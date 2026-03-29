/*
  Warnings:

  - The values [DYNAMIC_SWIPER] on the enum `SnippetType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SnippetType_new" AS ENUM ('STATIC', 'DYNAMIC');
ALTER TABLE "public"."Snippet" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Snippet" ALTER COLUMN "type" TYPE "SnippetType_new" USING ("type"::text::"SnippetType_new");
ALTER TYPE "SnippetType" RENAME TO "SnippetType_old";
ALTER TYPE "SnippetType_new" RENAME TO "SnippetType";
DROP TYPE "public"."SnippetType_old";
ALTER TABLE "Snippet" ALTER COLUMN "type" SET DEFAULT 'STATIC';
COMMIT;

-- AlterTable
ALTER TABLE "Snippet" ADD COLUMN     "categoryId" TEXT;

-- CreateTable
CREATE TABLE "ContentCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DynamicContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "description" TEXT,
    "descriptionAr" TEXT,
    "image" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "categoryId" TEXT NOT NULL,
    "publishDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DynamicContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Snippet" ADD CONSTRAINT "Snippet_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ContentCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DynamicContent" ADD CONSTRAINT "DynamicContent_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ContentCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
