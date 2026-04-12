'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { useAppSelector } from '@/app/store/hooks';
import {
    Bold, Italic, Underline as UnderlineIcon,
    Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
    List, ListOrdered, AlignLeft, AlignCenter,
    AlignRight, AlignJustify, Link as LinkIcon,
    Undo, Redo, Quote,
    Code as CodeIcon, Minus, Eraser, Palette,
    Highlighter, Square, CornerUpLeft, MousePointer2, Columns
} from 'lucide-react';

// Custom Extension for Block Styles (Border & Radius)
const BlockStyle = Extension.create({
    name: 'blockStyle',
    addOptions() {
        return {
            types: ['paragraph', 'heading', 'bulletList', 'orderedList'],
        };
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    border: {
                        default: null,
                        parseHTML: element => element.style.border,
                        renderHTML: attributes => {
                            if (!attributes.border) return {};
                            return { style: `border: ${attributes.border}; padding: 12px;` };
                        },
                    },
                    borderRadius: {
                        default: null,
                        parseHTML: element => element.style.borderRadius,
                        renderHTML: attributes => {
                            if (!attributes.borderRadius) return {};
                            return { style: `border-radius: ${attributes.borderRadius}; overflow: hidden;` };
                        },
                    },
                    width: {
                        default: null,
                        parseHTML: element => element.style.width,
                        renderHTML: attributes => {
                            if (!attributes.width) return {};
                            return { style: `width: ${attributes.width};` };
                        },
                    },
                    backgroundColor: {
                        default: null,
                        parseHTML: element => element.style.backgroundColor,
                        renderHTML: attributes => {
                            if (!attributes.backgroundColor) return {};
                            return { style: `background-color: ${attributes.backgroundColor}; padding: 12px;` };
                        },
                    },
                    columns: {
                        default: null,
                        parseHTML: element => {
                            const val = element.getAttribute('data-columns');
                            return val ? Number(val) : null;
                        },
                        renderHTML: attributes => {
                            if (!attributes.columns) return {};
                            return {
                                'data-columns': attributes.columns,
                                style: `display: grid; grid-template-columns: repeat(${attributes.columns}, 1fr); column-gap: 16px; row-gap: 8px; width: 100%;`
                            };
                        },
                    },
                    columnGap: {
                        default: null,
                        parseHTML: element => element.getAttribute('data-column-gap'),
                        renderHTML: attributes => {
                            if (!attributes.columnGap) return {};
                            return {
                                'data-column-gap': attributes.columnGap,
                                style: `row-gap: ${attributes.columnGap};`
                            };
                        },
                    },
                    markerColor: {
                        default: null,
                        parseHTML: element => element.getAttribute('data-marker-color'),
                        renderHTML: attributes => {
                            if (!attributes.markerColor) return {};
                            return {
                                'data-marker-color': attributes.markerColor,
                                style: `--marker-color: ${attributes.markerColor};`
                            };
                        },
                    },
                },
            },
        ];
    },
});

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    dir?: 'ltr' | 'rtl';
}

