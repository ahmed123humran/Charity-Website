import { NextRequest, NextResponse } from 'next/server';
import { CreatePageDto } from '@/app/utils/page_dto';
import { createPageSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { Role } from '@prisma/client';
import { logActivity } from '@/app/utils/logger';

/**
 * @method GET
 * @route ~/api/pages
 * @desc Get all pages
 * @access Public
 */
export async function GET(request: NextRequest) {
    try {
        const pages = await prisma.page.findMany({
            include: {
                website: true,
                user: true
            }
        });
        return NextResponse.json(pages, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}


/**
 * @method POST
 * @route ~/api/pages
 * @desc Create a new page
 * @access Public
 */
export async function POST(request: NextRequest) {
    try {
        const user = await getServerUser();
        if (!user || (user.role !== Role.ADMIN && user.role !== Role.EDITOR)) {
            return NextResponse.json({ message: 'unauthorized: Only Admin and Editor can create pages' }, { status: 403 });
        }

        const body = (await request.json()) as CreatePageDto;
        const validation = createPageSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const { url, websiteId, title, content, userId } = validation.data;

        const exists = await prisma.page.findUnique({
            where: { url },
        });

        if (exists) {
            return NextResponse.json(
                { message: 'URL already exists' },
                { status: 409 }
            );
        }

        const newPage = await prisma.page.create({
            data: {
                title: title as any,
                url,
                content: content as any,
                websiteId,
                userId
            }
        });

        await logActivity({
            action: 'CREATE',
            entityType: 'PAGE',
            entityId: newPage.id,
            details: `Created page: ${url}`,
            newData: newPage,
            userId: user.id
        });

        return NextResponse.json(newPage, { status: 201 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}
