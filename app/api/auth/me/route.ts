import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

export async function GET(request: NextRequest) {
    try {
        const session = request.cookies.get('admin-session');

        if (!session || !session.value) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: session.value },
                    { phone: session.value }
                ]
            },
            select: {
                id: true,
                email: true,
                phone: true,
                name: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
