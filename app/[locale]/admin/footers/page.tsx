'use client';

import { useRouter } from '@/navigation';
import { useState, useEffect } from 'react';
import { Plus, Search, FileText, ArrowUpRight, Edit2, Trash2, CheckCircle, XCircle, Layout } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { getLocalizedName } from '@/app/utils/locale';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/app/store/hooks';
import FootersTour from '@/app/components/FootersTour';

interface Website {
    id: string;
    name: any;
}

interface Footer {
    id: string;
    title: any;
    isPublished: boolean;
    websiteId: string;
    website: Website;
    createdAt: string;
}

export default function FootersManagement() {
    const t = useTranslations('Admin');
    const commonT = useTranslations('Common');
    const locale = useLocale();
    const router = useRouter();
    const { role: userRole } = useAppSelector((state) => state.user);
    const [footers, setFooters] = useState<Footer[]>([]);
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Form state
    const [titleEn, setTitleEn] = useState('');
    const [titleAr, setTitleAr] = useState('');
    const [websiteId, setWebsiteId] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [footersRes, websitesRes] = await Promise.all([
                fetch('/api/footers'),
                fetch('/api/websites')
            ]);
            const footersData = await footersRes.json();
            const websitesData = await websitesRes.json();
            setFooters(footersData);
            setWebsites(websitesData);
            if (!isEditing && websitesData.length > 0) setWebsiteId(websitesData[0].id);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error(commonT('error'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const apiUrl = isEditing ? `/api/footers/${currentId}` : '/api/footers';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: { en: titleEn, ar: titleAr }, websiteId }),
            });
            if (res.ok) {
                closeModal();
                fetchData();
                toast.success(isEditing ? commonT('updated') : commonT('created'));
            } else {
                toast.error(commonT('error'));
            }
        } catch (error) {
            console.error(`Failed to ${isEditing ? 'update' : 'create'} footer:`, error);
            toast.error(commonT('error'));
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`/api/footers/${deleteId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchData();
                toast.success(commonT('deleted'));
            } else {
                toast.error(commonT('error'));
            }
        } catch (error) {
            console.error('Failed to delete footer:', error);
            toast.error(commonT('error'));
        }
    };

    const togglePublish = async (id: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setFooters(footers.map(p => p.id === id ? { ...p, isPublished: !currentStatus } : p));

            const res = await fetch(`/api/footers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublished: !currentStatus })
            });

            if (res.ok) {
                toast.success(commonT('saved'));
            } else {
                // Revert on failure
                setFooters(footers.map(p => p.id === id ? { ...p, isPublished: currentStatus } : p));
                toast.error('Failed to update status');
            }
        } catch (error) {
            console.error('Failed to toggle publish status:', error);
            // Revert on failure
            setFooters(footers.map(p => p.id === id ? { ...p, isPublished: currentStatus } : p));
            toast.error('Failed to update status');
        }
    };

    const openEditModal = (footer: Footer) => {
        setTitleEn(footer.title?.en || '');
        setTitleAr(footer.title?.ar || '');
        setWebsiteId(footer.websiteId);
        setCurrentId(footer.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setTitleEn('');
        setTitleAr('');
        setWebsiteId(websites[0]?.id || '');
        setCurrentId(null);
    };

    return (
        <div className="space-y-8">
            <FootersTour />
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('footers')}</h1>
                    <p className="text-slate-500 mt-1">{t('manageFooters')}</p>
                </div>
                {(userRole === 'ADMIN' || userRole === 'EDITOR') && (
                    <button
                        id="new-footer-btn"
                        onClick={() => {
                            setIsEditing(false);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        {t('newFooter')}
                    </button>
                )}
            </div>

            <div id="footers-list" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rtl:left-auto rtl:right-3" />
                        <input
                            type="text"
                            placeholder={t('searchFooters')}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 text-gray-400 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 rtl:pl-4 rtl:pr-10 text-start"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-start">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-start">{t('footerTitle')}</th>
                                <th className="px-6 py-4 text-start">{commonT('charities')}</th>
                                <th className="px-6 py-4 text-start">{commonT('status')}</th>
                                <th className="px-6 py-4 text-end">{commonT('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8 h-16 bg-slate-50/50"></td>
                                    </tr>
                                ))
                            ) : footers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        {t('noFooters')}
                                    </td>
                                </tr>
                            ) : footers.map((footer) => (
                                <tr key={footer.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <span className="font-semibold text-slate-900">{getLocalizedName(footer.title, locale)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-700">{getLocalizedName(footer.website?.name, locale)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {(userRole === 'ADMIN' || userRole === 'EDITOR') ? (
                                            <button
                                                onClick={() => togglePublish(footer.id, footer.isPublished)}
                                                className="text-start focus:outline-hidden"
                                                disabled={loading}
                                            >
                                                {footer.isPublished ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors cursor-pointer">
                                                        <CheckCircle className="w-3 h-3" /> {t('published')}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
                                                        <XCircle className="w-3 h-3" /> {t('draft')}
                                                    </span>
                                                )}
                                            </button>
                                        ) : (
                                            <div className="text-start">
                                                {footer.isPublished ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3" /> {t('published')}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                        <XCircle className="w-3 h-3" /> {t('draft')}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-end">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                title={commonT('about')}
                                            >
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                            {(userRole === 'ADMIN' || userRole === 'EDITOR') && (
                                                <>
                                                    <button
                                                        onClick={() => router.push(`/admin/footers/${footer.id}/editor`)}
                                                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                        title={t('designFooter')}
                                                    >
                                                        <Layout className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(footer)}
                                                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                        title={commonT('edit')}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {userRole === 'ADMIN' && (
                                                <button
                                                    onClick={() => handleDeleteClick(footer.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                    title={commonT('delete')}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {
                showModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {isEditing ? t('editFooter') : t('newFooter')}
                                </h2>
                                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">&times;</button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('targetWebsite')}</label>
                                    <select
                                        value={websiteId}
                                        onChange={(e) => setWebsiteId(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 text-gray-400 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-start"
                                    >
                                        {websites.map(site => (
                                            <option key={site.id} value={site.id}>{getLocalizedName(site.name, locale)}</option>
                                        ))}
                                        {websites.length === 0 && <option disabled>No websites available</option>}
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('footerTitle')} (EN)</label>
                                        <input
                                            type="text"
                                            value={titleEn}
                                            onChange={(e) => setTitleEn(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 border border-slate-200 text-gray-400 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 ltr"
                                            placeholder="e.g. About Us"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('footerTitle')} (AR)</label>
                                        <input
                                            type="text"
                                            value={titleAr}
                                            onChange={(e) => setTitleAr(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 border border-slate-200 text-gray-400 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 rtl"
                                            placeholder="مثال: من نحن"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                                    >
                                        {commonT('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                                    >
                                        {isEditing ? commonT('saveChanges') : commonT('create')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title={commonT('delete')}
                message={commonT('confirmDelete')}
                isDeleting
            />
        </div >
    );
}
