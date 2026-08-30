-- AlterTable
ALTER TABLE "PortfolioProject" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'corporate',
ADD COLUMN     "categoryLabel" TEXT,
ADD COLUMN     "overview" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "services" TEXT[];

-- CreateIndex
CREATE INDEX "PortfolioProject_category_idx" ON "PortfolioProject"("category");
