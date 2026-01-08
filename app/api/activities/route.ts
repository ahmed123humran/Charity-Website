import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/db';
import { getServerUser } from '@/app/utils/auth';

export async function GET(req: NextRequest) {
    try {
        const user = await getServerUser();

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }
        const prismaAny = prisma as any;
        let activities;
        if (prismaAny.activityLog) {
            activities = await prismaAny.activityLog.findMany({
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            role: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else {
            const rawActivities: any[] = await prisma.$queryRawUnsafe(`
                SELECT a.*, u.name as "userName", u.email as "userEmail", u.role as "userRole"
                FROM "ActivityLog" a
                LEFT JOIN "User" u ON a."userId" = u.id
                ORDER BY a."createdAt" DESC
            `);

            activities = rawActivities.map(row => ({
                ...row,
                user: {
                    name: row.userName,
                    email: row.userEmail,
                    role: row.userRole
                }
            }));
        }

        return NextResponse.json(activities);
    } catch (error: any) {
        return NextResponse.json(
            {
                message: 'Failed to fetch activities',
                error: error.message,
                stack: error.stack
            },
            { status: 500 }
        );
    }
}
