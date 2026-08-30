-- AlterTable
ALTER TABLE "PortfolioCategory" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE INDEX "PortfolioCategory_active_idx" ON "PortfolioCategory"("active");
