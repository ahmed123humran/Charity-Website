'use client';

import { Link } from '@/navigation';
import {
    LayoutDashboard,
    Globe,
    FileText,
    Menu as MenuIcon,
    PlusSquare,
    LogOut,
    Users,
    RefreshCw,
    PanelBottom,
    History,
    Share2,
    Sparkles
} from 'lucide-react';

import { useRouter } from '@/navigation';
import { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useAppSelector, useAppDispatch } from '@/app/store/hooks';
import { logoutUser } from '@/app/store/slices/userSlice';

export default function AdminSidebar() {
    const locale = useLocale();
    const t = useTranslations('Admin');
    const commonT = useTranslations('Common');
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Get state from Redux
    const { name: websiteName, logo: websiteLogo } = useAppSelector((state) => state.website);
    const { name: userName, email: userEmail, phone: userPhone, role: userRole } = useAppSelector((state) => state.user);

    const navItems = [
        { label: t('dashboard'), href: '/admin', icon: LayoutDashboard },
        { label: t('websites'), href: '/admin/websites', icon: Globe },
        { label: t('socialMedia'), href: '/admin/social-media', icon: Share2 },
        { label: t('pages'), href: '/admin/pages', icon: FileText },
        { label: t('footers'), href: '/admin/footers', icon: PanelBottom },
        { label: t('menus'), href: '/admin/menus', icon: MenuIcon },
        { label: t('snippets'), href: '/admin/snippets', icon: PlusSquare },
        { label: t('searchReplace'), href: '/admin/tools/search-replace', icon: RefreshCw },
        ...(userRole === 'ADMIN' ? [
            { label: t('users'), href: '/admin/users', icon: Users },
            { label: t('activityLogs') || 'Activity Logs', href: '/admin/activities', icon: History }
        ] : []),
    ];

    const handleLogout = async () => {
        const result = await dispatch(logoutUser());
        if (logoutUser.fulfilled.match(result)) {
            router.push('/login');
        }
    };

    // Get the localized website name
    const displayName = websiteName?.[locale as 'en' | 'ar'] || commonT('title');

    return (
        <aside
            className="w-72 text-white min-h-screen fixed inset-y-0 start-0 flex flex-col border-e border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.2)] z-[100]"
            style={{
                background: 'linear-gradient(180deg, var(--primary-dark) 0%, rgba(15, 23, 42, 1) 100%)',
            }}
        >
            <div className="p-8">
                <div className="group cursor-pointer">
                    <div className="flex items-center gap-4 mb-2">
                        {websiteLogo ? (
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/10 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <img src={websiteLogo} alt="Logo" className="w-full h-full object-contain p-1.5" />
                            </div>
                        ) : (
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                                <Sparkles className="text-primary" size={24} />
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent truncate tracking-tight">{displayName}</span>
                            <span className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em]">الإدارة الذكية</span>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 mt-4 px-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        id={`nav-${item.href.replace(/\//g, '-')}`}
                        href={item.icon === LayoutDashboard ? '/admin' : item.href}
                        className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-white/10 transition-all duration-300 text-slate-400 hover:text-white group relative overflow-hidden"
                    >
                        <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span className="font-semibold text-sm transition-transform group-hover:translate-x-1">{item.label}</span>
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                ))}
            </nav>

            <div className="p-6 mt-auto">
                <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-6 backdrop-blur-xl">
                    {(userName || userEmail) && (
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-black text-white truncate">{userName || 'مدير النظام'}</p>
                            <p className="text-[10px] font-bold text-white/40 truncate uppercase tracking-wider">{userRole || 'Admin'}</p>
                        </div>
                    )}

                    <div className="space-y-1">
                        <LanguageSwitcher
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all w-full text-xs font-bold"
                        />
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-500/20 text-red-400/80 hover:text-red-400 transition-all w-full text-xs font-bold"
                        >
                            <LogOut size={16} className="rtl:rotate-180" />
                            <span>{commonT('logout')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
