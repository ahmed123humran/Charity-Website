import crypto from 'crypto';
import prisma from './db';

interface LogOptions {
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SEARCH_REPLACE' | 'LOGIN' | 'LOGOUT';
    entityType: 'WEBSITE' | 'PAGE' | 'MENU' | 'SNIPPET' | 'USER' | 'SYSTEM' | 'FOOTER';
    entityId: string;
    details: string;
    oldData?: any;
    newData?: any;
    userId: number;
}

export async function logActivity({
    action,
    entityType,
    entityId,
    details,
    oldData,
    newData,
    userId
}: LogOptions) {
    try {
        const prismaAny = prisma as any;

        if (prismaAny.activityLog) {
            await prismaAny.activityLog.create({
                data: {
                    action,
                    entityType,
                    entityId,
                    details,
                    oldData: oldData || undefined,
                    newData: newData || undefined,
                    userId
                }
            });
        } else {
            // Raw SQL fallback for creation
            await prisma.$executeRawUnsafe(`
                INSERT INTO "ActivityLog" ("id", "action", "entityType", "entityId", "details", "oldData", "newData", "userId", "createdAt")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            `,
                crypto.randomUUID(),
                action,
                entityType,
                entityId,
                details,
                oldData ? JSON.stringify(oldData) : null,
                newData ? JSON.stringify(newData) : null,
                userId
            );
        }
    } catch (error) {
        console.error('CRITICAL: Failed to log activity:', error);
        // Don't throw the error to avoid breaking the main operation if logging fails
    }
}
