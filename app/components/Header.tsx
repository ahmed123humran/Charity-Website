import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import { LogIn } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import prisma from '@/app/utils/db';
import { getLocalizedName } from '@/app/utils/locale';
import DesktopNav from './DesktopNav';

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
        <header className="sticky top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-20 gap-4">
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        {website?.logo ? (
                            <img
                                src={website.logo}
                                alt={websiteName}
                                className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-contain bg-white p-1 shadow-sm transition-transform group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center bg-primary transition-transform group-hover:scale-105">
                                <div className="w-4 h-4 lg:w-5 lg:h-5 bg-white rounded-xs rotate-45" />
                            </div>
                        )}
                        <span className="text-lg lg:text-2xl font-bold bg-linear-to-r from-primary to-primary-dark bg-clip-text text-transparent truncate max-w-[120px] lg:max-w-none">
                            {websiteName}
                        </span>
                    </Link>

                    <DesktopNav
                        menus={menus.map(m => ({ id: m.id, name: m.name, url: m.url }))}
                        locale={locale}
                    />

                    <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                        <div className="hidden sm:block">
                            <LanguageSwitcher />
                        </div>
                        <Link
                            href="/login"
                            className="hidden xl:flex items-center gap-2 text-white px-5 py-2.5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg bg-primary shadow-primary-glow text-sm"
                        >
                            <LogIn className="w-4 h-4" />
                            {t('signIn')}
                        </Link>
                        <div className="lg:hidden flex items-center gap-3">
                            <div className="sm:hidden">
                                <LanguageSwitcher />
                            </div>
                        </div>
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
