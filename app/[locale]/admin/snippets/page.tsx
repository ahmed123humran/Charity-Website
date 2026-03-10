'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, PlusSquare, Edit2, Trash2, Tag, Layers, Code, LayoutTemplate, ImageIcon, Copy, MousePointer2, Type, Move } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/app/store/hooks';
import SnippetsTour from '@/app/components/SnippetsTour';
import { sanitizeHtml } from '@/app/utils/sanitize';

interface Snippet {
    id: string;
    name: string;
    nameAr: string | null;
    category: string;
    htmlContent: string;
    thumbnail: string | null;
}

export default function SnippetsManagement() {
    const t = useTranslations('Admin');
    const commonT = useTranslations('Common');
    const locale = useLocale();
    const { role: userRole } = useAppSelector((state) => state.user);
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
    const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
    const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => { fetchSnippets(); }, []);

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
            const clone = previewRef.current.cloneNode(true) as HTMLElement;
            clone.querySelectorAll('*').forEach(el => {
                (el as HTMLElement).style.outline = '';
                (el as HTMLElement).style.outlineOffset = '';
                el.removeAttribute('contenteditable');
            });
            finalContent = clone.innerHTML;
        }

        try {
            const apiUrl = isEditing ? `/api/snippets/${currentId}` : '/api/snippets';
            const method = isEditing ? 'PUT' : 'POST';
            const res = await fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, nameAr, category, htmlContent: finalContent }),
            });
            if (res.ok) {
                closeModal();
                fetchSnippets();
                toast.success(commonT('saved'));
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
        setCurrentId(snippet.id);
        setIsEditing(true);
        setViewMode('visual');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setName('');
        setNameAr('');
        setCategory('Intro');
        setHtmlContent('');
        setCurrentId(null);
        setActiveElement(null);
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
                if (previewRef.current) setHtmlContent(previewRef.current.innerHTML);
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
                                    <div className="scale-50 origin-center opacity-40 pointer-events-none w-full h-full overflow-hidden" dangerouslySetInnerHTML={{ __html: sanitizeHtml(s.htmlContent) }} />
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

                        <div className="flex-1 overflow-hidden flex flex-col xl:flex-row">
                            <div className="w-full xl:w-72 bg-slate-50 border-b xl:border-b-0 xl:border-r border-slate-100 p-4 sm:p-6 overflow-y-auto shrink-0 z-10 transition-all">
                                <div className="flex flex-col md:flex-row xl:flex-col gap-4">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{t('generalDetails')}</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-3">
                                            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={`${t('snippetName')} (EN)`} className="w-full px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300 text-gray-400 outline-hidden" />
                                            <input type="text" value={nameAr} onChange={e => setNameAr(e.target.value)} placeholder={`${t('snippetName')} (AR)`} className="w-full px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-end placeholder:text-slate-300 text-gray-400 outline-hidden" dir="rtl" />
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-48 xl:w-full shrink-0">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{t('category')}</label>
                                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-400 outline-hidden">
                                            {['Intro', 'Content', 'Features', 'Contact', 'Footer', 'Header', 'CTA', 'Stats'].map(c => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="text-[10px] text-slate-400 p-4 border-2 border-dashed border-slate-200 rounded-2xl leading-relaxed italic mt-6 hidden sm:block">
                                    {t('quickTip')}
                                </div>
                            </div>

                            <div className="flex-1 bg-slate-100 p-4 sm:p-8 overflow-auto relative">
                                {viewMode === 'code' ? (
                                    <textarea value={htmlContent} onChange={e => setHtmlContent(e.target.value)} className="w-full h-full font-mono text-[13px] sm:text-sm p-4 sm:p-8 bg-slate-900 text-indigo-100 rounded-2xl sm:rounded-3xl outline-none min-h-[300px] text-gray-400 outline-hidden" />
                                ) : (
                                    <div className="max-w-4xl mx-auto min-h-full py-10 sm:py-20 relative">
                                        {activeElement && previewRef.current?.contains(activeElement) && (
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
                                        <div ref={previewRef} onClick={handlePreviewClick} dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }} className="bg-white shadow-2xl min-h-[400px]" />
                                    </div>
                                )}
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
const X = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
