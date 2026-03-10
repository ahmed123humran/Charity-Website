'use client';

import { useRouter } from '@/navigation';
import { useState, useEffect } from 'react';
import { Plus, Search, FileText, ArrowUpRight, Edit2, Trash2, CheckCircle, XCircle, Layout } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { getLocalizedName } from '@/app/utils/locale';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/app/store/hooks';
import PagesTour from '@/app/components/PagesTour';

interface Website {
    id: string;
    name: any;
}

interface Page {
    id: string;
    title: any;
    url: string;
    isPublished: boolean;
    websiteId: string;
    website: Website;
    createdAt: string;
}

export default function PagesManagement() {
    const t = useTranslations('Admin');
    const commonT = useTranslations('Common');
    const locale = useLocale();
    const router = useRouter();
    const { role: userRole } = useAppSelector((state) => state.user);
    const [pages, setPages] = useState<Page[]>([]);
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Form state
    const [titleEn, setTitleEn] = useState('');
    const [titleAr, setTitleAr] = useState('');
    const [url, setUrl] = useState('');
    const [websiteId, setWebsiteId] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pagesRes, websitesRes] = await Promise.all([
                fetch('/api/pages'),
                fetch('/api/websites')
            ]);
            const pagesData = await pagesRes.json();
            const websitesData = await websitesRes.json();

            setPages(Array.isArray(pagesData) ? pagesData : []);
            setWebsites(Array.isArray(websitesData) ? websitesData : []);

            if (!isEditing && Array.isArray(websitesData) && websitesData.length > 0) {
                setWebsiteId(websitesData[0].id);
            }
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
            const apiUrl = isEditing ? `/api/pages/${currentId}` : '/api/pages';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: { en: titleEn, ar: titleAr }, url, websiteId }),
            });
            if (res.ok) {
                closeModal();
                fetchData();
                toast.success(isEditing ? commonT('updated') : commonT('created'));
            } else {
                const err = await res.json();
                try {
                    toast.error(commonT(err.message) || err.message || commonT('error'));
                } catch (e) {
                    toast.error(err.message || commonT('error'));
                }
            }
        } catch (error) {
            console.error(`Failed to ${isEditing ? 'update' : 'create'} page:`, error);
            toast.error(commonT('error'));
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`/api/pages/${deleteId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchData();
                toast.success(commonT('deleted'));
            } else {
                const err = await res.json();
                try {
                    toast.error(commonT(err.message) || err.message || commonT('error'));
                } catch (e) {
                    toast.error(err.message || commonT('error'));
                }
            }
        } catch (error) {
            console.error('Failed to delete page:', error);
            toast.error(commonT('error'));
        }
    };

    const togglePublish = async (id: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setPages(pages.map(p => p.id === id ? { ...p, isPublished: !currentStatus } : p));

            const res = await fetch(`/api/pages/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublished: !currentStatus })
            });

            if (res.ok) {
                toast.success(commonT('saved'));
            } else {
                // Revert on failure
                setPages(pages.map(p => p.id === id ? { ...p, isPublished: currentStatus } : p));
                const err = await res.json();
                try {
                    toast.error(commonT(err.message) || err.message || commonT('statusUpdateError'));
                } catch (e) {
                    toast.error(err.message || commonT('statusUpdateError'));
                }
            }
        } catch (error) {
            console.error('Failed to toggle publish status:', error);
            // Revert on failure
            setPages(pages.map(p => p.id === id ? { ...p, isPublished: currentStatus } : p));
            toast.error(commonT('statusUpdateError'));
        }
    };

    const openEditModal = (page: Page) => {
        setTitleEn(page.title?.en || '');
        setTitleAr(page.title?.ar || '');
        setUrl(page.url);
        setWebsiteId(page.websiteId);
        setCurrentId(page.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setTitleEn('');
        setTitleAr('');
        setUrl('');
        setWebsiteId(websites[0]?.id || '');
        setCurrentId(null);
    };

    return (
        <div className="space-y-8">
            <PagesTour />
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('pages')}</h1>
                    <p className="text-slate-500 mt-1">{t('managePages')}</p>
                </div>
                {(userRole === 'ADMIN' || userRole === 'EDITOR') && (
                    <button
                        id="new-page-btn"
                        onClick={() => {
                            setIsEditing(false);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        {t('newPage')}
                    </button>
                )}
            </div>

            <div id="pages-list" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rtl:left-auto rtl:right-3" />
                        <input
                            type="text"
                            placeholder={t('searchPages')}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 text-gray-400 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 rtl:pl-4 rtl:pr-10 text-start"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-start">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-start">{t('pageTitle')}</th>
                                <th className="px-6 py-4 text-start">{t('urlPath')}</th>
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
                            ) : pages.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        {t('noPages')}
                                    </td>
                                </tr>
                            ) : pages.map((page, index) => (
                                <tr key={page.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <span className="font-semibold text-slate-900">{getLocalizedName(page.title, locale)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        <code className="bg-slate-100 px-2 py-1 rounded text-primary">/{page.url}</code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-700">{getLocalizedName(page.website?.name, locale)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {(userRole === 'ADMIN' || userRole === 'EDITOR') ? (
                                            <button
                                                onClick={() => togglePublish(page.id, page.isPublished)}
                                                className="text-start focus:outline-hidden cursor-pointer"
                                                disabled={loading}
                                            >
                                                {page.isPublished ? (
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
                                                {page.isPublished ? (
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
                                                className="p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                                title={commonT('about')}
                                            >
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                            {(userRole === 'ADMIN' || userRole === 'EDITOR') && (
                                                <>
                                                    <button
                                                        id={index === 0 ? "design-page-action" : undefined}
                                                        onClick={() => router.push(`/admin/pages/${page.id}/editor`)}
                                                        className="p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                                        title={t('designPage')}
                                                    >
                                                        <Layout className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(page)}
                                                        className="p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                                        title={commonT('edit')}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {userRole === 'ADMIN' && (
                                                <button
                                                    onClick={() => handleDeleteClick(page.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
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
                                    {isEditing ? t('editPage') : t('newPage')}
                                </h2>
                                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 cursor-pointer text-2xl">&times;</button>
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
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('pageTitle')} (EN)</label>
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
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('pageTitle')} (AR)</label>
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
                                <div>
                                    <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1">
                                        {t('urlPath')}
                                        <span title="الجزء الذي يظهر بعد اسم النطاق في المتصفح (مثال: about-us)" className="cursor-help text-primary/60">
                                            <FileText className="w-3.5 h-3.5" />
                                        </span>
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-s-lg border border-e-0 border-slate-200 bg-slate-50 text-slate-500 text-sm">
                                            /
                                        </span>
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            required
                                            className="flex-1 w-full px-4 py-2 border border-slate-200 text-gray-400 rounded-e-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 shadow-xs text-start"
                                            placeholder="about-us"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                                    >
                                        {commonT('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors cursor-pointer"
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
