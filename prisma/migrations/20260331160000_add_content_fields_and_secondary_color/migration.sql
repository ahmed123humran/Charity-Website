-- AlterTable
ALTER TABLE "DynamicContent" ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "linkUrl" TEXT,
ADD COLUMN "tag" TEXT,
ADD COLUMN "tagAr" TEXT;

-- AlterTable
ALTER TABLE "Snippet" ADD COLUMN "containerType" TEXT NOT NULL DEFAULT 'contained';

-- AlterTable
ALTER TABLE "Website" ADD COLUMN "secondaryColor" TEXT NOT NULL DEFAULT '#F59E0B';

-- DropIndex
DROP INDEX IF EXISTS "Page_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "Page_url_websiteId_key" ON "Page"("url", "websiteId");
