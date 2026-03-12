'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import {
    Save, ArrowLeft, ArrowRight, Plus, Move, Trash2, Layout, Type, LinkIcon,
    Image as ImageIcon, Copy, MousePointer2, X, FilePlay,
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette,
    Type as TypeIcon, Minus, Plus as PlusIcon, PaintBucket, Settings,
    Eye, EyeOff, Monitor, Laptop, Smartphone, SquareRoundCorner, VectorSquare,
    PanelLeft, PanelRight
} from 'lucide-react';
import { getLocalizedName } from '@/app/utils/locale';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import toast from 'react-hot-toast';
import EditorTour from '@/app/components/EditorTour';
import { sanitizeHtml } from '@/app/utils/sanitize';
import DynamicSwiper from '@/app/components/DynamicSwiper';

interface Snippet {
    id: string;
    name: string;
    nameAr: string | null;
    category: string;
    htmlContent: string;
    thumbnail?: string;
    type?: string;
    apiEndpoint?: string | null;
    swiperConfig?: any | null;
    fieldMapping?: any | null;
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
    type?: string;
    apiEndpoint?: string | null;
    swiperConfig?: any | null;
    fieldMapping?: any | null;
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
    if (item.type === 'DYNAMIC_SWIPER') {
        return (
            <div
                id={`snippet-content-${item.id}`}
                onClick={(e) => onContentClick(e, item.id)}
                className={`transition-all duration-300 min-h-[50px] relative ${!previewMode && isActive ? 'outline-2 outline outline-indigo-500 shadow-xl z-10' : ''}`}
            >
                <div className="pointer-events-none opacity-80">
                    <DynamicSwiper snippet={item as any} />
                </div>
                {!previewMode && (
                    <div className="absolute inset-0 bg-primary/5 flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors z-20">
                        <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-primary/20 flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold text-primary">Dynamic Swiper Preview</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            id={`snippet-content-${item.id}`}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.htmlContent) }}
            onClick={(e) => onContentClick(e, item.id)}
            className={`transition-all duration-300 min-h-[50px] ${!previewMode ? 'hover:outline-2 hover:outline-dashed hover:outline-primary/30 cursor-text' : ''} ${!previewMode && isActive ? 'outline-2 outline outline-indigo-500 shadow-xl z-10' : ''}`}
        />
    );
}, (prev, next) => {
    // ALWAYS re-render if preview mode changes to ensure outlines disappear/appear correctly
    if (prev.previewMode !== next.previewMode) return false;

    // CRITICAL: If the snippet is actively being edited, we NEVER re-render it from state
    // This allows the user to type freely without React overwriting the DOM nodes
    if (next.isBeingEdited) return true;

    return prev.item.htmlContent === next.item.htmlContent &&
        prev.isActive === next.isActive;
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
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [showRightPanel, setShowRightPanel] = useState(true);

    // Dialog state
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    const confirmDeleteSnippet = () => {
        if (deleteIndex === null) return;
        setDroppedSnippets(prev => prev.filter((_, i) => i !== deleteIndex));
        setDeleteIndex(null);
        toast.success(commonT('deleted'));
    };

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

        // Responsive initialization: close sidebars on small screens
        if (window.innerWidth < 1024) {
            setShowLeftPanel(false);
            setShowRightPanel(false);
        }
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
        document.querySelectorAll('[id^="snippet-content-"] *').forEach(el => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.removeProperty('outline');
            htmlEl.style.removeProperty('outline-offset');
            if (htmlEl.getAttribute('style') === '' || (htmlEl.getAttribute('style') && htmlEl.style.length === 0)) {
                htmlEl.removeAttribute('style');
            }
            htmlEl.removeAttribute('contenteditable');
        });
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
            addSnippet(snippet);
        } catch (err) { console.error('Drop failed', err); }
        setDragOverIndex(null);
    };

