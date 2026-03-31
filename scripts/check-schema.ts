import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const website = await prisma.website.findFirst();
        console.log('Website data sample:', website);
        console.log('Columns found in Website:', Object.keys(website || {}));
    } catch (error: any) {
        console.error('Error checking Website table:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
