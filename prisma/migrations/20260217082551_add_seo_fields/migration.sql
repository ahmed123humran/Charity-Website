-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "seoDescription" JSONB,
ADD COLUMN     "seoKeywords" JSONB,
ADD COLUMN     "seoTitle" JSONB;

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "seoDescription" JSONB,
ADD COLUMN     "seoKeywords" JSONB,
ADD COLUMN     "seoTitle" JSONB,
ADD COLUMN     "twitterHandle" TEXT;
