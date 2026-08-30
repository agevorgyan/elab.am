-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "ctaText" TEXT DEFAULT 'Order Service →',
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT;
