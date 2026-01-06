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
