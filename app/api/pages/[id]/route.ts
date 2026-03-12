import { NextRequest, NextResponse } from 'next/server';
import { updatePageSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { Role } from '@prisma/client';
import { logActivity } from '@/app/utils/logger';

interface Props {
    params: Promise<{ id: string }>;
}

/**
 * @method GET
 * @route ~/api/pages/[id]
 * @desc Get a single page by id
 * @access Public
 */
export async function GET(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const page = await prisma.page.findUnique({
            where: { id },
            include: {
                website: true,
                user: true
            }
        });

        if (!page) {
            return NextResponse.json({ message: 'notFound' }, { status: 404 });
        }

        return NextResponse.json(page, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}

/**
 * @method PUT
 * @route ~/api/pages/[id]
 * @desc Update a page
 * @access Public
 */
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const user = await getServerUser();
        if (!user || (user.role !== Role.ADMIN && user.role !== Role.EDITOR)) {
            return NextResponse.json({ message: 'unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const validation = updatePageSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const page = await prisma.page.findUnique({ where: { id } });
        if (!page) {
            return NextResponse.json({ message: 'notFound' }, { status: 404 });
        }

        const updatedPage = await prisma.page.update({
            where: { id },
            data: {
                title: validation.data.title as any,
                url: validation.data.url,
                content: validation.data.content as any,
                isPublished: validation.data.isPublished,
                websiteId: validation.data.websiteId,
                userId: validation.data.userId
            }
        });

        await logActivity({
            action: 'UPDATE',
            entityType: 'PAGE',
            entityId: id,
            details: `Updated page: ${updatedPage.url}`,
            oldData: page,
            newData: updatedPage,
            userId: user.id
        });

        return NextResponse.json(updatedPage, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}

/**
 * @method DELETE
 * @route ~/api/pages/[id]
 * @desc Delete a page
 * @access Public
 */
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const user = await getServerUser();
        if (!user || user.role !== Role.ADMIN) {
            return NextResponse.json({ message: 'unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const page = await prisma.page.findUnique({ where: { id } });
        if (!page) {
            return NextResponse.json({ message: 'notFound' }, { status: 404 });
        }

        await prisma.page.delete({ where: { id } });

        await logActivity({
            action: 'DELETE',
            entityType: 'PAGE',
            entityId: id,
            details: `Deleted page: ${page.url}`,
            oldData: page,
            userId: user.id
        });

        return NextResponse.json({ message: 'deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}