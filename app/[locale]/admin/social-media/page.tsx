'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Share2, Image as ImageIcon } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { getLocalizedName } from '@/app/utils/locale';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/app/store/hooks';
import SocialMediaTour from '@/app/components/SocialMediaTour';

interface SocialMedia {
    id: string;
    name: any;
    url: string;
    image: string | null;
    createdAt: string;
}

export default function SocialMediaManagement() {
    const t = useTranslations('Admin');
    const commonT = useTranslations('Common');
    const locale = useLocale();
    const { role: userRole } = useAppSelector((state) => state.user);

    const [items, setItems] = useState<SocialMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Form state
    const [nameEn, setNameEn] = useState('');
    const [nameAr, setNameAr] = useState('');
    const [url, setUrl] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        fetchSocialMedias();
    }, []);

    const fetchSocialMedias = async () => {
        try {
            const res = await fetch('/api/social-media');
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch:', error);
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
                setImage(data.url);
                toast.success('Icon uploaded');
            } else {
                toast.error(data.message || 'Upload failed');
            }
        } catch (error) {
            toast.error('Upload error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const apiUrl = isEditing ? `/api/social-media/${currentId}` : '/api/social-media';
            const method = isEditing ? 'PUT' : 'POST';

            let finalUrl = url;
            if (/^\+?\d+$/.test(url.trim())) {
                finalUrl = `https://wa.me/${url.trim().replace('+', '')}`;
            }

            const res = await fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: { en: nameEn, ar: nameAr },
                    url: finalUrl,
                    image
                }),
            });

            if (res.ok) {
                closeModal();
                fetchSocialMedias();
                toast.success(isEditing ? commonT('updated') : commonT('created'));
            } else {
                toast.error(commonT('error'));
            }
        } catch (error) {
            toast.error(commonT('error'));
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`/api/social-media/${deleteId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchSocialMedias();
                toast.success(commonT('deleted'));
            } else {
                toast.error(commonT('error'));
            }
        } catch (error) {
            toast.error(commonT('error'));
        }
    };

    const openEditModal = (item: SocialMedia) => {
        setNameEn(item.name?.en || '');
        setNameAr(item.name?.ar || '');
        setUrl(item.url);
        setImage(item.image || '');
        setCurrentId(item.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setNameEn('');
        setNameAr('');
        setUrl('');
        setImage('');
        setCurrentId(null);
    };

    return (
        <div className="space-y-8">
            <SocialMediaTour />
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('socialMedia')}</h1>
                    <p className="text-slate-500 mt-1">{t('manageSocialMedia')}</p>
                </div>
                {(userRole === 'ADMIN' || userRole === 'EDITOR') && (
                    <button
                        id="new-social-btn"
                        onClick={() => { setIsEditing(false); setShowModal(true); }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        {t('newSocialMedia')}
                    </button>
                )}
            </div>

            <div id="social-list" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-start">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 text-start">{t('socialIcon')}</th>
                                <th className="px-6 py-4 text-start">{t('socialName')}</th>
                                <th className="px-6 py-4 text-start">{t('socialUrl')}</th>
                                <th className="px-6 py-4 text-end">{commonT('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse h-16"><td colSpan={4}></td></tr>
                                ))
                            ) : items.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">{t('noSocialMedia')}</td></tr>
                            ) : items.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        {item.image ? (
                                            <img src={item.image} alt="" className="w-10 h-10 object-contain bg-slate-100 rounded-lg p-1.5" />
                                        ) : (
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                                <Share2 className="w-5 h-5" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-slate-900">{getLocalizedName(item.name, locale)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-indigo-600">{item.url}</code>
                                    </td>
                                    <td className="px-6 py-4 text-end">
                                        <div className="flex justify-end gap-2">
                                            {(userRole === 'ADMIN' || userRole === 'EDITOR') && (
                                                <button onClick={() => openEditModal(item)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            {userRole === 'ADMIN' && (
                                                <button onClick={() => setDeleteId(item.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
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

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                {isEditing ? t('editSocialMedia') : t('newSocialMedia')}
                            </h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="relative group/avatar">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover/avatar:border-indigo-400">
                                        {image ? (
                                            <img src={image} alt="Icon" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-slate-300" />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <div className="text-[10px] text-center mt-2 font-bold text-slate-400 uppercase tracking-widest">{t('socialIcon')}</div>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <input
                                        type="text"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                                        placeholder="Icon URL (Optional)"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('socialName')} (EN)</label>
                                    <input type="text" value={nameEn} onChange={e => setNameEn(e.target.value)} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-hidden" placeholder="e.g. Facebook" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-end">{t('socialName')} (AR)</label>
                                    <input type="text" value={nameAr} onChange={e => setNameAr(e.target.value)} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-hidden rtl" placeholder="مثال: فيسبوك" />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                    {t('socialUrl')}
                                    <span title="يمكنك كتابة رابط الحساب أو رقم الواتساب مباشرة (مثال: 966500000000)" className="cursor-help text-indigo-400">
                                        <Share2 className="w-3 h-3" />
                                    </span>
                                </label>
                                <input type="text" value={url} onChange={e => setUrl(e.target.value)} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-hidden" placeholder="URL or WhatsApp Number" />
                                {/^\+?\d+$/.test(url.trim()) && <p className="text-[10px] text-green-600 mt-1 font-bold italic">Auto-converting to WhatsApp link</p>}
                            </div>

                            <div className="flex gap-3 pt-6">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">{commonT('cancel')}</button>
                                <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all">
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
