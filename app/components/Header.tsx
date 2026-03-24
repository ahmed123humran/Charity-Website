import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import { LogIn } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import prisma from '@/app/utils/db';
import { getLocalizedName } from '@/app/utils/locale';

export default async function Header() {
    const t = await getTranslations('Common');
    const locale = await getLocale();

    const website = await prisma.website.findFirst({
        orderBy: { updatedAt: 'desc' }
    });

    const menus = await prisma.menu.findMany({
        orderBy: { sequence: 'asc' }
    });

    const websiteName = website ? getLocalizedName(website.name, locale) : t('title');

    return (
        <header className="top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex items-center gap-2 group">
                        {website?.logo ? (
                            <img
                                src={website.logo}
                                alt={websiteName}
                                className="w-12 h-12 rounded-xl object-contain bg-white p-1 shadow-sm transition-transform group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary transition-transform group-hover:scale-105">
                                <div className="w-5 h-5 bg-white rounded-xs rotate-45" />
                            </div>
                        )}
                        <span className="text-2xl font-bold bg-linear-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                            {websiteName}
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {menus.length > 0 ? (
                            menus.map(menu => (
                                <Link
                                    key={menu.id}
                                    href={`/${menu.url}`}
                                    className="text-slate-600 hover:text-primary font-medium transition-colors"
                                >
                                    {getLocalizedName(menu.name, locale)}
                                </Link>
                            ))
                        ) : (
                            // Fallback if no menus exist yet
                            <>
                                <Link href="#" className="text-slate-600 hover:text-primary font-medium transition-colors">{t('charities')}</Link>
                                <Link href="#" className="text-slate-600 hover:text-primary font-medium transition-colors">{t('impact')}</Link>
                                <Link href="#" className="text-slate-600 hover:text-primary font-medium transition-colors">{t('about')}</Link>
                            </>
                        )}
                    </nav>

                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <Link
                            href="/login"
                            className="hidden lg:flex items-center gap-2 text-white px-6 py-2.5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg bg-primary shadow-primary-glow"
                        >
                            <LogIn className="w-4 h-4" />
                            {t('signIn')}
                        </Link>
                        <MobileMenu
                            menus={menus.map(m => ({ id: m.id, name: m.name, url: m.url }))}
                            websiteName={websiteName}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
