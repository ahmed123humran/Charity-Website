import { notFound } from 'next/navigation';
import DynamicSwiper from '@/app/components/DynamicSwiper';
import DynamicGrid from '@/app/components/DynamicGrid';
import StaticSnippet from '@/app/components/StaticSnippet';
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

    // Fetch page and website info sequentially to match current website
    const website = await prisma.website.findFirst({ orderBy: { updatedAt: 'desc' } });
    const page = website ? await prisma.page.findFirst({ where: { url, websiteId: website.id } }) : null;

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

    const websiteContext = await prisma.website.findFirst({ orderBy: { updatedAt: 'desc' } });

    let page = websiteContext ? await prisma.page.findFirst({
        where: { url, websiteId: websiteContext.id },
        include: { website: true }
    }) : null;

    let dynamicId = null;

    // If exact page not found, try finding a parent page for dynamic routes (e.g. /media/center/1 -> /media/center)
    if (!page && websiteContext && slug.length > 1) {
        const parentUrl = slug.slice(0, -1).join('/');
        const possibleDynamicId = slug[slug.length - 1];

        // Basic check if it could be an ID (usually starts with a letter/number and has a certain length, or is just a fallback)
        // Here we try to fetch the parent page. If it exists, we treat the last slug as the ID.
        page = await prisma.page.findFirst({
            where: { url: parentUrl, websiteId: websiteContext.id },
            include: { website: true }
        });

        if (page) {
            dynamicId = possibleDynamicId;
        }
    }

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
                            (item.type === 'DYNAMIC') ? (
                                <DynamicSwiper key={item.id} snippet={item} dynamicId={dynamicId} />
                            ) : (item.type === 'DYNAMIC_GRID') ? (
                                <DynamicGrid key={item.id} snippet={item} dynamicId={dynamicId} />
                            ) : (
                                <StaticSnippet key={item.id} htmlContent={item.htmlContent} snippet={item} />
                            )
                        ))}
                    </div>
                );
            } else if (Array.isArray(parsed)) {
                contentToRender = (
                    <div className="flex flex-col">
                        {parsed.map((item: any) => (
                            (item.type === 'DYNAMIC') ? (
                                <DynamicSwiper key={item.id} snippet={item} dynamicId={dynamicId} />
                            ) : (item.type === 'DYNAMIC_GRID') ? (
                                <DynamicGrid key={item.id} snippet={item} dynamicId={dynamicId} />
                            ) : (
                                <StaticSnippet key={item.id} htmlContent={item.htmlContent} snippet={item} />
                            )
                        ))}
                    </div>
                );
            } else {
                contentToRender = <StaticSnippet htmlContent={contentStr} />;
            }
        } catch (e) {
            const contentStr = typeof page.content === 'string' ? page.content : String(page.content);
            contentToRender = <StaticSnippet htmlContent={contentStr} />;
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
                            <StaticSnippet key={item.id} htmlContent={item.htmlContent} snippet={item} />
                        ))}
                    </div>
                );
            } else if (Array.isArray(parsed)) {
                footerToRender = (
                    <div className="flex flex-col">
                        {parsed.map((item: any) => (
                            <StaticSnippet key={item.id} htmlContent={item.htmlContent} snippet={item} />
                        ))}
                    </div>
                );
            } else {
                footerToRender = <StaticSnippet htmlContent={contentStr} />;
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
