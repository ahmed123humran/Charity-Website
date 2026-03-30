'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, Layers, ImageIcon, Search, Filter, PlusSquare, X, RefreshCw, Calendar } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/app/store/hooks';
import DatePicker from '@/app/components/DatePicker';

interface ContentCategory {
    id: string;
    name: string;
    nameAr: string | null;
}

interface DynamicContent {
    id: string;
    title: string;
    titleAr: string | null;
    description: string | null;
    descriptionAr: string | null;
    image: string | null;
    images?: string[];
    categoryId: string;
    publishDate: string | null;
    category: ContentCategory;
}

export default function ContentManagement() {
    const t = useTranslations('Admin');
    const commonT = useTranslations('Common');
    const locale = useLocale();
    const { role: userRole } = useAppSelector((state) => state.user);

    const [categories, setCategories] = useState<ContentCategory[]>([]);
    const [contents, setContents] = useState<DynamicContent[]>([]);
    const [loading, setLoading] = useState(true);

    // Content Modal State
    const [showContentModal, setShowContentModal] = useState(false);
    const [isEditingContent, setIsEditingContent] = useState(false);
    const [currentContentId, setCurrentContentId] = useState<string | null>(null);

    // Category Modal State
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);

    // Form States
    const [title, setTitle] = useState('');
    const [titleAr, setTitleAr] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionAr, setDescriptionAr] = useState('');
    const [image, setImage] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);

    const [catName, setCatName] = useState('');
    const [catNameAr, setCatNameAr] = useState('');

    // Pagination & Filter/Search
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    const [filterCategoryId, setFilterCategoryId] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState<{ id: string, type: 'content' | 'category' } | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [contentFormErrors, setContentFormErrors] = useState(false);
    const [categoryFormErrors, setCategoryFormErrors] = useState(false);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterCategoryId]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [catsRes, contentRes] = await Promise.all([
                fetch('/api/content-categories'),
                fetch('/api/dynamic-content')
            ]);
            const cats = await catsRes.json();
            const content = await contentRes.json();
            setCategories(Array.isArray(cats) ? cats : []);
            setContents(Array.isArray(content) ? content : []);
        } catch (error) {
            toast.error(commonT('error'));
        } finally {
            setLoading(false);
        }
    };

    const fetchContents = async () => {
        try {
            const res = await fetch('/api/dynamic-content');
            const data = await res.json();
            setContents(Array.isArray(data) ? data : []);
        } catch (error) { }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/content-categories');
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) { }
    };

    const handleContentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !selectedCategoryId) {
            setContentFormErrors(true);
            return toast.error(commonT('fillAllFields'));
        }
        setContentFormErrors(false);

        try {
            const apiUrl = isEditingContent ? `/api/dynamic-content/${currentContentId}` : '/api/dynamic-content';
            const method = isEditingContent ? 'PUT' : 'POST';
            const res = await fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title, titleAr, description, descriptionAr, image, images, categoryId: selectedCategoryId,
                    publishDate: publishDate || undefined
                }),
            });

            const err = await res.json();
            if (res.ok) {
                closeContentModal();
                fetchContents();
                toast.success(commonT('saved'));
            } else {
                if (Array.isArray(err)) {
                    err.forEach((e: any) => toast.error(t(e.message) || e.message));
                } else {
                    toast.error(err.message || commonT('error'));
                }
            }
        } catch (error) {
            toast.error(commonT('error'));
        }
    };

    const handleFileUpload = async (file: File) => {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok) {
                setImage(data.url);
                toast.success(commonT('uploadSuccess'));
            } else {
                const errorMessage = commonT(data.message) || data.message || commonT('uploadError');
                toast.error(data.details ? `${errorMessage}: ${data.details}` : errorMessage);
            }
        } catch (error) {
            toast.error(commonT('uploadError'));
        } finally {
            setUploadingImage(false);
        }
    };

    const handleAdditionalImageUpload = async (file: File) => {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok) {
                setImages(prev => [...prev, data.url]);
                toast.success(commonT('uploadSuccess'));
            } else {
                const errorMessage = commonT(data.message) || data.message || commonT('uploadError');
                toast.error(data.details ? `${errorMessage}: ${data.details}` : errorMessage);
            }
        } catch (error) {
            toast.error(commonT('uploadError'));
        } finally {
            setUploadingImage(false);
        }
    };

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!catName) {
            setCategoryFormErrors(true);
            return toast.error(commonT('fillAllFields'));
        }
        setCategoryFormErrors(false);

        try {
            const apiUrl = isEditingCategory ? `/api/content-categories/${currentCategoryId}` : '/api/content-categories';
            const method = isEditingCategory ? 'PUT' : 'POST';
            const res = await fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: catName, nameAr: catNameAr }),
            });

            if (res.ok) {
                closeCategoryModal();
                fetchCategories();
                toast.success(commonT('saved'));
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
            const url = deleteId.type === 'content' ? `/api/dynamic-content/${deleteId.id}` : `/api/content-categories/${deleteId.id}`;
            const res = await fetch(url, { method: 'DELETE' });
            if (res.ok) {
                if (deleteId.type === 'content') fetchContents();
                else {
                    fetchCategories();
                    fetchContents(); // Some content might have been deleted too if cascade is on, or need to refresh
                }
                toast.success(commonT('deleted'));
            } else {
                toast.error(commonT('error'));
            }
        } catch (error) {
            toast.error(commonT('error'));
        } finally {
            setDeleteId(null);
        }
    };

    const openEditContent = (item: DynamicContent) => {
        setTitle(item.title);
        setTitleAr(item.titleAr || '');
        setDescription(item.description || '');
        setDescriptionAr(item.descriptionAr || '');
        setImage(item.image || '');
        setImages(item.images || []);
        setSelectedCategoryId(item.categoryId);
        setPublishDate(item.publishDate ? new Date(item.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
        setCurrentContentId(item.id);
        setIsEditingContent(true);
        setShowContentModal(true);
    };

    const openEditCategory = (cat: ContentCategory) => {
        setCatName(cat.name);
        setCatNameAr(cat.nameAr || '');
        setCurrentCategoryId(cat.id);
        setIsEditingCategory(true);
        setShowCategoryModal(true);
    };

    const closeContentModal = () => {
        setShowContentModal(false);
        setIsEditingContent(false);
        setContentFormErrors(false);
        setTitle(''); setTitleAr(''); setDescription(''); setDescriptionAr(''); setImage(''); setImages([]); setSelectedCategoryId('');
        setPublishDate(new Date().toISOString().split('T')[0]);
    };

    const closeCategoryModal = () => {
        setShowCategoryModal(false);
        setIsEditingCategory(false);
        setCategoryFormErrors(false);
        setCatName(''); setCatNameAr('');
    };

    const filteredContent = contents.filter(item => {
        const matchesCategory = filterCategoryId === 'all' || item.categoryId === filterCategoryId;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.titleAr && item.titleAr.includes(searchTerm));
        return matchesCategory && matchesSearch;
    });

    const totalPages = Math.ceil(filteredContent.length / ITEMS_PER_PAGE);
    const paginatedContent = filteredContent.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('dynamicContent')}</h1>
                    <p className="text-slate-500 mt-1">{t('manageContent')}</p>
                </div>
                <div className="flex gap-3">
                    {userRole === 'ADMIN' && (
                        <button onClick={() => { setIsEditingCategory(false); setShowCategoryModal(true); }} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition-all cursor-pointer">
                            <Tag className="w-4 h-4" /> {t('newCategory')}
                        </button>
                    )}
                    {(userRole === 'ADMIN' || userRole === 'EDITOR') && (
                        <button onClick={() => { setIsEditingContent(false); setShowContentModal(true); }} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/95 shadow-sm transition-all cursor-pointer">
                            <Plus className="w-5 h-5" /> {t('newContent')}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder={commonT('search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={filterCategoryId}
                        onChange={(e) => setFilterCategoryId(e.target.value)}
                        className="w-full md:w-48 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                        <option value="all">{t('all')}</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{locale === 'ar' && c.nameAr ? c.nameAr : c.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Categories Management Summary */}
            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> {t('contentCategories')}
                </h2>
                <div className="flex flex-wrap gap-3">
                    {categories.map(cat => (
                        <div key={cat.id} className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all group">
                            <span className="font-semibold text-slate-700">{locale === 'ar' && cat.nameAr ? cat.nameAr : cat.name}</span>
                            {userRole === 'ADMIN' && (
                                <div className="flex gap-1 border-l border-slate-100 pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditCategory(cat)} className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer"><Edit2 size={12} /></button>
                                    <button onClick={() => setDeleteId({ id: cat.id, type: 'category' })} className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={12} /></button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {loading ? [1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-slate-200" />) :
                    paginatedContent.length === 0 ? <div className="col-span-full py-20 bg-white border border-dashed border-slate-300 rounded-3xl text-center"><h3 className="text-lg font-bold text-slate-900">{t('noContent')}</h3></div> :
                        paginatedContent.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all flex flex-col">
                                <div className="aspect-video bg-slate-100 relative group-hover:opacity-90 transition-opacity overflow-hidden">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <ImageIcon size={48} />
                                        </div>
                                    )}
                                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-primary shadow-sm">
                                        {locale === 'ar' && item.category.nameAr ? item.category.nameAr : item.category.name}
                                    </span>
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">{locale === 'ar' && item.titleAr ? item.titleAr : item.title}</h3>
                                        <p className="text-slate-500 text-sm line-clamp-2">{locale === 'ar' && item.descriptionAr ? item.descriptionAr : item.description}</p>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-50">
                                        {(userRole === 'ADMIN' || userRole === 'EDITOR') && (
                                            <button onClick={() => openEditContent(item)} className="p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                                        )}
                                        {userRole === 'ADMIN' && (
                                            <button onClick={() => setDeleteId({ id: item.id, type: 'content' })} className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                }
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {commonT('previous')}
                    </button>
                    <span className="text-sm font-bold text-slate-500">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {commonT('next')}
                    </button>
                </div>
            )}



            {/* Content Modal */}
            {showContentModal && (
                <div className="fixed inset-0 top-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{isEditingContent ? t('editContent') : t('newContent')}</h2>
                            <button onClick={closeContentModal} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors cursor-pointer"><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <div className="p-8 overflow-y-auto space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('contentTitle')} (AR)</label>
                                    <input type="text" value={titleAr} onChange={e => setTitleAr(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" dir="rtl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('contentTitle')} (EN)</label>
                                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={`w-full px-4 py-2 border rounded-xl outline-none transition-all ${contentFormErrors && !title ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:ring-2 focus:ring-primary/20'}`} dir="ltr" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('contentDescription')} (AR)</label>
                                    <textarea value={descriptionAr} onChange={e => setDescriptionAr(e.target.value)} rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" dir="rtl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('contentDescription')} (EN)</label>
                                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" dir="ltr" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('contentImage')}</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={image}
                                            onChange={e => setImage(e.target.value)}
                                            placeholder="https://... (or upload)"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="relative overflow-hidden cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-200">
                                        <ImageIcon className="w-4 h-4" />
                                        <span>{uploadingImage ? commonT('loading') : (image ? commonT('edit') : commonT('create'))}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                            className="absolute inset-0 opacity-0 cursor-pointer outline-none"
                                        />
                                    </div>
                                </div>
                                {image && (
                                    <div className="mt-2 w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('additionalImages')}</label>
                                <div className="flex items-center gap-4">
                                    <div className="relative overflow-hidden cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-200">
                                        <Plus className="w-4 h-4" />
                                        <span>{uploadingImage ? commonT('loading') : commonT('add')}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    Array.from(e.target.files).forEach(handleAdditionalImageUpload);
                                                }
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer outline-none"
                                        />
                                    </div>
                                </div>
                                {images.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group">
                                                <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('contentType')}</label>
                                    <select
                                        value={selectedCategoryId}
                                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-xl outline-none transition-all appearance-none bg-white ${contentFormErrors && !selectedCategoryId ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:ring-2 focus:ring-primary/20'}`}
                                    >
                                        <option value="">{t('selectCategory')}</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{locale === 'ar' && c.nameAr ? c.nameAr : c.name}</option>)}
                                    </select>
                                </div>
                                <DatePicker
                                    label={t('publishDate')}
                                    value={publishDate}
                                    onChange={setPublishDate}
                                    locale={locale}
                                    icon={<Calendar size={18} />}
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
                            <button onClick={closeContentModal} className="px-6 py-2 text-slate-500 font-bold cursor-pointer">{commonT('cancel')}</button>
                            <button onClick={handleContentSubmit} className="px-10 py-2.5 bg-primary text-white font-black rounded-full shadow-xl hover:bg-primary/90 transition-all cursor-pointer">{commonT('saveChanges')}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 top-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{isEditingCategory ? t('editCategory') : t('newCategory')}</h2>
                            <button onClick={closeCategoryModal} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors cursor-pointer"><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{commonT('name')} (EN)</label>
                                <input type="text" value={catName} onChange={e => setCatName(e.target.value)} className={`w-full px-4 py-2 border rounded-xl outline-none transition-all bg-white ${categoryFormErrors && !catName ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:ring-2 focus:ring-primary/20'}`} dir="ltr" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{commonT('name')} (AR)</label>
                                <input type="text" value={catNameAr} onChange={e => setCatNameAr(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" dir="rtl" />
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
                            <button onClick={closeCategoryModal} className="px-6 py-2 text-slate-500 font-bold cursor-pointer">{commonT('cancel')}</button>
                            <button onClick={handleCategorySubmit} className="px-10 py-2.5 bg-primary text-white font-black rounded-full shadow-xl hover:bg-primary/90 transition-all cursor-pointer">{commonT('saveChanges')}</button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title={commonT('delete')}
                message={commonT('confirmDelete')}
            />
        </div>
    );
}

