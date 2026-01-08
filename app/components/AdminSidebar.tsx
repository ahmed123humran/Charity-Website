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
    History
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
    const { name: websiteName } = useAppSelector((state) => state.website);
    const { name: userName, email: userEmail, phone: userPhone, role: userRole } = useAppSelector((state) => state.user);

    const navItems = [
        { label: t('dashboard'), href: '/admin', icon: LayoutDashboard },
        { label: t('websites'), href: '/admin/websites', icon: Globe },
        { label: t('pages'), href: '/admin/pages', icon: FileText },
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
            className="w-64 text-white min-h-screen fixed inset-y-0 start-0 flex flex-col border-e border-white/10"
            style={{ backgroundColor: 'var(--primary-dark)' }}
        >
            <div className="p-6">
                <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 rounded-xs" style={{ backgroundColor: 'var(--primary-dark)' }} />
                    </div>
                    {displayName}
                </h2>
                {websiteName && (
                    <p className="text-xs text-white/50 mt-1 ps-10 truncate">
                        {t('managingWebsite')}
                    </p>
                )}
            </div>

            <nav className="flex-1 mt-6 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.icon === LayoutDashboard ? '/admin' : item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-indigo-100 group"
                    >
                        <item.icon className="w-5 h-5 group-hover:text-white transition-colors" />
                        <span className="font-medium group-hover:text-white transition-colors">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10 space-y-4">
                {(userName || userEmail || userPhone) && (
                    <div className="px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-start">
                        <p className="text-sm font-bold text-white truncate">{userName || 'Admin'}</p>
                        <p className="text-xs text-white/50 truncate">{userEmail || userPhone}</p>
                    </div>
                )}
                <LanguageSwitcher
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-indigo-100/70 transition-colors w-full group font-medium"
                />
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-100/70 transition-colors w-full group"
                >
                    <LogOut className="w-5 h-5 rtl:rotate-180" />
                    <span className="font-medium">{commonT('logout')}</span>
                </button>
            </div>
        </aside>
    );
}
