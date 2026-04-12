'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Search, PlusSquare, Edit2, Trash2, Tag, Layers, Code,
    LayoutTemplate, ImageIcon, Copy, MousePointer2, Type, Move, Globe,
    Settings, Database, RefreshCw, CheckCircle2, X, Monitor, FileText,
    Check, Zap, FileSearch, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/app/store/hooks';
import SnippetsTour from '@/app/components/SnippetsTour';
import { sanitizeHtml } from '@/app/utils/sanitize';
import StaticSnippet from '@/app/components/StaticSnippet';
import DynamicSwiper from '@/app/components/DynamicSwiper';
import DynamicGrid from '@/app/components/DynamicGrid';

interface Snippet {
    id: string;
    name: string;
    nameAr: string | null;
    category: string;
    htmlContent: string;
    thumbnail: string | null;
    type: 'STATIC' | 'DYNAMIC' | 'DYNAMIC_GRID';
    apiEndpoint: string | null;
    swiperConfig: any | null;
    fieldMapping: any | null;
    categoryId: string | null;
    containerType: string | null;
}

export default function SnippetsManagement() {
    const t = useTranslations('Admin');
    const commonT = useTranslations('Common');
    const locale = useLocale();
    const { role: userRole } = useAppSelector((state) => state.user);
    const { logo: websiteLogo, name: websiteStoreName } = useAppSelector((state) => state.website);
    const websiteName = websiteStoreName ? (typeof websiteStoreName === 'string' ? websiteStoreName : (websiteStoreName as any)[locale] || (websiteStoreName as any)['ar'] || '') : '';
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [name, setName] = useState('');
    const [nameAr, setNameAr] = useState('');
    const [category, setCategory] = useState('Intro');
    const [htmlContent, setHtmlContent] = useState('');
    const [type, setType] = useState<'STATIC' | 'DYNAMIC' | 'DYNAMIC_GRID'>('STATIC');
    const [isExternalApi, setIsExternalApi] = useState(false);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [swiperConfig, setSwiperConfig] = useState({
        speed: 500,
        slidesPerViewDesktop: 3,
        slidesPerViewTablet: 2,
        slidesPerViewMobile: 1,
        loop: true,
        autoplay: false,
        spaceBetween: 20,
        paginationType: 'bullets',
        showNavigation: true,
        showPagination: true,
        effect: 'slide',
        autoplayDelay: 3000,
        pauseOnHover: true,
        navStyle: 'default',
        navIcon: 'chevron',
        navPosition: 'inside',
        navOffset: 10,
        paginationPosition: 'inside',
        paginationOffset: 20,
        isDetailView: false,
        linkType: 'page',
        modalHtml: '',
        itemsPerPage: 6,
        paginationStyle: 'numbers-rounded',
        paginationAlign: 'center',
        useAlternatingColors: false,
        useAlternatingLayout: false,
    });
    const [containerType, setContainerType] = useState('contained');
    const [fieldMapping, setFieldMapping] = useState<{ placeholder: string, apiField: string }[]>([]);
    const [activeTab, setActiveTab] = useState<'design' | 'swiper' | 'grid' | 'api' | 'modalDesign'>('design');
    const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
    const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
    const [sampleData, setSampleData] = useState<any>(null);
    const [isFetchingSample, setIsFetchingSample] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchSnippets();
        fetchCategories();
    }, []);

    // Visually replace {{logo}} and {{name}} in the preview DOM without modifying htmlContent state
    useEffect(() => {
        if (!previewRef.current || activeTab !== 'design' || viewMode !== 'visual') return;

        // Use a slight timeout to ensure DOM is fully rendered by dangerouslySetInnerHTML
        const timeoutId = setTimeout(() => {
            if (!previewRef.current) return;

            // 1. Replace Logos
            const images = previewRef.current.querySelectorAll('img');
            images.forEach((img: HTMLImageElement) => {
                const src = img.getAttribute('src');
                if (src === '{{logo}}') {
                    const FALLBACK_LOGO = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                    img.setAttribute('data-template-src', '{{logo}}');
                    img.src = websiteLogo || FALLBACK_LOGO;
                }
            });

            // 2. Replace Names (Text replacement)
            const walk = document.createTreeWalker(previewRef.current, NodeFilter.SHOW_TEXT, null);
            let node;
            const nodesToReplace: { node: Text, parent: HTMLElement }[] = [];

            while (node = walk.nextNode()) {
                if (node.textContent?.includes('{{name}}')) {
                    nodesToReplace.push({ node: node as Text, parent: node.parentElement as HTMLElement });
                }
            }

            nodesToReplace.forEach(({ node, parent }) => {
                const originalText = node.textContent || '';
                parent.setAttribute('data-template-text', originalText);
                node.textContent = originalText.replace(/{{name}}/g, websiteName || 'Website Name');
            });
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [htmlContent, websiteLogo, websiteName, activeTab, viewMode]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/content-categories');
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) { }
    };

    const getCleanHtml = () => {
        if (!previewRef.current) return '';
        const clone = previewRef.current.cloneNode(true) as HTMLElement;
        // Restore dynamic logo variables before saving
        clone.querySelectorAll('img[data-template-src]').forEach(img => {
            img.setAttribute('src', img.getAttribute('data-template-src') || '');
            img.removeAttribute('data-template-src');
        });
        // Restore dynamic name variables
        clone.querySelectorAll('[data-template-text]').forEach(el => {
            el.textContent = el.getAttribute('data-template-text');
            el.removeAttribute('data-template-text');
        });
        clone.querySelectorAll('*').forEach(el => {
            (el as HTMLElement).style.outline = '';
            (el as HTMLElement).style.outlineOffset = '';
            el.removeAttribute('contenteditable');
        });
        return clone.innerHTML;
    };

    const fetchSnippets = async () => {
        try {
            const res = await fetch('/api/snippets');
            const data = await res.json();
            setSnippets(Array.isArray(data) ? data : []);
        } catch (error) { toast.error(commonT('error')); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let finalContent = htmlContent;
        if (viewMode === 'visual' && previewRef.current) {
            finalContent = getCleanHtml();
        }

        try {
            const apiUrl = isEditing ? `/api/snippets/${currentId}` : '/api/snippets';
            const method = isEditing ? 'PUT' : 'POST';
            const res = await fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    nameAr,
                    category,
                    htmlContent: finalContent,
                    type: type,
                    apiEndpoint: ((type === 'DYNAMIC' || type === 'DYNAMIC_GRID') && isExternalApi) ? apiEndpoint : null,
                    categoryId: ((type === 'DYNAMIC' || type === 'DYNAMIC_GRID') && !isExternalApi) ? categoryId : null,
                    swiperConfig: (type === 'DYNAMIC' || type === 'DYNAMIC_GRID') ? swiperConfig : null,
                    fieldMapping: (type === 'DYNAMIC' || type === 'DYNAMIC_GRID') ? fieldMapping : null,
                    containerType,
                }),
            });
            if (res.ok) {
                closeModal();
                fetchSnippets();
                toast.success(commonT('saved'));
            } else {
                const err = await res.json();
                try {
                    if (Array.isArray(err)) {
                        err.forEach((e: any) => {
                            toast.error(t(e.message) || e.message);
                        });
                    } else {
                        toast.error(t(err.message) || err.message || commonT('error'));
                    }
                } catch (e) {
                    toast.error(err.message || commonT('error'));
                }
            }
        } catch (error) {
            toast.error(commonT('error'));
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`/api/snippets/${deleteId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchSnippets();
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
            toast.error(commonT('error'));
        }
        finally { setDeleteId(null); }
    };

    const openEditModal = (snippet: Snippet) => {
        setName(snippet.name);
        setNameAr(snippet.nameAr || '');
        setCategory(snippet.category);
        setHtmlContent(snippet.htmlContent);

        const snippetType = snippet.type || 'STATIC';
        if (snippetType === 'DYNAMIC') {
            setType('DYNAMIC');
            setIsExternalApi(!!snippet.apiEndpoint);
        } else if (snippetType === 'DYNAMIC_GRID') {
            setType('DYNAMIC_GRID');
            setIsExternalApi(!!snippet.apiEndpoint);
        } else {
            setType('STATIC');
            setIsExternalApi(false);
        }

        setApiEndpoint(snippet.apiEndpoint || '');
        setSwiperConfig(snippet.swiperConfig || {
            speed: 500,
            slidesPerViewDesktop: 3,
            slidesPerViewTablet: 2,
            slidesPerViewMobile: 1,
            loop: true,
            autoplay: false,
            spaceBetween: 20,
            paginationType: 'bullets',
            showNavigation: true,
            showPagination: true,
            effect: 'slide',
            autoplayDelay: 3000,
            pauseOnHover: true,
            navStyle: 'default',
            navIcon: 'chevron',
            isDetailView: false,
            linkType: 'page',
            useAlternatingColors: false,
            useAlternatingLayout: false,
            ...snippet.swiperConfig
        });
        setCategoryId(snippet.categoryId || '');
        setContainerType(snippet.containerType || 'contained');
        setFieldMapping(Array.isArray(snippet.fieldMapping) ? snippet.fieldMapping : []);
        setCurrentId(snippet.id);
        setIsEditing(true);
        setViewMode('visual');
        setActiveTab('design');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setName('');
        setNameAr('');
        setCategory('Intro');
        setHtmlContent('');
        setType('STATIC');
        setIsExternalApi(false);
        setApiEndpoint('');
        setCategoryId('');
        setContainerType('contained');
        setFieldMapping([]);
        setActiveTab('design');
        setCurrentId(null);
        setActiveElement(null);
        setSampleData(null);
        setSwiperConfig({
            speed: 500,
            slidesPerViewDesktop: 3,
            slidesPerViewTablet: 2,
            slidesPerViewMobile: 1,
            loop: true,
            autoplay: false,
            spaceBetween: 20,
            paginationType: 'bullets',
            showNavigation: true,
            showPagination: true,
            effect: 'slide',
            autoplayDelay: 3000,
            pauseOnHover: true,
            navStyle: 'default',
            navIcon: 'chevron',
            navPosition: 'inside',
            navOffset: 10,
            paginationPosition: 'inside',
            paginationOffset: 20,
            isDetailView: false,
            linkType: 'page',
            modalHtml: '',
            itemsPerPage: 6,
            paginationStyle: 'numbers-rounded',
            paginationAlign: 'center',
            useAlternatingColors: false,
            useAlternatingLayout: false,
        });
    };

    const handlePreviewClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        let target = e.target as HTMLElement;
        const smartTarget = target.closest('p, h1, h2, h3, h4, h5, h6, span, a, li, button, img');
        if (smartTarget && previewRef.current?.contains(smartTarget)) target = smartTarget as HTMLElement;

        if (activeElement) activeElement.style.outline = '';
        setActiveElement(target);

        if (target.tagName !== 'IMG' && target !== previewRef.current) {
            target.contentEditable = 'true';
            target.style.outline = '2px solid #3b82f6';
            target.focus();
            const handleBlur = () => {
                target.contentEditable = 'false';
                target.style.outline = '';
                if (previewRef.current) setHtmlContent(getCleanHtml());
                target.removeEventListener('blur', handleBlur);
            };
            target.addEventListener('blur', handleBlur);
        } else if (target !== previewRef.current) {
            target.style.outline = '2px solid #3b82f6';
        }
    };

    return (
        <div className="space-y-8">
            <SnippetsTour />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('snippets')}</h1>
                    <p className="text-slate-500 mt-1">{t('readymadeSections')}</p>
                </div>
                {(userRole === 'ADMIN' || userRole === 'EDITOR') && (
                    <button
                        id="new-snippet-btn"
                        onClick={() => { setIsEditing(false); setShowModal(true); setViewMode('visual'); }} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/95 shadow-sm transition-all cursor-pointer">
                        <Plus className="w-5 h-5" /> {t('newSnippet')}
                    </button>
                )}
            </div>

            <div id="snippets-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? [1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-slate-200" />) :
                    snippets.length === 0 ? <div className="col-span-full py-20 bg-white border border-dashed border-slate-300 rounded-3xl text-center"><h3 className="text-lg font-bold text-slate-900">{t('noSnippets')}</h3></div> :
                        snippets.map((s, index) => (
                            <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all">
                                <div className="aspect-video bg-slate-50 flex items-center justify-center p-6 border-b border-slate-100 relative">
                                    {s.type === 'DYNAMIC' ? (
                                        <div className="scale-75 origin-center pointer-events-none w-full h-full overflow-hidden flex items-center justify-center">
                                            <DynamicSwiper snippet={s} singleRecordOnly={true} />
                                        </div>
                                    ) : s.type === 'DYNAMIC_GRID' ? (
                                        <div className="scale-75 origin-center pointer-events-none w-full h-full overflow-hidden flex items-center justify-center">
                                            <DynamicGrid snippet={s} singleRecordOnly={true} />
                                        </div>
                                    ) : (
                                        <div className="scale-50 origin-center opacity-70 pointer-events-none w-full h-full overflow-hidden">
                                            <StaticSnippet htmlContent={s.htmlContent} />
                                        </div>
                                    )}
                                    <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-primary shadow-sm border border-indigo-100">{t(`categories.${s.category}`)}</span>
                                </div>
                                <div className="p-4 flex justify-between items-center bg-white">
                                    <span className="font-bold text-slate-800">{locale === 'ar' && s.nameAr ? s.nameAr : s.name}</span>
                                    <div className="flex gap-2">
                                        {(userRole === 'ADMIN' || userRole === 'EDITOR') && (
                                            <button
                                                id={index === 0 ? 'edit-snippet-btn-0' : undefined}
                                                onClick={() => openEditModal(s)}
                                                className="p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        {userRole === 'ADMIN' && (
                                            <button onClick={() => setDeleteId(s.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                }
            </div>

            {showModal && (
                <div className="fixed inset-0 top-14 lg:top-0 lg:start-72 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-[200]">
                    <div id="snippet-editor-modal" className="bg-white rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-6xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[95vh] sm:h-[90vh]">
                        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-2 sm:gap-4">
                            <h2 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tight truncate shrink min-w-0 pr-2">{isEditing ? t('editSnippet') : t('createSnippet')}</h2>
                            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                                <div className="flex bg-slate-100 p-1 rounded-full scale-90 sm:scale-100 origin-right">
                                    <button onClick={() => setViewMode('visual')} className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${viewMode === 'visual' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}>{t('visual')}</button>
                                    <button onClick={() => setViewMode('code')} className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${viewMode === 'code' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}>{t('code')}</button>
                                </div>
                                <button onClick={closeModal} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors cursor-pointer"><X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" /></button>
                            </div>
                        </div>

                        {(type === 'DYNAMIC' || type === 'DYNAMIC_GRID') && (
                            <div className="bg-slate-50 border-b border-slate-100 flex px-6 sm:px-10 overflow-x-auto no-scrollbar">
                                <button
                                    onClick={() => setActiveTab('design')}
                                    className={`py-4 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'design' ? 'border-primary text-primary bg-white shadow-[0_-4px_0_inset_white]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Layers className="w-4 h-4" /> {t('design')}
                                </button>
                                {type === 'DYNAMIC' && (
                                    <button
                                        onClick={() => setActiveTab('swiper')}
                                        className={`py-4 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'swiper' ? 'border-primary text-primary bg-white shadow-[0_-4px_0_inset_white]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <Settings className="w-4 h-4" /> {t('settings')}
                                    </button>
                                )}
                                {type === 'DYNAMIC_GRID' && (
                                    <button
                                        onClick={() => setActiveTab('grid')}
                                        className={`py-4 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'grid' ? 'border-primary text-primary bg-white shadow-[0_-4px_0_inset_white]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <LayoutTemplate className="w-4 h-4" /> {locale === 'ar' ? 'إعدادات الشبكة' : 'Grid Settings'}
                                    </button>
                                )}
                                {isExternalApi && (
                                    <button
                                        onClick={() => setActiveTab('api')}
                                        className={`py-4 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'api' ? 'border-primary text-primary bg-white shadow-[0_-4px_0_inset_white]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <Database className="w-4 h-4" /> {t('apiConfig')}
                                    </button>
                                )}
                                {swiperConfig.linkType === 'modal' && (
                                    <button
                                        onClick={() => setActiveTab('modalDesign')}
                                        className={`py-4 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'modalDesign' ? 'border-indigo-500 text-indigo-500 bg-white shadow-[0_-4px_0_inset_white]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <FileText className="w-4 h-4" /> {locale === 'ar' ? 'تصميم النافذة' : 'Modal Design'}
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="flex-1 overflow-hidden flex flex-col xl:flex-row">
                            <div className="w-full xl:w-72 bg-slate-50 border-b xl:border-b-0 xl:border-r border-slate-100 p-4 sm:p-6 overflow-y-auto shrink-0 z-10 transition-all">
                                <div className="flex flex-col md:flex-row xl:flex-col gap-4">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{t('generalDetails')}</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-3">
                                            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={`${t('snippetName')} (EN)`} className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400" />
                                            <input type="text" value={nameAr} onChange={e => setNameAr(e.target.value)} placeholder={`${t('snippetName')} (AR)`} className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-end placeholder:text-slate-400" dir="rtl" />
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-48 xl:w-full shrink-0">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">{t('category')}</label>
                                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                                            {['Intro', 'Content', 'Features', 'Contact', 'Footer', 'Header', 'CTA', 'Stats', 'Dynamic'].map(c => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
                                        </select>
                                    </div>
                                    <div className="w-full sm:w-48 xl:w-full shrink-0">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">{t('snippetType')}</label>
                                        <select value={type} onChange={e => {
                                            const newType = e.target.value as any;
                                            setType(newType);
                                            if (newType === 'DYNAMIC_GRID') setActiveTab('design');
                                        }} className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                                            <option value="STATIC">{t('static')}</option>
                                            <option value="DYNAMIC">{t('dynamicSwiper')}</option>
                                            <option value="DYNAMIC_GRID">{locale === 'ar' ? 'شبكة ديناميكية' : 'Dynamic Grid'}</option>
                                        </select>
                                    </div>
                                    {(type === 'DYNAMIC' || type === 'DYNAMIC_GRID') && (
                                        <>
                                            <div className="w-full sm:w-48 xl:w-full shrink-0">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">{locale === 'ar' ? 'نوع الحاوية' : 'Container Type'}</label>
                                                <select value={containerType} onChange={e => setContainerType(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                                                    <option value="contained">{locale === 'ar' ? 'داخل كونتينر' : 'Contained'}</option>
                                                    <option value="full">{locale === 'ar' ? 'عرض كامل' : 'Full Width'}</option>
                                                </select>
                                            </div>

                                            {/* Detail Mode Toggle */}
                                            {type !== 'DYNAMIC_GRID' && (
                                                <div className="w-full sm:w-48 xl:w-full shrink-0">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">{locale === 'ar' ? 'نمط صفحة التفاصيل' : 'Detail Page Mode'}</label>
                                                    <div onClick={() => setSwiperConfig({ ...swiperConfig, isDetailView: !swiperConfig.isDetailView })}
                                                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${swiperConfig.isDetailView ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <FileText className={`w-4 h-4 ${swiperConfig.isDetailView ? 'text-primary' : 'text-slate-400'}`} />
                                                            <span className={`text-xs font-bold ${swiperConfig.isDetailView ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{locale === 'ar' ? 'نمط صفحة التفاصيل' : 'Detail Page Layout'}</span>
                                                        </div>
                                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${swiperConfig.isDetailView ? 'border-primary bg-primary' : 'border-slate-300'}`}>
                                                            {swiperConfig.isDetailView && <Check className="w-2.5 h-2.5 text-white" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Modal Toggle */}
                                            <div className="w-full sm:w-48 xl:w-full shrink-0">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">{locale === 'ar' ? 'نمط المودال' : 'Modal Popup Mode'}</label>
                                                <div onClick={() => setSwiperConfig({ ...swiperConfig, linkType: swiperConfig.linkType === 'modal' ? 'page' : 'modal' })}
                                                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${swiperConfig.linkType === 'modal' ? 'border-indigo-500 bg-indigo-50/50' : 'border-indigo-50 bg-white hover:border-indigo-100'}`}>
                                                    <div className="flex items-center gap-2">
                                                        <Layers className={`w-4 h-4 ${swiperConfig.linkType === 'modal' ? 'text-indigo-500' : 'text-slate-400'}`} />
                                                        <span className="text-[11px] font-bold text-slate-700">{locale === 'ar' ? 'نافذة منبثقة' : 'Modal'}</span>
                                                    </div>
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${swiperConfig.linkType === 'modal' ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}`}>
                                                        {swiperConfig.linkType === 'modal' && <Check className="w-2.5 h-2.5 text-white" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {(type === 'DYNAMIC' || type === 'DYNAMIC_GRID') && (
                                    <div className="mt-4 flex items-center gap-2 cursor-pointer group" onClick={() => {
                                        const newValue = !isExternalApi;
                                        setIsExternalApi(newValue);
                                        if (!newValue && activeTab === 'api') {
                                            setActiveTab('design');
                                        }
                                    }}>
                                        <div className={`w-10 h-6 rounded-full relative transition-all ${isExternalApi ? 'bg-primary' : 'bg-slate-200'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isExternalApi ? 'right-1' : 'left-1'}`} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider group-hover:text-primary transition-colors">
                                            {locale === 'ar' ? 'استخدام API خارجي' : 'External API'}
                                        </span>
                                    </div>
                                )}
                                {(type === 'DYNAMIC' || type === 'DYNAMIC_GRID') && !isExternalApi && (
                                    <div className="mt-4 space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">{t('contentType')}</label>
                                        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                                            <option value="">{t('selectCategory')}</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{locale === 'ar' && c.nameAr ? c.nameAr : c.name}</option>)}
                                        </select>
                                    </div>
                                )}
                                {(type === 'DYNAMIC' || type === 'DYNAMIC_GRID') && (
                                    <div className="mt-8 space-y-4">
                                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                            <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                                                {locale === 'ar'
                                                    ? (!isExternalApi
                                                        ? 'سوف يتم جلب البيانات من القسم المحدد. استخدم {{title}}, {{description}}, {{publishDate}}, {{image}}, {{htmlContent}}, {{link}}, {{tag}}, {{linkText}}, {{icon}}, {{id}} .'
                                                        : 'سوف تظهر البيانات بشكل متكرر داخل البطاقة. استخدم {{field}} لوضع البيانات.')
                                                    : (!isExternalApi
                                                        ? 'Data will be fetched from the selected category. Use {{title}}, {{description}}, {{publishDate}}, {{image}}, {{htmlContent}}, {{link}}, {{tag}}, {{linkText}}, {{icon}}, {{id}}.'
                                                        : 'Data will repeat within the card. Use {{field}} to place data.')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div className="text-[10px] text-slate-400 p-4 border-2 border-dashed border-slate-200 rounded-2xl leading-relaxed italic mt-6 hidden sm:block">
                                    {t('quickTip')}
                                </div>
                            </div>

                            <div className="flex-1 bg-slate-100 p-4 sm:p-8 overflow-auto relative">
                                {activeTab === 'design' ? (
                                    viewMode === 'code' ? (
                                        <textarea value={htmlContent} onChange={e => setHtmlContent(e.target.value)} dir="ltr" className="w-full h-full font-mono text-[13px] sm:text-sm p-4 sm:p-8 bg-slate-900 !text-slate-100 rounded-2xl sm:rounded-3xl outline-none min-h-[300px] outline-hidden selection:bg-secondary selection:text-white" />
                                    ) : (
                                        <div className="max-w-4xl mx-auto min-h-full py-10 sm:py-20 relative">
                                            {activeElement && previewRef.current?.contains(activeElement) && type !== 'DYNAMIC' && type !== 'DYNAMIC_GRID' && (
                                                <div className="fixed z-50 flex gap-1 bg-slate-900 text-white p-1 rounded-full shadow-2xl"
                                                    style={{ top: `${activeElement.getBoundingClientRect().top - 40}px`, left: `${activeElement.getBoundingClientRect().left + activeElement.getBoundingClientRect().width / 2}px`, transform: 'translateX(-50%)' }}>
                                                    <button onMouseDown={e => {
                                                        e.preventDefault();
                                                        const clone = activeElement.cloneNode(true) as HTMLElement;
                                                        clone.style.outline = '';
                                                        activeElement.after(clone);
                                                        setHtmlContent(previewRef.current?.innerHTML || '');
                                                    }} className="p-1.5 hover:bg-slate-800 rounded-full cursor-pointer"><Copy className="w-3.5 h-3.5" /></button>
                                                    <button onMouseDown={e => {
                                                        e.preventDefault();
                                                        activeElement.remove();
                                                        setActiveElement(null);
                                                        setHtmlContent(previewRef.current?.innerHTML || '');
                                                    }} className="p-1.5 hover:bg-red-900 rounded-full cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                                                    {activeElement.tagName === 'IMG' && (
                                                        <button onMouseDown={e => {
                                                            e.preventDefault();
                                                            const src = prompt(t('urlHint'), (activeElement as HTMLImageElement).src);
                                                            if (src) { (activeElement as HTMLImageElement).src = src; setHtmlContent(previewRef.current?.innerHTML || ''); }
                                                        }} className="p-1.5 hover:bg-slate-800 rounded-full cursor-pointer"><ImageIcon className="w-3.5 h-3.5" /></button>
                                                    )}
                                                </div>
                                            )}
                                            {(type === 'DYNAMIC' || type === 'DYNAMIC_GRID') ? (
                                                <div className="bg-slate-50 border border-slate-200 shadow-inner rounded-[2rem] min-h-[400px] relative pointer-events-none opacity-95 overflow-hidden">
                                                    <div className="absolute top-0 right-0 bg-primary/95 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-bl-2xl z-50 shadow-sm backdrop-blur-sm shadow-primary/20 flex items-center gap-2"><Globe className="w-3 h-3" /> Live Preview</div>
                                                    {type === 'DYNAMIC' ? (
                                                        <DynamicSwiper snippet={{ id: 'preview', htmlContent, type, apiEndpoint, swiperConfig, categoryId, fieldMapping }} singleRecordOnly={true} />
                                                    ) : (
                                                        <DynamicGrid snippet={{ id: 'preview', htmlContent, type, apiEndpoint, swiperConfig, categoryId, fieldMapping }} singleRecordOnly={true} />
                                                    )}
                                                </div>
                                            ) : (
                                                <div ref={previewRef} onClick={handlePreviewClick} dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }} className="bg-white shadow-2xl min-h-[400px]" />
                                            )}
                                        </div>
                                    )
                                ) : (activeTab === 'modalDesign' && type === 'DYNAMIC') ? (
                                    <div className="flex-1 overflow-hidden flex flex-col xl:flex-row relative bg-slate-100">
                                        <div className="flex-1 p-4 sm:p-8 overflow-auto relative">
                                            <div className="mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white inline-block px-4 py-1.5 rounded-lg border border-slate-200">
                                                {locale === 'ar' ? 'كود التصميم للنافذة المنبثقة' : 'HTML Design for Modal Popup'}
                                            </div>
                                            <textarea value={swiperConfig.modalHtml || ''} onChange={e => setSwiperConfig({ ...swiperConfig, modalHtml: e.target.value })} dir="ltr" className="w-full font-mono text-[13px] sm:text-sm p-4 sm:p-8 bg-slate-900 !text-slate-100 rounded-2xl sm:rounded-3xl outline-none min-h-[400px] outline-hidden selection:bg-secondary selection:text-white" placeholder="<!-- HTML for Modal details -->" />
                                        </div>
                                        <div className="w-full xl:w-1/2 bg-white border-t xl:border-t-0 xl:border-r border-slate-200 p-4 sm:p-8 overflow-y-auto shrink-0 z-10 transition-all">
                                            <div className="bg-slate-50 border border-slate-200 shadow-inner rounded-[2rem] min-h-[400px] relative pointer-events-none opacity-95 overflow-hidden">
                                                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-bl-2xl z-50 shadow-sm backdrop-blur-sm shadow-indigo-500/20 flex items-center gap-2"><Globe className="w-3 h-3" /> {locale === 'ar' ? 'معاينة المودال' : 'Modal Preview'}</div>
                                                {type === 'DYNAMIC' ? (
                                                    <DynamicSwiper snippet={{ id: 'modal-preview', htmlContent: swiperConfig.modalHtml || '<div class="p-10 text-center text-slate-400">Modal HTML Empty</div>', type, apiEndpoint, swiperConfig: { ...swiperConfig, isDetailView: true }, categoryId, fieldMapping }} singleRecordOnly={true} isPreview={true} />
                                                ) : (
                                                    <DynamicGrid snippet={{ id: 'modal-preview', htmlContent: swiperConfig.modalHtml || '<div class="p-10 text-center text-slate-400">Modal HTML Empty</div>', type, apiEndpoint, swiperConfig: { ...swiperConfig, isDetailView: true }, categoryId, fieldMapping }} singleRecordOnly={true} isPreview={true} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (activeTab === 'swiper' && type === 'DYNAMIC') ? (
                                    <div className="max-w-3xl mx-auto py-10 space-y-8">
                                        {/* Quick Presets */}
                                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200">
                                            <div className="flex items-center gap-3 mb-6">
                                                <LayoutTemplate className="w-5 h-5 text-indigo-300" />
                                                <h3 className="text-lg font-bold">{locale === 'ar' ? 'القوالب السريعة' : 'Quick Presets'}</h3>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {[
                                                    { id: 'hero', name: 'Hero', nameAr: 'بطل الصفحة', config: { slidesPerViewDesktop: 1, slidesPerViewTablet: 1, slidesPerViewMobile: 1, spaceBetween: 0, effect: 'fade', autoplay: true, autoplayDelay: 5000, loop: true, showNavigation: true, showPagination: true, navStyle: 'glass', navPosition: 'inside', navOffset: 20, paginationPosition: 'inside', paginationOffset: 20 } },
                                                    { id: 'cards', name: 'Cards', nameAr: 'بطاقات', config: { slidesPerViewDesktop: 3, slidesPerViewTablet: 2, slidesPerViewMobile: 1, spaceBetween: 30, effect: 'slide', autoplay: false, loop: true, showNavigation: true, showPagination: true, navStyle: 'rounded', navPosition: 'outside', navOffset: 40, paginationPosition: 'outside', paginationOffset: 20 } },
                                                    { id: 'testimonials', name: 'Testimonials', nameAr: 'آراء العملاء', config: { slidesPerViewDesktop: 2, slidesPerViewTablet: 1, slidesPerViewMobile: 1, spaceBetween: 20, effect: 'coverflow', autoplay: true, autoplayDelay: 4000, loop: true, showNavigation: false, showPagination: true, navStyle: 'default', paginationPosition: 'outside', paginationOffset: 30 } },
                                                    { id: 'logos', name: 'Logos', nameAr: 'شعارات', config: { slidesPerViewDesktop: 6, slidesPerViewTablet: 4, slidesPerViewMobile: 2, spaceBetween: 40, effect: 'slide', autoplay: true, autoplayDelay: 2000, loop: true, showNavigation: false, showPagination: false, speed: 2000 } }
                                                ].map(preset => (
                                                    <button
                                                        key={preset.id}
                                                        onClick={() => setSwiperConfig({ ...swiperConfig, ...preset.config })}
                                                        className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group cursor-pointer"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                            <PlusSquare className="w-5 h-5 text-indigo-300" />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-wider">{locale === 'ar' ? preset.nameAr : preset.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>


                                        {/* Section 2: Swiper Behavior (Only visible in LIST mode) */}
                                        {!swiperConfig.isDetailView ? (
                                            <div className="space-y-10 pt-6 border-t border-slate-50 animate-in fade-in slide-in-from-top-4 duration-500">
                                                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                                        <Zap className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">{locale === 'ar' ? 'سلوك العرض المتحرك' : 'Slide Behavior'}</h4>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('swiperSpeed')}</label>
                                                        <input type="number" value={swiperConfig.speed} onChange={e => setSwiperConfig({ ...swiperConfig, speed: parseInt(e.target.value) })} className="w-full px-5 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                                                    </div>
                                                    <div className="flex flex-col gap-4 pt-4">
                                                        <label className="flex items-center gap-3 cursor-pointer group">
                                                            <div className={`w-12 h-7 rounded-full relative transition-all ${swiperConfig.loop ? 'bg-primary' : 'bg-slate-200'}`}>
                                                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${swiperConfig.loop ? 'right-1' : 'left-1'}`} />
                                                            </div>
                                                            <input type="checkbox" className="hidden" checked={swiperConfig.loop} onChange={e => setSwiperConfig({ ...swiperConfig, loop: e.target.checked })} />
                                                            <span className="text-xs font-bold text-slate-700 group-hover:text-primary transition-colors">{t('loop')}</span>
                                                        </label>
                                                        <label className="flex items-center gap-3 cursor-pointer group">
                                                            <div className={`w-12 h-7 rounded-full relative transition-all ${swiperConfig.autoplay ? 'bg-primary' : 'bg-slate-200'}`}>
                                                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${swiperConfig.autoplay ? 'right-1' : 'left-1'}`} />
                                                            </div>
                                                            <input type="checkbox" className="hidden" checked={swiperConfig.autoplay} onChange={e => setSwiperConfig({ ...swiperConfig, autoplay: e.target.checked })} />
                                                            <span className="text-xs font-bold text-slate-700 group-hover:text-primary transition-colors">{t('autoplay')}</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {swiperConfig.autoplay && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 animate-in fade-in zoom-in-95">
                                                        <div className="space-y-3">
                                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{locale === 'ar' ? 'تأخير التشغيل (مللي ثانية)' : 'Autoplay Delay (ms)'}</label>
                                                            <input type="number" step="500" value={swiperConfig.autoplayDelay} onChange={e => setSwiperConfig({ ...swiperConfig, autoplayDelay: parseInt(e.target.value) })} className="w-full px-5 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium" />
                                                        </div>
                                                        <div className="flex items-center gap-3 pt-6">
                                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                                <div className={`w-12 h-7 rounded-full relative transition-all ${swiperConfig.pauseOnHover ? 'bg-primary' : 'bg-slate-200'}`}>
                                                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${swiperConfig.pauseOnHover ? 'right-1' : 'left-1'}`} />
                                                                </div>
                                                                <input type="checkbox" className="hidden" checked={swiperConfig.pauseOnHover} onChange={e => setSwiperConfig({ ...swiperConfig, pauseOnHover: e.target.checked })} />
                                                                <span className="text-xs font-bold text-slate-600 group-hover:text-primary transition-colors">{locale === 'ar' ? 'توقف عند التمرير' : 'Pause on Hover'}</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{locale === 'ar' ? 'تأثير الانتقال' : 'Transition Effect'}</label>
                                                        <select value={swiperConfig.effect} onChange={e => setSwiperConfig({ ...swiperConfig, effect: e.target.value })} className="w-full px-5 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium">
                                                            <option value="slide">Slide</option>
                                                            <option value="fade">Fade</option>
                                                            <option value="cube">Cube</option>
                                                            <option value="coverflow">Coverflow</option>
                                                            <option value="flip">Flip</option>
                                                            <option value="cards">Cards</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{locale === 'ar' ? 'نمط التنقل' : 'Navigation Style'}</label>
                                                        <select value={swiperConfig.navStyle} onChange={e => setSwiperConfig({ ...swiperConfig, navStyle: e.target.value })} className="w-full px-5 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium">
                                                            <option value="default">{locale === 'ar' ? 'افتراضي (مربع)' : 'Default (Square)'}</option>
                                                            <option value="minimal">{locale === 'ar' ? 'بسيط' : 'Minimal'}</option>
                                                            <option value="rounded">{locale === 'ar' ? 'دائري' : 'Rounded'}</option>
                                                            <option value="glass">{locale === 'ar' ? 'زجاجي' : 'Glass'}</option>
                                                            <option value="filled">{locale === 'ar' ? 'ممتلئ' : 'Filled'}</option>
                                                            <option value="outline">{locale === 'ar' ? 'محدد' : 'Outline'}</option>
                                                            <option value="soft">{locale === 'ar' ? 'ناعم' : 'Soft'}</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-50 pt-8">
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{t('spaceBetween')}</label>
                                                        <input type="number" value={swiperConfig.spaceBetween} onChange={e => setSwiperConfig({ ...swiperConfig, spaceBetween: parseInt(e.target.value) })} className="w-full px-5 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{t('paginationType')}</label>
                                                        <select value={swiperConfig.paginationType} onChange={e => setSwiperConfig({ ...swiperConfig, paginationType: e.target.value })} className="w-full px-5 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium">
                                                            <option value="bullets">{t('paginationTypes.bullets')}</option>
                                                            <option value="fraction">{t('paginationTypes.fraction')}</option>
                                                            <option value="progressbar">{t('paginationTypes.progressbar')}</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 px-6 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                                    <div className="space-y-4">
                                                        <label className="flex items-center gap-3 cursor-pointer group">
                                                            <div className={`w-12 h-7 rounded-full relative transition-all ${swiperConfig.showNavigation ? 'bg-primary' : 'bg-slate-200'}`}>
                                                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${swiperConfig.showNavigation ? 'right-1' : 'left-1'}`} />
                                                            </div>
                                                            <input type="checkbox" className="hidden" checked={swiperConfig.showNavigation} onChange={e => setSwiperConfig({ ...swiperConfig, showNavigation: e.target.checked })} />
                                                            <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{t('showNavigation')}</span>
                                                        </label>
                                                        {swiperConfig.showNavigation && (
                                                            <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-1">
                                                                <div className="space-y-1">
                                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{locale === 'ar' ? 'الموقع' : 'Position'}</label>
                                                                    <select value={swiperConfig.navPosition} onChange={e => setSwiperConfig({ ...swiperConfig, navPosition: e.target.value })} className="w-full px-3 py-1.5 bg-white border border-slate-200 text-slate-900 rounded-lg text-xs font-medium outline-none focus:ring-1 focus:ring-primary/20">
                                                                        <option value="inside">{locale === 'ar' ? 'داخل' : 'Inside'}</option>
                                                                        <option value="outside">{locale === 'ar' ? 'خارج' : 'Outside'}</option>
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{locale === 'ar' ? 'الأيقونة' : 'Icon'}</label>
                                                                    <select value={swiperConfig.navIcon} onChange={e => setSwiperConfig({ ...swiperConfig, navIcon: e.target.value })} className="w-full px-3 py-1.5 bg-white border border-slate-200 text-slate-900 rounded-lg text-xs font-medium outline-none focus:ring-1 focus:ring-primary/20">
                                                                        <option value="chevron">Chevron</option>
                                                                        <option value="arrow">Arrow</option>
                                                                        <option value="move">Move</option>
                                                                        <option value="double">Double</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-span-2 space-y-1">
                                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{locale === 'ar' ? 'المسافة' : 'Offset'}</label>
                                                                    <input type="number" value={swiperConfig.navOffset} onChange={e => setSwiperConfig({ ...swiperConfig, navOffset: parseInt(e.target.value) })} className="w-full px-3 py-1.5 bg-white border border-slate-200 text-slate-900 rounded-lg text-xs font-medium outline-none focus:ring-1 focus:ring-primary/20" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="flex items-center gap-3 cursor-pointer group">
                                                            <div className={`w-12 h-7 rounded-full relative transition-all ${swiperConfig.showPagination ? 'bg-primary' : 'bg-slate-200'}`}>
                                                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${swiperConfig.showPagination ? 'right-1' : 'left-1'}`} />
                                                            </div>
                                                            <input type="checkbox" className="hidden" checked={swiperConfig.showPagination} onChange={e => setSwiperConfig({ ...swiperConfig, showPagination: e.target.checked })} />
                                                            <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{t('showPagination')}</span>
                                                        </label>
                                                        {swiperConfig.showPagination && (
                                                            <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-1">
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{locale === 'ar' ? 'الموقع' : 'Position'}</label>
                                                                    <select value={swiperConfig.paginationPosition} onChange={e => setSwiperConfig({ ...swiperConfig, paginationPosition: e.target.value })} className="w-full px-3 py-1.5 bg-white border border-slate-200 text-slate-900 rounded-lg text-xs font-medium outline-none focus:ring-1 focus:ring-primary/20">
                                                                        <option value="inside">{locale === 'ar' ? 'داخل' : 'Inside'}</option>
                                                                        <option value="outside">{locale === 'ar' ? 'خارج' : 'Outside'}</option>
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{locale === 'ar' ? 'المسافة' : 'Offset'}</label>
                                                                    <input type="number" value={swiperConfig.paginationOffset} onChange={e => setSwiperConfig({ ...swiperConfig, paginationOffset: parseInt(e.target.value) })} className="w-full px-3 py-1.5 bg-white border border-slate-200 text-slate-900 rounded-lg text-xs font-medium outline-none focus:ring-1 focus:ring-primary/20" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-6 pt-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-px bg-slate-100 flex-1"></div>
                                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('slidesPerView')}</h3>
                                                        <div className="h-px bg-slate-100 flex-1"></div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest text-center block">{t('desktop')}</label>
                                                            <input type="number" value={swiperConfig.slidesPerViewDesktop} onChange={e => setSwiperConfig({ ...swiperConfig, slidesPerViewDesktop: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-center" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest text-center block">{t('tablet')}</label>
                                                            <input type="number" value={swiperConfig.slidesPerViewTablet} onChange={e => setSwiperConfig({ ...swiperConfig, slidesPerViewTablet: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-center" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest text-center block">{t('mobile')}</label>
                                                            <input type="number" value={swiperConfig.slidesPerViewMobile} onChange={e => setSwiperConfig({ ...swiperConfig, slidesPerViewMobile: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-center" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 px-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                                <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center">
                                                    <FileSearch className="w-10 h-10 text-primary" />
                                                </div>
                                                <div className="max-w-md">
                                                    <h3 className="text-lg font-black text-slate-800 mb-2">{locale === 'ar' ? 'نمط صفحة التفاصيل نشط' : 'Detail Page Mode Active'}</h3>
                                                    <p className="text-sm text-slate-500 font-medium">
                                                        {locale === 'ar'
                                                            ? 'في هذا النمط، يتم عرض سجل واحد فقط. إعدادات السلايدر والتنقل معطلة لأنها غير منطقية عند عرض تفاصيل عنصر واحد.'
                                                            : 'In this mode, only a single record is rendered. Swiper and navigation settings are disabled as they are not applicable for a single item view.'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (activeTab === 'grid' && type === 'DYNAMIC_GRID') ? (
                                    <div className="max-w-3xl mx-auto py-10 space-y-8">
                                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200">
                                            <div className="flex items-center gap-3 mb-6">
                                                <LayoutTemplate className="w-5 h-5 text-indigo-300" />
                                                <h3 className="text-lg font-bold">{locale === 'ar' ? 'القوالب السريعة للشركات والجمعيات' : 'Quick Presets'}</h3>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {[
                                                    { id: 'grid3', name: '3 Columns', nameAr: '٣ أعمدة', config: { slidesPerViewDesktop: 3, slidesPerViewTablet: 2, slidesPerViewMobile: 1, itemsPerPage: 6, spaceBetween: 30 } },
                                                    { id: 'grid4', name: '4 Columns', nameAr: '٤ أعمدة', config: { slidesPerViewDesktop: 4, slidesPerViewTablet: 2, slidesPerViewMobile: 1, itemsPerPage: 8, spaceBetween: 20 } },
                                                    { id: 'list', name: 'List View', nameAr: 'عرض قائمة', config: { slidesPerViewDesktop: 1, slidesPerViewTablet: 1, slidesPerViewMobile: 1, itemsPerPage: 5, spaceBetween: 20 } },
                                                    { id: 'compact', name: 'Compact Grid', nameAr: 'شبكة مكثفة', config: { slidesPerViewDesktop: 6, slidesPerViewTablet: 3, slidesPerViewMobile: 2, itemsPerPage: 12, spaceBetween: 15 } }
                                                ].map(preset => (
                                                    <button
                                                        key={preset.id}
                                                        onClick={() => setSwiperConfig({ ...swiperConfig, ...preset.config })}
                                                        className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group cursor-pointer"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                            <PlusSquare className="w-5 h-5 text-indigo-300" />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-wider">{locale === 'ar' ? preset.nameAr : preset.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{locale === 'ar' ? 'عناصر الصفحة' : 'Items Per Page'}</label>
                                                <input type="number" value={swiperConfig.itemsPerPage} onChange={e => setSwiperConfig({ ...swiperConfig, itemsPerPage: parseInt(e.target.value) })} className="w-full px-5 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{t('spaceBetween')}</label>
                                                <input type="number" value={swiperConfig.spaceBetween} onChange={e => setSwiperConfig({ ...swiperConfig, spaceBetween: parseInt(e.target.value) })} className="w-full px-5 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{locale === 'ar' ? 'تبادل الألوان (Zebra)' : 'Alternating Colors'}</label>
                                                <div onClick={() => setSwiperConfig({ ...swiperConfig, useAlternatingColors: !swiperConfig.useAlternatingColors })}
                                                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${swiperConfig.useAlternatingColors ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <RefreshCw className={`w-4 h-4 ${swiperConfig.useAlternatingColors ? 'text-primary' : 'text-slate-400'}`} />
                                                        <span className={`text-xs font-bold ${swiperConfig.useAlternatingColors ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{locale === 'ar' ? 'تفعيل التبادل' : 'Enable Swapping'}</span>
                                                    </div>
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${swiperConfig.useAlternatingColors ? 'border-primary bg-primary' : 'border-slate-300'}`}>
                                                        {swiperConfig.useAlternatingColors && <Check className="w-2.5 h-2.5 text-white" />}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{locale === 'ar' ? 'تبادل التخطيط (يمين/يسار)' : 'Alternating Layout'}</label>
                                                <div onClick={() => setSwiperConfig({ ...swiperConfig, useAlternatingLayout: !swiperConfig.useAlternatingLayout })}
                                                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group ${swiperConfig.useAlternatingLayout ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <Move className={`w-4 h-4 ${swiperConfig.useAlternatingLayout ? 'text-primary' : 'text-slate-400'}`} />
                                                        <span className={`text-xs font-bold ${swiperConfig.useAlternatingLayout ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{locale === 'ar' ? 'تفعيل التبادل' : 'Enable Swapping'}</span>
                                                    </div>
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${swiperConfig.useAlternatingLayout ? 'border-primary bg-primary' : 'border-slate-300'}`}>
                                                        {swiperConfig.useAlternatingLayout && <Check className="w-2.5 h-2.5 text-white" />}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Help Note for Alternating Layout */}
                                            <div className="md:col-span-2 p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-in fade-in slide-in-from-top-2">
                                                <div className="flex items-start gap-3">
                                                    <Zap className="w-5 h-5 text-amber-600 mt-1 shrink-0" />
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-bold text-amber-900">
                                                            {locale === 'ar' ? 'ملاحظة لتفعيل تبادل التخطيط:' : 'Note for Alternating Layout:'}
                                                        </p>
                                                        <p className="text-[11px] text-amber-800 leading-relaxed">
                                                            {locale === 'ar'
                                                                ? 'لتفعيل ميزة تبديل التخطيط (يمين/يسار)، يجب أن يحتوي كود HTML للبطاقة على كلاسات flex القياسية مثل flex-row أو md:flex-row. سيقوم النظام بتحويلها تلقائياً إلى flex-row-reverse في البطاقات الزوجية.'
                                                                : 'To enable alternating layout (left/right), your card HTML must use standard flex classes like flex-row or md:flex-row. The system will automatically convert them to flex-row-reverse for even-indexed cards.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{locale === 'ar' ? 'محاذاة الترقيم' : 'Pagination Alignment'}</label>
                                                <div className="flex bg-white border border-slate-200 rounded-2xl p-1 gap-1">
                                                    {[
                                                        { id: 'start', icon: AlignLeft },
                                                        { id: 'center', icon: AlignCenter },
                                                        { id: 'end', icon: AlignRight }
                                                    ].map(align => (
                                                        <button
                                                            key={align.id}
                                                            onClick={() => setSwiperConfig({ ...swiperConfig, paginationAlign: align.id })}
                                                            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center transition-all ${swiperConfig.paginationAlign === align.id ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                                                        >
                                                            <align.icon className="w-4 h-4" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4 md:col-span-2 mt-4">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">{locale === 'ar' ? 'نمط الترقيم المرئي' : 'Visual Pagination Style'}</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {[
                                                        { id: 'numbers-rounded', label: locale === 'ar' ? 'أرقام مستديرة' : 'Rounded Numbers', img: 'rounded' },
                                                        { id: 'numbers-circle', label: locale === 'ar' ? 'أرقام دائرية' : 'Circular Numbers', img: 'circle' },
                                                        { id: 'numbers-square', label: locale === 'ar' ? 'أرقام مربعة' : 'Square Numbers', img: 'square' },
                                                        { id: 'numbers-outline', label: locale === 'ar' ? 'أرقام مفرغة' : 'Outline Numbers', img: 'outline' },
                                                        { id: 'load-more', label: locale === 'ar' ? 'زر تحميل المزيد' : 'Load More Button', img: 'load-more' },
                                                    ].map(style => (
                                                        <div
                                                            key={style.id}
                                                            onClick={() => setSwiperConfig({ ...swiperConfig, paginationStyle: style.id })}
                                                            className={`group relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${swiperConfig.paginationStyle === style.id ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                                        >
                                                            <div className="aspect-[4/2] bg-slate-50 flex items-center justify-center p-6 border-b border-inherit">
                                                                <img src={`/pagination/${style.img}.png`} alt={style.label} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-125" />
                                                            </div>
                                                            <div className={`p-3 text-center text-[10px] sm:text-xs font-black uppercase tracking-wider transition-colors ${swiperConfig.paginationStyle === style.id ? 'text-primary' : 'text-slate-400'}`}>
                                                                {style.label}
                                                            </div>
                                                            {swiperConfig.paginationStyle === style.id && (
                                                                <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-300">
                                                                    <Check className="w-3 h-3" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 pt-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-px bg-slate-100 flex-1"></div>
                                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{locale === 'ar' ? 'عدد الأعمدة' : 'Columns'}</h3>
                                                <div className="h-px bg-slate-100 flex-1"></div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest text-center block">{t('desktop')}</label>
                                                    <input type="number" value={swiperConfig.slidesPerViewDesktop} onChange={e => setSwiperConfig({ ...swiperConfig, slidesPerViewDesktop: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-center" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest text-center block">{t('tablet')}</label>
                                                    <input type="number" value={swiperConfig.slidesPerViewTablet} onChange={e => setSwiperConfig({ ...swiperConfig, slidesPerViewTablet: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-center" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest text-center block">{t('mobile')}</label>
                                                    <input type="number" value={swiperConfig.slidesPerViewMobile} onChange={e => setSwiperConfig({ ...swiperConfig, slidesPerViewMobile: parseInt(e.target.value) })} className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-center" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (activeTab === 'api' && (type === 'DYNAMIC' || type === 'DYNAMIC_GRID') && isExternalApi) ? (
                                    <div className="max-w-4xl mx-auto py-10 space-y-8">
                                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-700">{t('endpointUrl')}</label>
                                                <div className="flex gap-2">
                                                    <input type="text" value={apiEndpoint} onChange={e => setApiEndpoint(e.target.value)} placeholder="https://api.example.com/items" className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400" />
                                                    <button
                                                        onClick={async () => {
                                                            if (!apiEndpoint) return toast.error(commonT('error'));
                                                            setIsFetchingSample(true);
                                                            try {
                                                                const res = await fetch(apiEndpoint);
                                                                const data = await res.json();
                                                                const sample = Array.isArray(data) ? data[0] : (data.results ? data.results[0] : (data.items ? data.items[0] : data));
                                                                setSampleData(sample);
                                                                toast.success(commonT('saved'));
                                                            } catch (e) { toast.error(commonT('error')); }
                                                            finally { setIsFetchingSample(false); }
                                                        }}
                                                        disabled={isFetchingSample}
                                                        className="px-6 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                                                    >
                                                        {isFetchingSample ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} {t('fetchSample')}
                                                    </button>
                                                </div>
                                            </div>

                                            {sampleData && (
                                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t('mapping')}</h3>
                                                        <button onClick={() => setFieldMapping([...fieldMapping, { placeholder: '', apiField: '' }])} className="text-primary font-bold text-sm flex items-center gap-1 hover:underline cursor-pointer"><Plus className="w-4 h-4" /> {t('addField')}</button>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {fieldMapping.map((m, i) => (
                                                            <div key={i} className="flex gap-4 items-end bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-1">
                                                                <div className="flex-1 space-y-1">
                                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('placeholder')} (e.g. title)</label>
                                                                    <input type="text" value={m.placeholder} onChange={e => {
                                                                        const newMapping = [...fieldMapping];
                                                                        newMapping[i].placeholder = e.target.value;
                                                                        setFieldMapping(newMapping);
                                                                    }} className="w-full px-3 py-1.5 bg-white border border-slate-200 text-slate-900 rounded-lg text-sm outline-none transition-all placeholder:text-slate-400" />
                                                                </div>
                                                                <div className="flex-1 space-y-1">
                                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('apiField')}</label>
                                                                    <select value={m.apiField} onChange={e => {
                                                                        const newMapping = [...fieldMapping];
                                                                        newMapping[i].apiField = e.target.value;
                                                                        setFieldMapping(newMapping);
                                                                    }} className="w-full px-3 py-1.5 bg-white border border-slate-200 text-slate-900 rounded-lg text-sm outline-none transition-all">
                                                                        <option value="">{t('selectField')}</option>
                                                                        {Object.keys(sampleData).map(k => <option key={k} value={k}>{k}</option>)}
                                                                    </select>
                                                                </div>
                                                                <button onClick={() => setFieldMapping(fieldMapping.filter((_, idx) => idx !== i))} className="p-2 text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4 p-4 bg-slate-900 rounded-2xl overflow-hidden">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{t('sampleDataStructure')}</span>
                                                        </div>
                                                        <pre className="text-[11px] text-indigo-200 font-mono overflow-auto max-h-40">{JSON.stringify(sampleData, null, 2)}</pre>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (activeTab === 'api' && type === 'DYNAMIC' && !isExternalApi) ? (
                                    <div className="max-w-2xl mx-auto py-10">
                                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
                                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                                <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                                    <Layers className="w-4 h-4" /> {t('internalDynamic')}
                                                </h3>
                                                <p className="text-xs text-indigo-700 leading-relaxed">
                                                    {locale === 'ar'
                                                        ? 'للمحتوى الداخلي، يتم ربط المتغيرات تلقائياً. يمكنك استخدام الحقول التالية في تصميمك:'
                                                        : 'For internal content, variables are mapped automatically. You can use the following fields in your design:'}
                                                </p>
                                                <ul className="mt-3 space-y-1">
                                                    <li className="text-xs font-mono text-indigo-600 font-bold">{"{{title}}"}</li>
                                                    <li className="text-xs font-mono text-indigo-600 font-bold">{"{{description}}"}</li>
                                                    <li className="text-xs font-mono text-indigo-600 font-bold">{"{{image}}"}</li>
                                                    <li className="text-xs font-mono text-indigo-600 font-bold">{"{{images}}"}</li>
                                                    <li className="text-xs font-mono text-indigo-600 font-bold">{"{{publishDate}}"}</li>
                                                    <li className="text-xs font-mono text-indigo-600 font-bold">{"{{link}}"}</li>
                                                    <li className="text-xs font-mono text-indigo-600 font-bold">{"{{tag}}"}</li>
                                                    <li className="text-xs font-mono text-indigo-600 font-bold">{"{{linkText}}"}</li>
                                                    <li className="text-xs font-mono text-indigo-600 font-bold">{"{{icon}}"}</li>
                                                    <li className="text-xs font-mono text-indigo-600 font-bold">{"{{id}}"}</li>
                                                </ul>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t('mapping')}</h3>
                                                <p className="text-xs text-slate-500 italic">
                                                    {locale === 'ar'
                                                        ? 'لا حاجة لربط يدوي للمحتوى الداخلي.'
                                                        : 'No manual mapping needed for internal content.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 bg-white pb-6 sm:pb-6 shrink-0">
                            <button onClick={closeModal} className="order-2 sm:order-1 px-6 py-2 text-slate-500 font-bold text-sm sm:text-base cursor-pointer">{commonT('cancel')}</button>
                            <button onClick={handleSubmit} className="order-1 sm:order-2 px-10 py-2.5 bg-primary text-white font-black rounded-full shadow-xl hover:bg-primary/90 cursor-pointer transition-all text-sm sm:text-base">{commonT('saveChanges')}</button>
                        </div>
                    </div>
                </div>
            )}
            <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} title={commonT('delete')} message={commonT('confirmDelete')} />
        </div>
    );
}
