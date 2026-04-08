'use client';

import { useState, useEffect, useRef } from 'react';
import { Link } from '@/navigation';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLocalizedName } from '@/app/utils/locale';

interface Menu {
    id: string;
    name: any;
    url: string;
}

interface DesktopNavProps {
    menus: Menu[];
    locale: string;
}

export default function DesktopNav({ menus, locale }: DesktopNavProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const [visibleCount, setVisibleCount] = useState(0);
    const [isCalculated, setIsCalculated] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const calculateOverflow = () => {
        if (!containerRef.current) return;

        // Strict available width calculation
        const containerWidth = containerRef.current.clientWidth - 20;
        const moreButtonWidth = 100; // Safe space for "More +"
        let totalWidth = 0;
        let newVisibleCount = menus.length;

        const isXL = window.innerWidth >= 1280;
        const gap = isXL ? 32 : 16;

        // Measure the actual items (they are present in DOM but hidden initially)
        const widths = itemsRef.current.map(item => {
            if (!item) return 0;
            return item.getBoundingClientRect().width;
        });

        // Check if we actually measured anything
        const totalMeasured = widths.reduce((a, b) => a + b, 0);
        if (totalMeasured === 0 && menus.length > 0) {
            // Retry later if not rendered yet
            setTimeout(calculateOverflow, 100);
            return;
        }

        for (let i = 0; i < widths.length; i++) {
            totalWidth += widths[i] + gap;

            if (totalWidth > (containerWidth - moreButtonWidth)) {
                newVisibleCount = i;
                break;
            }
        }

        setVisibleCount(newVisibleCount);
        setIsCalculated(true);
    };

    useEffect(() => {
        // Initial calculation
        const timer = setTimeout(calculateOverflow, 300);

        const resizeObserver = new ResizeObserver(() => {
            calculateOverflow();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        // Click outside listener
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            clearTimeout(timer);
            resizeObserver.disconnect();
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menus]);

    const visibleItems = menus.slice(0, visibleCount);
    const hiddenItems = menus.slice(visibleCount);

    return (
        <nav
            ref={containerRef}
            className="hidden lg:flex items-center justify-center flex-1 min-w-0 h-full relative"
        >
            {/* 
          Master Container: 
          - Before calculation: Render all items as 'invisible' to measure them.
          - After calculation: Show only 'visibleCount' items.
      */}
            <div className={`flex items-center gap-x-4 xl:gap-x-8 transition-opacity duration-300 ${isCalculated ? 'opacity-100' : 'invisible'}`}>
                {(isCalculated ? visibleItems : menus).map((menu, i) => (
                    <Link
                        key={menu.id}
                        ref={el => { if (!isCalculated) itemsRef.current[i] = el; }}
                        href={`/${menu.url}`}
                        className="text-slate-600 hover:text-primary font-medium transition-colors whitespace-nowrap text-sm xl:text-base px-1"
                    >
                        {getLocalizedName(menu.name, locale)}
                    </Link>
                ))}

                {/* More Button */}
                {isCalculated && hiddenItems.length > 0 && (
                    <div ref={dropdownRef} className="relative shrink-0">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold text-sm whitespace-nowrap shadow-xs ${isDropdownOpen ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <Plus className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-45' : ''}`} />
                            <span>{locale === 'ar' ? 'المزيد' : 'More'}</span>
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full mt-2 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-[70] overflow-hidden"
                                >
                                    <div className="px-4 py-2 border-b border-slate-50 mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            {locale === 'ar' ? 'روابط إضافية' : 'Extra Links'}
                                        </span>
                                    </div>
                                    <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
                                        {hiddenItems.map(menu => (
                                            <Link
                                                key={menu.id}
                                                href={`/${menu.url}`}
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="block px-4 py-2.5 text-sm text-primary/80 hover:text-primary font-medium transition-colors text-start"
                                            >
                                                {getLocalizedName(menu.name, locale)}
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </nav>
    );
}
