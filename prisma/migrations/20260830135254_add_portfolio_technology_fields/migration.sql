-- AlterTable
ALTER TABLE "PortfolioTechnology" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "url" TEXT;

-- CreateIndex
CREATE INDEX "PortfolioTechnology_active_idx" ON "PortfolioTechnology"("active");
