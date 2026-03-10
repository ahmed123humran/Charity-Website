import { NextRequest, NextResponse } from 'next/server';
import { CreateFooterDto } from '@/app/utils/page_dto';
import { createFooterSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { Role } from '@prisma/client';
import { logActivity } from '@/app/utils/logger';

/**
 * @method GET
 * @route ~/api/footers
 * @desc Get all footers
 * @access Public
 */
export async function GET(request: NextRequest) {
    try {
        const footers = await prisma.footer.findMany({
            include: {
                website: true,
                user: true
            }
        });
        return NextResponse.json(footers, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}


/**
 * @method POST
 * @route ~/api/footers
 * @desc Create a new footer
 * @access Public
 */
export async function POST(request: NextRequest) {
    try {
        const user = await getServerUser();
        if (!user || (user.role !== Role.ADMIN && user.role !== Role.EDITOR)) {
            return NextResponse.json({ message: 'unauthorized: Only Admin and Editor can create footers' }, { status: 403 });
        }

        const body = (await request.json()) as CreateFooterDto;
        const validation = createFooterSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const { websiteId, title, content, userId } = validation.data;

        const dbSnippets = await prisma.snippet.findMany();

        // Helper to find snippet by name
        const findSnip = (name: string) => dbSnippets.find(s => s.name === name);
        const footer = findSnip('Footer');

        // Construct content array (simulating dropped snippets)
        const contentItems = [footer].filter(Boolean).map(s => ({
            id: crypto.randomUUID(), // unique instance ID
            snippetId: s!.id,
            htmlContent: s!.htmlContent,
            name: s!.name
        }));

        const newFooter = await prisma.footer.create({
            data: {
                title: title as any,
                content: {
                    en: contentItems,
                    ar: contentItems // Use same content for now, or could duplicate/localize if snippets supported it
                },
                websiteId,
                userId
            }
        });

        await logActivity({
            action: 'CREATE',
            entityType: 'FOOTER',
            entityId: newFooter.id,
            details: `Created footer: ${title}`,
            newData: newFooter,
            userId: user.id
        });

        return NextResponse.json(newFooter, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}