const MenuBar = ({ editor, onDropdownChange }: { editor: any, onDropdownChange: (open: boolean) => void }) => {
    const { themeColor, secondaryColor } = useAppSelector((state) => state.website);
    const [activeDropdown, setActiveDropdown] = React.useState<number | null>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if it's a click on a color input belonging to the browser
            const target = event.target as HTMLElement;
            if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'color') {
                return;
            }

            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
                onDropdownChange(false);
            }
        };

        if (activeDropdown !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown, onDropdownChange]);

    if (!editor) return null;

    const handleDropdownToggle = (index: number) => {
        const isOpen = activeDropdown === index;
        setActiveDropdown(isOpen ? null : index);
        onDropdownChange(!isOpen);
    };

    const addLink = () => {
        if (!editor) return;
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const setTextColor = (color: string) => {
        if (!editor) return;
        editor.chain().focus().setColor(color).run();
        setActiveDropdown(null);
        onDropdownChange(false);
    };

    const setHighlightColor = (color: string) => {
        if (!editor) return;
        editor.chain().focus().setHighlight({ color }).run();
        setActiveDropdown(null);
        onDropdownChange(false);
    };

    const setBlockBgColor = (color: string) => {
        if (!editor) return;
        editor.chain().focus()
            .updateAttributes('paragraph', { backgroundColor: color })
            .updateAttributes('heading', { backgroundColor: color })
            .run();
        setActiveDropdown(null);
        onDropdownChange(false);
    };

    const toggleBorder = () => {
        if (!editor) return;
        const attrs = editor.getAttributes('paragraph');
        const isBordered = attrs.border;
        if (isBordered) {
            editor.chain().focus()
                .updateAttributes('paragraph', { border: null })
                .updateAttributes('heading', { border: null })
                .run();
        } else {
            const newAttrs = {
                border: '2px solid var(--primary-color)',
            };
            editor.chain().focus()
                .updateAttributes('paragraph', newAttrs)
                .updateAttributes('heading', newAttrs)
                .run();
        }
    };

    const updateBlockStyle = (attrs: any) => {
        if (!editor) return;
        editor.chain().focus()
            .updateAttributes('paragraph', attrs)
            .updateAttributes('heading', attrs)
            .run();
    };

    const getListType = () => {
        if (!editor) return null;
        if (editor.isActive('bulletList')) return 'bulletList';
        if (editor.isActive('orderedList')) return 'orderedList';
        return null;
    };

    const updateListColumns = (cols: number | null) => {
        if (!editor) return;
        const type = getListType();
        if (!type) return;
        editor.chain().focus().updateAttributes(type, { columns: cols }).run();
    };

    const updateListGap = (gap: string) => {
        if (!editor) return;
        const type = getListType();
        if (!type) return;
        editor.chain().focus().updateAttributes(type, { columnGap: gap }).run();
    };

    const updateMarkerColor = (color: string | null) => {
        if (!editor) return;
        const type = getListType();
        if (!type) return;
        editor.chain().focus().updateAttributes(type, { markerColor: color }).run();
    };

    const buttons = [
        { icon: <Bold className="w-4 h-4" />, action: () => editor.chain().focus().toggleBold().run(), active: 'bold', title: 'عريض' },
        { icon: <Italic className="w-4 h-4" />, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic', title: 'مائل' },
        { icon: <UnderlineIcon className="w-4 h-4" />, action: () => editor.chain().focus().toggleUnderline().run(), active: 'underline', title: 'تحته خط' },
        { divider: true },
        {
            icon: <Palette className="w-4 h-4" />,
            dropdown: true,
            title: 'لون النص',
            content: (
                <div className="flex flex-col gap-2 p-3 bg-white border border-slate-200 rounded-xl shadow-xl animate-scale-in min-w-[140px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">ألوان الهوية</span>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setTextColor('var(--primary-color)')} className="w-9 h-9 rounded-lg border-2 border-slate-100 shadow-sm transition-transform hover:scale-110" style={{ backgroundColor: themeColor }} title="الأساسي" />
                        <button onClick={() => setTextColor('var(--secondary-color)')} className="w-9 h-9 rounded-lg border-2 border-slate-100 shadow-sm transition-transform hover:scale-110" style={{ backgroundColor: secondaryColor }} title="الثانوي" />
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div className="flex flex-col gap-1 items-stretch">
                        <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-gradient-to-r from-red-500 via-green-500 to-blue-500 overflow-hidden relative min-h-[24px]">
                            <input
                                type="color"
                                onMouseDown={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                    editor.chain().focus().setColor(e.target.value).run();
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                title="لون مخصص"
                            />
                            <div className="w-full h-full text-[10px] text-white font-bold text-center z-0 drop-shadow-sm">مخصص</div>
                        </div>
                    </div>
                    <button onClick={() => { editor.chain().focus().unsetColor().run(); setActiveDropdown(null); onDropdownChange(false); }} className="text-[10px] text-slate-500 hover:text-red-500 font-medium text-right mt-1 underline">مسح اللون</button>
                </div>
            )
        },
        {
            icon: <Highlighter className="w-4 h-4" />,
            dropdown: true,
            title: 'تمييز النص',
            content: (
                <div className="flex flex-col gap-2 p-3 bg-white border border-slate-200 rounded-xl shadow-xl animate-scale-in min-w-[140px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">ألوان الهوية</span>
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setHighlightColor('var(--primary-color)')} className="w-9 h-9 rounded-lg border-2 border-slate-100 shadow-sm transition-transform hover:scale-110" style={{ backgroundColor: themeColor }} />
                        <button onClick={() => setHighlightColor('var(--secondary-color)')} className="w-9 h-9 rounded-lg border-2 border-slate-100 shadow-sm transition-transform hover:scale-110" style={{ backgroundColor: secondaryColor }} />
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div className="flex flex-col gap-1 items-stretch">
                        <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 overflow-hidden relative min-h-[24px]">
                            <input
                                type="color"
                                onMouseDown={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                    editor.chain().focus().setHighlight({ color: e.target.value }).run();
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full h-full text-[10px] text-white font-bold text-center z-0 drop-shadow-sm">مخصص</div>
                        </div>
                    </div>
                    <button onClick={() => { editor.chain().focus().unsetHighlight().run(); setActiveDropdown(null); onDropdownChange(false); }} className="text-[10px] text-slate-500 hover:text-red-500 font-medium text-right mt-1 underline">مسح التمييز</button>
                </div>
            )
        },
        { divider: true },
        { icon: <Heading1 className="w-4 h-4" />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: { heading: { level: 1 } }, title: 'عنوان رئيسي' },
        { icon: <Heading2 className="w-4 h-4" />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: { heading: { level: 2 } }, title: 'عنوان فرعي' },
        { icon: <Heading3 className="w-4 h-4" />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: { heading: { level: 3 } }, title: 'عنوان صغير' },
        { divider: true },
        { icon: <List className="w-4 h-4" />, action: () => editor.chain().focus().toggleBulletList().run(), active: 'bulletList', title: 'قائمة نقطية' },
        { icon: <ListOrdered className="w-4 h-4" />, action: () => editor.chain().focus().toggleOrderedList().run(), active: 'orderedList', title: 'قائمة رقمية' },
        {
            icon: <Columns className="w-4 h-4" />,
            dropdown: true,
            title: 'إعدادات القائمة',
            content: (() => {
                const listType = editor.isActive('bulletList') ? 'bulletList' : (editor.isActive('orderedList') ? 'orderedList' : null);
                const attrs = listType ? editor.getAttributes(listType) : {};
                const currentCols = attrs.columns;
                const currentGap = attrs.columnGap || '16px';
                const currentMarkerColor = attrs.markerColor;

                return (
                    <div className="flex flex-col gap-1 p-3 bg-white border border-slate-200 rounded-xl shadow-xl animate-scale-in min-w-[190px]" onMouseDown={(e) => e.stopPropagation()}>
                        {/* Marker Color Section */}
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right px-1 pb-1">لون الترقيم/النقطة</span>
                        <div className="flex gap-2 items-center justify-end mb-2">
                            <div className="flex gap-1">
                                <button onClick={() => updateMarkerColor('var(--primary-color)')} className="w-7 h-7 rounded-lg border border-slate-200" style={{ backgroundColor: themeColor }} />
                                <button onClick={() => updateMarkerColor('var(--secondary-color)')} className="w-7 h-7 rounded-lg border border-slate-200" style={{ backgroundColor: secondaryColor }} />
                            </div>
                            <div className="flex-1 flex items-center justify-center p-1 rounded-lg bg-gradient-to-r from-teal-400 to-emerald-400 overflow-hidden relative min-h-[28px] border border-slate-200/20 shadow-sm">
                                <input
                                    type="color"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onChange={(e) => updateMarkerColor(e.target.value)}
                                    value={currentMarkerColor || '#000000'}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex items-center gap-1 z-0">
                                    <Palette className="w-3 h-3 text-white" />
                                    <span className="text-[9px] text-white font-bold drop-shadow-sm">لون حر</span>
                                </div>
                            </div>
                            <button onClick={() => updateMarkerColor(null)} className="text-[9px] text-red-500 underline font-bold px-1">حذف</button>
                        </div>

                        <div className="h-px bg-slate-100 my-1" />

                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right px-1 pb-1">عدد الأعمدة</span>
                        <button
                            onClick={() => { updateListColumns(null); setActiveDropdown(null); onDropdownChange(false); }}
                            className={`text-xs px-3 py-2 rounded-lg text-right transition-colors font-bold ${!currentCols ? 'bg-primary text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'}`}
                        >عمود واحد (افتراضي)</button>
                        <button
                            onClick={() => { updateListColumns(2); }}
                            className={`text-xs px-3 py-2 rounded-lg text-right transition-colors font-bold ${currentCols === 2 ? 'bg-primary text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'}`}
                        >عمودين</button>
                        <button
                            onClick={() => { updateListColumns(3); }}
                            className={`text-xs px-3 py-2 rounded-lg text-right transition-colors font-bold ${currentCols === 3 ? 'bg-primary text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'}`}
                        >3 أعمدة</button>

                        <div className="h-px bg-slate-100 my-1" />

                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right px-1 pb-1">المسافة العمودية بين الصفوف</span>
                        <div className="flex gap-1 px-1 flex-wrap" dir="rtl">
                            <button
                                onClick={() => updateListGap('0px')}
                                className={`flex-1 min-w-[35px] text-[9px] py-1.5 rounded-md transition-all font-bold ${currentGap === '0px' ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                            >0px</button>
                            <button
                                onClick={() => updateListGap('4px')}
                                className={`flex-1 min-w-[35px] text-[9px] py-1.5 rounded-md transition-all font-bold ${currentGap === '4px' ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                            >4px</button>
                            <button
                                onClick={() => updateListGap('8px')}
                                className={`flex-1 min-w-[35px] text-[9px] py-1.5 rounded-md transition-all font-bold ${currentGap === '8px' ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                            >8px</button>
                            <button
                                onClick={() => updateListGap('16px')}
                                className={`flex-1 min-w-[35px] text-[9px] py-1.5 rounded-md transition-all font-bold ${currentGap === '16px' ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                            >16px</button>
                        </div>
                    </div>
                );
            })()
        },
        { divider: true },
        { icon: <AlignLeft className="w-4 h-4" />, action: () => editor.chain().focus().setTextAlign('left').run(), active: { textAlign: 'left' }, title: 'محاذاة لليسار' },
        { icon: <AlignCenter className="w-4 h-4" />, action: () => editor.chain().focus().setTextAlign('center').run(), active: { textAlign: 'center' }, title: 'محاذاة للوسط' },
        { icon: <AlignRight className="w-4 h-4" />, action: () => editor.chain().focus().setTextAlign('right').run(), active: { textAlign: 'right' }, title: 'محاذاة لليمين' },
        { divider: true },
        {
            icon: <Square className="w-4 h-4" />,
            dropdown: true,
            title: 'تنسيق الإطار والخلفية',
            content: (
                <div
                    className="flex flex-col gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-2xl animate-scale-in min-w-[220px]"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">نمط العرض</span>
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg" dir="rtl">
                            <button
                                onClick={() => updateBlockStyle({ width: null })}
                                className={`flex-1 text-[10px] py-1.5 rounded-md transition-all ${!editor.getAttributes('paragraph').width ? 'bg-white shadow-sm text-primary font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                            >كامل الصف</button>
                            <button
                                onClick={() => updateBlockStyle({ width: 'fit-content' })}
                                className={`flex-1 text-[10px] py-1.5 rounded-md transition-all ${editor.getAttributes('paragraph').width === 'fit-content' ? 'bg-white shadow-sm text-primary font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                            >على النص</button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">خصائص الإطار</span>
                        <div className="flex gap-2 items-center" dir="rtl">
                            <div className="flex-1 flex items-center justify-center p-1.5 rounded-lg bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 overflow-hidden relative min-h-[30px] border border-slate-200/20 shadow-sm">
                                <input
                                    type="color"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    value={editor.getAttributes('paragraph').border?.split(' ').pop() || (themeColor || '#3b82f6')}
                                    onChange={(e) => {
                                        const width = editor.getAttributes('paragraph').border?.split(' ')[0] || '2px';
                                        updateBlockStyle({ border: `${width} solid ${e.target.value}` });
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex items-center gap-1.5 z-0">
                                    <Palette className="w-3 h-3 text-white" />
                                    <span className="text-[10px] text-white font-bold drop-shadow-sm">لون الإطار</span>
                                </div>
                            </div>
                            <select
                                onChange={(e) => {
                                    const color = editor.getAttributes('paragraph').border?.split(' ').pop() || (themeColor || '#3b82f6');
                                    updateBlockStyle({ border: `${e.target.value}px solid ${color}` });
                                }}
                                value={parseInt(editor.getAttributes('paragraph').border?.split(' ')[0]) || 2}
                                className="w-24 text-[10px] px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-right font-bold"
                            >
                                <option value="1">1px نحيف</option>
                                <option value="2">2px عادي</option>
                                <option value="4">4px سميك</option>
                                <option value="8">8px عريض</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">لون خلفية الفقرة</span>
                        <div className="flex gap-2 items-center justify-end">
                            <div className="flex gap-1">
                                <button onClick={() => setBlockBgColor('var(--primary-color)')} className="w-7 h-7 rounded-lg border border-slate-200" style={{ backgroundColor: themeColor }} />
                                <button onClick={() => setBlockBgColor('var(--secondary-color)')} className="w-7 h-7 rounded-lg border border-slate-200" style={{ backgroundColor: secondaryColor }} />
                            </div>
                            <div className="flex-1 flex items-center justify-center p-1.5 rounded-lg bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 overflow-hidden relative min-h-[28px] border border-slate-200/20 shadow-sm">
                                <input
                                    type="color"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onChange={(e) => {
                                        editor.chain().focus()
                                            .updateAttributes('paragraph', { backgroundColor: e.target.value })
                                            .updateAttributes('heading', { backgroundColor: e.target.value })
                                            .run();
                                    }}
                                    value={editor.getAttributes('paragraph').backgroundColor || '#ffffff'}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex items-center gap-1.5 z-0">
                                    <Palette className="w-3 h-3 text-white" />
                                    <span className="text-[10px] text-white font-bold drop-shadow-sm">مخصص</span>
                                </div>
                            </div>
                            <button onClick={() => { updateBlockStyle({ backgroundColor: null }); }} className="text-[9px] text-red-500 underline font-bold px-1">مسح</button>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />
                    <button
                        onClick={toggleBorder}
                        className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${editor.getAttributes('paragraph').border ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-primary text-white hover:bg-primary/90'}`}
                    >
                        {editor.getAttributes('paragraph').border ? 'إزالة الإطار' : 'إضافة إطار افتراضي'}
                    </button>
                </div>
            )
        },
        {
            icon: <CornerUpLeft className="w-4 h-4" />,
            dropdown: true,
            title: 'تدوير الحواف',
            content: (
                <div className="flex flex-col gap-1 p-2 bg-white border border-slate-200 rounded-xl shadow-xl animate-scale-in min-w-[150px]">
                    <button onClick={() => { updateBlockStyle({ borderRadius: '0px' }); onDropdownChange(false); setActiveDropdown(null); }} className="text-xs px-4 py-2 hover:bg-slate-100 rounded-lg text-right transition-colors font-bold text-slate-700">زاوية حادة (0px)</button>
                    <button onClick={() => { updateBlockStyle({ borderRadius: '8px' }); onDropdownChange(false); setActiveDropdown(null); }} className="text-xs px-4 py-2 hover:bg-slate-100 rounded-lg text-right transition-colors font-bold text-slate-700">حواف ناعمة (8px)</button>
                    <button onClick={() => { updateBlockStyle({ borderRadius: '20px' }); onDropdownChange(false); setActiveDropdown(null); }} className="text-xs px-4 py-2 hover:bg-slate-100 rounded-lg text-right transition-colors font-bold text-slate-700">حواف دائرية (20px)</button>
                    <button onClick={() => { updateBlockStyle({ borderRadius: '9999px' }); onDropdownChange(false); setActiveDropdown(null); }} className="text-xs px-4 py-2 hover:bg-slate-100 rounded-lg text-right transition-colors font-bold text-slate-700">شكل كبسولة</button>
                </div>
            )
        },
        { divider: true },
        { icon: <LinkIcon className="w-4 h-4" />, action: addLink, active: 'link', title: 'إضافة رابط' },
        { icon: <Minus className="w-4 h-4" />, action: () => editor.chain().focus().setHorizontalRule().run(), title: 'خط فاصل' },
        { icon: <Quote className="w-4 h-4" />, action: () => editor.chain().focus().toggleBlockquote().run(), active: 'blockquote', title: 'اقتباس' },
        { icon: <Eraser className="w-4 h-4" />, action: () => { editor.chain().focus().clearNodes().unsetAllMarks().run(); updateBlockStyle({ border: null, borderRadius: null, width: null, backgroundColor: null }); }, title: 'مسح التنسيق' },
        { divider: true },
        { icon: <Undo className="w-4 h-4" />, action: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo(), title: 'تراجع' },
        { icon: <Redo className="w-4 h-4" />, action: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo(), title: 'إعادة' },
    ];

    if (!editor) return null;

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-2xl relative z-30">
            {buttons.map((btn, i) => (
                btn.divider ? (
                    <div key={i} className="w-px h-6 bg-slate-200 mx-1 self-center" />
                ) : btn.dropdown ? (
                    <div key={i} className="relative" ref={activeDropdown === i ? dropdownRef : null}>
                        <button
                            type="button"
                            onClick={() => handleDropdownToggle(i)}
                            className={`p-1.5 rounded-lg transition-all text-slate-600 hover:bg-slate-200 hover:text-slate-900 ${activeDropdown === i ? 'bg-slate-200' : ''}`}
                            title={btn.title}
                        >
                            {btn.icon}
                        </button>
                        {activeDropdown === i && (
                            <div className="absolute top-full left-0 mt-1 z-[200]">
                                {btn.content}
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        key={i}
                        type="button"
                        onClick={btn.action}
                        disabled={btn.disabled}
                        className={`p-1.5 rounded-lg transition-all ${btn.active && (typeof btn.active === 'string' ? editor.isActive(btn.active) : editor.isActive(btn.active))
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                            } ${btn.disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                        title={btn.title}
                    >
                        {btn.icon}
                    </button>
                )
            ))}
        </div>
    );
};

export default function RichTextEditor({ value, onChange, placeholder = 'ابدأ الكتابة...', dir = 'ltr' }: RichTextEditorProps) {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4, 5, 6] },
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-xl max-w-full h-auto shadow-md my-4',
                },
            }),
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            BlockStyle,
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            // Wrap the final value in a prose container for storage
            onChange(`<div class="prose prose-slate max-w-none">${html}</div>`);
        },
        editorProps: {
            attributes: {
                class: `prose prose-slate max-w-none focus:outline-none min-h-[150px] p-4 text-slate-700 leading-relaxed ${dir === 'rtl' ? 'rtl-content' : ''}`,
                dir: dir,
            },
        },
    });

    // Update editor content when value changes from outside (e.g. on edit)
    useEffect(() => {
        if (editor && value) {
            // Strip the prose wrapper if present before setting content to editor
            const wrapperStart = '<div class="prose prose-slate max-w-none">';
            const wrapperEnd = '</div>';

            let cleanValue = value;
            if (value.startsWith(wrapperStart) && value.endsWith(wrapperEnd)) {
                cleanValue = value.slice(wrapperStart.length, -wrapperEnd.length);
            }

            if (cleanValue !== editor.getHTML()) {
                editor.commands.setContent(cleanValue);
            }
        }
    }, [value, editor]);

    return (
        <div className={`w-full border border-slate-200 rounded-2xl transition-all bg-white relative overflow-visible ${isDropdownOpen ? 'z-50 shadow-xl ring-2 ring-primary/5' : 'z-0'}`}>
            <MenuBar editor={editor} onDropdownChange={setIsDropdownOpen} />
            <div className="relative overflow-visible z-10">
                <EditorContent editor={editor} />
            </div>
            <style jsx global>{`
                .tiptap p.is-editor-empty:first-child::before {
                    color: #adb5bd;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                .rtl-content {
                    direction: rtl;
                    text-align: right;
                }
                /* Tightening vertical spacing inside prose */
                .prose p {
                    margin-top: 0.35em !important;
                    margin-bottom: 0.35em !important;
                    line-height: 1.5 !important;
                }
                .prose ul, .prose ol {
                    margin-top: 0.5em !important;
                    margin-bottom: 0.5em !important;
                }
                .prose li p {
                    margin-top: 0 !important;
                    margin-bottom: 0 !important;
                }
                .prose li {
                    margin-top: 0.1em !important;
                    margin-bottom: 0.1em !important;
                }
                .prose hr {
                    margin-top: 1em !important;
                    margin-bottom: 1em !important;
                }
                .prose ul::marker, .prose ol::marker {
                    color: var(--marker-color, inherit) !important;
                    font-weight: bold;
                }
                /* Specific override for Tailwind Typography to ensure our marker color wins */
                .prose :where(ul, ol):not(:where([class~="not-prose"] *)) li::marker {
                    color: var(--marker-color, inherit) !important;
                }
                .tiptap [style*="width: fit-content"] {
                    display: table; /* Using table instead of inline-block to preserve block characteristics while fitting content */
                }
            `}</style>
        </div>
    );
}
