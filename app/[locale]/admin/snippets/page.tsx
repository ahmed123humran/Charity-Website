'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, PlusSquare, Edit2, Trash2, Tag, Layers } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Snippet {
    id: string;
    name: string;
    category: string;
    htmlContent: string;
    thumbnail: string | null;
}

export default function SnippetsManagement() {
    const t = useTranslations('Admin');
    const commonT = useTranslations('Common');
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Intro');
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        fetchSnippets();
    }, []);

    const fetchSnippets = async () => {
        try {
            const res = await fetch('/api/snippets');
            const data = await res.json();
            setSnippets(data);
        } catch (error) {
            console.error('Failed to fetch snippets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const apiUrl = isEditing ? `/api/snippets/${currentId}` : '/api/snippets';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, category, htmlContent }),
            });
            if (res.ok) {
                closeModal();
                fetchSnippets();
            }
        } catch (error) {
            console.error(`Failed to ${isEditing ? 'update' : 'create'} snippet:`, error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(commonT('confirmDelete'))) return;
        try {
            const res = await fetch(`/api/snippets/${id}`, { method: 'DELETE' });
            if (res.ok) fetchSnippets();
        } catch (error) {
            console.error('Failed to delete snippet:', error);
        }
    };

    const openEditModal = (snippet: Snippet) => {
        setName(snippet.name);
        setCategory(snippet.category);
        setHtmlContent(snippet.htmlContent);
        setCurrentId(snippet.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setName('');
        setCategory('Intro');
        setHtmlContent('');
        setCurrentId(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('snippets')}</h1>
                    <p className="text-slate-500 mt-1">{t('readymadeSections')}</p>
                </div>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    {t('newSnippet')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl h-48 animate-pulse shadow-sm border border-slate-200"></div>
                    ))
                ) : snippets.length === 0 ? (
                    <div className="col-span-full py-20 bg-white border border-dashed border-slate-300 rounded-3xl text-center">
                        <PlusSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">{t('noSnippets')}</h3>
                        <p className="text-slate-500">{t('snippetsDescription')}</p>
                    </div>
                ) : snippets.map((snippet) => (
                    <div key={snippet.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="aspect-video bg-slate-100 flex items-center justify-center p-6 border-b border-slate-100 relative overflow-hidden">
                            <div className="text-slate-400 text-xs scale-75 origin-top opacity-50 pointer-events-none select-none">
                                {snippet.htmlContent.substring(0, 100)}...
                            </div>
                            <div className="absolute top-3 right-3 rtl:left-3 rtl:right-auto">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-primary shadow-xs border border-primary/20">
                                    <Tag className="w-2.5 h-2.5" />
                                    {snippet.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-5 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-900">{snippet.name}</h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Layers className="w-3 h-3" />
                                    {t('htmlFragment')}
                                </p>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => openEditModal(snippet)}
                                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                                    title={commonT('edit')}
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(snippet.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    title={commonT('delete')}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">
                                {isEditing ? t('editSnippet') : t('createSnippet')}
                            </h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('snippetName')}</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-start"
                                        placeholder="e.g. Hero Section"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('category')}</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-start"
                                    >
                                        <option value="Intro">Intro</option>
                                        <option value="Content">Content</option>
                                        <option value="Features">Features</option>
                                        <option value="Contact">Contact</option>
                                        <option value="Footer">Footer</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('htmlContent')}</label>
                                <textarea
                                    value={htmlContent}
                                    onChange={(e) => setHtmlContent(e.target.value)}
                                    required
                                    rows={8}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 font-mono text-sm bg-slate-50 text-start"
                                    placeholder="<section>...</section>"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                                >
                                    {commonT('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                                >
                                    {isEditing ? commonT('saveChanges') : commonT('create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
