
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
    console.log('SocialMedia fields:', Object.keys((prisma as any).socialMedia));
}
check();
