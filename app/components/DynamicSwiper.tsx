'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade, EffectCube, EffectCoverflow, EffectFlip, EffectCards } from 'swiper/modules';
import { sanitizeHtml } from '@/app/utils/sanitize';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-cards';
import { useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, MoveLeft, MoveRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DynamicSwiperProps {
    snippet: {
        id: string;
        htmlContent: string;
        apiEndpoint?: string | null;
        swiperConfig?: any | null;
        fieldMapping?: any | null;
        type?: 'STATIC' | 'DYNAMIC';
        categoryId?: string | null;
        containerType?: string | null;
    };
    dynamicId?: string | null;
    singleRecordOnly?: boolean;
}

export default function DynamicSwiper({
    snippet,
    dynamicId,
    singleRecordOnly = false
}: {
    snippet: any;
    dynamicId?: string | null;
    singleRecordOnly?: boolean;
}) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const {
        apiEndpoint,
        htmlContent,
        swiperConfig,
        fieldMapping,
        type,
        categoryId
    } = snippet;

    const locale = useLocale();
    const isInternal = type === 'DYNAMIC' && (!apiEndpoint || apiEndpoint === '') && categoryId;

    useEffect(() => {
        let effectiveEndpoint = isInternal
            ? `/api/dynamic-content?categoryId=${categoryId}`
            : apiEndpoint;

        // Only use the dynamic ID if the snippet is specifically configured as a "Detail View"
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
                    // Handle wrapped results from common API patterns
                    if (Array.isArray(json.data)) items = json.data;
                    else if (Array.isArray(json.results)) items = json.results;
                    else if (Array.isArray(json.items)) items = json.items;
                    // Otherwise, if it's a single object (like our ID fetch), wrap it
                    else items = [json];
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

    const config = swiperConfig || {};
    const sliedesPerView = {
        desktop: config.slidesPerViewDesktop || 3,
        tablet: config.slidesPerViewTablet || 2,
        mobile: config.slidesPerViewMobile || 1,
    };

    const isFullWidth = snippet.containerType === 'full';
    const sectionPadding = config.py ?? (isFullWidth ? '0' : '20');
    const paginationPos = config.paginationPosition ?? (isFullWidth ? 'inside' : 'outside');
    const navPos = config.navPosition ?? (isFullWidth ? 'inside' : 'outside');
    const maxSlides = Math.max(sliedesPerView.desktop, sliedesPerView.tablet, sliedesPerView.mobile);
    const effectiveLoop = (data.length > maxSlides) ? (config.loop ?? true) : false;
    const sectionPaddingClass = isFullWidth ? 'py-0' : (sectionPadding === '0' ? 'py-0' : 'py-20');

    if (loading) {
        const isDetail = (dynamicId && swiperConfig?.isDetailView);
        return (
            <section className={isFullWidth ? 'py-0' : 'py-20'}>
                <div className={isFullWidth ? 'w-full' : 'container mx-auto px-4'}>
                    <div className={isDetail ? 'w-full max-w-4xl mx-auto' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}>
                        {(isDetail ? [1] : [1, 2, 3]).map(i => (
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
    if (data.length === 0) return null;

    const renderSlide = (item: any) => {
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
            if (linkUrl !== '#' && !linkUrl.startsWith('http') && !linkUrl.startsWith('/')) {
                linkUrl = '/' + linkUrl;
            }
            content = content.split('{{link}}').join(linkUrl);
            const tag = (locale === 'ar' && item.tagAr) ? item.tagAr : (item.tag || '');
            content = content.split('{{tag}}').join(String(tag));
            const linkText = (locale === 'ar' && item.linkTextAr) ? item.linkTextAr : (item.linkText || (locale === 'ar' ? 'اقرأ المزيد' : 'Read More'));
            content = content.split('{{linkText}}').join(String(linkText));
            content = content.split('{{icon}}').join(String(item.icon || ''));
            content = content.split('{{id}}').join(String(item.id || ''));
        } else if (fieldMapping && Array.isArray(fieldMapping)) {
            fieldMapping.forEach(mapping => {
                const placeholder = `{{${mapping.placeholder}}}`;
                const value = item[mapping.apiField] || '';
                // Use a more robust way to replace all occurrences without regex escaping issues
                content = content.split(placeholder).join(String(value));
            });
        }
        // Handle interal navigation for <a> tags to prevent full page reloads
        const handleClick = (e: React.MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            if (link && link.href && link.href.startsWith(window.location.origin)) {
                e.preventDefault();
                let path = link.href.replace(window.location.origin, '');

                // CRITICAL: Strip locale prefix (e.g. /ar or /en) if standard localized router is used
                // as router.push from next-intl automatically adds the current locale.
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

                router.push(path as any);
            }
        };

        return <div onClick={handleClick} dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />;
    };

    const NavIcon = ({ type, side }: { type: string, side: 'left' | 'right' }) => {
        const isRtl = locale === 'ar';
        const effectiveSide = isRtl ? (side === 'left' ? 'right' : 'left') : side;

        if (type === 'arrow') return effectiveSide === 'left' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />;
        if (type === 'move') return effectiveSide === 'left' ? <MoveLeft size={20} /> : <MoveRight size={20} />;
        if (type === 'double') return effectiveSide === 'left' ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />;
        return effectiveSide === 'left' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />;
    };

    if (singleRecordOnly || (dynamicId && swiperConfig?.isDetailView)) {
        return (
            <section className={`${sectionPaddingClass} transition-all duration-500`}>
                <div className={isFullWidth ? 'w-full' : 'container mx-auto px-4'}>
                    {renderSlide(data[0])}
                </div>
            </section>
        );
    }

    return (
        <section className={`${sectionPaddingClass} overflow-hidden transition-all duration-500`}>
            <div className={isFullWidth ? 'w-full' : 'container mx-auto px-4'}>
                <div
                    className={`relative ${navPos === 'outside' ? 'md:px-16' : ''} ${paginationPos === 'outside' ? 'pb-14' : ''} nav-${config.navStyle || 'default'}`}
                    style={{
                        ['--nav-offset' as any]: `${config.navOffset ?? (isFullWidth ? 30 : 10)}px`,
                        ['--pagination-offset' as any]: `${config.paginationOffset ?? (isFullWidth && paginationPos === 'inside' ? 40 : 20)}px`
                    }}
                >
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay, EffectFade, EffectCube, EffectCoverflow, EffectFlip, EffectCards]}
                        effect={config.effect || 'slide'}
                        spaceBetween={config.spaceBetween ?? 20}
                        slidesPerView={sliedesPerView.mobile}
                        breakpoints={{
                            640: { slidesPerView: sliedesPerView.tablet },
                            1024: { slidesPerView: sliedesPerView.desktop },
                        }}
                        speed={config.speed || 500}
                        loop={effectiveLoop}
                        autoplay={config.autoplay ? {
                            delay: config.autoplayDelay || 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: config.pauseOnHover ?? true
                        } : false}
                        navigation={{
                            nextEl: `.swiper-button-next-${snippet.id}`,
                            prevEl: `.swiper-button-prev-${snippet.id}`,
                        }}
                        pagination={config.showPagination !== false ? {
                            clickable: true,
                            type: config.paginationType || 'bullets',
                            el: `.swiper-pagination-${snippet.id}`
                        } : false}
                        className="mySwiper !static !pb-6"
                    >
                        {data.map((item, index) => (
                            <SwiperSlide key={index}>
                                {renderSlide(item)}
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {config.showNavigation !== false && (
                        <>
                            <div className={`swiper-button-prev swiper-button-prev-${snippet.id} !absolute !z-10 flex items-center justify-center transition-all`}>
                                <NavIcon type={config.navIcon} side="left" />
                            </div>
                            <div className={`swiper-button-next swiper-button-next-${snippet.id} !absolute !z-10 flex items-center justify-center transition-all`}>
                                <NavIcon type={config.navIcon} side="right" />
                            </div>
                        </>
                    )}

                    {config.showPagination !== false && (
                        <div className={`swiper-pagination swiper-pagination-${snippet.id} !absolute !z-10`}></div>
                    )}

                    <style jsx global>{`
                    .nav-${config.navStyle || 'default'} {
                        --p-offset: var(--pagination-offset);
                        --n-offset: var(--nav-offset);
                    }
                    
                    /* Navigation Positions */
                    .swiper-button-next, .swiper-button-prev {
                        top: 50% !important;
                        transform: translateY(-50%) !important;
                        margin: 0 !important;
                        background-image: none !important;
                    }
                    .swiper-button-next:after, .swiper-button-prev:after {
                        display: none !important;
                    }
                    
                    .swiper-button-prev { 
                        left: ${navPos === 'outside' ? 'calc(-1 * var(--n-offset))' : 'var(--n-offset)'} !important;
                    }
                    .swiper-button-next { 
                        right: ${navPos === 'outside' ? 'calc(-1 * var(--n-offset))' : 'var(--n-offset)'} !important;
                    }

                    [dir='rtl'] .swiper-button-prev {
                        left: auto !important;
                        right: ${navPos === 'outside' ? 'calc(-1 * var(--n-offset))' : 'var(--n-offset)'} !important;
                    }
                    [dir='rtl'] .swiper-button-next {
                        right: auto !important;
                        left: ${navPos === 'outside' ? 'calc(-1 * var(--n-offset))' : 'var(--n-offset)'} !important;
                    }

                    .swiper-pagination {
                        bottom: var(--p-offset) !important;
                        left: 50% !important;
                        transform: translateX(-50%) !important;
                        width: auto !important;
                        z-index: 20 !important;
                    }

                    /* Navigation Styles */
                    .swiper-button-next, .swiper-button-prev {
                        transition: all 0.3s ease !important;
                        color: var(--primary-color) !important;
                    }

                    /* Default Style */
                    .nav-default .swiper-button-next, .nav-default .swiper-button-prev {
                        background: white !important;
                        width: 44px !important;
                        height: 44px !important;
                        border-radius: 12px !important;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
                    }

                    /* Minimal Style */
                    .nav-minimal .swiper-button-next, .nav-minimal .swiper-button-prev {
                        background: transparent !important;
                    }

                    /* Rounded Style */
                    .nav-rounded .swiper-button-next, .nav-rounded .swiper-button-prev {
                        background: white !important;
                        width: 50px !important;
                        height: 50px !important;
                        border-radius: 99px !important;
                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
                    }

                    /* Glass Style */
                    .nav-glass .swiper-button-next, .nav-glass .swiper-button-prev {
                        background: rgba(255, 255, 255, 0.2) !important;
                        backdrop-filter: blur(8px) !important;
                        width: 44px !important;
                        height: 44px !important;
                        border-radius: 12px !important;
                        border: 1px solid rgba(255, 255, 255, 0.3) !important;
                    }

                    /* Filled Style */
                    .nav-filled .swiper-button-next, .nav-filled .swiper-button-prev {
                        background: var(--primary-color) !important;
                        color: white !important;
                        width: 44px !important;
                        height: 44px !important;
                        border-radius: 12px !important;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
                    }

                    /* Outline Style */
                    .nav-outline .swiper-button-next, .nav-outline .swiper-button-prev {
                        background: white !important;
                        border: 2px solid var(--primary-color) !important;
                        color: var(--primary-color) !important;
                        width: 44px !important;
                        height: 44px !important;
                        border-radius: 12px !important;
                    }

                    /* Soft Style */
                    .nav-soft .swiper-button-next, .nav-soft .swiper-button-prev {
                        background: #eff6ff !important;
                        color: var(--primary-color) !important;
                        width: 44px !important;
                        height: 44px !important;
                        border-radius: 12px !important;
                    }

                    .swiper-button-next:after, .swiper-button-prev:after {
                        display: none !important;
                        background-image: none !important;
                    }
                    
                    .swiper-button-next:hover, .swiper-button-prev:hover {
                        transform: translateY(-50%) scale(1.1) !important;
                        ${config.navStyle === 'filled' ? 'filter: brightness(1.1) !important;' : 'background-color: var(--primary-color) !important; color: white !important;'}
                    }
                    
                    /* Pagination Styles */
                    .swiper-pagination-bullet {
                        background: var(--primary-color) !important;
                        opacity: 0.2 !important;
                        transition: all 0.3s ease !important;
                        width: 10px !important;
                        height: 10px !important;
                    }
                    .swiper-pagination-bullet-active {
                        background: var(--primary-color) !important;
                        opacity: 1 !important;
                        width: 28px !important;
                        border-radius: 5px !important;
                    }
                    .swiper-pagination-fraction {
                        color: var(--primary-color) !important;
                        font-weight: 800 !important;
                        font-size: 14px !important;
                        background: white !important;
                        padding: 6px 16px !important;
                        border-radius: 12px !important;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) !important;
                        display: inline-block !important;
                        width: auto !important;
                        left: 50% !important;
                        transform: translateX(-50%) !important;
                        border: 1px solid rgba(0,0,0,0.05) !important;
                        bottom: ${paginationPos === 'outside' ? 'calc(-1 * var(--p-offset) - 10px)' : 'var(--p-offset)'} !important;
                    }
                    .swiper-pagination-progressbar {
                        background: color-mix(in srgb, var(--primary-color), transparent 90%) !important;
                        height: 4px !important;
                        border-radius: 99px !important;
                        top: auto !important;
                        bottom: ${paginationPos === 'outside' ? 'calc(-1 * var(--p-offset))' : 'var(--p-offset)'} !important;
                    }
                    .swiper-pagination-progressbar-fill {
                        background: var(--primary-color) !important;
                        border-radius: 99px !important;
                    }
                    `}</style>
                </div>
            </div>
        </section>
    );
}
