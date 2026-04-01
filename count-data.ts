
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    try {
        const categories = await prisma.contentCategory.count();
        const contents = await prisma.dynamicContent.count();
        console.log({ categories, contents });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
