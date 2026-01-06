'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Menu as MenuIcon, Edit2, Trash2, ChevronRight, ListOrdered } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { getLocalizedName } from '@/app/utils/locale';

interface Website {
    id: string;
    name: any;
}


interface Page {
    id: string;
    title: any;
    url: string;
    websiteId: string;
}

interface Menu {
    id: string;
    name: any;
    url: string;
    sequence: number;
    websiteId: string;
    website: Website;
    parentId: string | null;
    pageId: string | null;
}

export default function MenusManagement() {
    const t = useTranslations('Admin');
    const commonT = useTranslations('Common');
    const locale = useLocale();
    const [menus, setMenus] = useState<Menu[]>([]);
    const [websites, setWebsites] = useState<Website[]>([]);
    const [pages, setPages] = useState<Page[]>([]); // New state for pages
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);

    // Form state
    const [nameEn, setNameEn] = useState('');
    const [nameAr, setNameAr] = useState('');
    const [url, setUrl] = useState('');
    const [sequence, setSequence] = useState(0);
    const [websiteId, setWebsiteId] = useState('');
    const [pageId, setPageId] = useState<string>(''); // New state for selected page

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [menusRes, websitesRes, pagesRes] = await Promise.all([
                fetch('/api/menus'),
                fetch('/api/websites'),
                fetch('/api/pages')
            ]);
            const menusData = await menusRes.json();
            const websitesData = await websitesRes.json();
            const pagesData = await pagesRes.json();

            setMenus(menusData);
            setWebsites(websitesData);
            setPages(pagesData);

            if (!isEditing && websitesData.length > 0) setWebsiteId(websitesData[0].id);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const apiUrl = isEditing ? `/api/menus/${currentId}` : '/api/menus';
            const method = isEditing ? 'PUT' : 'POST';

            const payload: any = {
                name: { en: nameEn, ar: nameAr },
                url,
                sequence: Number(sequence),
                websiteId,
                pageId: pageId || undefined
            };

            const res = await fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                closeModal();
                fetchData();
            }
        } catch (error) {
            console.error(`Failed to ${isEditing ? 'update' : 'create'} menu:`, error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(commonT('confirmDelete'))) return;
        try {
            const res = await fetch(`/api/menus/${id}`, { method: 'DELETE' });
            if (res.ok) fetchData();
        } catch (error) {
            console.error('Failed to delete menu:', error);
        }
    };

    const openEditModal = (menu: Menu) => {
        setNameEn(menu.name?.en || '');
        setNameAr(menu.name?.ar || '');
        setUrl(menu.url);
        setSequence(menu.sequence);
        setWebsiteId(menu.websiteId);
        setPageId(menu.pageId || '');
        setCurrentId(menu.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setNameEn('');
        setNameAr('');
        setUrl('');
        setSequence(0);
        setWebsiteId(websites[0]?.id || '');
        setPageId('');
        setCurrentId(null);
    };

    // Handle page selection
    const handlePageSelect = (selectedPageId: string) => {
        setPageId(selectedPageId);
        if (selectedPageId) {
            const page = pages.find(p => p.id === selectedPageId);
            if (page) {
                setUrl(`/${page.url}`); // Auto-fill URL with page slug
                // Optionally auto-fill names if empty
                if (!nameEn) setNameEn(page.title?.en || '');
                if (!nameAr) setNameAr(page.title?.ar || '');
            }
        }
    };

    // Filter pages by selected website
    const availablePages = pages.filter(p => !websiteId || p.websiteId === websiteId);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('menus')}</h1>
                    <p className="text-slate-500 mt-1">{t('configureMenus')}</p>
                </div>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    {t('newMenuItem')}
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rtl:left-auto rtl:right-3" />
                        <input
                            type="text"
                            placeholder={t('searchMenus')}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 rtl:pl-4 rtl:pr-10 text-start"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-start">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-start">{t('menuLabel')}</th>
                                <th className="px-6 py-4 text-start">{commonT('create')} URL</th>
                                <th className="px-6 py-4 text-start">{commonT('charities')}</th>
                                <th className="px-6 py-4 text-start">{t('sequence')}</th>
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
                            ) : menus.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        {t('noMenus')}
                                    </td>
                                </tr>
                            ) : menus.map((menu) => (
                                <tr key={menu.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                                <MenuIcon className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-slate-900">{getLocalizedName(menu.name, locale)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {menu.url}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-700">{getLocalizedName(menu.website?.name, locale)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 text-slate-600 text-sm bg-slate-100 px-2.5 py-1 rounded-md">
                                            <ListOrdered className="w-3.5 h-3.5" />
                                            {menu.sequence}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-end">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(menu)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                                                title={commonT('edit')}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(menu.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                title={commonT('delete')}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-slate-900">
                                {isEditing ? t('editMenuItem') : t('newMenuItem')}
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
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-start bg-white"
                                >
                                    {websites.map(site => (
                                        <option key={site.id} value={site.id}>{getLocalizedName(site.name, locale)}</option>
                                    ))}
                                    {websites.length === 0 && <option disabled>{t('noWebsitesAvailable')}</option>}
                                </select>
                            </div>

                            {/* Page Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('linkToPage')}</label>
                                <select
                                    value={pageId}
                                    onChange={(e) => handlePageSelect(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-start bg-white"
                                >
                                    <option value="">{t('customUrl')}</option>
                                    {availablePages.map(page => (
                                        <option key={page.id} value={page.id}>
                                            {getLocalizedName(page.title, locale)} ({page.url})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 mt-1">{t('linkPageHelp')}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('menuLabel')} (EN)</label>
                                    <input
                                        type="text"
                                        value={nameEn}
                                        onChange={(e) => setNameEn(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ltr"
                                        placeholder="e.g. Home"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('menuLabel')} (AR)</label>
                                    <input
                                        type="text"
                                        value={nameAr}
                                        onChange={(e) => setNameAr(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 rtl"
                                        placeholder="مثال: الرئيسية"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('urlHint')}</label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                    className={`w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 shadow-xs text-start ${pageId ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                                    placeholder="/home or https://..."
                                    readOnly={!!pageId} // Lock URL if page is selected
                                    disabled={!!pageId} // Also disable it to make it clear
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('sequence')}</label>
                                <input
                                    type="number"
                                    value={sequence}
                                    onChange={(e) => setSequence(Number(e.target.value))}
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 shadow-xs text-start"
                                />
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
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    {isEditing ? commonT('saveChanges') : commonT('create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
