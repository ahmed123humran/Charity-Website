import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

export async function POST(request: NextRequest) {
    try {
        const { searchText, targetType } = await request.json();

        if (!searchText) {
            return NextResponse.json({ message: 'Search text is required' }, { status: 400 });
        }

        const results: any[] = [];

        // 1. Search in Pages
        if (targetType === 'all' || targetType === 'pages') {
            const pages = await prisma.page.findMany();
            pages.forEach(page => {
                let matches = 0;
                if (page.content) {
                    const contentStr = typeof page.content === 'string' ? page.content : JSON.stringify(page.content);
                    // Simple count of occurrences
                    const regex = new RegExp(searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
                    const count = (contentStr.match(regex) || []).length;
                    if (count > 0) matches = count;
                }

                // Also search in title
                const titleStr = JSON.stringify(page.title);
                const titleRegex = new RegExp(searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
                const titleCount = (titleStr.match(titleRegex) || []).length;
                matches += titleCount;

                if (matches > 0) {
                    results.push({
                        type: 'page',
                        id: page.id,
                        name: (page.title as any)?.en || page.url,
                        found: matches
                    });
                }
            });
        }

        // 2. Search in Snippets
        if (targetType === 'all' || targetType === 'snippets') {
            const snippets = await prisma.snippet.findMany();
            snippets.forEach(snippet => {
                const regex = new RegExp(searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
                const count = (snippet.htmlContent.match(regex) || []).length;

                // Search in name too
                const nameRegex = new RegExp(searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
                const nameCount = (snippet.name.match(nameRegex) || []).length;

                const total = count + nameCount;

                if (total > 0) {
                    results.push({
                        type: 'snippet',
                        id: snippet.id,
                        name: snippet.name,
                        found: total
                    });
                }
            });
        }

        // 3. Search in Menus
        if (targetType === 'all' || targetType === 'menus') {
            const menus = await prisma.menu.findMany();
            menus.forEach(menu => {
                const nameStr = JSON.stringify(menu.name);
                const regex = new RegExp(searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
                const count = (nameStr.match(regex) || []).length;

                if (count > 0) {
                    results.push({
                        type: 'menu',
                        id: menu.id,
                        name: (menu.name as any)?.en || 'Menu Item',
                        found: count
                    });
                }
            });
        }

        return NextResponse.json({ results });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}