    const addSnippet = (snippet: Snippet, index?: number) => {
        const newSnippet: DroppedSnippet = {
            id: crypto.randomUUID(),
            snippetId: snippet.id,
            htmlContent: snippet.htmlContent,
            name: snippet.name,
            type: snippet.type,
            apiEndpoint: snippet.apiEndpoint,
            swiperConfig: snippet.swiperConfig,
            fieldMapping: snippet.fieldMapping
        };
        const dropIndex = index !== undefined ? index : (dragOverIndex !== null ? dragOverIndex : droppedSnippets.length);
        setDroppedSnippets(prev => {
            const newList = [...prev];
            newList.splice(dropIndex, 0, newSnippet);
            return newList;
        });

        if (window.innerWidth < 1024) {
            setShowRightPanel(false);
            toast.success(editorT('snippetAdded'));
        }
    };

    const handleSnippetClick = (snippet: Snippet) => {
        if (previewMode) return;
        if (window.innerWidth < 1024) {
            addSnippet(snippet);
        }
    };

    const commitChanges = (id: string) => {
        const snippet = droppedSnippets.find(s => s.id === id);
        if (snippet?.type === 'DYNAMIC_SWIPER') return;

        const wrapper = document.getElementById(`snippet-content-${id}`);
        if (wrapper) {
            // Clean a CLONE so the live DOM keeps its visual outline for the user
            const clone = wrapper.cloneNode(true) as HTMLElement;
            clone.querySelectorAll('*').forEach(el => {
                const htmlEl = el as HTMLElement;
                htmlEl.style.removeProperty('outline');
                htmlEl.style.removeProperty('outline-offset');
                if (htmlEl.getAttribute('style') === '' || (htmlEl.getAttribute('style') && htmlEl.style.length === 0)) {
                    htmlEl.removeAttribute('style');
                }
                htmlEl.removeAttribute('contenteditable');
            });

            setDroppedSnippets(prev => prev.map(s => s.id === id ? { ...s, htmlContent: clone.innerHTML } : s));
        }
    };

    const rgbToHex = (color: string) => {
        if (!color || color === 'transparent') return '#ffffff';
        if (color.startsWith('#')) return color;
        const rgb = color.match(/\d+/g);
        if (!rgb || rgb.length < 3) return '#ffffff';
        const hex = (x: string) => {
            const h = parseInt(x).toString(16);
            return h.length === 1 ? '0' + h : h;
        };
        return '#' + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
    };

    const updateActiveStyles = (el: HTMLElement) => {
        const computed = window.getComputedStyle(el);
        const tag = el.tagName.toLowerCase();

        let styles: typeof activeStyles = {
            fontSize: '16px',
            color: '#000000',
            backgroundColor: 'transparent',
            textAlign: 'left',
            borderRadius: '0px'
        };

        if (tag === 'svg') {
            styles.color = rgbToHex(el.getAttribute('fill') || computed.color);
            styles.fontSize = el.getAttribute('width') || computed.width;
            styles.backgroundColor = rgbToHex(el.getAttribute('background') || 'transparent');
            styles.textAlign = 'center';
            styles.borderRadius = computed.borderRadius || '0px';
        } else if (tag === 'img' || tag === 'video') {
            styles.borderRadius = computed.borderRadius || '0px';
            styles.backgroundColor = rgbToHex(computed.backgroundColor);
        } else {
            styles = {
                fontSize: computed.fontSize,
                color: rgbToHex(computed.color),
                backgroundColor: rgbToHex(computed.backgroundColor),
                textAlign: computed.textAlign,
                borderRadius: computed.borderRadius
            };
        }

        setActiveStyles(styles);
        setActiveTagName(tag);
    };

