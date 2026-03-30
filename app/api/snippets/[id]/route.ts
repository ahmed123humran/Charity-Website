import { NextRequest, NextResponse } from 'next/server';
import { updateSnippetSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';
import { Role } from '@prisma/client';
import { logActivity } from '@/app/utils/logger';

interface Props {
    params: Promise<{ id: string }>;
}

/**
 * @method GET
 * @route ~/api/snippets/[id]
 * @desc Get a single snippet by id
 * @access Public
 */
export async function GET(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const snippet = await prisma.snippet.findUnique({
            where: { id }
        });

        if (!snippet) {
            return NextResponse.json({ message: 'Snippet not found' }, { status: 404 });
        }

        return NextResponse.json(snippet, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}

/**
 * @method PUT
 * @route ~/api/snippets/[id]
 * @desc Update a snippet
 * @access Public
 */
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const user = await getServerUser();
        if (!user || (user.role !== Role.ADMIN && user.role !== Role.EDITOR)) {
            return NextResponse.json({ message: 'Unauthorized: Only Admin and Editor can update snippets' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const validation = updateSnippetSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(validation.error.issues, { status: 400 });
        }

        const snippet = await prisma.snippet.findUnique({ where: { id } });
        if (!snippet) {
            return NextResponse.json({ message: 'Snippet not found' }, { status: 404 });
        }

        const updatedSnippet = await prisma.snippet.update({
            where: { id },
            data: validation.data
        });

        await logActivity({
            action: 'UPDATE',
            entityType: 'SNIPPET',
            entityId: id,
            details: `Updated snippet: ${updatedSnippet.name}`,
            oldData: snippet,
            newData: updatedSnippet,
            userId: user.id
        });

        return NextResponse.json(updatedSnippet, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'internalServerError' }, { status: 500 });
    }
}

/**
 * @method DELETE
 * @route ~/api/snippets/[id]
 * @desc Delete a snippet
 * @access Public
 */
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const user = await getServerUser();
        if (!user || user.role !== Role.ADMIN) {
            return NextResponse.json({ message: 'Unauthorized: Only Admin can delete snippets' }, { status: 403 });
        }

        const { id } = await params;
        const snippet = await prisma.snippet.findUnique({ where: { id } });
        if (!snippet) {
            return NextResponse.json({ message: 'Snippet not found' }, { status: 404 });
        }

        await prisma.snippet.delete({ where: { id } });

        await logActivity({
            action: 'DELETE',
            entityType: 'SNIPPET',
            entityId: id,
            details: `Deleted snippet: ${snippet.name}`,
            oldData: snippet,
            userId: user.id
        });

        return NextResponse.json({ message: 'deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
