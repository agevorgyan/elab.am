-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "popular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priceCurrency" TEXT NOT NULL DEFAULT 'AMD',
ADD COLUMN     "priceLabel" TEXT DEFAULT 'Starting from',
ADD COLUMN     "showPrice" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tagline" TEXT;
