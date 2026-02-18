export function getUserLocale() {
  // Simple mock or server-side utility
  return 'en';
}

export function getLocalizedName(name: any, locale: string): string {
  if (!name) return '';
  if (typeof name === 'string') return name; // Fallback for legacy data or simple strings
  // prioritize exact locale, then fallback language, then first available
  return name[locale] || name['en'] || Object.values(name)[0] || '';
}

export function extractTextFromHtml(html: string): string {
  if (!html) return '';
  // Simple regex to strip HTML tags
  return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

export function getContentSnippet(content: any, locale: string, length: number = 160): string {
  if (!content) return '';

  let html = '';
  try {
    const parsed = typeof content === 'string' ? JSON.parse(content) : content;

    // Handle localized content format { en: [], ar: [] }
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && (parsed.en || parsed.ar)) {
      const localizedContent = parsed[locale] || parsed.en || [];
      if (Array.isArray(localizedContent)) {
        html = localizedContent.map((item: any) => item.htmlContent || '').join(' ');
      }
    }
    // Handle array format
    else if (Array.isArray(parsed)) {
      html = parsed.map((item: any) => item.htmlContent || '').join(' ');
    }
    else if (typeof parsed === 'string') {
      html = parsed;
    }
  } catch (e) {
    html = String(content);
  }

  const plainText = extractTextFromHtml(html);
  if (plainText.length <= length) return plainText;
  return plainText.substring(0, length) + '...';
}
