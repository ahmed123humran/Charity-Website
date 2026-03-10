import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { logActivity } from '@/app/utils/logger';

export async function POST(request: NextRequest) {
    try {
        const { searchText, replaceText, targetType } = await request.json();

        if (!searchText) {
            return NextResponse.json({ message: 'Search text is required' }, { status: 400 });
        }

        let totalUpdated = 0;
        const safeSearchText = searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(safeSearchText, 'gi');

        // 1. Replace in Pages
        if (targetType === 'all' || targetType === 'pages') {
            const pages = await prisma.page.findMany();
            for (const page of pages) {
                let updated = false;
                let newContent = page.content;
                let newTitle = page.title;

                if (page.content) {
                    const contentStr = typeof page.content === 'string' ? page.content : JSON.stringify(page.content);
                    if (regex.test(contentStr)) {
                        const replacedStr = contentStr.replace(regex, replaceText);
                        newContent = replacedStr;
                        updated = true;
                    }
                }

                const titleStr = JSON.stringify(page.title);
                if (regex.test(titleStr)) {
                    const replacedTitleStr = titleStr.replace(regex, replaceText);
                    newTitle = JSON.parse(replacedTitleStr);
                    updated = true;
                }

                if (updated) {
                    await prisma.page.update({
                        where: { id: page.id },
                        data: { content: newContent, title: newTitle }
                    });
                    totalUpdated++;
                }
            }
        }

        // 2. Replace in Snippets
        if (targetType === 'all' || targetType === 'snippets') {
            const snippets = await prisma.snippet.findMany();
            for (const snippet of snippets) {
                let updated = false;
                let newHtml = snippet.htmlContent;
                let newName = snippet.name;

                if (regex.test(snippet.htmlContent)) {
                    newHtml = snippet.htmlContent.replace(regex, replaceText);
                    updated = true;
                }

                if (regex.test(snippet.name)) {
                    newName = snippet.name.replace(regex, replaceText);
                    updated = true;
                }

                if (updated) {
                    await prisma.snippet.update({
                        where: { id: snippet.id },
                        data: { htmlContent: newHtml, name: newName }
                    });
                    totalUpdated++;
                }
            }
        }

        // 3. Replace in Menus
        if (targetType === 'all' || targetType === 'menus') {
            const menus = await prisma.menu.findMany();
            for (const menu of menus) {
                const nameStr = JSON.stringify(menu.name);
                if (regex.test(nameStr)) {
                    const replacedNameStr = nameStr.replace(regex, replaceText);
                    await prisma.menu.update({
                        where: { id: menu.id },
                        data: { name: JSON.parse(replacedNameStr) }
                    });
                    totalUpdated++;
                }
            }
        }

        const user = await getServerUser();
        if (user && totalUpdated > 0) {
            await logActivity({
                action: 'UPDATE',
                entityType: 'WEBSITE', // Using WEBSITE as a generic catch-all for bulk tools or just indicating a system-wide change
                entityId: 'BULK_REPLACE',
                details: `Bulk Replace: Changed "${searchText}" to "${replaceText}" in ${totalUpdated} items.`,
                newData: { searchText, replaceText, totalUpdated, targetType },
                userId: user.id
            });
        }

        return NextResponse.json({ success: true, count: totalUpdated });
    } catch (error) {
        console.error('Replace API error:', error);
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}
