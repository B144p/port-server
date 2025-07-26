/*
  Warnings:

  - The `endDate` column on the `Education` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `endDate` column on the `Experience` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `date` on the `ContributionChart` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startDate` on the `Education` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startDate` on the `Experience` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startDate` on the `Statistics` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endDate` on the `Statistics` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ContributionChart" DROP CONSTRAINT "ContributionChart_statisticsId_fkey";

-- DropForeignKey
ALTER TABLE "EducationDescription" DROP CONSTRAINT "EducationDescription_educationId_fkey";

-- DropForeignKey
ALTER TABLE "ExperienceResponsibility" DROP CONSTRAINT "ExperienceResponsibility_experienceId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectTag" DROP CONSTRAINT "ProjectTag_projectId_fkey";

-- DropForeignKey
ALTER TABLE "StatisticsLanguage" DROP CONSTRAINT "StatisticsLanguage_statisticsId_fkey";

-- DropForeignKey
ALTER TABLE "StatisticsOS" DROP CONSTRAINT "StatisticsOS_statisticsId_fkey";

-- AlterTable
ALTER TABLE "ContributionChart" DROP COLUMN "date",
ADD COLUMN     "date" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Education" DROP COLUMN "startDate",
ADD COLUMN     "startDate" INTEGER NOT NULL,
DROP COLUMN "endDate",
ADD COLUMN     "endDate" INTEGER;

-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "startDate",
ADD COLUMN     "startDate" INTEGER NOT NULL,
DROP COLUMN "endDate",
ADD COLUMN     "endDate" INTEGER;

-- AlterTable
ALTER TABLE "Statistics" DROP COLUMN "startDate",
ADD COLUMN     "startDate" INTEGER NOT NULL,
DROP COLUMN "endDate",
ADD COLUMN     "endDate" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "EducationDescription" ADD CONSTRAINT "EducationDescription_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "Education"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceResponsibility" ADD CONSTRAINT "ExperienceResponsibility_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatisticsLanguage" ADD CONSTRAINT "StatisticsLanguage_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "Statistics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatisticsOS" ADD CONSTRAINT "StatisticsOS_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "Statistics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionChart" ADD CONSTRAINT "ContributionChart_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "Statistics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTag" ADD CONSTRAINT "ProjectTag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
