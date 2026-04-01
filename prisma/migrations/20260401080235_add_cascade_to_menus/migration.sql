-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_parentId_fkey";

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
