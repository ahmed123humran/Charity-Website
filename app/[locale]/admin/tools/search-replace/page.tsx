'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Replace, FileText, PlusSquare, AlertTriangle, CheckCircle2, Loader2, RefreshCw, Menu as MenuIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import SearchReplaceTour from '@/app/components/SearchReplaceTour';

export default function SearchReplaceTool() {
    const t = useTranslations('Admin');
    const commonT = useTranslations('Common');

    const [searchText, setSearchText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [targetType, setTargetType] = useState<'all' | 'pages' | 'snippets' | 'menus'>('all');
    const [isSearching, setIsSearching] = useState(false);
    const [isReplacing, setIsReplacing] = useState(false);
    const [results, setResults] = useState<{ type: string; id: string; name: string; found: number }[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSearch = async () => {
        if (!searchText.trim()) {
            toast.error(t('enterSearchText'));
            return;
        }

        setIsSearching(true);
        setResults([]);
        try {
            const res = await fetch('/api/admin/content/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ searchText, targetType })
            });

            if (res.ok) {
                const data = await res.json();
                setResults(data.results);
                if (data.results.length === 0) {
                    toast(t('noMatchesFound'), { icon: '🔍' });
                }
            } else {
                toast.error(commonT('error'));
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error(commonT('error'));
        } finally {
            setIsSearching(false);
        }
    };

    const handleReplace = async () => {
        setIsReplacing(true);
        try {
            const res = await fetch('/api/admin/content/replace', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ searchText, replaceText, targetType })
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(t('replaceSuccess', { count: data.count }));
                setResults([]);
                setShowConfirm(false);
                setSearchText('');
                setReplaceText('');
            } else {
                toast.error(commonT('error'));
            }
        } catch (error) {
            console.error('Replace error:', error);
            toast.error(commonT('error'));
        } finally {
            setIsReplacing(false);
        }
    };

    const totalMatches = results.reduce((acc, curr) => acc + curr.found, 0);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <SearchReplaceTour />
            <div id="search-replace-form" className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm">
                        <RefreshCw className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('searchReplace')}</h1>
                        <p className="text-slate-500 font-medium mt-1">{t('searchReplaceDesc')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">{t('findText')}</label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-800 placeholder:text-slate-400 text-start"
                                placeholder={t('findPlaceholder')}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">{t('replaceWith')}</label>
                        <div className="relative group">
                            <Replace className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                value={replaceText}
                                onChange={(e) => setReplaceText(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-800 placeholder:text-slate-400 text-start"
                                placeholder={t('replacePlaceholder')}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                        {['all', 'pages', 'snippets', 'menus'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setTargetType(type as any)}
                                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${targetType === type ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {t(type)}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSearch}
                            disabled={isSearching || !searchText}
                            className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all disabled:opacity-50"
                        >
                            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            {t('previewMatches')}
                        </button>
                        <button
                            onClick={() => setShowConfirm(true)}
                            disabled={results.length === 0 || !searchText}
                            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50 group"
                        >
                            <Replace className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            {t('replaceAll')}
                        </button>
                    </div>
                </div>
            </div>

            {results.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="px-8 py-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <div>
                            <h2 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                                {t('matchesFound')}
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-0.5 rounded-full text-xs font-black">{totalMatches}</span>
                            </h2>
                        </div>
                        <div className="text-sm font-medium text-slate-500">{t('acrossItems', { count: results.length })}</div>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                        {results.map((res, i) => (
                            <div key={i} className="px-8 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl ${res.type === 'page' ? 'bg-purple-100 text-purple-600' : res.type === 'snippet' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {res.type === 'page' ? <FileText className="w-5 h-5" /> : res.type === 'snippet' ? <PlusSquare className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{res.name}</div>
                                        <div className="text-xs font-bold text-slate-400 tracking-widest uppercase">{t(res.type)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full font-black text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                                    {t('countMatches', { count: res.found })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showConfirm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] max-w-lg w-full p-10 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 scale-110 shadow-inner">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 text-center mb-3">{t('bulkActionRequired')}</h2>
                        <p className="text-slate-500 text-center font-medium leading-relaxed">
                            {t('bulkReplaceConfirm', { search: searchText, replace: replaceText, items: results.length, total: totalMatches })}
                        </p>
                        <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t('notice')}</div>
                            <p className="text-xs text-slate-500 font-medium">{t('bulkReplaceNotice')}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="w-full py-4 text-slate-600 font-black rounded-2xl border-2 border-slate-100 hover:bg-slate-50 transition-all uppercase tracking-widest text-sm"
                            >
                                {commonT('back')}
                            </button>
                            <button
                                onClick={handleReplace}
                                disabled={isReplacing}
                                className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all uppercase tracking-widest text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isReplacing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                {commonT('confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
