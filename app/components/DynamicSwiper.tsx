'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { sanitizeHtml } from '@/app/utils/sanitize';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useLocale } from 'next-intl';

interface Props {
    snippet: {
        id: string;
        htmlContent: string;
        apiEndpoint?: string | null;
        swiperConfig?: any | null;
        fieldMapping?: any | null;
        type?: 'STATIC' | 'DYNAMIC';
        categoryId?: string | null;
    };
}

export default function DynamicSwiper({ snippet, singleRecordOnly = false }: { snippet: any, singleRecordOnly?: boolean }) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        apiEndpoint,
        htmlContent,
        swiperConfig,
        fieldMapping,
        type,
        categoryId
    } = snippet;

    const locale = useLocale();

    const isInternal = type === 'DYNAMIC' && !apiEndpoint && categoryId;

    useEffect(() => {
        const effectiveEndpoint = isInternal
            ? `/api/dynamic-content?categoryId=${categoryId}`
            : apiEndpoint;

        if (!effectiveEndpoint) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const res = await fetch(effectiveEndpoint);
                if (!res.ok) throw new Error('Failed to fetch data');
                const json = await res.json();

                // Try to find the array in the response
                let items = Array.isArray(json) ? json : (json.results || json.items || json.data || []);
                if (!Array.isArray(items) && typeof json === 'object') items = [json];

                setData(items);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiEndpoint, type, categoryId]);

    if (loading) return <div className="py-10 text-center text-slate-400">Loading dynamic content...</div>;
    if (error) return <div className="py-10 text-center text-red-400">Error: {error}</div>;
    if (data.length === 0) return null;

    const renderSlide = (item: any) => {
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
        } else if (fieldMapping && Array.isArray(fieldMapping)) {
            fieldMapping.forEach(mapping => {
                const placeholder = `{{${mapping.placeholder}}}`;
                const value = item[mapping.apiField] || '';
                // Use a more robust way to replace all occurrences without regex escaping issues
                content = content.split(placeholder).join(String(value));
            });
        }
        return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />;
    };

    const config = swiperConfig || {};
    const sliedesPerView = {
        desktop: config.slidesPerViewDesktop || 3,
        tablet: config.slidesPerViewTablet || 2,
        mobile: config.slidesPerViewMobile || 1,
    };

    if (singleRecordOnly) {
        return (
            <div className="w-full h-full p-4">
                {renderSlide(data[0])}
            </div>
        );
    }

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={config.spaceBetween ?? 20}
                    slidesPerView={sliedesPerView.mobile}
                    breakpoints={{
                        640: { slidesPerView: sliedesPerView.tablet },
                        1024: { slidesPerView: sliedesPerView.desktop },
                    }}
                    speed={config.speed || 500}
                    loop={config.loop !== false}
                    autoplay={config.autoplay ? { delay: 3000, disableOnInteraction: false } : false}
                    navigation={config.showNavigation !== false}
                    pagination={config.showPagination !== false ? {
                        clickable: true,
                        type: config.paginationType || 'bullets'
                    } : false}
                    className="mySwiper !pb-12"
                >
                    {data.map((item, index) => (
                        <SwiperSlide key={index}>
                            {renderSlide(item)}
                        </SwiperSlide>
                    ))}
                </Swiper>

                <style jsx global>{`
                .swiper-button-next, .swiper-button-prev {
                    background: white;
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    color: var(--primary-color);
                }
                .swiper-button-next:after, .swiper-button-prev:after {
                    font-size: 18px !important;
                    font-weight: bold;
                }
                .swiper-button-next:hover, .swiper-button-prev:hover {
                    background-color: var(--primary-color);
                    color: white;
                    transform: scale(1.05);
                }
                /* Adjust for Swiper default positioning if needed */
                .swiper-button-next { right: 10px; }
                .swiper-button-prev { left: 10px; }
                
                [dir='rtl'] .swiper-button-next { 
                    right: auto;
                    left: 10px;
                }
                [dir='rtl'] .swiper-button-prev {
                    left: auto;
                    right: 10px;
                }
                [dir='rtl'] .swiper-button-next:hover, [dir='rtl'] .swiper-button-prev:hover {
                    transform: scale(1.05);
                }

                    .swiper-pagination-bullet {
                        background: var(--primary-color);
                        opacity: 0.2;
                        transition: all 0.3s ease;
                        width: 10px;
                        height: 10px;
                    }
                    .swiper-pagination-bullet-active {
                        background: var(--primary-color);
                        opacity: 1;
                        width: 28px;
                        border-radius: 5px;
                    }
                    .swiper-pagination-fraction {
                        color: var(--primary-color);
                        font-weight: 800;
                        font-size: 14px;
                        background: white;
                        padding: 6px 16px;
                        border-radius: 12px;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                        display: inline-block;
                        width: auto !important;
                        left: 50% !important;
                        transform: translateX(-50%);
                        border: 1px solid rgba(0,0,0,0.05);
                    }
                    .swiper-pagination-progressbar {
                        background: color-mix(in srgb, var(--primary-color), transparent 90%);
                        height: 4px !important;
                        border-radius: 99px;
                    }
                    .swiper-pagination-progressbar-fill {
                        background: var(--primary-color) !important;
                        border-radius: 99px;
                    }
                `}</style>
            </div>
        </section>
    );
}
