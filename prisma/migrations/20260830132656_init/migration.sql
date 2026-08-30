-- AlterTable
ALTER TABLE "_PortfolioCategoryToPortfolioProject" ADD CONSTRAINT "_PortfolioCategoryToPortfolioProject_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PortfolioCategoryToPortfolioProject_AB_unique";

-- AlterTable
ALTER TABLE "_PortfolioProjectToPortfolioTechnology" ADD CONSTRAINT "_PortfolioProjectToPortfolioTechnology_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PortfolioProjectToPortfolioTechnology_AB_unique";
