import { notFound } from 'next/navigation';
import DynamicSwiper from '@/app/components/DynamicSwiper';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import prisma from '@/app/utils/db';
import { Metadata } from 'next';
import { getLocalizedName, getContentSnippet } from '@/app/utils/locale';
import { sanitizeHtml } from '@/app/utils/sanitize';

interface Props {
    params: Promise<{ slug: string[]; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const url = slug.join('/');

    // Fetch page and website info in parallel
    const [page, website] = await Promise.all([
        prisma.page.findUnique({ where: { url } }),
        prisma.website.findFirst({ orderBy: { updatedAt: 'desc' } })
    ]);

    if (!page) return {};

    const pageTitle = getLocalizedName(page.title, locale);
    const siteName = getLocalizedName(website?.name, locale) || "Ragmi";
    const pageDescription = getContentSnippet(page.content, locale);
    const siteLogo = website?.logo || "/favicon.ico";

    return {
        title: pageTitle,
        description: pageDescription,
        openGraph: {
            title: `${pageTitle} | ${siteName}`,
            description: pageDescription,
            url: `./${url}`,
            siteName: siteName,
            images: siteLogo ? [{ url: siteLogo }] : [],
            type: 'article',
            locale: locale === 'ar' ? 'ar_SA' : 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${pageTitle} | ${siteName}`,
            description: pageDescription,
            images: siteLogo ? [siteLogo] : [],
        },
    };
}

export default async function DynamicPage({ params }: Props) {
    const { slug } = await params;
    const url = slug.join('/');
    const isHomePage = slug.length === 0;

    const page = await prisma.page.findUnique({
        where: { url },
        include: { website: true }
    });

    if (!page || !page.isPublished) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <main className="flex-1 pt-20">
                    <div className="py-20 text-center text-slate-500">
                        <p>Page not found.</p>
                    </div>
                </main>
                <div />
            </div>
        );
    }

    let contentToRender = null;
    if (page.content) {
        try {
            const contentStr = typeof page.content === 'string' ? page.content : JSON.stringify(page.content);
            const parsed = JSON.parse(contentStr);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && (parsed.en || parsed.ar)) {
                const { locale } = await params;
                const localizedContent = parsed[locale] || parsed.en || [];
                contentToRender = (
                    <div className="flex flex-col">
                        {localizedContent.map((item: any) => (
                            item.type === 'DYNAMIC_SWIPER' ? (
                                <DynamicSwiper key={item.id} snippet={item} />
                            ) : (
                                <div key={item.id} dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.htmlContent) }} />
                            )
                        ))}
                    </div>
                );
            } else if (Array.isArray(parsed)) {
                contentToRender = (
                    <div className="flex flex-col">
                        {parsed.map((item: any) => (
                            item.type === 'DYNAMIC_SWIPER' ? (
                                <DynamicSwiper key={item.id} snippet={item} />
                            ) : (
                                <div key={item.id} dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.htmlContent) }} />
                            )
                        ))}
                    </div>
                );
            } else {
                contentToRender = <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(contentStr) }} />;
            }
        } catch (e) {
            const contentStr = typeof page.content === 'string' ? page.content : String(page.content);
            contentToRender = <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(contentStr) }} />;
        }
    }

    let footerToRender = null;
    if (!isHomePage) {
        const footer = await prisma.footer.findFirst({
            where: { websiteId: page.websiteId },
        });
        if (!footer) {
            return (
                <div className="min-h-screen bg-white flex flex-col">
                    <Header />
                    <main className="flex-1">
                        <div className="py-20 text-center text-slate-500">
                            <p>Page not found.</p>
                        </div>
                    </main>
                    <div />
                </div>
            );
        }
        try {
            const contentStr = typeof footer.content === 'string' ? footer.content : JSON.stringify(footer.content);
            const parsed = JSON.parse(contentStr);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && (parsed.en || parsed.ar)) {
                const { locale } = await params;
                const localizedContent = parsed[locale] || parsed.en || [];
                footerToRender = (
                    <div className="flex flex-col">
                        {localizedContent.map((item: any) => (
                            <div key={item.id} dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.htmlContent) }} />
                        ))}
                    </div>
                );
            } else if (Array.isArray(parsed)) {
                footerToRender = (
                    <div className="flex flex-col">
                        {parsed.map((item: any) => (
                            <div key={item.id} dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.htmlContent) }} />
                        ))}
                    </div>
                );
            } else {
                footerToRender = <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(contentStr) }} />;
            }
        } catch (e) {
            // Optionally handle plain HTML string for footer
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1">
                {contentToRender || (
                    <div className="py-20 text-center text-slate-500">
                        <p>This page is empty.</p>
                    </div>
                )}
            </main>
            {footerToRender || <div />}
        </div>
    );
}
