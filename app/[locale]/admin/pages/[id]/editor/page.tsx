'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import {
    Save, ArrowLeft, Plus, Move, Trash2, Layout, Type, LinkIcon, 
    Image as ImageIcon, Copy, MousePointer2, X, FilePlay, 
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette,
    Type as TypeIcon, Minus, Plus as PlusIcon, PaintBucket, Settings,
    Eye, EyeOff, Monitor, Laptop, Smartphone, SquareRoundCorner, VectorSquare
} from 'lucide-react';
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

// Memoized Snippet Component to prevent unnecessary re-renders that kill focus
const StableSnippet = memo(({
    item,
    isActive,
    previewMode,
    onContentClick,
    isBeingEdited
}: {
    item: DroppedSnippet,
    isActive: boolean,
    previewMode: boolean,
    onContentClick: (e: React.MouseEvent, id: string) => void,
    isBeingEdited: boolean
}) => {
    return (
        <div
            id={`snippet-content-${item.id}`}
            dangerouslySetInnerHTML={{ __html: item.htmlContent }}
            onClick={(e) => onContentClick(e, item.id)}
            className={`transition-all duration-300 min-h-[50px] ${!previewMode ? 'hover:outline-2 hover:outline-dashed hover:outline-indigo-300 cursor-text' : ''} ${!previewMode && isActive ? 'outline-2 outline outline-indigo-500 shadow-xl z-10' : ''}`}
        />
    );
}, (prev, next) => {
    // CRITICAL: If the snippet is actively being edited, we NEVER re-render it from state
    // This allows the user to type freely without React overwriting the DOM nodes
    if (next.isBeingEdited) return true;
    return prev.item.htmlContent === next.item.htmlContent &&
        prev.isActive === next.isActive &&
        prev.previewMode === next.previewMode;
});

