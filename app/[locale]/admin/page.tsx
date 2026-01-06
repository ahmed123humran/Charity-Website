import {
    Globe,
    FileText,
    Menu as MenuIcon,
    PlusSquare
} from 'lucide-react';
import prisma from '@/app/utils/db';
import { getTranslations } from 'next-intl/server';

async function getStats() {
    const [websitesCount, pagesCount, menusCount, snippetsCount] = await Promise.all([
        prisma.website.count(),
        prisma.page.count(),
        prisma.menu.count(),
        prisma.snippet.count()
    ]);

    return [
        { key: 'websites', value: websitesCount, icon: Globe, color: 'text-blue-600', bg: 'bg-blue-100' },
        { key: 'pages', value: pagesCount, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
        { key: 'menus', value: menusCount, icon: MenuIcon, color: 'text-orange-600', bg: 'bg-orange-100' },
        { key: 'snippets', value: snippetsCount, icon: PlusSquare, color: 'text-green-600', bg: 'bg-green-100' },
    ];
}

export default async function AdminDashboard() {
    const stats = await getStats();
    const t = await getTranslations('Admin');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">{t('overview')}</h1>
                <p className="text-slate-500 mt-1">{t('subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.key} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-slate-500 font-medium">{t(stat.key)}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">{t('recentWebsites')}</h2>
                    <div className="text-slate-500 text-sm">{t('noRecentWebsites')}</div>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">{t('recentPages')}</h2>
                    <div className="text-slate-500 text-sm">{t('noRecentPages')}</div>
                </div>
            </div>
        </div>
    );
}
