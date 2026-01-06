import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, localePrefix } from './navigation';

const intlMiddleware = createMiddleware({
    locales,
    localePrefix,
    defaultLocale: 'en'
});

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = request.cookies.get('admin-session');

    // Logic to protect admin routes
    // Check if the path starts with a locale + /admin
    const isAdminPath = locales.some(locale => pathname.startsWith(`/${locale}/admin`)) || pathname.startsWith('/admin');
    const isLoginPath = locales.some(locale => pathname.startsWith(`/${locale}/login`)) || pathname.startsWith('/login');

    if (isAdminPath) {
        if (!session || !session.value) {
            // Determine locale to redirect to login
            const locale = pathname.split('/')[1];
            const validLocale = locales.includes(locale as any) ? locale : 'en';
            return NextResponse.redirect(new URL(`/${validLocale}/login`, request.url));
        }
    }

    if (isLoginPath) {
        if (session && session.value) {
            const locale = pathname.split('/')[1];
            const validLocale = locales.includes(locale as any) ? locale : 'en';
            return NextResponse.redirect(new URL(`/${validLocale}/admin`, request.url));
        }
    }

    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames
    matcher: [
        // Enable a redirect to a matching locale at the root
        '/',
        // Set a cookie to remember the previous locale for
        // all requests that have a locale prefix
        '/(ar|en)/:path*',
        // Enable redirects for internal paths
        '/admin/:path*',
        '/login'
    ]
};
