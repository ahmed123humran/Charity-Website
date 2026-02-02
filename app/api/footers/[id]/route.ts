import { NextRequest, NextResponse } from 'next/server';
import { updateFooterSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { Role } from '@prisma/client';
import { logActivity } from '@/app/utils/logger';

interface Props {
    params: Promise<{ id: string }>;
}

/**
 * @method GET
 * @route ~/api/footers/[id]
 * @desc Get a single footer by id
 * @access Public
 */
export async function GET(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const footer = await prisma.footer.findUnique({
            where: { id },
            include: {
                website: true,
                user: true
            }
        });

        if (!footer) {
            return NextResponse.json({ message: 'Footer not found' }, { status: 404 });
        }

        return NextResponse.json(footer, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * @method PUT
 * @route ~/api/footers/[id]
 * @desc Update a footer
 * @access Public
 */
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const user = await getServerUser();
        if (!user || (user.role !== Role.ADMIN && user.role !== Role.EDITOR)) {
            return NextResponse.json({ message: 'Unauthorized: Only Admin and Editor can update footers' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const validation = updateFooterSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const footer = await prisma.footer.findUnique({ where: { id } });
        if (!footer) {
            return NextResponse.json({ message: 'Footer not found' }, { status: 404 });
        }

        const updatedFooter = await prisma.footer.update({
            where: { id },
            data: {
                title: validation.data.title as any,
                content: validation.data.content as any,
                isPublished: validation.data.isPublished,
                websiteId: validation.data.websiteId,
                userId: validation.data.userId
            }
        });

        await logActivity({
            action: 'UPDATE',
            entityType: 'FOOTER',
            entityId: id,
            oldData: footer,
            details: `Updated page: ${updatedFooter.title}`,
            newData: updatedFooter,
            userId: user.id
        });

        return NextResponse.json(updatedFooter, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * @method DELETE
 * @route ~/api/footers/[id]
 * @desc Delete a footer
 * @access Public
 */
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const user = await getServerUser();
        if (!user || user.role !== Role.ADMIN) {
            return NextResponse.json({ message: 'Unauthorized: Only Admin can delete footers' }, { status: 403 });
        }

        const { id } = await params;
        const footer = await prisma.footer.findUnique({ where: { id } });
        if (!footer) {
            return NextResponse.json({ message: 'Footer not found' }, { status: 404 });
        }

        await prisma.footer.delete({ where: { id } });

        await logActivity({
            action: 'DELETE',
            entityType: 'FOOTER',
            entityId: id,
            details: `Deleted page: ${footer.title}`,
            oldData: footer,
            userId: user.id
        });

        return NextResponse.json({ message: 'Footer deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}