import { NextRequest, NextResponse } from 'next/server';
import { updateContentCategorySchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { Role } from '@prisma/client';
import { logActivity } from '@/app/utils/logger';

interface Props {
    params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Props) {
    const { id } = await params;
    try {
        const user = await getServerUser();
        if (!user || user.role !== Role.ADMIN) {
            return NextResponse.json({ message: 'unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const validation = updateContentCategorySchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error.issues, { status: 400 });
        }

        const oldCategory = await prisma.contentCategory.findUnique({ where: { id } });
        if (!oldCategory) {
            return NextResponse.json({ message: 'notFound' }, { status: 404 });
        }

        const updatedCategory = await prisma.contentCategory.update({
            where: { id },
            data: validation.data
        });

        await logActivity({
            action: 'UPDATE',
            entityType: 'CONTENT_CATEGORY',
            entityId: updatedCategory.id,
            details: `Updated content category: ${updatedCategory.name}`,
            oldData: oldCategory,
            newData: updatedCategory,
            userId: user.id
        });

        return NextResponse.json(updatedCategory, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: Props) {
    const { id } = await params;
    try {
        const user = await getServerUser();
        if (!user || user.role !== Role.ADMIN) {
            return NextResponse.json({ message: 'unauthorized' }, { status: 403 });
        }

        const oldCategory = await prisma.contentCategory.findUnique({ where: { id } });
        if (!oldCategory) {
            return NextResponse.json({ message: 'notFound' }, { status: 404 });
        }

        await prisma.contentCategory.delete({ where: { id } });

        await logActivity({
            action: 'DELETE',
            entityType: 'CONTENT_CATEGORY',
            entityId: id,
            details: `Deleted content category: ${oldCategory.name}`,
            oldData: oldCategory,
            userId: user.id
        });

        return NextResponse.json({ message: 'deleted' }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}
