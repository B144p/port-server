-- CreateTable
CREATE TABLE "ViewEvent" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "bucket" INTEGER NOT NULL,
    "userAgent" TEXT,
    "referer" TEXT,
    "path" TEXT,
    "acceptLanguage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ViewEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ViewEvent_versionId_createdAt_idx" ON "ViewEvent"("versionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ViewEvent_versionId_ip_bucket_key" ON "ViewEvent"("versionId", "ip", "bucket");

-- AddForeignKey
ALTER TABLE "ViewEvent" ADD CONSTRAINT "ViewEvent_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "FrontendVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
