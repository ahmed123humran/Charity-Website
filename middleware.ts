import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, localePrefix } from './navigation';
import { verifySession } from '@/app/utils/session';

const intlMiddleware = createMiddleware({
    locales,
    localePrefix,
    defaultLocale: 'en'
});

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = request.cookies.get('admin-session');

    // Logic to protect admin routes
    // Check if the path starts with a locale + /admin
    const isAdminPath = locales.some(locale => pathname.startsWith(`/${locale}/admin`)) || pathname.startsWith('/admin');
    const isLoginPath = locales.some(locale => pathname.startsWith(`/${locale}/login`)) || pathname.startsWith('/login');

    if (isAdminPath) {
        // Verify JWT token signature and expiration
        const payload = session?.value ? await verifySession(session.value) : null;
        if (!payload) {
            // Determine locale to redirect to login
            const locale = pathname.split('/')[1];
            const validLocale = locales.includes(locale as any) ? locale : 'en';
            return NextResponse.redirect(new URL(`/${validLocale}/login`, request.url));
        }
    }

    if (isLoginPath) {
        // Verify JWT token before redirecting to admin
        const payload = session?.value ? await verifySession(session.value) : null;
        if (payload) {
            const locale = pathname.split('/')[1];
            const validLocale = locales.includes(locale as any) ? locale : 'en';
            return NextResponse.redirect(new URL(`/${validLocale}/admin`, request.url));
        }
    }

    const response = intlMiddleware(request);
    response.headers.set('x-url', request.url);
    return response;
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
