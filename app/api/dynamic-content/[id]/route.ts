import { NextRequest, NextResponse } from 'next/server';
import { updateDynamicContentSchema } from '@/app/utils/validiton';
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
        if (!user || (user.role !== Role.ADMIN && user.role !== Role.EDITOR)) {
            return NextResponse.json({ message: 'unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const validation = updateDynamicContentSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const oldContent = await prisma.dynamicContent.findUnique({ where: { id } });
        if (!oldContent) {
            return NextResponse.json({ message: 'notFound' }, { status: 404 });
        }

        const updatedContent = await prisma.dynamicContent.update({
            where: { id },
            data: validation.data,
            include: { category: true }
        });

        await logActivity({
            action: 'UPDATE',
            entityType: 'DYNAMIC_CONTENT',
            entityId: updatedContent.id,
            details: `Updated dynamic content: ${updatedContent.title}`,
            oldData: oldContent,
            newData: updatedContent,
            userId: user.id
        });

        return NextResponse.json(updatedContent, { status: 200 });
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

        const oldContent = await prisma.dynamicContent.findUnique({ where: { id } });
        if (!oldContent) {
            return NextResponse.json({ message: 'notFound' }, { status: 404 });
        }

        await prisma.dynamicContent.delete({ where: { id } });

        await logActivity({
            action: 'DELETE',
            entityType: 'DYNAMIC_CONTENT',
            entityId: id,
            details: `Deleted dynamic content: ${oldContent.title}`,
            oldData: oldContent,
            userId: user.id
        });

        return NextResponse.json({ message: 'deleted' }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}