export default function VisualEditor({ params }: { params: Promise<{ id: string }> }) {
    const t = useTranslations('Admin');
    const editorT = useTranslations('Editor');
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
    const [previewMode, setPreviewMode] = useState(false);

    // States for persistent content
    const [contentEn, setContentEn] = useState<DroppedSnippet[]>([]);
    const [contentAr, setContentAr] = useState<DroppedSnippet[]>([]);

    const [activeSnippetId, setActiveSnippetId] = useState<string | null>(null);
    const activeElementRef = useRef<HTMLElement | null>(null);
    const [activeTagName, setActiveTagName] = useState<string | null>(null);

    const [activeStyles, setActiveStyles] = useState({
        fontSize: '16px',
        color: '#000000',
        backgroundColor: 'transparent',
        textAlign: 'left',
        borderRadius: '0px'
    });

    const canvasRef = useRef<HTMLDivElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const svgInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const videoImgInputRef = useRef<HTMLInputElement>(null);

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
                            const en = parsed.en || [];
                            const ar = parsed.ar || [];
                            setContentEn(en);
                            setContentAr(ar);
                            setDroppedSnippets(editorLocale === 'en' ? en : ar);
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
        if (activeSnippetId) commitChanges(activeSnippetId);

        if (editorLocale === 'en') {
            setContentEn(droppedSnippets);
            setDroppedSnippets(contentAr);
        } else {
            setContentAr(droppedSnippets);
            setDroppedSnippets(contentEn);
        }

        setEditorLocale(newLocale);
        setActiveSnippetId(null);
        activeElementRef.current = null;
        setActiveTagName(null);
    };

    const handleDragStart = (e: React.DragEvent, snippet: Snippet) => {
        if (previewMode) return;
        e.dataTransfer.setData('text/plain', JSON.stringify(snippet));
    };

    const handleDragOver = (e: React.DragEvent, index?: number) => {
        if (previewMode) return;
        e.preventDefault();
        setDragOverIndex(index !== undefined ? index : droppedSnippets.length);
    };

    const handleDrop = (e: React.DragEvent) => {
        if (previewMode) return;
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
        setDragOverIndex(null);
    };

    const commitChanges = (id: string) => {
        const wrapper = document.getElementById(`snippet-content-${id}`);
        if (wrapper) {
            const clone = wrapper.cloneNode(true) as HTMLElement;
            clone.querySelectorAll('*').forEach(el => {
                const htmlEl = el as HTMLElement;
                htmlEl.style.outline = '';
                htmlEl.style.outlineOffset = '';
                el.removeAttribute('contenteditable');
            });
            setDroppedSnippets(prev => prev.map(s => s.id === id ? { ...s, htmlContent: clone.innerHTML } : s));
        }
    };

    const updateActiveStyles = (el: HTMLElement) => {
        const computed = window.getComputedStyle(el);
        let styles: typeof activeStyles = {
            fontSize: '16px',
            color: '#000000',
            backgroundColor: 'transparent',
            textAlign: 'left',
            borderRadius: '0px'
        };

        if (el.tagName === 'SVG') {
            // For SVG, fontSize can be interpreted as width/height
            styles.color = (el.getAttribute('fill') || computed.color) as string;
            styles.fontSize = el.getAttribute('width') || computed.width;
            styles.backgroundColor = el.getAttribute('background') || 'transparent';
            styles.textAlign = 'center';
            styles.borderRadius = computed.borderRadius || '0px';
        } else if (activeTagName === 'img') {
            styles.borderRadius = computed.borderRadius || '0px';
        } else {
            styles = {
                fontSize: computed.fontSize,
                color: computed.color,
                backgroundColor: computed.backgroundColor,
                textAlign: computed.textAlign,
                borderRadius: computed.borderRadius
            };
        }

        setActiveStyles(styles);
        setActiveTagName(el.tagName.toLowerCase());
    };

    const handleContentClick = (e: React.MouseEvent, snippetId: string) => {
        if (previewMode) return;
        let target = e.target as HTMLElement;
        const wrapper = document.getElementById(`snippet-content-${snippetId}`);

        // Target editable elements
        const smartTarget = target.closest('p, h1, h2, h3, h4, h5, h6, span, a, li, button, img, section, div:not([id^="snippet-content-"]), svg, video');
        if (smartTarget && wrapper?.contains(smartTarget)) target = smartTarget as HTMLElement;

        e.stopPropagation();

        // If clicking a new element, commit old one
        if (activeElementRef.current && activeElementRef.current !== target && activeSnippetId) {
            activeElementRef.current.style.outline = '';
            activeElementRef.current.style.outlineOffset = '';
            commitChanges(activeSnippetId);
        }

        activeElementRef.current = target;
        setActiveSnippetId(snippetId);
        updateActiveStyles(target);

        if (target.tagName !== 'IMG' && !target.classList.contains('no-edit')) {
            if (target.tagName === 'SVG') {
                // Mark SVG as editable
                target.style.outline = '2px solid #3b82f6';
                target.style.outlineOffset = '2px';
            } else {
                target.contentEditable = 'true';
                target.style.outline = '2px solid #3b82f6';
                target.style.outlineOffset = '2px';

                // We only commit on blur or when clicking away to stay efficient
                const onBlur = () => {
                    target.contentEditable = 'false';
                    target.style.outline = '';
                    commitChanges(snippetId);
                    target.removeEventListener('blur', onBlur);
                };
                target.addEventListener('blur', onBlur);
            }
        } else {
            target.style.outline = '2px solid #3b82f6';
            target.style.outlineOffset = '2px';
        }
    };

    type StyleCommand =
    | 'fontSize'
    | 'foreColor'
    | 'backgroundColor'
    | 'textAlign'
    | 'borderRadius'
    | 'aspectRatio'
    | 'objectFit';

    type ElementKind = 'text' | 'svg' | 'img' | 'video';

    const getElementKind = (el: HTMLElement): ElementKind => {
        if (el.tagName === 'svg') return 'svg';
        if (el.tagName === 'IMG') return 'img';
        if (el.tagName === 'VIDEO') return 'video';
        return 'text';
    };


    type StyleHandler = (el: HTMLElement, value?: string) => void;

    const STYLE_HANDLERS: Record<ElementKind, Partial<Record<StyleCommand, StyleHandler>>> = {
        text: {
            fontSize: (el, v) => el.style.fontSize = v || '',
            foreColor: (el, v) => el.style.color = v || '',
            backgroundColor: (el, v) => el.style.backgroundColor = v || '',
            textAlign: (el, v) => el.style.textAlign = v || '',
            borderRadius: (el, v) => el.style.borderRadius = v || '',
        },

        svg: {
            fontSize: (el, v) => {
            el.setAttribute('width', v || '24px');
            el.setAttribute('height', v || '24px');
            },
            foreColor: (el, v) => el.setAttribute('fill', v || '#000'),
            backgroundColor: (el, v) => el.style.backgroundColor = v || 'transparent',
            borderRadius: (el, v) => el.style.borderRadius = v || '0px',
        },

        img: {
            borderRadius: (el, v) => el.style.borderRadius = v || '',
            objectFit: (el, v) => el.style.objectFit = v || 'cover',
        },

        video: {
            borderRadius: (el, v) => el.style.borderRadius = v || '',
            objectFit: (el, v) => el.style.objectFit = v || 'cover',
            aspectRatio: (el, v) => el.style.aspectRatio = v || '',
        },
    };


    const applyStyle = (command: StyleCommand, value?: string) => {
        const el = activeElementRef.current;
        if (!el) return;

        const kind = getElementKind(el);
        const handler = STYLE_HANDLERS[kind]?.[command];

        if (!handler) return;

        handler(el, value);

        updateActiveStyles(el);

        if (activeSnippetId) {
            const instantCommitCommands: StyleCommand[] = [
            'foreColor',
            'backgroundColor',
            'fontSize',
            'textAlign',
            'borderRadius',
            ];

            if (instantCommitCommands.includes(command)) {
            commitChanges(activeSnippetId);
            }
        }
    };

    const applyStyleDebounced = (() => {
        let t: NodeJS.Timeout;
        return (command: StyleCommand, value?: string) => {
            clearTimeout(t);
            t = setTimeout(() => {
            applyStyle(command, value);
            }, 60);
        };
    })();

    const handleSave = async () => {
        if (activeSnippetId) commitChanges(activeSnippetId);
        setSaving(true);
        try {
            const latestEn = editorLocale === 'en' ? droppedSnippets : contentEn;
            const latestAr = editorLocale === 'ar' ? droppedSnippets : contentAr;
            const contentToSave = { en: latestEn, ar: latestAr };
            await fetch(`/api/pages/${page?.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: JSON.stringify(contentToSave) })
            });
            toast.success(commonT('saved'), { id: 'save-progress' });
        } catch (error) { toast.error(commonT('error')); }
        finally { setSaving(false); }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeElementRef.current || activeElementRef.current.tagName !== 'IMG') return;

        const img = activeElementRef.current as HTMLImageElement;

        const reader = new FileReader();
        reader.onload = () => {
            img.src = reader.result as string;

            if (activeSnippetId) {
                commitChanges(activeSnippetId);
            }
        };

        reader.readAsDataURL(file);
    };

    const handleSvgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.includes('svg')) {
            toast.error(commonT('svgerror'))
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            let svgText = reader.result as string;

            // 🔐 تنظيف مبدئي
            svgText = svgText
                .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
                .replace(/on\w+="[^"]*"/g, '');

            // 🎯 تأكد من الخصائص المهمة
            if (!svgText.includes('viewBox')) {
                console.warn('SVG بدون viewBox قد لا يتجاوب جيدًا');
            }

            // 🎨 إجبار التحكم باللون
            svgText = svgText.replace(
                /<svg([^>]+)>/,
                `<svg$1 fill="currentColor" width="24" height="24" style="color:inherit">`
            );

            // 🔄 استبدال العنصر الحالي
            if (activeElementRef.current) {
                activeElementRef.current.outerHTML = svgText;
                commitChanges(activeSnippetId!);
            }
        };

        reader.readAsText(file);
    };

    const handleVideoReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeElementRef.current) return;

        if (!file.type.includes('video')) {
            toast.error(commonT('videoerror'))
            return;
        }

        const video = activeElementRef.current as HTMLVideoElement;
        const url = URL.createObjectURL(file);

        video.src = url;
        video.load();

        commitChanges(activeSnippetId!);
    };

    const handleVideoImgReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeElementRef.current) return;

        const video = activeElementRef.current as HTMLVideoElement;
        const url = URL.createObjectURL(file);

        video.poster = url;
        video.load();

        commitChanges(activeSnippetId!);
    };

    const removevideoImg = () => {
        const video = activeElementRef.current as HTMLVideoElement;

        video.poster = '';
        video.load();

        commitChanges(activeSnippetId!);
    };

    const updateLinkHref = (href: string) => {
        const el = activeElementRef.current;
        console.log(el.tagName)
        console.log(href)
        if (!el || el.tagName !== 'A') return;

        el.setAttribute('href', href);
        commitChanges(activeSnippetId!);
    };

    const toggleLinkTarget = (openNewTab: boolean) => {
        const el = activeElementRef.current;
        if (!el || el.tagName !== 'A') return;

        if (openNewTab) {
            el.setAttribute('target', '_blank');
            el.setAttribute('rel', 'noopener noreferrer');
        } else {
            el.removeAttribute('target');
            el.removeAttribute('rel');
        }

        commitChanges(activeSnippetId!);
    };

    const moveSnippet = (index: number, direction: 'up' | 'down') => {
        const newSnippets = [...droppedSnippets];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newSnippets.length) {
            [newSnippets[index], newSnippets[targetIndex]] = [newSnippets[targetIndex], newSnippets[index]];
            setDroppedSnippets(newSnippets);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-bold">{commonT('loading')}</div>;

    const swatchColors = [
        '#10B981', '#3B82F6', '#EF4444', '#000000',
        '#6366F1', '#64748B', '#8B5CF6', '#F59E0B',
        '#14B8A6', '#828282', '#FFFFFF'
    ];

    const bgColors = [
        '#EF4444', '#1E293B', '#F59E0B', '#0EA5E9',
        '#8B5CF6', '#10B981', '#3182CE', '#000000'
    ];

    return (
        <div className="flex flex-col h-screen bg-slate-100 overflow-hidden font-sans">
            <div className="h-14 bg-[#1E293B] flex justify-between items-center px-6 z-50 text-white shadow-xl">
                <div className="flex items-center gap-6">
                    <button onClick={handleSave} disabled={saving} className="bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-lg flex items-center gap-2">
                        <Save className="w-3.5 h-3.5" /> {saving ? '...' : commonT('saveChanges')}
                    </button>
                    <button onClick={() => setPreviewMode(!previewMode)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${previewMode ? 'bg-amber-500 text-white' : 'hover:bg-slate-800'}`}>
                        {previewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />} {previewMode ? editorT('exitPreview') : editorT('preview')}
                    </button>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex bg-[#0F172A] p-1 rounded-lg">
                        <button onClick={() => switchLocale('ar')} className={`px-4 py-1 rounded text-[10px] font-bold transition-all ${editorLocale === 'ar' ? 'bg-[#3B82F6] text-white shadow-lg' : 'text-slate-400'}`}>AR</button>
                        <button onClick={() => switchLocale('en')} className={`px-4 py-1 rounded text-[10px] font-bold transition-all ${editorLocale === 'en' ? 'bg-[#3B82F6] text-white shadow-lg' : 'text-slate-400'}`}>EN</button>
                    </div>
                    <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
                        <span className="text-xs font-bold text-slate-300">{getLocalizedName(page?.title, locale)}</span>
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-800 rounded-lg"><ArrowLeft className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <div className={`w-72 bg-white border-r border-slate-200 overflow-y-auto z-40 flex flex-col transition-all duration-300 ${previewMode ? '-ml-72' : 'ml-0'}`}>
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{editorT('styleDesigner')}</span>
                        <Settings className="w-3.5 h-3.5 text-indigo-500" />
                    </div>

                    <div className="p-5 space-y-8">
                        <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                            <div className="text-[9px] text-slate-400 font-bold uppercase mb-2 text-center flex items-center justify-center gap-1">
                                <MousePointer2 className="w-2.5 h-2.5" /> {editorT('activeElement')}
                            </div>
                            <div className="text-center font-black text-indigo-600 text-xs py-1 px-3 bg-white border border-slate-200 rounded-lg shadow-sm uppercase">
                                {activeTagName || editorT('none')}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {(!['img', 'video'].includes(activeTagName)) && (
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <TypeIcon className="w-3 h-3" /> {editorT('typography')}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1"><span className="text-[10px] font-bold text-slate-500 uppercase">{editorT('size')}</span><span className="text-[11px] font-black text-indigo-600">{activeElementRef.current?.tagName === 'svg'? activeElementRef.current.getAttribute('width') : activeStyles.fontSize}</span></div>
                                        <input type="range" min="8" max="120" value={activeElementRef.current?.tagName === 'svg'? parseInt(activeElementRef.current.getAttribute('width') || '24') : parseInt(activeStyles.fontSize) || 16} onChange={(e) => applyStyle('fontSize', `${e.target.value}px`)} className="w-full h-1.5 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                    </div>
                                </div>
                            )}
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <SquareRoundCorner className="w-3 h-3" /> {editorT('squarerounded')}
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1"><span className="text-[10px] font-bold text-slate-500 uppercase">{editorT('squarerounded')}</span><span className="text-[11px] font-black text-indigo-600">{activeStyles.borderRadius}</span></div>
                                <input type="range" min="0" max="24" value={parseInt(activeStyles.borderRadius) || 0} onChange={(e) => applyStyle('borderRadius', `${e.target.value}px`)} className="w-full h-1.5 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                            </div>
                            {activeTagName === 'img' && (
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <button
                                    onClick={() => imageInputRef.current?.click()}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl shadow-md transition cursor-pointer"
                                    >
                                        {editorT('replaceimg')}
                                    </button>
                                    <input
                                        ref={imageInputRef}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => handleImageChange(e)}
                                    />
                                </div>
                            )}
                            {(activeTagName === 'svg') && (
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <VectorSquare className="w-3 h-3" /> SVG
                                    </div>

                                    <button
                                        onClick={() => svgInputRef.current?.click()}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl shadow-md transition cursor-pointer"
                                        >
                                        {editorT('replacesvg')}
                                    </button>
                                    <input
                                        ref={svgInputRef}
                                        type="file"
                                        accept=".svg"
                                        hidden
                                        onChange={handleSvgUpload}
                                    />
                                </div>
                            )}
                            {(activeTagName === 'video') && (
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <FilePlay className="w-3 h-3" /> Video
                                    </div>
                                    <button
                                        onClick={() => videoInputRef.current?.click()}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl shadow-md transition cursor-pointer"
                                        >
                                        {editorT('replacevideo')}
                                    </button>
                                    <div className='flex'>
                                        <button
                                            onClick={() => videoImgInputRef.current?.click()}
                                            className="w-4/5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-r-xl shadow-md transition cursor-pointer"
                                            >
                                            {editorT('replaceimgvideo')}
                                        </button>
                                        <button
                                            onClick={() => {removevideoImg();}}
                                            className="flex justify-center items-center w-1/5 bg-red-400 hover:bg-red-700 text-white text-center rounded-l-xl shadow-md transition cursor-pointer"
                                            >
                                            <Trash2 className="h-4 text-white" />
                                        </button>
                                    </div>
                                    <input
                                        ref={videoInputRef}
                                        type="file"
                                        accept="video/mp4,video/webm"
                                        hidden
                                        onChange={handleVideoReplace}
                                    />
                                    <input
                                        ref={videoImgInputRef}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleVideoImgReplace}
                                    />
                                </div>
                            )}
                            {activeTagName === 'a' && (
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <LinkIcon className="w-3 h-3" /> {editorT('link')}
                                    </div>

                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="https://example.com"
                                            value={activeElementRef.current?.getAttribute('href') || ''}
                                            onChange={(e) => updateLinkHref(e.target.value)}
                                            className="w-full text-xs px-3 py-2 border border-slate-200 text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={activeElementRef.current?.getAttribute('target') === '_blank'}
                                        onChange={(e) => toggleLinkTarget(e.target.checked)}
                                    />
                                        {editorT('openInNewTab')}
                                    </label>
                                </div>
                            )}
                            {(!['img', 'svg', 'video'].includes(activeTagName)) && (
                                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
                                    <button onMouseDown={(e) => { e.preventDefault(); applyStyle('textAlign', 'left'); }} className={`p-2 rounded-lg flex justify-center transition-all ${activeStyles.textAlign.includes('left') ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><AlignLeft className="w-4 h-4" /></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); applyStyle('textAlign', 'center'); }} className={`p-2 rounded-lg flex justify-center transition-all ${activeStyles.textAlign.includes('center') ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><AlignCenter className="w-4 h-4" /></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); applyStyle('textAlign', 'right'); }} className={`p-2 rounded-lg flex justify-center transition-all ${activeStyles.textAlign.includes('right') ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><AlignRight className="w-4 h-4" /></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); applyStyle('textAlign', 'justify'); }} className={`p-2 rounded-lg flex justify-center transition-all ${activeStyles.textAlign.includes('justify') ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><Layout className="w-4 h-4" /></button>
                                </div>
                            )}
                            {(!['img', 'video'].includes(activeTagName)) && (
                                <div className="space-y-3">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase px-1">{editorT('textColor')}</span>
                                    <div className="grid grid-cols-4 gap-2">
                                        {swatchColors.map(c => (
                                            <button key={c} onMouseDown={(e) => { e.preventDefault(); applyStyle('foreColor', c); }} className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
                                        ))}
                                        {/* مدخل اللون الديناميكي مع تدرج */}
                                        <div className="relative w-8 h-8 rounded-full shadow-md overflow-hidden  border-2 border-white">
                                            {/* التدرج كخلفية */}
                                            <div className="absolute inset-0 rounded-full" 
                                                style={{ background: 'linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet)' }} />
                                            {/* input شفاف فوق التدرج */}
                                            <input
                                                type="color"
                                                value={activeStyles.color || '#ff0000'}
                                                onChange={(e) => applyStyleDebounced('foreColor', e.target.value)}
                                                className="w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {(!['video'].includes(activeTagName)) && (
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><PaintBucket className="w-3 h-3" /> {editorT('background')}</div>
                                <div className="space-y-3">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase px-1">{editorT('color')}</span>
                                    <div className="grid grid-cols-4 gap-2">
                                        {bgColors.map(c => (
                                            <button key={c} onMouseDown={(e) => { e.preventDefault(); applyStyle('backgroundColor', c); }} className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
                                        ))}
                                        <button onMouseDown={(e) => { e.preventDefault(); applyStyle('backgroundColor', 'transparent'); }} className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 shadow-md flex items-center justify-center relative"><div className="absolute w-full h-[1px] bg-red-400 rotate-45" /></button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col items-center p-8 bg-[#E2E8F0]">
                    <div className="flex gap-4 mb-4 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                        <button className="p-2 text-indigo-600 bg-indigo-50 rounded-lg"><Monitor className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-400 rounded-lg"><Smartphone className="w-4 h-4" /></button>
                    </div>

                    <div ref={canvasRef} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => { if (activeSnippetId) commitChanges(activeSnippetId); setActiveSnippetId(null); activeElementRef.current = null; setActiveTagName(null); }}
                        className={`w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-y-auto scroll-smooth transition-all duration-500 relative min-h-[600px] ${previewMode ? 'ring-0' : 'ring-1 ring-slate-300'}`}
                    >
                        <div className="flex flex-col min-h-full">
                            {droppedSnippets.map((item, index) => (
                                <div key={item.id} className="group relative">
                                    {!previewMode && (
                                        <div className="absolute top-4 right-4 hidden group-hover:flex items-center gap-1.5 bg-[#1E293B] text-white px-2 py-1 rounded-xl z-50 shadow-2xl border border-white/10 scale-90 opacity-90 transition-all">
                                            <button onClick={() => moveSnippet(index, 'up')} className="p-1.5 hover:bg-slate-700 rounded-lg"><Move className="w-3.5 h-3.5 rotate-180" /></button>
                                            <button onClick={() => moveSnippet(index, 'down')} className="p-1.5 hover:bg-slate-700 rounded-lg"><Move className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => { const newList = [...droppedSnippets]; newList.splice(index + 1, 0, { ...item, id: crypto.randomUUID() }); setDroppedSnippets(newList); }} className="p-1.5 hover:bg-slate-700 rounded-lg"><Copy className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => { if (window.confirm(editorT('deleteConfirm'))) setDroppedSnippets(prev => prev.filter((_, i) => i !== index)); }} className="p-1.5 hover:bg-red-900 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    )}
                                    <StableSnippet
                                        item={item}
                                        isActive={activeSnippetId === item.id}
                                        previewMode={previewMode}
                                        onContentClick={handleContentClick}
                                        isBeingEdited={activeSnippetId === item.id && activeElementRef.current !== null}
                                    />
                                </div>
                            ))}
                            {!previewMode && (
                                <div onDragOver={(e) => handleDragOver(e, droppedSnippets.length)} className={`h-40 border-2 border-dashed border-slate-300 m-8 rounded-3xl flex flex-col items-center justify-center transition-all gap-3 ${dragOverIndex === droppedSnippets.length ? 'bg-indigo-50 border-indigo-400' : 'bg-white hover:bg-slate-50'}`}>
                                    <Plus className={`w-10 h-10 ${dragOverIndex === droppedSnippets.length ? 'text-indigo-600' : 'text-slate-200'}`} />
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{editorT('dropNewSection')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={`w-80 bg-white border-l border-slate-200 overflow-y-auto z-40 transition-all duration-300 ${previewMode ? '-mr-80' : 'mr-0'}`}>
                    <div className="p-4 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">{editorT('snippetsLibrary')}</div>
                    <div className="p-4 space-y-3">
                        {snippets.map(s => (
                            <div key={s.id} draggable onDragStart={(e) => handleDragStart(e, s)} className="p-5 bg-white border border-slate-200 rounded-2xl cursor-grab hover:border-indigo-400 hover:shadow-xl transition-all group overflow-hidden">
                                <div className="text-xs font-black text-slate-800 uppercase group-hover:text-indigo-600">{s.name}</div>
                                <div className="text-[9px] text-slate-400 mt-1 uppercase font-bold">{t(`categories.${s.category}`)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
