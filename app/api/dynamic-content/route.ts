import { NextRequest, NextResponse } from 'next/server';
import { createDynamicContentSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { Role } from '@prisma/client';
import { logActivity } from '@/app/utils/logger';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');

        const content = await prisma.dynamicContent.findMany({
            where: categoryId ? { categoryId } : {},
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(content, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getServerUser();
        if (!user || (user.role !== Role.ADMIN && user.role !== Role.EDITOR)) {
            return NextResponse.json({ message: 'unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const validation = createDynamicContentSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const newContent = await prisma.dynamicContent.create({
            data: validation.data,
            include: { category: true }
        });

        await logActivity({
            action: 'CREATE',
            entityType: 'DYNAMIC_CONTENT',
            entityId: newContent.id,
            details: `Created dynamic content: ${newContent.title}`,
            newData: newContent,
            userId: user.id
        });

        return NextResponse.json(newContent, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}
