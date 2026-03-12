import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import prisma from "@/app/utils/db";
import ContentStatus from "@/app/components/ContentStatus";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getLocalizedName, getContentSnippet } from "@/app/utils/locale";
import { sanitizeHtml } from "@/app/utils/sanitize";
import DynamicSwiper from "@/app/components/DynamicSwiper";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [page, website] = await Promise.all([
    prisma.page.findFirst({
      where: { OR: [{ url: '/' }, { url: 'home' }, { url: '' }] },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.website.findFirst({ orderBy: { updatedAt: 'desc' } })
  ]);

  const siteName = getLocalizedName(website?.name, locale) || "Ragmi";
  const siteDescription = getLocalizedName(website?.description, locale) || "Modern charity platform for sustainable development.";
  const homeDescription = page ? getContentSnippet(page.content, locale) : siteDescription;
  const siteLogo = website?.logo || "/favicon.ico";

  return {
    title: {
      absolute: siteName, // Using absolute for home to avoid "Home | SiteName" if siteName is already the title
    },
    description: homeDescription || siteDescription,
    openGraph: {
      title: siteName,
      description: homeDescription || siteDescription,
      images: siteLogo ? [{ url: siteLogo }] : [],
    }
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const userCount = await prisma.user.count();
  if (userCount === 0) {
    redirect(`/${locale}/setup`);
  }

  // Try to find the homepage configuration in the database
  // We check for common homepage URL patterns
  const page = await prisma.page.findFirst({
    where: {
      OR: [
        { url: '/' },
        { url: 'home' },
        { url: '' }
      ]
    },
    orderBy: { updatedAt: 'desc' } // Get the most recently updated one if duplicates exist (though url should be unique)
  });

  let contentToRender = null;
  let isEmpty = true;
  let footerToRender = null;

  if (page && page.content && page.isPublished) {
    try {
      const contentStr = typeof page.content === 'string' ? page.content : JSON.stringify(page.content);
      const parsed = JSON.parse(contentStr);

      // Handle localized content format { en: [], ar: [] }
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && (parsed.en || parsed.ar)) {
        const localizedContent = parsed[locale] || parsed.en || [];
        if (Array.isArray(localizedContent) && localizedContent.length > 0) {
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
          isEmpty = false;
        }
      }
      // Handle legacy array format
      else if (Array.isArray(parsed) && parsed.length > 0) {
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
        isEmpty = false;
      }
    } catch (e) {
      // Fallback for simple HTML string content
      const contentStr = typeof page.content === 'string' ? page.content : String(page.content);
      if (contentStr) {
        contentToRender = <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(contentStr) }} />;
        isEmpty = false;
      }
    }
  }
  if (page) {
    const footer = await prisma.footer.findFirst({
      where: { websiteId: page.websiteId },
    });
    if (footer && footer.content && footer.isPublished) {
      try {
        const contentStr = typeof footer.content === 'string' ? footer.content : JSON.stringify(footer.content);
        const parsed = JSON.parse(contentStr);

        // Handle localized content format { en: [], ar: [] }
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && (parsed.en || parsed.ar)) {
          const localizedContent = parsed[locale] || parsed.en || [];
          if (Array.isArray(localizedContent) && localizedContent.length > 0) {
            footerToRender = (
              <div className="flex flex-col">
                {localizedContent.map((item: any) => (
                  <div key={item.id} dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.htmlContent) }} />
                ))}
              </div>
            );
          }
        }
        // Handle legacy array format
        else if (Array.isArray(parsed) && parsed.length > 0) {
          footerToRender = (
            <div className="flex flex-col">
              {parsed.map((item: any) => (
                <div key={item.id} dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.htmlContent) }} />
              ))}
            </div>
          );
        }
      } catch (e) {
        // Fallback for simple HTML string content
        const contentStr = typeof footer.content === 'string' ? footer.content : String(footer.content);
        if (contentStr) {
          footerToRender = <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(contentStr) }} />;
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <ContentStatus isEmpty={isEmpty} />

      <main>
        {contentToRender || (
          <div className="py-32 text-center bg-slate-50">
            <div className="max-w-md mx-auto px-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome to Your Website</h2>
              <p className="text-slate-600 mb-8">
                This homepage is currently empty.
                <br />
                Go to the admin dashboard to build your page using snippets.
              </p>
            </div>
          </div>
        )}
      </main>

      {footerToRender || (
        <div />
      )}
    </div>
  );
}
