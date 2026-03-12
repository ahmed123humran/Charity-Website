'use client';

import React, { useState, useEffect } from 'react';
import { Search, History, User as UserIcon, Tag, Clock, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/app/store/hooks';
import ActivityTour from '@/app/components/ActivityTour';

interface ActivityLog {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    details: string | null;
    oldData: any;
    newData: any;
    createdAt: string;
    user: {
        name: string | null;
        email: string;
        role: string;
    };
}

export default function ActivitiesPage() {
    const t = useTranslations('Admin');
    const commonT = useTranslations('Common');
    const { role: userRole } = useAppSelector((state) => state.user);
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const res = await fetch('/api/activities');
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            } else {
                const errorData = await res.json().catch(() => ({}));
                const msg = commonT(errorData.message) || errorData.message || res.statusText || commonT('error');
                toast.error(`${commonT('error')}: ${msg}`);
            }
        } catch (error: any) {
            toast.error(commonT('error'));
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const filteredActivities = activities.filter(activity =>
        activity.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE': return 'bg-green-100 text-green-700';
            case 'UPDATE': return 'bg-blue-100 text-blue-700';
            case 'DELETE': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (userRole !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center h-full py-20 text-slate-500">
                <History className="w-16 h-16 mb-4 opacity-20" />
                <h2 className="text-xl font-bold">{t('accessDenied')}</h2>
                <p>{t('onlyAdminsViewLogs')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <ActivityTour />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <History className="w-8 h-8 text-primary" />
                        {t('activityLogs')}
                    </h1>
                    <p className="text-slate-500 mt-1">{t('activityLogsDesc')}</p>
                </div>
            </div>

            <div id="activity-logs-list" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rtl:left-auto rtl:right-3" />
                        <input
                            type="text"
                            placeholder={t('searchActivities')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 text-gray-400 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 rtl:pl-4 rtl:pr-10 text-start"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-start">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-start">{t('user')}</th>
                                <th className="px-6 py-4 text-start">{t('action')}</th>
                                <th className="px-6 py-4 text-start">{t('entity')}</th>
                                <th className="px-6 py-4 text-start">{t('details')}</th>
                                <th className="px-6 py-4 text-start">{t('time')}</th>
                                <th className="px-6 py-4 text-end">{t('data')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-8 h-16 bg-slate-50/50"></td>
                                    </tr>
                                ))
                            ) : filteredActivities.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        {t('noActivitiesFound')}
                                    </td>
                                </tr>
                            ) : filteredActivities.map((activity) => (
                                <React.Fragment key={activity.id}>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <UserIcon className="w-4 h-4 text-slate-500" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-900 text-sm">{activity.user.name || 'Admin'}</span>
                                                    <span className="text-xs text-slate-500">{activity.user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-black tracking-widest ${getActionColor(activity.action)}`}>
                                                {activity.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <Tag className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-sm font-medium">{activity.entityType}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600 line-clamp-1">{activity.details}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(activity.createdAt).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-end">
                                            <button
                                                onClick={() => toggleRow(activity.id)}
                                                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-primary cursor-pointer"
                                            >
                                                {expandedRows.has(activity.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRows.has(activity.id) && (
                                        <tr className="bg-slate-50/50">
                                            <td colSpan={6} className="px-6 py-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('oldData')}</span>
                                                        <pre className="bg-white p-4 rounded-xl border border-slate-200 text-[10px] overflow-auto max-h-48 font-mono">
                                                            {activity.oldData ? JSON.stringify(activity.oldData, null, 2) : t('noPreviousData')}
                                                        </pre>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t('newData')}</span>
                                                        <pre className="bg-white p-4 rounded-xl border border-slate-200 text-[10px] overflow-auto max-h-48 font-mono">
                                                            {activity.newData ? JSON.stringify(activity.newData, null, 2) : t('noNewData')}
                                                        </pre>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

