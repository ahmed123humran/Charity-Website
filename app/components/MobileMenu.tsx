'use client';

import { useState } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import { Link } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { getLocalizedName } from '@/app/utils/locale';

interface MenuItem {
    id: string;
    name: any;
    url: string;
}

export default function MobileMenu({ menus, websiteName }: { menus: MenuItem[]; websiteName: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('Common');
    const locale = useLocale();

    return (
        <>
            {/* Hamburger Button - visible only on mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Slide-in Panel */}
            <div
                className={`fixed top-0 ${locale === 'ar' ? 'left-0' : 'right-0'} h-full w-72 bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-out md:hidden ${isOpen
                        ? 'translate-x-0'
                        : locale === 'ar'
                            ? '-translate-x-full'
                            : 'translate-x-full'
                    }`}
            >
                {/* Panel Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <span className="text-lg font-bold bg-linear-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                        {websiteName}
                    </span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col p-4 gap-1">
                    {menus.length > 0 ? (
                        menus.map(menu => (
                            <Link
                                key={menu.id}
                                href={`/${menu.url}`}
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-3 rounded-xl text-slate-700 hover:bg-primary/5 hover:text-primary font-medium transition-all duration-200"
                            >
                                {getLocalizedName(menu.name, locale)}
                            </Link>
                        ))
                    ) : (
                        <>
                            <Link href="#" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-xl text-slate-700 hover:bg-primary/5 hover:text-primary font-medium transition-all">{t('charities')}</Link>
                            <Link href="#" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-xl text-slate-700 hover:bg-primary/5 hover:text-primary font-medium transition-all">{t('impact')}</Link>
                            <Link href="#" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-xl text-slate-700 hover:bg-primary/5 hover:text-primary font-medium transition-all">{t('about')}</Link>
                        </>
                    )}
                </nav>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-slate-100 space-y-3 bg-white">
                    <LanguageSwitcher className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600 font-bold" />
                    <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 w-full text-white px-4 py-3 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg bg-primary shadow-primary-glow"
                    >
                        <LogIn className="w-4 h-4" />
                        {t('signIn')}
                    </Link>
                </div>
            </div>
        </>
    );
}
