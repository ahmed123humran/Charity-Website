'use client';

import { useRouter } from '@/navigation';
import { useState, useEffect } from 'react';
import { Plus, Search, Globe, MoreVertical, Edit2, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { getLocalizedName } from '@/app/utils/locale';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/app/store/hooks';
import WebsiteTour from '@/app/components/WebsiteTour';

interface Website {
    id: string;
    name: any; // Json type
    domain: string | null;
    themeColor: string;
    language: string;
    logo: string | null;
    createdAt: string;
}

export default function WebsitesPage() {
    const t = useTranslations('Admin');
    const commonT = useTranslations('Common');
    const locale = useLocale();
    const router = useRouter();
    const { role: userRole } = useAppSelector((state) => state.user);
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Form state
    const [nameEn, setNameEn] = useState('');
    const [nameAr, setNameAr] = useState('');
    const [domain, setDomain] = useState('');
    const [themeColor, setThemeColor] = useState('#4f46e5');
    const [logo, setLogo] = useState('');

    useEffect(() => {
        fetchWebsites();
    }, []);

    const fetchWebsites = async () => {
        try {
            const res = await fetch('/api/websites');
            const data = await res.json();
            setWebsites(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch websites:', error);
            toast.error(commonT('error'));
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok) {
                setLogo(data.url);
                toast.success(commonT('uploadSuccess'));
            } else {
                try {
                    toast.error(commonT(data.message) || data.message || commonT('uploadError'));
                } catch (e) {
                    toast.error(data.message || commonT('uploadError'));
                }
            }
        } catch (error) {
            toast.error(commonT('uploadError'));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing ? `/api/websites/${currentId}` : '/api/websites';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: { en: nameEn, ar: nameAr },
                    domain,
                    themeColor,
                    logo,
                }),
            });
            if (res.ok) {
                closeModal();
                fetchWebsites();
                router.refresh(); // Refresh server components to update global theme
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
            console.error(`Failed to ${isEditing ? 'update' : 'create'} website:`, error);
            toast.error(commonT('error'));
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`/api/websites/${deleteId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchWebsites();
                toast.success(commonT('deleted'));
            } else {
                toast.error(commonT('error'));
            }
        } catch (error) {
            console.error('Failed to delete website:', error);
            toast.error(commonT('error'));
        }
    };

    const openEditModal = (site: Website) => {
        setNameEn(site.name.en || '');
        setNameAr(site.name.ar || '');
        setDomain(site.domain || '');
        setThemeColor(site.themeColor);
        setLogo(site.logo || '');
        setCurrentId(site.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setNameEn('');
        setNameAr('');
        setDomain('');
        setThemeColor('#4f46e5');
        setLogo('');
        setCurrentId(null);
    };

    return (
        <div className="space-y-8">
            <WebsiteTour />
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('websites')}</h1>
                    <p className="text-slate-500 mt-1">{t('manageWebsites')}</p>
                </div>
                {(userRole === 'ADMIN' || userRole === 'EDITOR') && (
                    <button
                        id="new-website-btn"
                        onClick={() => {
                            setIsEditing(false);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
                    >
                        <Plus className="w-5 h-5" />
                        {t('newWebsite')}
                    </button>
                )}
            </div>

            <div id="website-table" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rtl:left-auto rtl:right-3" />
                        <input
                            type="text"
                            placeholder={t('searchWebsites')}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 text-gray-400 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 rtl:pl-4 rtl:pr-10 text-start"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-start">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-start">{commonT('name')}</th>
                                <th className="px-6 py-4 text-start">{t('domain')}</th>
                                <th className="px-6 py-4 text-start">{commonT('status')}</th>
                                <th className="px-6 py-4 text-start">{commonT('created')}</th>
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
                            ) : websites.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        {t('noWebsites')}
                                    </td>
                                </tr>
                            ) : websites.map((site) => (
                                <tr key={site.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {site.logo ? (
                                                <img
                                                    src={site.logo}
                                                    alt=""
                                                    className="w-10 h-10 rounded-lg object-contain bg-slate-100 p-1 flex-shrink-0"
                                                />
                                            ) : (
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0"
                                                    style={{ backgroundColor: site.themeColor || '#4f46e5' }}
                                                >
                                                    {getLocalizedName(site.name, locale)[0]?.toUpperCase()}
                                                </div>
                                            )}
                                            <span className="font-semibold text-slate-900">{getLocalizedName(site.name, locale)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {site.domain || 'Not set'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {new Date(site.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-end">
                                        <div className="flex justify-end gap-2">
                                            {(userRole === 'ADMIN' || userRole === 'EDITOR') && (
                                                <button
                                                    onClick={() => openEditModal(site)}
                                                    className="p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                                    title={commonT('edit')}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            {userRole === 'ADMIN' && (
                                                <button
                                                    onClick={() => handleDeleteClick(site.id)}
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
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl border border-slate-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">
                                {isEditing ? t('editWebsite') : t('newWebsite')}
                            </h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-2xl cursor-pointer">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('websiteName')} (EN)</label>
                                    <input
                                        type="text"
                                        value={nameEn}
                                        onChange={(e) => setNameEn(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 text-gray-400 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 ltr"
                                        placeholder="e.g. Health Charity"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('websiteName')} (AR)</label>
                                    <input
                                        type="text"
                                        value={nameAr}
                                        onChange={(e) => setNameAr(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 text-gray-400 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 rtl"
                                        placeholder="مثال: جمعية صحية"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('domain')} ({commonT('about')})</label>
                                <input
                                    type="text"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 text-gray-400 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-start"
                                    placeholder="e.g. health.example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('themeColor')}</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={themeColor}
                                        onChange={(e) => setThemeColor(e.target.value)}
                                        className="w-12 h-10 p-1 rounded-lg border border-slate-200 cursor-pointer bg-white text-gray-400 outline-hidden"
                                    />
                                    <input
                                        type="text"
                                        value={themeColor}
                                        onChange={(e) => setThemeColor(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-slate-200 text-gray-400 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 font-mono"
                                        placeholder="#4f46e5"
                                    />
                                    <div
                                        className="w-10 h-10 rounded-lg border border-slate-200 shadow-inner"
                                        style={{ backgroundColor: themeColor }}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">{t('websiteLogo')}</label>
                                <div className="flex items-center gap-6 p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                                    <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
                                        {logo ? (
                                            <img src={logo} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-slate-300" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    value={logo}
                                                    onChange={(e) => setLogo(e.target.value)}
                                                    className="w-full px-4 py-2 bg-white border border-slate-200 text-gray-400 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                                                    placeholder="Logo URL (or upload)"
                                                />
                                            </div>
                                            <div className="relative overflow-hidden cursor-pointer bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                                                <span>{commonT('create')}</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                                    className="absolute inset-0 opacity-0 cursor-pointer text-gray-400 outline-hidden"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium">Recommended: Square SVG or transparent PNG (min 200x200px)</p>
                                    </div>
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
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title={commonT('delete')}
                message={commonT('confirmDelete')}
                isDeleting
            />
        </div>
    );
}
