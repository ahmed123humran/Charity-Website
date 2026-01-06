import { NextRequest, NextResponse } from 'next/server';
import { createSnippetSchema } from '@/app/utils/validiton';
import prisma from '@/app/utils/db';

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
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
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
        const body = await request.json();
        const validation = createSnippetSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const newSnippet = await prisma.snippet.create({
            data: validation.data
        });

        return NextResponse.json(newSnippet, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