    const handleContentClick = (e: React.MouseEvent, snippetId: string) => {
        if (previewMode) return;
        let target = e.target as HTMLElement;
        const wrapper = document.getElementById(`snippet-content-${snippetId}`);

        // Target editable elements
        let smartTarget = target.closest('p, h1, h2, h3, h4, h5, h6, span, a, li, button, img, section, div:not([id^="snippet-content-"]), svg, video');

        // Logic refinement: If we click a DIV that has 1 child and that child is media,
        // we check if the DIV has visual styles (background/border). 
        // If it doesn't, we "drill down" to the media for easier editing.
        if (smartTarget && smartTarget.tagName === 'DIV') {
            const mediaChild = smartTarget.querySelector('video, img, svg');
            if (mediaChild && (smartTarget as HTMLElement).children.length === 1) {
                const styles = window.getComputedStyle(smartTarget as HTMLElement);
                const hasBg = styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent';
                const hasBorder = styles.borderWidth !== '0px';

                // Drill down if container is blank wrapper OR if user clicked exactly on media
                if ((!hasBg && !hasBorder) || target.tagName === 'VIDEO' || target.tagName === 'IMG' || target.tagName === 'svg') {
                    smartTarget = mediaChild as HTMLElement;
                }
            }
        }

        if (smartTarget && wrapper?.contains(smartTarget)) target = smartTarget as HTMLElement;

        // Surgical Cleanup: Only remove old outlines if we are switching selection
        if (activeElementRef.current && activeElementRef.current !== target) {
            const oldEl = activeElementRef.current;
            oldEl.style.removeProperty('outline');
            oldEl.style.removeProperty('outline-offset');
            if (oldEl.getAttribute('style') === '' || (oldEl.getAttribute('style') && oldEl.style.length === 0)) {
                oldEl.removeAttribute('style');
            }
            oldEl.removeAttribute('contenteditable');

            // If switching snippets, commit old one
            if (activeSnippetId && activeSnippetId !== snippetId) {
                commitChanges(activeSnippetId);
            }
        }

        activeElementRef.current = target;
        setActiveSnippetId(snippetId);
        updateActiveStyles(target);

        if (target.tagName !== 'IMG' && !target.classList.contains('no-edit')) {
            if (target.tagName === 'SVG') {
                target.style.outline = '2px solid #3b82f6';
                target.style.outlineOffset = '2px';
            } else {
                target.contentEditable = 'true';
                target.style.outline = '2px solid #3b82f6';
                target.style.outlineOffset = '2px';
                target.focus();
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
            toast.error(commonT('videoerror'));
            return;
        }

        const video = activeElementRef.current as HTMLVideoElement;
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            video.setAttribute('src', base64);
            video.load();
            commitChanges(activeSnippetId!);
        };
        reader.readAsDataURL(file);
    };

