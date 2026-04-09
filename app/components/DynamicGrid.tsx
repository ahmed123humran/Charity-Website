'use client';

import React, { useEffect, useState } from 'react';
import { sanitizeHtml } from '@/app/utils/sanitize';
import { useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import { useAppDispatch } from '@/app/store/hooks';
import { openModal, closeModal } from '@/app/store/slices/dynamicModalSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DynamicGrid({
    snippet,
    dynamicId,
    singleRecordOnly = false,
    isPreview = false
}: {
    snippet: any;
    dynamicId?: string | null;
    singleRecordOnly?: boolean;
    isPreview?: boolean;
}) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const locale = useLocale();

    const config = snippet.swiperConfig || {};
    const itemsPerPage = config.itemsPerPage || 6;
    const paginationStyle = config.paginationStyle || 'numbers-rounded';

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayCount, setDisplayCount] = useState(itemsPerPage);

    const {
        apiEndpoint,
        htmlContent,
        swiperConfig,
        fieldMapping,
        type,
        categoryId
    } = snippet;

    const isInternal = (type === 'DYNAMIC' || type === 'DYNAMIC_GRID') && (!apiEndpoint || apiEndpoint === '') && categoryId;

    useEffect(() => {
        setDisplayCount(itemsPerPage);
    }, [itemsPerPage]);

    useEffect(() => {
        let effectiveEndpoint = isInternal
            ? `/api/dynamic-content?categoryId=${categoryId}`
            : apiEndpoint;

        if (dynamicId && isInternal && swiperConfig?.isDetailView) {
            effectiveEndpoint = `/api/dynamic-content/${dynamicId}`;
        }

        if (!effectiveEndpoint) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const res = await fetch(effectiveEndpoint);
                if (!res.ok) throw new Error('Failed to fetch data');
                const json = await res.json();

                let items = [];
                if (Array.isArray(json)) {
                    items = json;
                } else if (json && typeof json === 'object') {
                    if (Array.isArray(json.data)) items = json.data;
                    else if (Array.isArray(json.results)) items = json.results;
                    else if (Array.isArray(json.items)) items = json.items;
                    else items = [json];
                }

                if (dynamicId && !swiperConfig?.isDetailView) {
                    items = items.filter((item: any) => item.id !== dynamicId);
                }

                setData(items);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiEndpoint, type, categoryId, dynamicId, swiperConfig?.isDetailView]);

    const columns = {
        desktop: config.slidesPerViewDesktop || 3,
        tablet: config.slidesPerViewTablet || 2,
        mobile: config.slidesPerViewMobile || 1,
    };

    const isFullWidth = snippet.containerType === 'full';
    const sectionPaddingClass = isFullWidth ? 'py-0' : (config.py === '0' ? 'py-0' : 'py-20');

    if (loading) {
        if (!isPreview && swiperConfig?.isDetailView && !dynamicId) return null;
        const isDetail = ((isPreview || dynamicId) && swiperConfig?.isDetailView);
        return (
            <section className={isFullWidth ? 'py-0' : 'py-20'}>
                <div className={isFullWidth ? 'w-full' : 'container mx-auto px-4'}>
                    <div className={isDetail ? 'w-full max-w-4xl mx-auto' : `grid grid-cols-1 md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop} gap-8`}>
                        {(isDetail ? [1] : Array.from({ length: itemsPerPage }).map((_, i) => i + 1)).map(i => (
                            <div key={i} className={`bg-white dark:bg-slate-800 ${isDetail ? 'rounded-none h-[500px]' : 'rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-80'} animate-pulse`}>
                                <div className={isDetail ? 'w-full h-full bg-slate-200 dark:bg-slate-700' : 'w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-6'}></div>
                                {!isDetail && (
                                    <>
                                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4 mb-4"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
                                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-5/6"></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) return <div className="py-20 text-center text-red-400">Error: {error}</div>;
    if (!loading && (data.length === 0 || (!singleRecordOnly && !isPreview && swiperConfig?.isDetailView && !dynamicId))) {
        return null;
    }

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = singleRecordOnly || swiperConfig?.isDetailView
        ? [data[0]]
        : (paginationStyle === 'load-more'
            ? data.slice(0, displayCount)
            : data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

    const renderSlide = (item: any, index: number = 0) => {
        if (!item) return null;
        let content = htmlContent;

        if (isInternal) {
            const title = (locale === 'ar' && item.titleAr) ? item.titleAr : item.title;
            const description = (locale === 'ar' && item.descriptionAr) ? item.descriptionAr : item.description;
            const image = item.image || '';
            const publishDate = item.publishDate ? new Date(item.publishDate).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

            content = content.split('{{title}}').join(String(title || ''));
            content = content.split('{{description}}').join(String(description || ''));
            content = content.split('{{image}}').join(String(image || ''));
            content = content.split('{{publishDate}}').join(String(publishDate || ''));

            let linkUrl = String(item.linkUrl || '#');
            if (config.linkType === 'modal') {
                linkUrl = `#modal-${item.id}`;
                content = content.replace(/href=['"][^'"]*\{\{link\}\}[^'"]*['"]/g, `href="${linkUrl}"`);
            } else if (linkUrl !== '#' && !linkUrl.startsWith('http') && !linkUrl.startsWith('/')) {
                linkUrl = '/' + linkUrl;
            }
            content = content.split('{{link}}').join(linkUrl);

            const tag = (locale === 'ar' && item.tagAr) ? item.tagAr : (item.tag || '');
            content = content.split('{{tag}}').join(String(tag));
            const linkText = (locale === 'ar' && item.linkTextAr) ? item.linkTextAr : (item.linkText || (locale === 'ar' ? 'اقرأ المزيد' : 'Read More'));
            content = content.split('{{linkText}}').join(String(linkText));
            content = content.split('{{icon}}').join(String(item.icon || ''));
            content = content.split('{{id}}').join(String(item.id || ''));
            const htmlContentVal = (locale === 'ar' && item.htmlContentAr) ? item.htmlContentAr : (item.htmlContent || '');
            content = content.split('{{htmlContent}}').join(String(htmlContentVal));
        } else if (fieldMapping && Array.isArray(fieldMapping)) {
            fieldMapping.forEach(mapping => {
                const placeholder = `{{${mapping.placeholder}}}`;
                const value = item[mapping.apiField] || '';
                content = content.split(placeholder).join(String(value));
            });
        }

        // Alternating features (Colors & Layout) - Applied AFTER variable injection
        if (index % 2 === 1) {
            if (config.useAlternatingColors) {
                content = content
                    .split('primary').join('TMP_SWAP')
                    .split('secondary').join('primary')
                    .split('TMP_SWAP').join('secondary');
            }
            if (config.useAlternatingLayout) {
                content = content.replace(/\b([\w:]+)?flex-row(-reverse)?\b/g, (match, prefix, suffix) => {
                    const p = prefix || '';
                    return suffix ? `${p}flex-row` : `${p}flex-row-reverse`;
                });
            }
        }

        const handleClick = (e: React.MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            if (link && link.href && link.href.startsWith(window.location.origin)) {
                e.preventDefault();
                let path = link.href.replace(window.location.origin, '');

                if (path.includes('#modal-')) {
                    const id = path.split('#modal-')[1];
                    if (id) {
                        dispatch(openModal({ dynamicId: id, snippet: snippet }));
                        return;
                    }
                }

                const localesList = ['ar', 'en'];
                for (const loc of localesList) {
                    if (path.startsWith(`/${loc}/`)) {
                        path = path.replace(`/${loc}`, '');
                        break;
                    } else if (path === `/${loc}`) {
                        path = '/';
                        break;
                    }
                }

                dispatch(closeModal());
                router.push(path as any);
            }
        };

        return (
            <div
                key={item.id}
                onClick={handleClick}
                className={`prose prose-slate max-w-none ${locale === 'ar' ? 'rtl-content' : ''}`}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
            />
        );
    };

    if (singleRecordOnly || ((isPreview || dynamicId) && swiperConfig?.isDetailView)) {
        return (
            <section className={`${sectionPaddingClass} transition-all duration-500`}>
                <div className={isFullWidth ? 'w-full' : 'container mx-auto px-4'}>
                    {renderSlide(data[0], 0)}
                </div>
            </section>
        );
    }

    const renderPagination = () => {
        if (totalPages <= 1 || config.showPagination === false) return null;

        if (paginationStyle === 'load-more') {
            if (displayCount >= data.length) return null;
            return (
                <div className="mt-16 flex justify-center">
                    <button
                        onClick={() => setDisplayCount(prev => prev + itemsPerPage)}
                        className="px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                        {locale === 'ar' ? 'تحميل المزيد' : 'Load More'}
                    </button>
                </div>
            );
        }

        const getButtonStyle = (pageIndex: number) => {
            const isActive = currentPage === pageIndex + 1;
            const base = "w-11 h-11 font-bold transition-all cursor-pointer flex items-center justify-center ";

            switch (paginationStyle) {
                case 'numbers-circle':
                    return base + `rounded-full ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-slate-200 text-slate-500 hover:border-primary hover:text-primary'}`;
                case 'numbers-square':
                    return base + `rounded-none ${isActive ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-primary hover:text-primary'}`;
                case 'numbers-outline':
                    return base + `rounded-xl border-2 ${isActive ? 'border-primary text-primary bg-primary/5' : 'border-slate-100 text-slate-400 hover:border-primary hover:text-primary bg-white'}`;
                case 'numbers-rounded':
                default:
                    return base + `rounded-2xl ${isActive ? 'bg-primary text-white shadow-xl shadow-primary/25' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary shadow-sm hover:shadow-md'}`;
            }
        };

        const getNavStyle = (disabled: boolean) => {
            const base = "p-3 transition-all cursor-pointer ";
            switch (paginationStyle) {
                case 'numbers-circle': return base + "rounded-full bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary disabled:opacity-30";
                case 'numbers-square': return base + "rounded-none bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary disabled:opacity-30";
                case 'numbers-outline': return base + "rounded-xl border-2 border-slate-100 text-slate-300 hover:border-primary hover:text-primary disabled:opacity-20";
                default: return base + "rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary shadow-sm disabled:opacity-40";
            }
        };

        const alignment = config.paginationAlign || 'center';
        const justifyClass = alignment === 'start' ? 'justify-start' : alignment === 'end' ? 'justify-end' : 'justify-center';

        return (
            <div className={`mt-16 flex items-center gap-3 ${justifyClass}`}>
                <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={getNavStyle(currentPage === 1)}
                >
                    {locale === 'ar' ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
                </button>

                <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={getButtonStyle(i)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={getNavStyle(currentPage === totalPages)}
                >
                    {locale === 'ar' ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
                </button>
            </div>
        );
    };

    return (
        <section className={`${sectionPaddingClass} transition-all duration-500`}>
            <div className={isFullWidth ? 'w-full' : 'container mx-auto px-4'}>
                <div
                    className={`grid gap-${config.spaceBetween ?? '8'} grid-cols-1 md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`}
                    style={{
                        gap: `${config.spaceBetween ?? 30}px`
                    }}
                >
                    {paginatedData.map((item, idx) => renderSlide(item, idx))}
                </div>

                {renderPagination()}
            </div>
        </section>
    );
}
