import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import { LogIn } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import prisma from '@/app/utils/db';
import { getLocalizedName } from '@/app/utils/locale';

export default async function Header() {
    const t = await getTranslations('Common');
    const locale = await getLocale();

    const menus = await prisma.menu.findMany({
        orderBy: { sequence: 'asc' }
    });

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                            <div className="w-5 h-5 bg-white rounded-xs rotate-45" />
                        </div>
                        <span className="text-2xl font-bold bg-linear-to-r from-[var(--primary-color)] to-[var(--primary-dark)] bg-clip-text text-transparent">
                            {t('title')}
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-slate-600 hover:text-[var(--primary-color)] font-medium transition-colors">{t('home')}</Link>
                        {menus.length > 0 ? (
                            menus.map(menu => (
                                <Link
                                    key={menu.id}
                                    href={`/${menu.url}`}
                                    className="text-slate-600 hover:text-[var(--primary-color)] font-medium transition-colors"
                                >
                                    {getLocalizedName(menu.name, locale)}
                                </Link>
                            ))
                        ) : (
                            // Fallback if no menus exist yet
                            <>
                                <Link href="#" className="text-slate-600 hover:text-[var(--primary-color)] font-medium transition-colors">{t('charities')}</Link>
                                <Link href="#" className="text-slate-600 hover:text-[var(--primary-color)] font-medium transition-colors">{t('impact')}</Link>
                                <Link href="#" className="text-slate-600 hover:text-[var(--primary-color)] font-medium transition-colors">{t('about')}</Link>
                            </>
                        )}
                    </nav>

                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <Link
                            href="/login"
                            className="flex items-center gap-2 text-white px-6 py-2.5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
                            style={{ backgroundColor: 'var(--primary-color)', boxShadow: '0 10px 15px -3px var(--primary-glow)' }}
                        >
                            <LogIn className="w-4 h-4" />
                            {t('signIn')}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