    const handleVideoImgReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeElementRef.current) return;

        const video = activeElementRef.current as HTMLVideoElement;
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            video.setAttribute('poster', base64);
            video.load();
            commitChanges(activeSnippetId!);
        };
        reader.readAsDataURL(file);
    };

    const removevideoImg = () => {
        const video = activeElementRef.current as HTMLVideoElement;
        video.removeAttribute('poster');
        video.load();
        commitChanges(activeSnippetId!);
    };

    const updateLinkHref = (href: string) => {
        const el = activeElementRef.current;
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
            <EditorTour />
            <div className="h-14 bg-[#1E293B] flex justify-between items-center px-3 sm:px-6 z-50 text-white shadow-xl overflow-x-auto">
                <div className="flex items-center gap-2 sm:gap-6 shrink-0">
                    <button
                        id="save-button"
                        onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white px-3 sm:px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer">
                        <Save className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{saving ? '...' : commonT('saveChanges')}</span>
                    </button>
                    <button onClick={() => {
                        if (!previewMode && activeSnippetId) commitChanges(activeSnippetId);
                        setPreviewMode(!previewMode);
                    }} className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${previewMode ? 'bg-amber-500 text-white' : 'hover:bg-slate-800'}`}>
                        {previewMode ? <EyeOff className="w-3.5 h-3.5 cursor-pointer" /> : <Eye className="w-3.5 h-3.5" />} <span className="hidden sm:inline">{previewMode ? editorT('exitPreview') : editorT('preview')}</span>
                    </button>
                    {!previewMode && (
                        <>
                            <button
                                id="editor-left-panel-toggle"
                                onClick={() => {
                                    setShowLeftPanel(!showLeftPanel);
                                    if (!showLeftPanel && window.innerWidth < 1024) setShowRightPanel(false);
                                }}
                                className={`p-2 rounded-lg text-xs font-bold transition-all hidden lg:flex cursor-pointer ${showLeftPanel ? 'bg-primary text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                                title="Style panel"
                            >
                                {locale === 'ar' ? <PanelRight className="w-3.5 h-3.5 cursor-pointer" /> : <PanelLeft className="w-3.5 h-3.5" />}
                            </button>
                            <button
                                id="editor-right-panel-toggle"
                                onClick={() => {
                                    setShowRightPanel(!showRightPanel);
                                    if (!showRightPanel && window.innerWidth < 1024) setShowLeftPanel(false);
                                }}
                                className={`p-2 rounded-lg text-xs font-bold transition-all lg:hidden cursor-pointer ${showRightPanel ? 'bg-primary text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                                title="Snippets panel"
                            >
                                {locale === 'ar' ? <PanelLeft className="w-3.5 h-3.5 cursor-pointer" /> : <PanelRight className="w-3.5 h-3.5" />}
                            </button>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                    <div className="flex bg-[#0F172A] p-1 rounded-lg">
                        <button onClick={() => switchLocale('ar')} className={`px-3 sm:px-4 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${editorLocale === 'ar' ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}>AR</button>
                        <button onClick={() => switchLocale('en')} className={`px-3 sm:px-4 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${editorLocale === 'en' ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}>EN</button>
                    </div>
                    <div className="flex items-center gap-3 border-l border-slate-700 pl-3 sm:pl-6 cursor-pointer">
                        <span className="text-xs font-bold text-slate-300 hidden sm:block">{getLocalizedName(page?.title, locale)}</span>
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer">
                            {locale === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile overlay for left panel */}
                {showLeftPanel && !previewMode && (
                    <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setShowLeftPanel(false)} />
                )}
                <div
                    id="editor-sidebar"
                    className={`bg-white border-slate-200 overflow-y-auto flex flex-col transition-all duration-300 absolute lg:relative h-[calc(100vh-3.5rem)] z-[60] w-72 lg:w-72 start-0 border-r lg:border-r 
                        ${previewMode
                            ? 'ltr:-translate-x-full rtl:translate-x-full lg:ltr:-ml-72 lg:rtl:-mr-72'
                            : showLeftPanel
                                ? 'translate-x-0 lg:ml-0 lg:mr-0'
                                : 'ltr:-translate-x-full rtl:translate-x-full lg:translate-x-0 lg:ltr:-ml-72 lg:rtl:-mr-72 hidden lg:flex'
                        }
                        max-lg:w-full sm:max-lg:w-80 max-lg:shadow-2xl`}
                >
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{editorT('styleDesigner')}</span>
                        <Settings className="w-3.5 h-3.5 text-primary" />
                    </div>

                    <div className="p-5 space-y-8">
                        <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                            <div className="text-[9px] text-slate-400 font-bold uppercase mb-2 text-center flex items-center justify-center gap-1">
                                <MousePointer2 className="w-2.5 h-2.5" /> {editorT('activeElement')}
                            </div>
                            <div className="text-center font-black text-primary text-xs py-1 px-3 bg-white border border-slate-200 rounded-lg shadow-sm uppercase">
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
                                        <div className="flex justify-between items-center px-1"><span className="text-[10px] font-bold text-slate-500 uppercase">{editorT('size')}</span><span className="text-[11px] font-black text-primary">{activeElementRef.current?.tagName === 'svg' ? activeElementRef.current.getAttribute('width') : activeStyles.fontSize}</span></div>
                                        <input type="range" min="8" max="120" value={activeElementRef.current?.tagName === 'svg' ? parseInt(activeElementRef.current.getAttribute('width') || '24') : parseInt(activeStyles.fontSize) || 16} onChange={(e) => applyStyle('fontSize', `${e.target.value}px`)} className="w-full h-1.5 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-primary text-gray-400 outline-hidden" />
                                    </div>
                                </div>
                            )}
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <SquareRoundCorner className="w-3 h-3" /> {editorT('squarerounded')}
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1"><span className="text-[10px] font-bold text-slate-500 uppercase">{editorT('squarerounded')}</span><span className="text-[11px] font-black text-primary">{activeStyles.borderRadius}</span></div>
                                <input type="range" min="0" max="24" value={parseInt(activeStyles.borderRadius) || 0} onChange={(e) => applyStyle('borderRadius', `${e.target.value}px`)} className="w-full h-1.5 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-primary text-gray-400 outline-hidden" />
                            </div>
                            {activeTagName === 'img' && (
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => imageInputRef.current?.click()}
                                        className="w-full bg-primary hover:bg-primary/95 text-white text-xs font-bold py-2 rounded-xl shadow-md transition cursor-pointer"
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
                                <div className="space-y-3 pt-4 border-t border-slate-100 text-gray-400 outline-hidden">
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
                                <div className="space-y-3 pt-4 border-t border-slate-100 text-gray-400 outline-hidden">
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
                                            className={`w-4/5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 ${editorLocale === 'ar' ? 'rounded-r-xl' : 'rounded-l-xl'} shadow-md transition cursor-pointer`}
                                        >
                                            {editorT('replaceimgvideo')}
                                        </button>
                                        <button
                                            onClick={() => { removevideoImg(); }}
                                            className={`flex justify-center items-center w-1/5 bg-red-400 hover:bg-red-700 text-white text-center ${editorLocale === 'ar' ? 'rounded-l-xl' : 'rounded-r-xl'} shadow-md transition cursor-pointer`}
                                        >
                                            <Trash2 className="h-4 text-white cursor-pointer" />
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
                                <div className="space-y-4 pt-4 border-t border-slate-100 text-gray-400 outline-hidden">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <LinkIcon className="w-3 h-3" /> {editorT('link')}
                                    </div>

                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="https://example.com"
                                            value={activeElementRef.current?.getAttribute('href') || ''}
                                            onChange={(e) => updateLinkHref(e.target.value)}
                                            className="w-full text-xs px-3 py-2 border border-slate-200 text-gray-400 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary"
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
                                    <button onMouseDown={(e) => { e.preventDefault(); applyStyle('textAlign', 'left'); }} className={`p-2 rounded-lg flex justify-center transition-all cursor-pointer ${activeStyles.textAlign.includes('left') ? 'bg-white shadow-sm text-primary' : 'text-slate-400'}`}><AlignLeft className="w-4 h-4 cursor-pointer" /></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); applyStyle('textAlign', 'center'); }} className={`p-2 rounded-lg flex justify-center transition-all cursor-pointer ${activeStyles.textAlign.includes('center') ? 'bg-white shadow-sm text-primary' : 'text-slate-400'}`}><AlignCenter className="w-4 h-4 cursor-pointer" /></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); applyStyle('textAlign', 'right'); }} className={`p-2 rounded-lg flex justify-center transition-all cursor-pointer ${activeStyles.textAlign.includes('right') ? 'bg-white shadow-sm text-primary' : 'text-slate-400'}`}><AlignRight className="w-4 h-4 cursor-pointer" /></button>
                                    <button onMouseDown={(e) => { e.preventDefault(); applyStyle('textAlign', 'justify'); }} className={`p-2 rounded-lg flex justify-center transition-all cursor-pointer ${activeStyles.textAlign.includes('justify') ? 'bg-white shadow-sm text-primary' : 'text-slate-400'}`}><Layout className="w-4 h-4 cursor-pointer" /></button>
                                </div>
                            )}
                            {(!['img', 'video'].includes(activeTagName)) && (
                                <div className="space-y-3">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase px-1">{editorT('textColor')}</span>
                                    <div className="grid grid-cols-4 gap-2">
                                        {swatchColors.map(c => (
                                            <button key={c} onMouseDown={(e) => { e.preventDefault(); applyStyle('foreColor', c); }} className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer" style={{ backgroundColor: c }} />
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
                                                className="w-full h-full opacity-0 cursor-pointer text-gray-400 outline-hidden"
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
                                            <button key={c} onMouseDown={(e) => { e.preventDefault(); applyStyle('backgroundColor', c); }} className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer" style={{ backgroundColor: c }} />
                                        ))}
                                        <button onMouseDown={(e) => { e.preventDefault(); applyStyle('backgroundColor', 'transparent'); }} className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 shadow-md flex items-center justify-center relative cursor-pointer"><div className="absolute w-full h-[1px] bg-red-400 rotate-45" /></button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col items-center p-2 lg:p-6 bg-[#E2E8F0] z-10 w-full">
                    <div className="flex gap-4 mb-4 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                        <button className="p-2 text-primary bg-primary/10 rounded-lg cursor-pointer"><Monitor className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-400 rounded-lg cursor-pointer"><Smartphone className="w-4 h-4" /></button>
                    </div>

                    <div
                        id="editor-canvas"
                        ref={canvasRef} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => {
                            if (activeSnippetId) commitChanges(activeSnippetId);
                        }}
                        className={`w-full max-w-7xl bg-white shadow-2xl rounded-2xl overflow-y-auto scroll-smooth transition-all duration-500 relative min-h-[600px] ${previewMode ? 'ring-0' : 'ring-1 ring-slate-300 [&_video]:pointer-events-none'}`}
                    >
                        <div className="flex flex-col min-h-full">
                            {droppedSnippets.map((item, index) => {
                                const isActive = activeSnippetId === item.id;
                                return (
                                    <div key={item.id} className="group relative">
                                        {!previewMode && (
                                            <div className="absolute top-4 right-4 hidden group-hover:flex items-center gap-1.5 bg-[#1E293B] text-white px-2 py-1 rounded-xl z-50 shadow-2xl border border-white/10 scale-90 opacity-90 transition-all">
                                                <button onClick={() => moveSnippet(index, 'up')} className="p-1.5 hover:bg-slate-700 rounded-lg cursor-pointer"><Move className="w-3.5 h-3.5 rotate-180" /></button>
                                                <button onClick={() => moveSnippet(index, 'down')} className="p-1.5 hover:bg-slate-700 rounded-lg cursor-pointer"><Move className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => { const newList = [...droppedSnippets]; newList.splice(index + 1, 0, { ...item, id: crypto.randomUUID() }); setDroppedSnippets(newList); }} className="p-1.5 hover:bg-slate-700 rounded-lg cursor-pointer"><Copy className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => setDeleteIndex(index)} className="p-1.5 hover:bg-red-900 rounded-lg cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        )}
                                        {isActive && !previewMode && activeElementRef.current && (
                                            <div
                                                className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-3 bg-slate-900/95 backdrop-blur-xl text-white p-4 rounded-3xl z-[100] shadow-2xl border border-white/20 lg:hidden animate-in fade-in slide-in-from-bottom-8 w-[92vw] max-w-sm"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {/* Header & Tag Indicator */}
                                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-primary p-1.5 rounded-lg">
                                                            <Settings className="w-3.5 h-3.5 text-white" />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{activeTagName}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            document.querySelectorAll('[id^="snippet-content-"] *').forEach(el => {
                                                                const htmlEl = el as HTMLElement;
                                                                htmlEl.style.removeProperty('outline');
                                                                htmlEl.style.removeProperty('outline-offset');
                                                                if (htmlEl.getAttribute('style') === '' || (htmlEl.getAttribute('style') && htmlEl.style.length === 0)) {
                                                                    htmlEl.removeAttribute('style');
                                                                }
                                                                htmlEl.removeAttribute('contenteditable');
                                                            });
                                                            setActiveSnippetId(null); activeElementRef.current = null; setActiveTagName(null);
                                                        }}
                                                        className="p-1 hover:bg-white/10 rounded-full cursor-pointer"
                                                    >
                                                        <Plus className="w-4 h-4 rotate-45 text-slate-400" />
                                                    </button>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4">
                                                    {/* Typography: Size & Alignment */}
                                                    {(!['img', 'video'].includes(activeTagName!)) && (
                                                        <div className="flex flex-col gap-2 bg-white/5 p-2 rounded-2xl border border-white/5 flex-1 min-w-[140px]">
                                                            <div className="flex items-center justify-between gap-1 px-1 border-b border-white/10 pb-2">
                                                                <div className="flex items-center gap-1">
                                                                    <button onMouseDown={(e) => { e.preventDefault(); applyStyle('fontSize', (parseInt(activeStyles.fontSize) - 1) + 'px'); }} className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                                                                    <span className="text-[10px] font-black w-6 text-center">{activeStyles.fontSize.replace('px', '').replace('rem', '')}</span>
                                                                    <button onMouseDown={(e) => { e.preventDefault(); applyStyle('fontSize', (parseInt(activeStyles.fontSize) + 1) + 'px'); }} className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer"><PlusIcon className="w-3.5 h-3.5" /></button>
                                                                </div>
                                                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Size</div>
                                                            </div>
                                                            <div className="flex items-center justify-around gap-1 pt-1">
                                                                <button onMouseDown={(e) => { e.preventDefault(); applyStyle('textAlign', 'left'); }} className={`p-2 rounded-lg transition-all ${activeStyles.textAlign.includes('left') ? 'bg-primary/90 text-white' : 'hover:bg-white/10 text-slate-400'}`}><AlignLeft className="w-4 h-4 cursor-pointer" /></button>
                                                                <button onMouseDown={(e) => { e.preventDefault(); applyStyle('textAlign', 'center'); }} className={`p-2 rounded-lg transition-all ${activeStyles.textAlign.includes('center') ? 'bg-primary/90 text-white' : 'hover:bg-white/10 text-slate-400'}`}><AlignCenter className="w-4 h-4 cursor-pointer" /></button>
                                                                <button onMouseDown={(e) => { e.preventDefault(); applyStyle('textAlign', 'right'); }} className={`p-2 rounded-lg transition-all ${activeStyles.textAlign.includes('right') ? 'bg-primary/90 text-white' : 'hover:bg-white/10 text-slate-400'}`}><AlignRight className="w-4 h-4 cursor-pointer" /></button>
                                                                <button onMouseDown={(e) => { e.preventDefault(); applyStyle('textAlign', 'justify'); }} className={`p-2 rounded-lg transition-all ${activeStyles.textAlign.includes('justify') ? 'bg-primary/90 text-white' : 'hover:bg-white/10 text-slate-400'}`}><Layout className="w-4 h-4 cursor-pointer" /></button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Common: Border Radius & Colors */}
                                                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                                                        {/* Border Radius Toggle/Step */}
                                                        <button
                                                            onMouseDown={(e) => { e.preventDefault(); applyStyle('borderRadius', (parseInt(activeStyles.borderRadius || '0') + 4) % 28 + 'px'); }}
                                                            className="p-2 hover:bg-white/10 rounded-xl cursor-pointer"
                                                            title="Border Radius"
                                                        >
                                                            <SquareRoundCorner className="w-4 h-4" />
                                                        </button>

                                                        {/* Colors */}
                                                        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                                                            {(!['img', 'video'].includes(activeTagName!)) && (
                                                                <div className="relative group">
                                                                    <div className="w-6 h-6 rounded-full border border-white/20 overflow-hidden" style={{ background: 'linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet)' }}>
                                                                        <input
                                                                            type="color"
                                                                            value={activeStyles.color}
                                                                            onChange={(e) => applyStyleDebounced('foreColor', e.target.value)}
                                                                            className="absolute inset-0 opacity-0 cursor-pointer text-gray-400 outline-hidden"
                                                                        />
                                                                    </div>
                                                                    <TypeIcon className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-slate-900 rounded-full p-0.5" />
                                                                </div>
                                                            )}
                                                            {activeTagName !== 'video' && (
                                                                <div className="relative group">
                                                                    <div className="w-6 h-6 rounded-full border border-white/20 bg-slate-700 flex items-center justify-center overflow-hidden">
                                                                        <div className="w-full h-full" style={{ backgroundColor: activeStyles.backgroundColor === 'transparent' ? '#334155' : activeStyles.backgroundColor }} />
                                                                        <input
                                                                            type="color"
                                                                            value={activeStyles.backgroundColor === 'transparent' ? '#ffffff' : activeStyles.backgroundColor}
                                                                            onChange={(e) => applyStyleDebounced('backgroundColor', e.target.value)}
                                                                            className="absolute inset-0 opacity-0 cursor-pointer text-gray-400 outline-hidden"
                                                                        />
                                                                    </div>
                                                                    <PaintBucket className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-slate-900 rounded-full p-0.5" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Media Controls */}
                                                {(['img', 'svg', 'video'].includes(activeTagName!)) && (
                                                    <div className="flex gap-2 bg-white/5 p-2 rounded-2xl border border-white/5 overflow-x-auto">
                                                        {activeTagName === 'img' && (
                                                            <button onClick={() => imageInputRef.current?.click()} className="flex-1 bg-primary px-3 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 shrink-0 cursor-pointer">
                                                                <ImageIcon className="w-3.5 h-3.5" /> {editorT('replaceimg')}
                                                            </button>
                                                        )}
                                                        {activeTagName === 'svg' && (
                                                            <button onClick={() => svgInputRef.current?.click()} className="flex-1 bg-emerald-600 px-3 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 shrink-0 cursor-pointer">
                                                                <VectorSquare className="w-3.5 h-3.5" /> {editorT('replacesvg')}
                                                            </button>
                                                        )}
                                                        {activeTagName === 'video' && (
                                                            <>
                                                                <button onClick={() => videoInputRef.current?.click()} className="flex-1 bg-emerald-600 px-3 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 shrink-0 cursor-pointer">
                                                                    <FilePlay className="w-3.5 h-3.5" /> Video
                                                                </button>
                                                                <button onClick={() => videoImgInputRef.current?.click()} className="flex-1 bg-slate-700 px-3 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 shrink-0 cursor-pointer">
                                                                    <ImageIcon className="w-3.5 h-3.5" /> Cover
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Link Controls */}
                                                {activeTagName === 'a' && (
                                                    <div className="flex flex-col gap-2 bg-white/5 p-3 rounded-2xl border border-white/5">
                                                        <div className="flex items-center gap-2">
                                                            <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                                                            <input
                                                                type="text"
                                                                placeholder="https://..."
                                                                value={activeElementRef.current?.getAttribute('href') || ''}
                                                                onChange={(e) => updateLinkHref(e.target.value)}
                                                                className="flex-1 bg-transparent border-none text-[10px] focus:ring-0 p-0 text-slate-300 text-gray-400 outline-hidden"
                                                            />
                                                        </div>
                                                        <label className="flex items-center gap-2 text-[10px] text-slate-400 cursor-pointer pt-2 border-t border-white/5">
                                                            <input
                                                                type="checkbox"
                                                                checked={activeElementRef.current?.getAttribute('target') === '_blank'}
                                                                onChange={(e) => toggleLinkTarget(e.target.checked)}
                                                                className="rounded border-white/20 bg-transparent text-primary w-3 h-3"
                                                            />
                                                            {editorT('openInNewTab')}
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <StableSnippet
                                            item={item}
                                            isActive={isActive}
                                            previewMode={previewMode}
                                            onContentClick={handleContentClick}
                                            isBeingEdited={isActive && activeElementRef.current !== null}
                                        />
                                    </div>
                                )
                            })}
                            {!previewMode && (
                                <div onDragOver={(e) => handleDragOver(e, droppedSnippets.length)} className={`h-40 border-2 border-dashed border-slate-300 m-8 rounded-3xl flex flex-col items-center justify-center transition-all gap-3 ${dragOverIndex === droppedSnippets.length ? 'bg-primary/10 border-primary' : 'bg-white hover:bg-slate-50'}`}>
                                    <Plus className={`w-10 h-10 ${dragOverIndex === droppedSnippets.length ? 'text-primary' : 'text-slate-200'}`} />
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{editorT('dropNewSection')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile overlay for right panel */}
                {showRightPanel && !previewMode && (
                    <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setShowRightPanel(false)} />
                )}
                <div
                    id="editor-right-sidebar"
                    className={`bg-white border-l border-slate-200 overflow-y-auto transition-all duration-300 absolute lg:relative h-[calc(100vh-3.5rem)] z-[60] w-80 end-0 
                        ${previewMode
                            ? 'ltr:translate-x-full rtl:-translate-x-full lg:ltr:-mr-80 lg:rtl:-ml-80'
                            : showRightPanel
                                ? 'translate-x-0 lg:mr-0 lg:ml-0'
                                : 'ltr:translate-x-full rtl:-translate-x-full lg:translate-x-0 lg:ltr:-mr-80 lg:rtl:-ml-80 hidden lg:block'
                        }`}
                >
                    <div className="p-4 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">{editorT('snippetsLibrary')}</div>
                    <div id="editor-snippets" className="p-4 space-y-3">
                        {snippets.map(s => (
                            <div
                                key={s.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, s)}
                                onClick={() => { if (window.innerWidth < 1024) handleSnippetClick(s); }}
                                className="p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer lg:cursor-grab hover:border-primary/70 hover:shadow-lg active:scale-95 transition-all group overflow-hidden"
                            >
                                <div className="text-xs font-black text-slate-800 uppercase group-hover:text-primary">{locale === 'ar' && s.nameAr ? s.nameAr : s.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            <ConfirmDialog
                isOpen={deleteIndex !== null}
                onClose={() => setDeleteIndex(null)}
                onConfirm={confirmDeleteSnippet}
                title={commonT('delete')}
                message={editorT('deleteConfirm')}
                isDeleting
            />
        </div >
    );
}
