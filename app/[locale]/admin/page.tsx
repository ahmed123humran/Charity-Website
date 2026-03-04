import {
    Globe,
    FileText,
    Menu as MenuIcon,
    PlusSquare,
    History
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
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('overview')}</h1>
                    <p className="text-slate-400 font-medium mt-1">{t('subtitle')}</p>
                </div>
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <History size={20} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.key}
                            className="group relative bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-primary/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="relative z-10">
                                <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                    <Icon size={28} />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-4xl font-black text-slate-900 group-hover:translate-x-1 transition-transform">{stat.value}</div>
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t(stat.key)}</div>
                                </div>
                            </div>

                            {/* Decorative Gradient Overlay */}
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-slate-900">{t('recentWebsites')}</h2>
                        <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">{t('viewAll')}</button>
                    </div>
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                            <Globe size={32} />
                        </div>
                        <p className="text-slate-400 text-sm font-medium">{t('noRecentWebsites')}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-slate-900">{t('recentPages')}</h2>
                        <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">{t('viewAll')}</button>
                    </div>
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                            <FileText size={32} />
                        </div>
                        <p className="text-slate-400 text-sm font-medium">{t('noRecentPages')}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                </div>
            </div>
        </div>
    );
}

