(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/utils/locale.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getLocalizedName",
    ()=>getLocalizedName,
    "getUserLocale",
    ()=>getUserLocale
]);
function getUserLocale() {
    // Simple mock or server-side utility
    return 'en';
}
function getLocalizedName(name, locale) {
    if (!name) return '';
    if (typeof name === 'string') return name; // Fallback for legacy data or simple strings
    // prioritize exact locale, then fallback language, then first available
    return name[locale] || name['en'] || Object.values(name)[0] || '';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/[locale]/admin/pages/[id]/editor/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VisualEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/use-intl/dist/esm/development/react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/navigation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Move$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/move.js [app-client] (ecmascript) <export default as Move>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panels$2d$top$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layout$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panels-top-left.js [app-client] (ecmascript) <export default as Layout>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/palette.js [app-client] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/type.js [app-client] (ecmascript) <export default as Type>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square.js [app-client] (ecmascript) <export default as Square>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bold$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bold$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bold.js [app-client] (ecmascript) <export default as Bold>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$italic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Italic$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/italic.js [app-client] (ecmascript) <export default as Italic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$underline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Underline$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/underline.js [app-client] (ecmascript) <export default as Underline>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-start.js [app-client] (ecmascript) <export default as AlignLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$center$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignCenter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-center.js [app-client] (ecmascript) <export default as AlignCenter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$end$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-end.js [app-client] (ecmascript) <export default as AlignRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link.js [app-client] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/code.js [app-client] (ecmascript) <export default as Code>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mouse$2d$pointer$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MousePointer2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mouse-pointer-2.js [app-client] (ecmascript) <export default as MousePointer2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$locale$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/locale.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function VisualEditor({ params }) {
    _s();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('Admin');
    const commonT = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('Common');
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"])();
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [snippets, setSnippets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [droppedSnippets, setDroppedSnippets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [draggedSnippet, setDraggedSnippet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dragOverIndex, setDragOverIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editorLocale, setEditorLocale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('en');
    const [contentEn, setContentEn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [contentAr, setContentAr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Style Editor State
    const [activeElement, setActiveElement] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeSnippetId, setActiveSnippetId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Track changes to force re-renders
    const [styleVersion, setStyleVersion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [elementText, setElementText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const switchLocale = (newLocale)=>{
        if (newLocale === editorLocale) return;
        // Save current snippets to buffer
        if (editorLocale === 'en') setContentEn(droppedSnippets);
        else setContentAr(droppedSnippets);
        // Load new snippets from buffer
        setDroppedSnippets(newLocale === 'en' ? contentEn : contentAr);
        setEditorLocale(newLocale);
    };
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VisualEditor.useEffect": ()=>{
            const init = {
                "VisualEditor.useEffect.init": async ()=>{
                    const { id } = await params;
                    await Promise.all([
                        fetchPage(id),
                        fetchSnippets()
                    ]);
                }
            }["VisualEditor.useEffect.init"];
            init();
        }
    }["VisualEditor.useEffect"], [
        params
    ]);
    const fetchPage = async (id)=>{
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
    const fetchSnippets = async ()=>{
        try {
            const res = await fetch('/api/snippets');
            if (res.ok) {
                const data = await res.json();
                setSnippets(data);
            }
        } catch (error) {
            console.error('Failed to fetch snippets', error);
        } finally{
            setLoading(false);
        }
    };
    const handleDragStart = (e, snippet)=>{
        setDraggedSnippet(snippet);
        e.dataTransfer.setData('text/plain', JSON.stringify(snippet));
        e.dataTransfer.effectAllowed = 'copy';
    };
    const handleDragOver = (e, index)=>{
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        if (typeof index === 'number') {
            setDragOverIndex(index);
        } else {
            setDragOverIndex(droppedSnippets.length);
        }
    };
    const handleDrop = (e)=>{
        e.preventDefault();
        const snippetData = e.dataTransfer.getData('text/plain');
        if (!snippetData) return;
        try {
            const snippet = JSON.parse(snippetData);
            const newSnippet = {
                id: crypto.randomUUID(),
                snippetId: snippet.id,
                htmlContent: snippet.htmlContent,
                name: snippet.name
            };
            const dropIndex = dragOverIndex !== null ? dragOverIndex : droppedSnippets.length;
            setDroppedSnippets((prev)=>{
                const newSnippets = [
                    ...prev
                ];
                newSnippets.splice(dropIndex, 0, newSnippet);
                return newSnippets;
            });
            // Auto-select the dropped snippet after a brief delay to allow rendering
            setTimeout(()=>{
                const element = document.getElementById(`snippet-content-${newSnippet.id}`);
                if (element) {
                    // Trigger a click to select it
                    element.click();
                // Or set active element directly if we want to bypass click logic, but click sets breadcrumbs etc.
                // But click requires an event object.
                // Better to just call the logic or simulate click.
                // element.click() works if the handler is attached.
                // In React the handler is onClick={...} so element.click() is standard DOM, but React might handle it.
                // Actually, for "dangerouslySetInnerHTML" wrapper div, the onClick is on the wrapper.
                // So `element` (the wrapper) .click() should bubble or trigger.
                // But `handleContentClick` prevents propagation.
                // Let's rely on manual setting if possible or just use click() and hope React dispatches it.
                // React 17+ delegates to root, 16 delegates to document. click() on DOM node usually triggers React listeners.
                // Let's try finding the wrapper and clicking it.
                // The wrapper has id `snippet-content-${item.id}`? No, the wrapper has that ID.
                // render: <div id={`snippet-content-${item.id}`} ... onClick={...}>
                // So yes, clicking it works.
                }
            }, 100);
        } catch (err) {
            console.error('Drop failed', err);
        }
    };
    // Text & Style Editing Handlers
    const handleContentClick = (e, snippetId)=>{
        let target = e.target;
        const wrapper = document.getElementById(`snippet-content-${snippetId}`);
        // Smart targeting: if we click inside a common text element (like an icon in a button), target the text element
        const smartTarget = target.closest('p, h1, h2, h3, h4, h5, h6, span, a, li, button, label, b, i, u, strong, em, small, sub, sup, td, th, blockquote, cite, pre, code');
        if (smartTarget && wrapper?.contains(smartTarget)) {
            target = smartTarget;
        }
        // Prevent default only if we are taking action
        e.stopPropagation();
        // If we click a different element, save the previous one first
        if (activeElement && activeElement !== target && activeSnippetId) {
            commitChanges(activeSnippetId);
            activeElement.style.outline = '';
        }
        // Set active element for styling
        if (activeElement) {
            activeElement.style.outline = ''; // Clear previous
        }
        setActiveElement(target);
        setActiveSnippetId(snippetId);
        setElementText(target.innerText);
        setStyleVersion((v)=>v + 1);
        // Visual cue for selection
        target.style.outline = '2px solid #3b82f6';
        target.style.outlineOffset = '2px';
        // Allow editing of text-containing elements
        const textTags = [
            'P',
            'H1',
            'H2',
            'H3',
            'H4',
            'H5',
            'H6',
            'SPAN',
            'A',
            'LI',
            'BUTTON',
            'LABEL',
            'B',
            'I',
            'U',
            'STRONG',
            'EM',
            'SMALL',
            'SUB',
            'SUP',
            'TD',
            'TH',
            'CAPTION',
            'FIGCAPTION',
            'DT',
            'DD',
            'ADDRESS',
            'BLOCKQUOTE',
            'CITE',
            'PRE',
            'CODE'
        ];
        const isContainer = [
            'DIV',
            'SECTION',
            'ARTICLE',
            'ASIDE',
            'FOOTER',
            'HEADER',
            'MAIN',
            'NAV'
        ].includes(target.tagName);
        // Prevent link navigation while editing
        if (target.tagName === 'A') {
            e.preventDefault();
        }
        // Universal text editing: if it contains text nodes that aren't empty, allow editing
        const hasDirectText = Array.from(target.childNodes).some((node)=>node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
        const isKnownTextTag = textTags.includes(target.tagName);
        if (isKnownTextTag || hasDirectText || isContainer && target.children.length === 0) {
            // Enable editing on click
            target.contentEditable = 'true';
            target.style.outline = 'none'; // UX: No outline while editing text
            // Set direction for correct cursor behavior in Arabic
            if (editorLocale === 'ar') {
                target.dir = 'rtl';
            } else {
                target.dir = 'ltr';
            }
            target.focus();
            // Sync changes to sidebar text area while typing
            const handleInput = ()=>{
                setElementText(target.innerText);
            };
            // Handle blur to save changes
            const handleBlur = ()=>{
                target.contentEditable = 'false';
                // target.removeAttribute('dir'); // Optional: remove to keep HTML clean? 
                // Better keep it if it's explicitly set.
                commitChanges(snippetId);
                target.removeEventListener('input', handleInput);
                target.removeEventListener('blur', handleBlur);
            };
            target.addEventListener('input', handleInput);
            target.addEventListener('blur', handleBlur);
        }
    };
    const clearSelection = ()=>{
        if (activeElement && activeSnippetId) {
            activeElement.style.outline = '';
            // activeElement.contentEditable = 'false'; // Ensure editing stops
            commitChanges(activeSnippetId); // Save final state
            setActiveElement(null);
            setActiveSnippetId(null);
        }
    };
    // Apply style directly to DOM without triggering React re-render of snippets
    const handleStyleChange = (property, value)=>{
        if (!activeElement || !activeSnippetId) return;
        // Apply style to DOM
        activeElement.style[property] = value;
        // Force sidebar update to reflect new values (e.g. toggles)
        setStyleVersion((v)=>v + 1);
    // WE DO NOT CALL updateSnippetContent HERE
    // Changes are committed on blur or clearSelection
    };
    // Update Text Content from Sidebar
    const handleTextChange = (text)=>{
        if (!activeElement || !activeSnippetId) return;
        activeElement.innerText = text;
        setElementText(text);
    // We don't commit immediately to avoid re-rendering entire snippet on keystroke
    // Changes are committed on blur or save or selection change
    };
    // Helper to get current computed style
    // We rely on styleVersion to force re-evaluation of this during render
    const getActiveStyle = (property)=>{
        if (!activeElement) return '';
        // Check inline style first, then computed
        return activeElement.style[property] || window.getComputedStyle(activeElement)[property];
    };
    // Commit current DOM state to React State
    const commitChanges = (id)=>{
        const wrapper = document.getElementById(`snippet-content-${id}`);
        if (wrapper) {
            // Clean artifacts before saving
            // We need to clone or work on string to avoid flashing the live element
            let content = wrapper.innerHTML;
            // Remove editor artifacts from the string
            // 1. contentEditable
            content = content.replace(/contenteditable="true"/g, '');
            // 2. outline style - this is inline style.
            // The outline is added to activeElement.
            // High-fidelity cleaning: Clone, remove all editor artefacts, then grab HTML
            const clone = wrapper.cloneNode(true);
            // Remove selection outlines, contentEditable, and other UI markings
            const artefacts = clone.querySelectorAll('*');
            artefacts.forEach((el)=>{
                const element = el;
                element.style.outline = '';
                element.style.outlineOffset = '';
                element.removeAttribute('contenteditable');
                element.removeAttribute('dir'); // clean up direction if added
                if (element.style.length === 0) element.removeAttribute('style');
            });
            const cleanHtml = clone.innerHTML;
            setDroppedSnippets((prev)=>prev.map((s)=>s.id === id ? {
                        ...s,
                        htmlContent: cleanHtml
                    } : s));
        }
    };
    // NOTE: This function is replaced by commitChanges for internal use
    const updateSnippetContent = (id)=>{
        commitChanges(id);
    };
    // Enhanced Save to clean up editor artefacts
    const handleSaveClean = async ()=>{
        // Deselect everything first to remove outlines and commit changes
        clearSelection();
        // Wait a tick for React/DOM to update styles
        setTimeout(()=>{
            saveToBackend(droppedSnippets); // Pass current state
        }, 50);
    };
    const saveToBackend = async (snippetsToSave)=>{
        if (!page) return;
        setSaving(true);
        try {
            const contentToSave = {
                en: editorLocale === 'en' ? snippetsToSave : contentEn,
                ar: editorLocale === 'ar' ? snippetsToSave : contentAr
            };
            const contentJson = JSON.stringify(contentToSave);
            const res = await fetch(`/api/pages/${page.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: contentJson
                })
            });
            if (res.ok) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success(commonT('saved'));
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error('Failed to save');
            }
        } catch (error) {
            console.error('Failed to save', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error('Failed to save');
        } finally{
            setSaving(false);
        }
    };
    const removeSnippet = (index)=>{
        setDroppedSnippets((prev)=>prev.filter((_, i)=>i !== index));
        clearSelection();
    };
    const duplicateSnippet = (index)=>{
        const snippetToCopy = droppedSnippets[index];
        const newSnippet = {
            ...snippetToCopy,
            id: Math.random().toString(36).substr(2, 9) // New unique ID
        };
        const newList = [
            ...droppedSnippets
        ];
        newList.splice(index + 1, 0, newSnippet);
        setDroppedSnippets(newList);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success('Snippet duplicated');
    };
    const moveSnippet = (index, direction)=>{
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === droppedSnippets.length - 1) return;
        const newSnippets = [
            ...droppedSnippets
        ];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newSnippets[index], newSnippets[targetIndex]] = [
            newSnippets[targetIndex],
            newSnippets[index]
        ];
        setDroppedSnippets(newSnippets);
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-8 text-center",
        children: "Loading editor..."
    }, void 0, false, {
        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
        lineNumber: 423,
        columnNumber: 25
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-[calc(100vh-theme(spacing.16))] gap-6 -m-8 p-8 overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-64 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-b border-slate-100 bg-slate-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "font-bold text-slate-900 flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panels$2d$top$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layout$3e$__["Layout"], {
                                    className: "w-4 h-4 text-indigo-600"
                                }, void 0, false, {
                                    fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                    lineNumber: 431,
                                    columnNumber: 25
                                }, this),
                                t('snippetsLibrary')
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                            lineNumber: 430,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                        lineNumber: 429,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto p-4 space-y-4",
                        children: snippets.map((snippet)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                draggable: true,
                                onDragStart: (e)=>handleDragStart(e, snippet),
                                className: "p-4 bg-white border border-slate-200 rounded-xl cursor-move hover:border-indigo-500 hover:shadow-md transition-all group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-medium text-slate-700 mb-2",
                                        children: snippet.name
                                    }, void 0, false, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 443,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded inline-block",
                                        children: snippet.category
                                    }, void 0, false, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 444,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, snippet.id, true, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 437,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                        lineNumber: 435,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                lineNumber: 428,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col min-w-0 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 flex-shrink-0 z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.back(),
                                        className: "p-2 hover:bg-slate-100 rounded-lg transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                            className: "w-5 h-5 text-slate-600"
                                        }, void 0, false, {
                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                            lineNumber: 458,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 457,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "font-bold text-slate-900 truncate max-w-md",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$locale$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLocalizedName"])(page?.title, locale) || t('untitledPage')
                                    }, void 0, false, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 460,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center bg-slate-100 rounded-lg p-1 ml-4 rtl:mr-4 rtl:ml-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>switchLocale('en'),
                                                className: `px-3 py-1 text-xs font-semibold rounded-md transition-all ${editorLocale === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`,
                                                children: "English"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 463,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>switchLocale('ar'),
                                                className: `px-3 py-1 text-xs font-semibold rounded-md transition-all ${editorLocale === 'ar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`,
                                                children: "العربية"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 469,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 462,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 456,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>window.open(`/${locale}/${page?.url || ''}`, '_blank'),
                                        className: "px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors",
                                        children: commonT('preview')
                                    }, void 0, false, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 478,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleSaveClean,
                                        disabled: saving,
                                        className: "flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 489,
                                                columnNumber: 29
                                            }, this),
                                            saving ? t('saving') : commonT('saveChanges')
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 484,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 477,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                        lineNumber: 455,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: canvasRef,
                        onDragOver: (e)=>handleDragOver(e),
                        onClick: (e)=>{
                            // If clicking directly on canvas background (not event from snippet), clear selection
                            if (e.target === canvasRef.current) {
                                clearSelection();
                            }
                        },
                        onDrop: (e)=>{
                            e.preventDefault();
                            handleDrop(e);
                        },
                        className: "flex-1 overflow-y-auto p-8 relative scroll-smooth",
                        children: [
                            activeElement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fixed z-[100] flex flex-col gap-2 pointer-events-none",
                                style: {
                                    top: `${activeElement.getBoundingClientRect().top - 60}px`,
                                    left: `${activeElement.getBoundingClientRect().left + activeElement.getBoundingClientRect().width / 2}px`,
                                    transform: 'translateX(-50%)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-slate-900 text-white px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1 text-[10px] font-black uppercase tracking-widest pointer-events-auto animate-in fade-in zoom-in duration-200",
                                        children: (()=>{
                                            const crumbs = [];
                                            let curr = activeElement;
                                            const rootId = `snippet-content-${activeSnippetId}`;
                                            while(curr && curr.id !== rootId && crumbs.length < 4){
                                                crumbs.unshift(curr);
                                                curr = curr.parentElement;
                                            }
                                            return crumbs.map((el, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center",
                                                    children: [
                                                        i > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "opacity-30 mx-1",
                                                            children: "/"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                            lineNumber: 533,
                                                            columnNumber: 55
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onMouseDown: (e)=>{
                                                                e.preventDefault();
                                                                if (el !== activeElement) {
                                                                    if (activeElement.isContentEditable) {
                                                                        activeElement.contentEditable = 'false';
                                                                    }
                                                                    setActiveElement(el);
                                                                    setStyleVersion((v)=>v + 1);
                                                                }
                                                            },
                                                            className: `hover:text-indigo-400 transition-colors ${el === activeElement ? 'text-indigo-400' : 'text-slate-300'}`,
                                                            children: el.tagName.toLowerCase()
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                            lineNumber: 534,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                    lineNumber: 532,
                                                    columnNumber: 41
                                                }, this));
                                        })()
                                    }, void 0, false, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 522,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white/90 backdrop-blur-md border border-slate-200/50 p-1 rounded-2xl shadow-2xl flex items-center gap-1 pointer-events-auto animate-in slide-in-from-bottom-2 duration-300",
                                        children: [
                                            activeElement.tagName !== 'IMG' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onMouseDown: (e)=>{
                                                            e.preventDefault();
                                                            document.execCommand('bold');
                                                            setStyleVersion((v)=>v + 1);
                                                        },
                                                        className: `p-2 rounded-xl hover:bg-slate-100 transition-all ${document.queryCommandState('bold') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`,
                                                        title: "Bold",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bold$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bold$3e$__["Bold"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                            lineNumber: 563,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 558,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onMouseDown: (e)=>{
                                                            e.preventDefault();
                                                            document.execCommand('italic');
                                                            setStyleVersion((v)=>v + 1);
                                                        },
                                                        className: `p-2 rounded-xl hover:bg-slate-100 transition-all ${document.queryCommandState('italic') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`,
                                                        title: "Italic",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$italic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Italic$3e$__["Italic"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                            lineNumber: 570,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 565,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onMouseDown: (e)=>{
                                                            e.preventDefault();
                                                            document.execCommand('underline');
                                                            setStyleVersion((v)=>v + 1);
                                                        },
                                                        className: `p-2 rounded-xl hover:bg-slate-100 transition-all ${document.queryCommandState('underline') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$underline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Underline$3e$__["Underline"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                            lineNumber: 576,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 572,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-px h-4 bg-slate-200 mx-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 578,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-0.5",
                                                        children: [
                                                            {
                                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"],
                                                                cmd: 'justifyLeft'
                                                            },
                                                            {
                                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$center$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignCenter$3e$__["AlignCenter"],
                                                                cmd: 'justifyCenter'
                                                            },
                                                            {
                                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$end$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignRight$3e$__["AlignRight"],
                                                                cmd: 'justifyRight'
                                                            }
                                                        ].map((btn, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onMouseDown: (e)=>{
                                                                    e.preventDefault();
                                                                    document.execCommand(btn.cmd);
                                                                    setStyleVersion((v)=>v + 1);
                                                                },
                                                                className: "p-2 rounded-xl hover:bg-slate-100 text-slate-600",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(btn.icon, {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                    lineNumber: 590,
                                                                    columnNumber: 53
                                                                }, this)
                                                            }, i, false, {
                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                lineNumber: 585,
                                                                columnNumber: 49
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 579,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-px h-4 bg-slate-200 mx-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 594,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onMouseDown: (e)=>{
                                                            e.preventDefault();
                                                            const url = prompt('Enter URL:', activeElement.tagName === 'A' ? activeElement.href : '');
                                                            if (url) {
                                                                document.execCommand('createLink', false, url);
                                                                setStyleVersion((v)=>v + 1);
                                                            }
                                                        },
                                                        className: "p-2 rounded-xl hover:bg-slate-100 text-slate-600",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                            lineNumber: 606,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 595,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative group/color",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: "p-2 rounded-xl hover:bg-slate-100 text-slate-600",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-4 h-4 rounded-full border border-slate-300 shadow-xs",
                                                                    style: {
                                                                        backgroundColor: '#4f46e5'
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                    lineNumber: 610,
                                                                    columnNumber: 49
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                lineNumber: 609,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute top-full left-0 mt-2 hidden group-hover/color:grid grid-cols-5 gap-1.5 p-3 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 w-48",
                                                                children: [
                                                                    [
                                                                        '#000000',
                                                                        '#ffffff',
                                                                        '#64748b',
                                                                        '#ef4444',
                                                                        '#f59e0b',
                                                                        '#10b981',
                                                                        '#3b82f6',
                                                                        '#4f46e5',
                                                                        '#8b5cf6',
                                                                        '#d946ef'
                                                                    ].map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onMouseDown: (e)=>{
                                                                                e.preventDefault();
                                                                                document.execCommand('foreColor', false, color);
                                                                                if (activeSnippetId) commitChanges(activeSnippetId);
                                                                                setStyleVersion((v)=>v + 1);
                                                                            },
                                                                            className: "w-6 h-6 rounded-full border border-slate-200 shadow-xs hover:scale-125 transition-transform",
                                                                            style: {
                                                                                backgroundColor: color
                                                                            },
                                                                            title: `Color: ${color}`
                                                                        }, color, false, {
                                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                            lineNumber: 614,
                                                                            columnNumber: 53
                                                                        }, this)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onMouseDown: (e)=>{
                                                                            e.preventDefault();
                                                                            const color = prompt('Custom Hex Color:', '#000000');
                                                                            if (color) {
                                                                                document.execCommand('foreColor', false, color);
                                                                                if (activeSnippetId) commitChanges(activeSnippetId);
                                                                                setStyleVersion((v)=>v + 1);
                                                                            }
                                                                        },
                                                                        className: "col-span-2 w-full h-6 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors",
                                                                        children: "Custom"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                        lineNumber: 627,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                lineNumber: 612,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 608,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-px h-4 bg-slate-200 mx-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 643,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onMouseDown: (e)=>{
                                                            e.preventDefault();
                                                            const newEl = activeElement.cloneNode(true);
                                                            newEl.style.outline = '';
                                                            activeElement.after(newEl);
                                                            if (activeSnippetId) commitChanges(activeSnippetId);
                                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success('Element duplicated');
                                                        },
                                                        className: "p-2 rounded-xl hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-all",
                                                        title: "Duplicate Block",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                            lineNumber: 661,
                                                            columnNumber: 41
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 649,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative group/add",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: "p-2 rounded-xl hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition-all",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                    lineNumber: 666,
                                                                    columnNumber: 45
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                lineNumber: 665,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute top-full left-0 mt-2 hidden group-hover/add:flex flex-col gap-1 p-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 w-44",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onMouseDown: (e)=>{
                                                                            e.preventDefault();
                                                                            const p = document.createElement('p');
                                                                            p.innerText = 'New text block...';
                                                                            p.className = 'mt-4 text-slate-600 leading-relaxed';
                                                                            activeElement.after(p);
                                                                            if (activeSnippetId) commitChanges(activeSnippetId);
                                                                        },
                                                                        className: "flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__["Type"], {
                                                                                className: "w-3.5 h-3.5 text-indigo-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                                lineNumber: 680,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            " New Paragraph"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                        lineNumber: 669,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onMouseDown: (e)=>{
                                                                            e.preventDefault();
                                                                            const btn = document.createElement('button');
                                                                            btn.innerText = 'Click Me';
                                                                            btn.className = 'mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all';
                                                                            activeElement.after(btn);
                                                                            if (activeSnippetId) commitChanges(activeSnippetId);
                                                                        },
                                                                        className: "flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mouse$2d$pointer$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MousePointer2$3e$__["MousePointer2"], {
                                                                                className: "w-3.5 h-3.5 text-emerald-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                                lineNumber: 693,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            " New Button"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                        lineNumber: 682,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                lineNumber: 668,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 664,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onMouseDown: (e)=>{
                                                            e.preventDefault();
                                                            if (confirm('Delete this element?')) {
                                                                const parent = activeElement.parentElement;
                                                                activeElement.remove();
                                                                clearSelection();
                                                                if (activeSnippetId) commitChanges(activeSnippetId);
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success('Element removed');
                                                            }
                                                        },
                                                        className: "p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all",
                                                        title: "Delete Element",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                            lineNumber: 712,
                                                            columnNumber: 41
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 698,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 648,
                                                columnNumber: 33
                                            }, this),
                                            activeElement.tagName === 'IMG' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1 border-l border-slate-100 ml-1 pl-1",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onMouseDown: (e)=>{
                                                        e.preventDefault();
                                                        const src = prompt('Image URL:', activeElement.src);
                                                        if (src) {
                                                            activeElement.src = src;
                                                            commitChanges(activeSnippetId);
                                                        }
                                                    },
                                                    className: "px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                            lineNumber: 729,
                                                            columnNumber: 45
                                                        }, this),
                                                        " Replace"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                    lineNumber: 718,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 717,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 555,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 513,
                                columnNumber: 25
                            }, this),
                            droppedSnippets.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 pointer-events-none",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Move$3e$__["Move"], {
                                        className: "w-12 h-12 mb-4 opacity-50"
                                    }, void 0, false, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 739,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-lg font-medium",
                                        children: t('dragDropTitle')
                                    }, void 0, false, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 740,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm",
                                        children: t('dragDropDesc')
                                    }, void 0, false, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 741,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 738,
                                columnNumber: 25
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4 pb-20 max-w-5xl mx-auto",
                                children: [
                                    droppedSnippets.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `group relative bg-white transition-all border-2 rounded-sm ${activeSnippetId === item.id ? 'border-primary shadow-xl ring-8 ring-primary/5' : 'border-transparent shadow-xs hover:shadow-lg hover:border-slate-300'}`,
                                            onDragOver: (e)=>{
                                                e.stopPropagation();
                                                handleDragOver(e, index);
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `absolute -top-5 left-1/2 -translate-x-1/2 flex gap-1 transition-all bg-slate-900 text-white shadow-2xl p-1 rounded-full z-[40] ${activeSnippetId === item.id || 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>moveSnippet(index, 'up'),
                                                            disabled: index === 0,
                                                            className: "w-8 h-8 flex items-center justify-center hover:bg-slate-800 rounded-full disabled:opacity-20 transition-colors",
                                                            children: "↑"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                            lineNumber: 756,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>moveSnippet(index, 'down'),
                                                            disabled: index === droppedSnippets.length - 1,
                                                            className: "w-8 h-8 flex items-center justify-center hover:bg-slate-800 rounded-full disabled:opacity-20 transition-colors",
                                                            children: "↓"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                            lineNumber: 757,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-px h-4 bg-slate-700 mx-1 self-center"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                            lineNumber: 758,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                const html = prompt('Edit Raw HTML:', item.htmlContent);
                                                                if (html !== null) {
                                                                    const newSnippets = [
                                                                        ...droppedSnippets
                                                                    ];
                                                                    newSnippets[index].htmlContent = html;
                                                                    setDroppedSnippets(newSnippets);
                                                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success('HTML updated');
                                                                }
                                                            },
                                                            className: "w-8 h-8 flex items-center justify-center hover:bg-indigo-600 rounded-full transition-colors",
                                                            title: "Edit Raw HTML",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"], {
                                                                className: "w-3.5 h-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                lineNumber: 772,
                                                                columnNumber: 45
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                            lineNumber: 759,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>duplicateSnippet(index),
                                                            className: "w-8 h-8 flex items-center justify-center hover:bg-blue-600 rounded-full transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                className: "w-3.5 h-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                lineNumber: 774,
                                                                columnNumber: 191
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                            lineNumber: 774,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>removeSnippet(index),
                                                            className: "w-8 h-8 flex items-center justify-center hover:bg-red-600 rounded-full transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                className: "w-3.5 h-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                lineNumber: 775,
                                                                columnNumber: 187
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                            lineNumber: 775,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                    lineNumber: 755,
                                                    columnNumber: 37
                                                }, this),
                                                dragOverIndex === index && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute -top-4 left-0 right-0 h-2 bg-primary z-50 rounded-full opacity-100 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                    lineNumber: 780,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    id: `snippet-content-${item.id}`,
                                                    dangerouslySetInnerHTML: {
                                                        __html: item.htmlContent
                                                    },
                                                    onClick: (e)=>handleContentClick(e, item.id),
                                                    className: "pointer-events-auto min-h-[80px]"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                    lineNumber: 784,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, item.id, true, {
                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                            lineNumber: 746,
                                            columnNumber: 33
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `h-32 border-2 border-dashed border-slate-300 rounded-[2.5rem] flex items-center justify-center transition-all group/drop ${dragOverIndex === droppedSnippets.length ? 'bg-indigo-50/50 border-indigo-400 scale-[1.01]' : 'bg-slate-50/50 hover:bg-slate-100/50'}`,
                                        onDragOver: (e)=>{
                                            e.stopPropagation();
                                            handleDragOver(e, droppedSnippets.length);
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center gap-3 opacity-30 group-hover/drop:opacity-60 transition-opacity",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-3 bg-white rounded-2xl shadow-sm",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        className: "w-6 h-6 text-indigo-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 803,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                    lineNumber: 802,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-900 font-black tracking-widest uppercase text-[10px]",
                                                    children: t('dropToAppend')
                                                }, void 0, false, {
                                                    fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                    lineNumber: 805,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                            lineNumber: 801,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 794,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 744,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                        lineNumber: 496,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                lineNumber: 453,
                columnNumber: 13
            }, this),
            activeElement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-80 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-[0_0_50px_rgba(0,0,0,0.1)] overflow-hidden flex-shrink-0 animate-in slide-in-from-right-10 duration-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 border-b border-slate-100 bg-slate-50/20 flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "font-black text-slate-900 flex items-center gap-2 text-xs uppercase tracking-widest",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"], {
                                                className: "w-4 h-4 text-indigo-600"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 819,
                                                columnNumber: 33
                                            }, this),
                                            activeElement.tagName,
                                            " properties"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 818,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] text-slate-400 font-bold mt-0.5",
                                        children: "Edit element styles"
                                    }, void 0, false, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 822,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 817,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: clearSelection,
                                className: "p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                    lineNumber: 825,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 824,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                        lineNumber: 816,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto p-6 space-y-10 scrollbar-hide",
                        children: [
                            activeElement.tagName === 'IMG' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 901,
                                                columnNumber: 37
                                            }, this),
                                            " Dimensions"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 900,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-[10px] font-bold text-slate-500 ml-1",
                                                        children: "Width"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 905,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: activeElement.style.width || activeElement.getAttribute('width') || '',
                                                        onChange: (e)=>handleStyleChange('width', e.target.value),
                                                        className: "w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none",
                                                        placeholder: "Auto"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 906,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 904,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-[10px] font-bold text-slate-500 ml-1",
                                                        children: "Height"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 915,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: activeElement.style.height || activeElement.getAttribute('height') || '',
                                                        onChange: (e)=>handleStyleChange('height', e.target.value),
                                                        className: "w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none",
                                                        placeholder: "Auto"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 916,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 914,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 903,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-[10px] font-bold text-slate-500 ml-1",
                                                children: "Alt Text"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 926,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: activeElement.alt,
                                                onChange: (e)=>{
                                                    activeElement.alt = e.target.value;
                                                },
                                                onBlur: ()=>commitChanges(activeSnippetId),
                                                className: "w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none",
                                                placeholder: "SEO Description"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 927,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 925,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 899,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-widest",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"], {
                                                className: "w-3.5 h-3.5 text-indigo-500"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1044,
                                                columnNumber: 33
                                            }, this),
                                            " Quick Styles"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1043,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3 pt-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1",
                                                children: "Predefined Colors"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1047,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-2",
                                                children: [
                                                    '#000000',
                                                    '#ffffff',
                                                    '#475569',
                                                    '#ef4444',
                                                    '#3b82f6',
                                                    '#10b981',
                                                    '#f59e0b',
                                                    '#4f46e5'
                                                ].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleStyleChange('color', c),
                                                        className: `w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${activeElement.style.color === c ? 'border-primary ring-2 ring-primary/10' : 'border-slate-100'}`,
                                                        style: {
                                                            backgroundColor: c
                                                        },
                                                        title: "Apply to Text"
                                                    }, c, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1050,
                                                        columnNumber: 41
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1048,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1046,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 1042,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1065,
                                                columnNumber: 33
                                            }, this),
                                            " Box Model"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1064,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-[10px] font-bold text-slate-500 mb-2 px-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Padding"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                lineNumber: 1071,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: getActiveStyle('padding')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                lineNumber: 1072,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1070,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "range",
                                                        min: "0",
                                                        max: "100",
                                                        step: "4",
                                                        value: parseInt(getActiveStyle('padding')) || 0,
                                                        onChange: (e)=>handleStyleChange('padding', `${e.target.value}px`),
                                                        className: "w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-full cursor-pointer"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1074,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1069,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-[10px] font-bold text-slate-500 mb-2 px-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Margin"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                lineNumber: 1083,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: getActiveStyle('margin')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                lineNumber: 1084,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1082,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "range",
                                                        min: "0",
                                                        max: "100",
                                                        step: "4",
                                                        value: parseInt(getActiveStyle('margin')) || 0,
                                                        onChange: (e)=>handleStyleChange('margin', `${e.target.value}px`),
                                                        className: "w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-full cursor-pointer"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1086,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1081,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-[10px] font-bold text-slate-500 mb-2 px-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Border Radius"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                lineNumber: 1095,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: getActiveStyle('borderRadius')
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                                lineNumber: 1096,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1094,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "range",
                                                        min: "0",
                                                        max: "50",
                                                        step: "2",
                                                        value: parseInt(getActiveStyle('borderRadius')) || 0,
                                                        onChange: (e)=>handleStyleChange('borderRadius', `${e.target.value}px`),
                                                        className: "w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-full cursor-pointer"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1098,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1093,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1068,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 1063,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1111,
                                                columnNumber: 33
                                            }, this),
                                            " Background"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1110,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-4 gap-2",
                                        children: [
                                            [
                                                'transparent',
                                                '#ffffff',
                                                '#f8fafc',
                                                '#1e293b',
                                                '#ef4444',
                                                '#3b82f6',
                                                '#10b981',
                                                '#f59e0b'
                                            ].map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleStyleChange('backgroundColor', color),
                                                    className: `w-full aspect-square rounded-xl border-2 transition-all hover:scale-110 ${getActiveStyle('backgroundColor') === color ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-100'}`,
                                                    style: {
                                                        backgroundColor: color === 'transparent' ? 'white' : color
                                                    },
                                                    children: color === 'transparent' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-full h-px bg-red-400 rotate-45"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1121,
                                                        columnNumber: 69
                                                    }, this)
                                                }, color, false, {
                                                    fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                    lineNumber: 1115,
                                                    columnNumber: 37
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "color",
                                                className: "w-full aspect-square p-1 bg-white border-2 border-slate-100 rounded-xl cursor-pointer",
                                                onChange: (e)=>handleStyleChange('backgroundColor', e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1124,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1113,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "text-xs font-semibold text-slate-500 flex gap-2 items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                                        className: "w-3 h-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1134,
                                                        columnNumber: 37
                                                    }, this),
                                                    " Background Image"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1133,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                className: "w-full text-xs p-2 border border-slate-200 rounded bg-white",
                                                placeholder: "https://...",
                                                value: activeElement.style.backgroundImage?.replace(/url\(['"]?(.*?)['"]?\)/, '$1') === 'none' ? '' : activeElement.style.backgroundImage?.replace(/url\(['"]?(.*?)['"]?\)/, '$1') || '',
                                                onChange: (e)=>{
                                                    const val = e.target.value.trim();
                                                    handleStyleChange('backgroundImage', val ? `url('${val}')` : 'none');
                                                    if (val) {
                                                        handleStyleChange('backgroundSize', 'cover');
                                                        handleStyleChange('backgroundPosition', 'center');
                                                    }
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1136,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2 text-[10px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleStyleChange('backgroundSize', 'cover'),
                                                        className: "px-2 py-1 bg-white border rounded hover:border-indigo-500 transition-colors",
                                                        children: "Cover"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1151,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleStyleChange('backgroundSize', 'contain'),
                                                        className: "px-2 py-1 bg-white border rounded hover:border-indigo-500 transition-colors",
                                                        children: "Contain"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1152,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleStyleChange('backgroundPosition', 'center'),
                                                        className: "px-2 py-1 bg-white border rounded hover:border-indigo-500 transition-colors",
                                                        children: "Center"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1153,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1150,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1132,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 1109,
                                columnNumber: 25
                            }, this),
                            activeElement.tagName === 'A' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-sm font-semibold text-blue-800 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1162,
                                                columnNumber: 37
                                            }, this),
                                            " Link Properties"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1161,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs text-blue-600 mb-1",
                                                children: "Target URL"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1165,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: activeElement.getAttribute('href') || '',
                                                onChange: (e)=>{
                                                    activeElement.setAttribute('href', e.target.value);
                                                    setStyleVersion((v)=>v + 1);
                                                },
                                                onBlur: ()=>commitChanges(activeSnippetId),
                                                className: "w-full text-xs p-2 border border-blue-200 rounded text-blue-900 bg-white",
                                                placeholder: "https://..."
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1166,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1164,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                id: "openInNewTab",
                                                checked: activeElement.getAttribute('target') === '_blank',
                                                onChange: (e)=>{
                                                    if (e.target.checked) activeElement.setAttribute('target', '_blank');
                                                    else activeElement.removeAttribute('target');
                                                    setStyleVersion((v)=>v + 1);
                                                    commitChanges(activeSnippetId);
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1179,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "openInNewTab",
                                                className: "text-xs text-blue-700 select-none cursor-pointer",
                                                children: "Open in new tab"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1190,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1178,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 1160,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4 pt-4 border-t border-slate-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-2 text-sm font-semibold text-slate-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Move$3e$__["Move"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1198,
                                                columnNumber: 33
                                            }, this),
                                            " Spacing"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1197,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs text-slate-500 mb-1",
                                                        children: "Padding"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1202,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "range",
                                                        min: "0",
                                                        max: "100",
                                                        step: "4",
                                                        className: "w-full accent-indigo-600",
                                                        onChange: (e)=>handleStyleChange('padding', `${e.target.value}px`)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1203,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1201,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs text-slate-500 mb-1",
                                                        children: "Margin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1210,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "range",
                                                        min: "0",
                                                        max: "100",
                                                        step: "4",
                                                        className: "w-full accent-indigo-600",
                                                        onChange: (e)=>handleStyleChange('margin', `${e.target.value}px`)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1211,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1209,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1200,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 1196,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4 pt-4 border-t border-slate-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-2 text-sm font-semibold text-slate-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Square$3e$__["Square"], {
                                                className: "w-4 h-4 border border-current rounded-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1223,
                                                columnNumber: 33
                                            }, this),
                                            " Border & Effects"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1222,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-slate-500 w-12",
                                                        children: "Width"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1227,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "range",
                                                        min: "0",
                                                        max: "20",
                                                        className: "flex-1 accent-indigo-600",
                                                        onChange: (e)=>{
                                                            handleStyleChange('borderWidth', e.target.value + 'px');
                                                            if (activeElement.style.borderStyle === '') handleStyleChange('borderStyle', 'solid');
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1228,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1226,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-slate-500 w-12",
                                                        children: "Radius"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1238,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "range",
                                                        min: "0",
                                                        max: "100",
                                                        className: "flex-1 accent-indigo-600",
                                                        onChange: (e)=>handleStyleChange('borderRadius', e.target.value + 'px')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1239,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1237,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-slate-500 w-12",
                                                        children: "Color"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1246,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "color",
                                                        className: "flex-1 h-8 rounded border-0 p-0 cursor-pointer",
                                                        onChange: (e)=>handleStyleChange('borderColor', e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1247,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1245,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2 pt-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleStyleChange('boxShadow', '0 10px 15px -3px rgb(0 0 0 / 0.1)'),
                                                        className: "text-[10px] px-2 py-1 bg-white border rounded hover:border-indigo-500 shadow-sm",
                                                        children: "Soft Shadow"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1254,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleStyleChange('boxShadow', '0 20px 25px -5px rgb(0 0 0 / 0.1)'),
                                                        className: "text-[10px] px-2 py-1 bg-white border rounded hover:border-indigo-500 shadow-lg",
                                                        children: "Hard Shadow"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1255,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleStyleChange('boxShadow', 'none'),
                                                        className: "text-[10px] px-2 py-1 bg-white border rounded hover:border-indigo-500",
                                                        children: "None"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1256,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1253,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1225,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 1221,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4 pt-4 border-t border-slate-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "flex items-center gap-2 text-sm font-semibold text-slate-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1264,
                                                columnNumber: 33
                                            }, this),
                                            " Advanced CSS"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1263,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-slate-400 italic",
                                                children: "Apply any CSS property manually"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1267,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        id: "custom-prop",
                                                        placeholder: "opacity, transform...",
                                                        className: "text-[11px] p-1.5 border rounded border-slate-200"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1269,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        id: "custom-val",
                                                        placeholder: "0.5, scale(1.1)...",
                                                        className: "text-[11px] p-1.5 border rounded border-slate-200"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                        lineNumber: 1274,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1268,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    const p = document.getElementById('custom-prop').value;
                                                    const v = document.getElementById('custom-val').value;
                                                    if (p && v) handleStyleChange(p, v);
                                                },
                                                className: "w-full py-1.5 bg-slate-800 text-white text-[11px] font-bold rounded hover:bg-black transition-colors",
                                                children: "Apply Style"
                                            }, void 0, false, {
                                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                                lineNumber: 1280,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                        lineNumber: 1266,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                                lineNumber: 1262,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                        lineNumber: 829,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
                lineNumber: 815,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/[locale]/admin/pages/[id]/editor/page.tsx",
        lineNumber: 426,
        columnNumber: 9
    }, this);
}
_s(VisualEditor, "IYMYOtkKjdvW4VVEQZbm8/cZefc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$use$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocale"]
    ];
});
_c = VisualEditor;
var _c;
__turbopack_context__.k.register(_c, "VisualEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_f530ab72._.js.map