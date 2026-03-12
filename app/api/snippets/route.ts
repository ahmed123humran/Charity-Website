import { NextRequest, NextResponse } from 'next/server';
import { createSnippetSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { Role } from '@prisma/client';
import { logActivity } from '@/app/utils/logger';

/**
 * @method GET
 * @route ~/api/snippets
 * @desc Get all snippets
 * @access Public
 */
export async function GET(request: NextRequest) {
    try {
        const snippets = await prisma.snippet.findMany();
        return NextResponse.json(snippets, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}

/**
 * @method POST
 * @route ~/api/snippets
 * @desc Create a new snippet
 * @access Public
 */
export async function POST(request: NextRequest) {
    try {
        const user = await getServerUser();
        if (!user || (user.role !== Role.ADMIN && user.role !== Role.EDITOR)) {
            return NextResponse.json({ message: 'unauthorized: Only Admin and Editor can create snippets' }, { status: 403 });
        }

        const body = await request.json();
        const validation = createSnippetSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const newSnippet = await prisma.snippet.create({
            data: validation.data
        });

        await logActivity({
            action: 'CREATE',
            entityType: 'SNIPPET',
            entityId: newSnippet.id,
            details: `Created snippet: ${newSnippet.name}`,
            newData: newSnippet,
            userId: user.id
        });

        return NextResponse.json(newSnippet, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}
