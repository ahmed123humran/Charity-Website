import { NextRequest, NextResponse } from 'next/server';
import { createContentCategorySchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { Role } from '@prisma/client';
import { logActivity } from '@/app/utils/logger';

export async function GET(request: NextRequest) {
    try {
        const categories = await prisma.contentCategory.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(categories, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getServerUser();
        if (!user || user.role !== Role.ADMIN) {
            return NextResponse.json({ message: 'unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const validation = createContentCategorySchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error.issues, { status: 400 });
        }

        const newCategory = await prisma.contentCategory.create({
            data: validation.data
        });

        await logActivity({
            action: 'CREATE',
            entityType: 'CONTENT_CATEGORY',
            entityId: newCategory.id,
            details: `Created content category: ${newCategory.name}`,
            newData: newCategory,
            userId: user.id
        });

        return NextResponse.json(newCategory, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}
