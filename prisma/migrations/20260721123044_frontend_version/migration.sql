-- CreateTable
CREATE TABLE "FrontendVersion" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "show" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FrontendVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FrontendVersion_key_key" ON "FrontendVersion"("key");

-- CreateIndex
CREATE UNIQUE INDEX "FrontendVersion_url_key" ON "FrontendVersion"("url");

-- Backfill from CorsOrigin. Idempotent (ON CONFLICT DO NOTHING) so it can
-- safely be re-run right before deploying the code that reads this table,
-- to catch any origin added through the old endpoint in between.
-- `key`/`title` are derived from the URL's first host label
-- (e.g. https://port-oscilloscope.vercel.app -> "port-oscilloscope"),
-- disambiguated with a numeric suffix on collision. There's no better
-- source for `title` — CorsOrigin never had one; it's a placeholder to
-- edit after.
INSERT INTO "FrontendVersion" ("id", "key", "url", "title", "show", "order", "views", "createdAt", "updatedAt")
SELECT
  c.id,
  CASE WHEN c.cnt > 1 THEN c.slug || '-' || c.rn::text ELSE c.slug END,
  c.url,
  CASE WHEN c.cnt > 1 THEN c.slug || '-' || c.rn::text ELSE c.slug END,
  true,
  (ROW_NUMBER() OVER (ORDER BY c."createdAt"))::int - 1,
  0,
  c."createdAt",
  NOW()
FROM (
  SELECT
    id,
    url,
    "createdAt",
    split_part(regexp_replace(url, '^https?://', ''), '.', 1) AS slug,
    ROW_NUMBER() OVER (
      PARTITION BY split_part(regexp_replace(url, '^https?://', ''), '.', 1)
      ORDER BY "createdAt"
    ) AS rn,
    COUNT(*) OVER (
      PARTITION BY split_part(regexp_replace(url, '^https?://', ''), '.', 1)
    ) AS cnt
  FROM "CorsOrigin"
) c
ON CONFLICT ("url") DO NOTHING;
