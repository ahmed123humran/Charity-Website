'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import { Save, ArrowLeft, Plus, Move, Trash2, Layout, Type, Image as ImageIcon, Copy, MousePointer2, X } from 'lucide-react';
import { getLocalizedName } from '@/app/utils/locale';
import toast from 'react-hot-toast';

interface Snippet {
    id: string;
    name: string;
    category: string;
    htmlContent: string;
    thumbnail?: string;
}

interface Page {
    id: string;
    title: any;
    url: string;
    content: string | null;
}

interface DroppedSnippet {
    id: string; // unique instance id
    snippetId: string;
    htmlContent: string;
    name: string;
}

export default function VisualEditor({ params }: { params: Promise<{ id: string }> }) {
    const t = useTranslations('Admin');
    const commonT = useTranslations('Common');
    const router = useRouter();
    const locale = useLocale();

    const [page, setPage] = useState<Page | null>(null);
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [droppedSnippets, setDroppedSnippets] = useState<DroppedSnippet[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [editorLocale, setEditorLocale] = useState('en');
    const [contentEn, setContentEn] = useState<DroppedSnippet[]>([]);
    const [contentAr, setContentAr] = useState<DroppedSnippet[]>([]);

    const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
    const [activeSnippetId, setActiveSnippetId] = useState<string | null>(null);

    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const init = async () => {
            const { id } = await params;
            await Promise.all([fetchPage(id), fetchSnippets()]);
        };
        init();
    }, [params]);

    const fetchPage = async (id: string) => {
        try {
            const res = await fetch(`/api/pages/${id}`);
            if (res.ok) {
                const data = await res.json();
                setPage(data);
                if (data.content) {
                    try {
                        let parsed = data.content;
                        if (typeof parsed === 'string') parsed = JSON.parse(parsed);

                        if (typeof parsed === 'object' && !Array.isArray(parsed)) {
                            setContentEn(parsed.en || []);
                            setContentAr(parsed.ar || []);
                            setDroppedSnippets(editorLocale === 'en' ? (parsed.en || []) : (parsed.ar || []));
                        }
                    } catch (e) { console.log('Content parse error', e); }
                }
            }
        } catch (error) { console.error('Failed to fetch page', error); }
    };

    const fetchSnippets = async () => {
        try {
            const res = await fetch('/api/snippets');
            if (res.ok) {
                const data = await res.json();
                setSnippets(data);
            }
        } catch (error) { console.error('Failed to fetch snippets', error); }
        finally { setLoading(false); }
    };

    const switchLocale = (newLocale: string) => {
        if (newLocale === editorLocale) return;
        if (editorLocale === 'en') setContentEn(droppedSnippets);
        else setContentAr(droppedSnippets);
        setDroppedSnippets(newLocale === 'en' ? contentEn : contentAr);
        setEditorLocale(newLocale);
    };

    const handleDragStart = (e: React.DragEvent, snippet: Snippet) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(snippet));
    };

    const handleDragOver = (e: React.DragEvent, index?: number) => {
        e.preventDefault();
        setDragOverIndex(index !== undefined ? index : droppedSnippets.length);
    };

    const handleDrop = (e: React.DragEvent) => {
        const snippetData = e.dataTransfer.getData('text/plain');
        if (!snippetData) return;
        try {
            const snippet: Snippet = JSON.parse(snippetData);
            const newSnippet: DroppedSnippet = {
                id: crypto.randomUUID(),
                snippetId: snippet.id,
                htmlContent: snippet.htmlContent,
                name: snippet.name
            };
            const dropIndex = dragOverIndex !== null ? dragOverIndex : droppedSnippets.length;
            setDroppedSnippets(prev => {
                const newList = [...prev];
                newList.splice(dropIndex, 0, newSnippet);
                return newList;
            });
        } catch (err) { console.error('Drop failed', err); }
    };

    const commitChanges = (id: string) => {
        const wrapper = document.getElementById(`snippet-content-${id}`);
        if (wrapper) {
            const clone = wrapper.cloneNode(true) as HTMLElement;
            clone.querySelectorAll('*').forEach(el => {
                (el as HTMLElement).style.outline = '';
                (el as HTMLElement).style.outlineOffset = '';
                el.removeAttribute('contenteditable');
            });
            setDroppedSnippets(prev => prev.map(s => s.id === id ? { ...s, htmlContent: clone.innerHTML } : s));
        }
    };

    const handleContentClick = (e: React.MouseEvent, snippetId: string) => {
        let target = e.target as HTMLElement;
        const wrapper = document.getElementById(`snippet-content-${snippetId}`);
        const smartTarget = target.closest('p, h1, h2, h3, h4, h5, h6, span, a, li, button, img');
        if (smartTarget && wrapper?.contains(smartTarget)) target = smartTarget as HTMLElement;

        e.stopPropagation();
        if (activeElement && activeElement !== target && activeSnippetId) {
            activeElement.style.outline = '';
            commitChanges(activeSnippetId);
        }

        setActiveElement(target);
        setActiveSnippetId(snippetId);

        if (target.tagName !== 'IMG') {
            target.contentEditable = 'true';
            target.style.outline = '2px solid #3b82f6';
            target.focus();
            const handleBlur = () => {
                target.contentEditable = 'false';
                target.style.outline = '';
                commitChanges(snippetId);
                target.removeEventListener('blur', handleBlur);
            };
            target.addEventListener('blur', handleBlur);
        } else {
            target.style.outline = '2px solid #3b82f6';
        }
    };

    const handleSave = async () => {
        if (activeSnippetId) commitChanges(activeSnippetId);
        setSaving(true);
        try {
            const contentToSave = {
                en: editorLocale === 'en' ? droppedSnippets : contentEn,
                ar: editorLocale === 'ar' ? droppedSnippets : contentAr
            };
            await fetch(`/api/pages/${page?.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: JSON.stringify(contentToSave) })
            });
            toast.success(commonT('saved'));
        } catch (error) { toast.error('Save failed'); }
        finally { setSaving(false); }
    };

    const moveSnippet = (index: number, direction: 'up' | 'down') => {
        const newSnippets = [...droppedSnippets];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newSnippets.length) {
            [newSnippets[index], newSnippets[targetIndex]] = [newSnippets[targetIndex], newSnippets[index]];
            setDroppedSnippets(newSnippets);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Editor...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] -m-8">
            {/* Minimal Header */}
            <div className="h-14 bg-white border-b border-slate-200 flex justify-between items-center px-6 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-50 rounded-lg"><ArrowLeft className="w-4 h-4 text-slate-600" /></button>
                    <span className="font-bold text-slate-800">{getLocalizedName(page?.title, locale)}</span>
                    <div className="flex gap-1 ml-4 bg-slate-100 p-1 rounded-lg">
                        <button onClick={() => switchLocale('en')} className={`px-3 py-1 text-[10px] font-black uppercase rounded ${editorLocale === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>EN</button>
                        <button onClick={() => switchLocale('ar')} className={`px-3 py-1 text-[10px] font-black uppercase rounded ${editorLocale === 'ar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>AR</button>
                    </div>
                </div>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-1.5 rounded-full text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md">
                    <Save className="w-4 h-4" /> {saving ? '...' : commonT('saveChanges')}
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Snippets */}
                <div className="w-64 bg-slate-50 border-r border-slate-100 overflow-y-auto p-4 space-y-3">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Layout className="w-3 h-3" /> {t('snippetsLibrary')}
                    </div>
                    {snippets.map(s => (
                        <div key={s.id} draggable onDragStart={(e) => handleDragStart(e, s)} className="p-4 bg-white border border-slate-200 rounded-2xl cursor-move hover:border-indigo-400 hover:shadow-xl transition-all group">
                            <div className="text-xs font-bold text-slate-800">{s.name}</div>
                            <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">{s.category}</div>
                        </div>
                    ))}
                </div>

                {/* Main Canvas Area */}
                <div
                    ref={canvasRef}
                    onDragOver={(e) => handleDragOver(e)}
                    onDrop={handleDrop}
                    onClick={() => { setActiveElement(null); setActiveSnippetId(null); }}
                    className="flex-1 bg-slate-200 p-8 overflow-y-auto scroll-smooth relative"
                >
                    {/* Floating Component Toolbar */}
                    {activeElement && (
                        <div
                            className="fixed z-50 flex flex-col gap-2"
                            style={{
                                top: `${activeElement.getBoundingClientRect().top - 45}px`,
                                left: `${activeElement.getBoundingClientRect().left + activeElement.getBoundingClientRect().width / 2}px`,
                                transform: 'translateX(-50%)'
                            }}
                        >
                            <div className="bg-slate-900 text-white p-1 rounded-full shadow-2xl flex items-center gap-1">
                                <button
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        const newEl = activeElement.cloneNode(true) as HTMLElement;
                                        newEl.style.outline = '';
                                        activeElement.after(newEl);
                                        if (activeSnippetId) commitChanges(activeSnippetId);
                                    }}
                                    className="p-1.5 hover:bg-slate-800 rounded-full"
                                    title="Duplicate"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        if (confirm('Delete?')) {
                                            activeElement.remove();
                                            setActiveElement(null);
                                            if (activeSnippetId) commitChanges(activeSnippetId);
                                        }
                                    }}
                                    className="p-1.5 hover:bg-red-900 rounded-full"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <div className="w-px h-3 bg-slate-700 mx-0.5" />
                                {activeElement.tagName === 'IMG' && (
                                    <button
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            const src = prompt('URL:', (activeElement as HTMLImageElement).src);
                                            if (src) {
                                                (activeElement as HTMLImageElement).src = src;
                                                commitChanges(activeSnippetId!);
                                            }
                                        }}
                                        className="p-1.5 hover:bg-slate-800 rounded-full"
                                    >
                                        <ImageIcon className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="max-w-4xl mx-auto space-y-6 pb-40">
                        {droppedSnippets.map((item, index) => (
                            <div
                                key={item.id}
                                className={`group relative bg-white rounded-lg transition-all border-2 ${activeSnippetId === item.id ? 'border-primary ring-8 ring-primary/5' : 'border-transparent shadow-sm'}`}
                            >
                                {/* Snippet Toolbar */}
                                <div className="absolute -top-4 right-4 hidden group-hover:flex items-center gap-1 bg-slate-900 text-white p-1 rounded-lg z-30 shadow-xl">
                                    <button onClick={() => moveSnippet(index, 'up')} className="p-1 hover:bg-slate-800 rounded"><Move className="w-3 h-3 rotate-180" /></button>
                                    <button onClick={() => moveSnippet(index, 'down')} className="p-1 hover:bg-slate-800 rounded"><Move className="w-3 h-3" /></button>
                                    <button onClick={() => {
                                        const newList = [...droppedSnippets];
                                        newList.splice(index + 1, 0, { ...item, id: crypto.randomUUID() });
                                        setDroppedSnippets(newList);
                                    }} className="p-1 hover:bg-slate-800 rounded"><Copy className="w-3 h-3" /></button>
                                    <button onClick={() => {
                                        setDroppedSnippets(prev => prev.filter((_, i) => i !== index));
                                        if (activeSnippetId === item.id) { setActiveElement(null); setActiveSnippetId(null); }
                                    }} className="p-1 hover:bg-red-900 rounded"><Trash2 className="w-3 h-3" /></button>
                                </div>

                                <div
                                    id={`snippet-content-${item.id}`}
                                    dangerouslySetInnerHTML={{ __html: item.htmlContent }}
                                    onClick={(e) => handleContentClick(e, item.id)}
                                    className="min-h-[100px]"
                                />
                            </div>
                        ))}

                        {/* Drop Zone */}
                        <div
                            onDragOver={(e) => handleDragOver(e, droppedSnippets.length)}
                            className={`h-32 border-2 border-dashed border-slate-300 rounded-3xl flex items-center justify-center transition-all ${dragOverIndex === droppedSnippets.length ? 'bg-indigo-50 border-indigo-400' : 'bg-white/50'}`}
                        >
                            <Plus className="w-6 h-6 text-slate-300" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
