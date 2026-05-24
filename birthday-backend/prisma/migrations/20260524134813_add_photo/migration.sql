-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "pageId" INTEGER NOT NULL,
    "uploaderId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Photo_pageId_createdAt_idx" ON "Photo"("pageId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
