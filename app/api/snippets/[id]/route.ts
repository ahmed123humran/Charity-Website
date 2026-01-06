import { NextRequest, NextResponse } from 'next/server';
import { updateSnippetSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';

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
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
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
        const { id } = await params;
        const body = await request.json();
        const validation = updateSnippetSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const snippet = await prisma.snippet.findUnique({ where: { id } });
        if (!snippet) {
            return NextResponse.json({ message: 'Snippet not found' }, { status: 404 });
        }

        const updatedSnippet = await prisma.snippet.update({
            where: { id },
            data: validation.data
        });

        return NextResponse.json(updatedSnippet, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
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
        const { id } = await params;
        const snippet = await prisma.snippet.findUnique({ where: { id } });
        if (!snippet) {
            return NextResponse.json({ message: 'Snippet not found' }, { status: 404 });
        }

        await prisma.snippet.delete({ where: { id } });

        return NextResponse.json({ message: 'Snippet deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
