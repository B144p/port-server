-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- Backfill: give existing rows a stable, contiguous order. There was no
-- explicit ordering before this migration (findAll() had no orderBy), so
-- this is a first assignment, not a preservation of prior intent.
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "inProgress" DESC, title ASC) - 1 AS rn
  FROM "Project"
)
UPDATE "Project" p SET "order" = r.rn FROM ranked r WHERE p.id = r.id;

-- CreateIndex
CREATE INDEX "Project_order_idx" ON "Project"("order");
