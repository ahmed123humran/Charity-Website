import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const snippet = await prisma.snippet.findFirst();
        console.log('Snippet columns:', Object.keys(snippet || {}));

        const categories = await prisma.contentCategory.findMany({ take: 1 });
        console.log('ContentCategory exists, count:', categories.length);

        const content = await prisma.dynamicContent.findMany({ take: 1 });
        console.log('DynamicContent exists, count:', content.length);
    } catch (error: any) {
        console.error('Error checking tables:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
