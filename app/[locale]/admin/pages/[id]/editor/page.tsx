'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import { Save, ArrowLeft, Plus, Move, Trash2, Layout } from 'lucide-react';
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
    const [draggedSnippet, setDraggedSnippet] = useState<Snippet | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [editorLocale, setEditorLocale] = useState('en');
    const [contentEn, setContentEn] = useState<DroppedSnippet[]>([]);
    const [contentAr, setContentAr] = useState<DroppedSnippet[]>([]);

    const switchLocale = (newLocale: string) => {
        if (newLocale === editorLocale) return;
        // Save current snippets to buffer
        if (editorLocale === 'en') setContentEn(droppedSnippets);
        else setContentAr(droppedSnippets);

        // Load new snippets from buffer
        setDroppedSnippets(newLocale === 'en' ? contentEn : contentAr);
        setEditorLocale(newLocale);
    };

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
                        // Try parsing as JSON
                        let parsed = data.content;
                        if (typeof parsed === 'string') {
                            parsed = JSON.parse(parsed);
                        }

                        if (Array.isArray(parsed)) {
                            // Legacy: single array, assign to both or current?
                            // Assign to EN by default if array
                            setContentEn(parsed);
                            if (locale === 'en') setDroppedSnippets(parsed);
                        } else if (typeof parsed === 'object') {
                            // Localized format { en: [], ar: [] }
                            setContentEn(parsed.en || []);
                            setContentAr(parsed.ar || []);

                            // Set initial snippets based on editorLocale (which defaults to 'en' or we can sync with locale)
                            if (editorLocale === 'en') setDroppedSnippets(parsed.en || []);
                            else setDroppedSnippets(parsed.ar || []);
                        }
                    } catch (e) {
                        console.log('Content parse error', e);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch page', error);
        }
    };

    const fetchSnippets = async () => {
        try {
            const res = await fetch('/api/snippets');
            if (res.ok) {
                const data = await res.json();
                setSnippets(data);
            }
        } catch (error) {
            console.error('Failed to fetch snippets', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (e: React.DragEvent, snippet: Snippet) => {
        setDraggedSnippet(snippet);
        e.dataTransfer.setData('text/plain', JSON.stringify(snippet));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDragOver = (e: React.DragEvent, index?: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        if (typeof index === 'number') {
            setDragOverIndex(index);
        } else {
            setDragOverIndex(droppedSnippets.length);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
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

            const targetIndex = dragOverIndex !== null ? dragOverIndex : droppedSnippets.length;
            const newSnippets = [...droppedSnippets];
            newSnippets.splice(targetIndex, 0, newSnippet);

            setDroppedSnippets(newSnippets);
            setDragOverIndex(null);
        } catch (err) {
            console.error('Drop failed', err);
        }
    };

    // Text Editing Handlers
    const handleContentClick = (e: React.MouseEvent, snippetId: string) => {
        const target = e.target as HTMLElement;
        // Allow editing of common text elements
        if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'DIV', 'A', 'LI', 'BUTTON'].includes(target.tagName)) {
            // Prevent drag when trying to edit
            e.stopPropagation();
            e.preventDefault();

            // Toggle editing
            target.contentEditable = 'true';
            target.focus();

            // Add visual cue
            target.style.outline = '2px dashed #4f46e5';
            target.style.cursor = 'text';

            // Handle blur to save changes
            const handleBlur = () => {
                target.contentEditable = 'false';
                target.style.outline = '';
                target.style.cursor = '';

                // Find the parent snippet container to get the full HTML
                // We need to update the entire HTML content of this snippet
                updateSnippetContent(snippetId, target);

                target.removeEventListener('blur', handleBlur);
            };

            target.addEventListener('blur', handleBlur);
        }
    };

    const updateSnippetContent = (id: string, editedElement: HTMLElement) => {
        setDroppedSnippets(prev => prev.map(s => {
            if (s.id === id) {
                // To get the full updated HTML, we need to look at the wrapper div in the DOM
                // But since we have the edited element, we can't easily get the full snippet HTML just from that if it's nested deep.
                // Better approach: When rendering, we wrap the content in a div with an ID.
                // Then we can find that ID and get its innerHTML.
                const wrapper = document.getElementById(`snippet-content-${id}`);
                if (wrapper) {
                    return { ...s, htmlContent: wrapper.innerHTML };
                }
            }
            return s;
        }));
    };

    const handleSave = async () => {
        if (!page) return;
        setSaving(true);
        try {
            // Prepare localized content object
            const contentToSave = {
                en: editorLocale === 'en' ? droppedSnippets : contentEn,
                ar: editorLocale === 'ar' ? droppedSnippets : contentAr
            };

            const contentJson = JSON.stringify(contentToSave);
            const res = await fetch(`/api/pages/${page.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: contentJson })
            });

            if (res.ok) {
                toast.success(commonT('saved'));
            } else {
                toast.error('Failed to save');
            }
        } catch (error) {
            console.error('Failed to save', error);
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const removeSnippet = (id: string) => {
        setDroppedSnippets(droppedSnippets.filter(s => s.id !== id));
    };

    const moveSnippet = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === droppedSnippets.length - 1) return;

        const newSnippets = [...droppedSnippets];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        [newSnippets[index], newSnippets[targetIndex]] = [newSnippets[targetIndex], newSnippets[index]];
        setDroppedSnippets(newSnippets);
    };

    if (loading) return <div className="p-8 text-center">Loading editor...</div>;

    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] gap-6 -m-8 p-8 overflow-hidden">
            {/* Sidebar with Snippets */}
            <div className="w-80 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-shrink-0">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="font-bold text-slate-900 flex items-center gap-2">
                        <Layout className="w-4 h-4 text-indigo-600" />
                        {t('snippetsLibrary')}
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {snippets.map(snippet => (
                        <div
                            key={snippet.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, snippet)}
                            className="p-4 bg-white border border-slate-200 rounded-xl cursor-move hover:border-indigo-500 hover:shadow-md transition-all group"
                        >
                            <div className="font-medium text-slate-700 mb-2">{snippet.name}</div>
                            <div className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded inline-block">
                                {snippet.category}
                            </div>
                            {/* Simple visual representation */}
                            <div className="mt-3 h-16 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-slate-300">
                                <span className="text-xs">{t('preview')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Canvas */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative">
                {/* Editor Header */}
                <div className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 flex-shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <h1 className="font-bold text-slate-900 truncate max-w-md">{getLocalizedName(page?.title, locale) || t('untitledPage')}</h1>

                        {/* Editor Language Switcher */}
                        <div className="flex items-center bg-slate-100 rounded-lg p-1 ml-4 rtl:mr-4 rtl:ml-0">
                            <button
                                onClick={() => switchLocale('en')}
                                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${editorLocale === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => switchLocale('ar')}
                                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${editorLocale === 'ar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                العربية
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.open(`/${locale}/${page?.url || ''}`, '_blank')}
                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            {commonT('preview')}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? t('saving') : commonT('saveChanges')}
                        </button>
                    </div>
                </div>

                {/* Droppable Area */}
                <div
                    ref={canvasRef}
                    onDragOver={(e) => handleDragOver(e)}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleDrop(e);
                    }}
                    className="flex-1 overflow-y-auto p-8 relative scroll-smooth"
                >
                    {droppedSnippets.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50">
                            <Move className="w-12 h-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">{t('dragDropTitle')}</p>
                            <p className="text-sm">{t('dragDropDesc')}</p>
                        </div>
                    ) : (
                        <div className="space-y-4 pb-20 max-w-5xl mx-auto">
                            {droppedSnippets.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="group relative bg-white shadow-xs hover:shadow-lg transition-shadow border border-transparent hover:border-indigo-500 rounded-sm"
                                    onDragOver={(e) => {
                                        e.stopPropagation();
                                        handleDragOver(e, index);
                                    }}
                                >
                                    {/* Snippet Toolbar (visible on hover) */}
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm border border-slate-200 p-1 rounded-lg z-20">
                                        <button
                                            onClick={() => moveSnippet(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded disabled:opacity-30"
                                            title={t('moveUp')}
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => moveSnippet(index, 'down')}
                                            disabled={index === droppedSnippets.length - 1}
                                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded disabled:opacity-30"
                                            title={t('moveDown')}
                                        >
                                            ↓
                                        </button>
                                        <div className="w-px bg-slate-200 mx-1"></div>
                                        <button
                                            onClick={() => removeSnippet(item.id)}
                                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                                            title={t('remove')}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Drop Indicator Logic */}
                                    {dragOverIndex === index && (
                                        <div className="absolute -top-2 left-0 right-0 h-1 bg-indigo-500 z-30 pointer-events-none"></div>
                                    )}

                                    {/* Render HTML Content */}
                                    {/* We wrap it in a div to protect styles and provide a handle */}
                                    <div
                                        id={`snippet-content-${item.id}`}
                                        dangerouslySetInnerHTML={{ __html: item.htmlContent }}
                                        onClick={(e) => handleContentClick(e, item.id)}
                                        className="pointer-events-auto"
                                    />

                                    {/* Overlay removed to allow interaction */}
                                </div>
                            ))}

                            {/* Global Drop Zone at the bottom */}
                            <div
                                className={`h-32 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center transition-colors ${dragOverIndex === droppedSnippets.length ? 'bg-indigo-50 border-indigo-400' : 'bg-slate-50/50'}`}
                                onDragOver={(e) => {
                                    e.stopPropagation();
                                    handleDragOver(e, droppedSnippets.length);
                                }}
                            >
                                <span className="text-slate-400 font-medium">{t('dropToAppend')}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
