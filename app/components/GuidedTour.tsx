'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export interface TourStep {
    target: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface GuidedTourProps {
    steps: TourStep[];
    onComplete?: () => void;
    tourKey: string;
}

const TOOLTIP_WIDTH = 340;
const TOOLTIP_HEIGHT = 200;
const MARGIN = 16;

export default function GuidedTour({ steps, onComplete, tourKey }: GuidedTourProps) {
    const locale = useLocale();
    const t = useTranslations('Tours');
    const isRtl = locale === 'ar';

    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const hasSeenTour = localStorage.getItem(`tour_${tourKey}`);
        if (!hasSeenTour) {
            setTimeout(() => setIsVisible(true), 1000);
        }
    }, [tourKey]);

    const updateCoords = useCallback(() => {
        if (!isVisible || steps.length === 0) return;

        let targetSelector = steps[currentStep].target;
        let element = document.querySelector(targetSelector) as HTMLElement;

        // Smart fallback for mobile if element is hidden or off-screen
        const isMobile = window.innerWidth < 1024;
        if (isMobile && element) {
            const rect = element.getBoundingClientRect();

            // Check for Main Admin Sidebar
            const isInAdminSidebar = !!element.closest('aside');
            if (isInAdminSidebar && (rect.left < 0 || rect.left > window.innerWidth || (rect.width === 0 && rect.height === 0))) {
                const toggle = document.querySelector('#mobile-sidebar-toggle') as HTMLElement;
                if (toggle) element = toggle;
            }

            // Check for Editor Left Panel
            const isInEditorLeft = !!element.closest('#editor-sidebar');
            if (isInEditorLeft && (rect.left < 0 || (rect.width === 0 && rect.height === 0))) {
                const toggle = document.querySelector('#editor-left-panel-toggle') as HTMLElement;
                if (toggle) element = toggle;
            }

            // Check for Editor Right Panel
            const isInEditorRight = !!element.closest('#editor-right-sidebar');
            if (isInEditorRight && (rect.left > window.innerWidth || (rect.width === 0 && rect.height === 0))) {
                const toggle = document.querySelector('#editor-right-panel-toggle') as HTMLElement;
                if (toggle) element = toggle;
            }
        }

        if (element) {
            const rect = element.getBoundingClientRect();
            let finalTop = rect.top;
            let finalLeft = rect.left;
            let finalWidth = rect.width;
            let finalHeight = rect.height;

            // Intersect with scroll parents to handle overflow (e.g. tables on mobile)
            let parent = element.parentElement;
            while (parent && parent !== document.body) {
                const style = window.getComputedStyle(parent);
                if (style.overflow !== 'visible' || style.overflowX !== 'visible' || style.overflowY !== 'visible') {
                    const parentRect = parent.getBoundingClientRect();
                    const intersectTop = Math.max(finalTop, parentRect.top);
                    const intersectLeft = Math.max(finalLeft, parentRect.left);
                    const intersectBottom = Math.min(finalTop + finalHeight, parentRect.bottom);
                    const intersectRight = Math.min(finalLeft + finalWidth, parentRect.right);

                    finalTop = intersectTop;
                    finalLeft = intersectLeft;
                    finalWidth = Math.max(0, intersectRight - intersectLeft);
                    finalHeight = Math.max(0, intersectBottom - intersectTop);
                }
                parent = parent.parentElement;
            }

            setCoords({
                top: finalTop,
                left: finalLeft,
                width: finalWidth,
                height: finalHeight
            });

            const isOutOfView = rect.top < 0 || rect.bottom > window.innerHeight || rect.left < 0 || rect.right > window.innerWidth;
            if (isOutOfView && element.id !== 'mobile-sidebar-toggle') {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [isVisible, steps, currentStep]);

    useEffect(() => {
        updateCoords();
        const observer = new MutationObserver(updateCoords);
        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('resize', updateCoords);
        window.addEventListener('scroll', updateCoords, true);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateCoords);
            window.removeEventListener('scroll', updateCoords, true);
        };
    }, [updateCoords]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem(`tour_${tourKey}`, 'true');
        onComplete?.();
    };

    if (!mounted || !isVisible) return null;

    const step = steps[currentStep];

    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;

    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

    let finalTop = 0;
    let finalLeft = 0;
    let finalPosition: 'top' | 'bottom' | 'left' | 'right' | 'center' = 'bottom';

    if (step.position === 'center') {
        finalPosition = 'center';
    } else {
        const spaceBelow = vh - (coords.top + coords.height);
        const spaceAbove = coords.top;
        const spaceRight = vw - (coords.left + coords.width);
        const spaceLeft = coords.left;

        if (spaceBelow > TOOLTIP_HEIGHT + MARGIN) {
            finalPosition = 'bottom';
            finalTop = coords.top + coords.height + MARGIN;
            finalLeft = coords.left + coords.width / 2 - TOOLTIP_WIDTH / 2;
        } else if (spaceAbove > TOOLTIP_HEIGHT + MARGIN) {
            finalPosition = 'top';
            finalTop = coords.top - TOOLTIP_HEIGHT - MARGIN;
            finalLeft = coords.left + coords.width / 2 - TOOLTIP_WIDTH / 2;
        } else {
            if (isRtl) {
                if (spaceLeft > TOOLTIP_WIDTH + MARGIN) {
                    finalPosition = 'left';
                    finalTop = coords.top + coords.height / 2 - TOOLTIP_HEIGHT / 2;
                    finalLeft = coords.left - TOOLTIP_WIDTH - MARGIN;
                } else if (spaceRight > TOOLTIP_WIDTH + MARGIN) {
                    finalPosition = 'right';
                    finalTop = coords.top + coords.height / 2 - TOOLTIP_HEIGHT / 2;
                    finalLeft = coords.left + coords.width + MARGIN;
                } else {
                    finalPosition = 'center';
                }
            } else {
                if (spaceRight > TOOLTIP_WIDTH + MARGIN) {
                    finalPosition = 'right';
                    finalTop = coords.top + coords.height / 2 - TOOLTIP_HEIGHT / 2;
                    finalLeft = coords.left + coords.width + MARGIN;
                } else if (spaceLeft > TOOLTIP_WIDTH + MARGIN) {
                    finalPosition = 'left';
                    finalTop = coords.top + coords.height / 2 - TOOLTIP_HEIGHT / 2;
                    finalLeft = coords.left - TOOLTIP_WIDTH - MARGIN;
                } else {
                    finalPosition = 'center';
                }
            }
        }
    }

    const actualTooltipWidth = Math.min(TOOLTIP_WIDTH, vw - MARGIN * 2);

    const tooltipStyle: React.CSSProperties = finalPosition === 'center' ? {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed',
        zIndex: 1000001
    } : {
        top: clamp(finalTop, MARGIN, vh - TOOLTIP_HEIGHT - MARGIN),
        left: clamp(finalLeft, MARGIN, vw - actualTooltipWidth - MARGIN),
        position: 'fixed',
        zIndex: 1000001
    };

    return createPortal(
        <div className="fixed inset-0 z-[1000000] pointer-events-none" dir={isRtl ? 'rtl' : 'ltr'}>
            <svg className="absolute inset-0 w-full h-full">
                <defs>
                    <mask id={`tour-mask-${tourKey}`}>
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <rect
                            x={coords.left}
                            y={coords.top}
                            width={coords.width}
                            height={coords.height}
                            rx="12"
                            fill="black"
                            className="transition-all duration-300"
                        />
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.6)"
                    mask={`url(#tour-mask-${tourKey})`}
                    className="pointer-events-auto"
                    onClick={handleComplete}
                />
            </svg>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.9, y: finalPosition === 'top' ? 10 : -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute pointer-events-auto bg-white rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.4)] w-[calc(100vw-32px)] max-w-[340px] border border-slate-200 overflow-hidden"
                    style={tooltipStyle}
                >
                    <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/80 to-primary/50" />

                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-xl">
                                    <Sparkles className="text-primary" size={20} />
                                </div>
                                <h3 className="text-lg font-extrabold text-slate-900 leading-tight">{step.title}</h3>
                            </div>
                            <button onClick={handleComplete} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <p className="text-slate-600 text-[15px] leading-relaxed mb-6">{step.content}</p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`rounded-full transition-all duration-300 ${i === currentStep
                                            ? 'w-6 h-1.5 bg-primary'
                                            : 'w-1.5 h-1.5 bg-slate-200'
                                            }`}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-2.5">
                                {currentStep > 0 && (
                                    <button
                                        onClick={handlePrev}
                                        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                                    >
                                        {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:brightness-105 transition-all shadow-lg active:scale-95"
                                >
                                    {currentStep === steps.length - 1 ? t('finish') : t('next')}
                                    {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute border-[3px] border-primary rounded-xl pointer-events-none"
                style={{
                    top: coords.top - 8,
                    left: coords.left - 8,
                    width: coords.width + 16,
                    height: coords.height + 16,
                    boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2), 0 0 30px rgba(59, 130, 246, 0.3)',
                }}
            />
        </div>,
        document.body
    );
}
