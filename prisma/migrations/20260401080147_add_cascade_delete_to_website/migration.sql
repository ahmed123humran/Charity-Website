-- DropForeignKey
ALTER TABLE "Footer" DROP CONSTRAINT "Footer_websiteId_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_websiteId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_websiteId_fkey";

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Footer" ADD CONSTRAINT "Footer_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;
