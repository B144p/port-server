-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('IN_PROGRESS', 'ACTIVE', 'HOLD', 'PLANNING');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "inProgress" SET DEFAULT false;

-- Backfill status from the boolean it replaces.
UPDATE "Project" SET "status" = 'IN_PROGRESS' WHERE "inProgress" = true;
UPDATE "Project" SET "status" = 'ACTIVE'      WHERE "inProgress" = false;
