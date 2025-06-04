/*
  Warnings:

  - You are about to drop the `Loop` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Loop" DROP CONSTRAINT "Loop_userId_fkey";

-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_loopId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_loopId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_loopId_fkey";

-- DropTable
DROP TABLE "Loop";

-- CreateTable
CREATE TABLE "loops" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "tags" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "loops_slug_key" ON "loops"("slug");

-- CreateIndex
CREATE INDEX "loops_city_idx" ON "loops"("city");

-- CreateIndex
CREATE INDEX "loops_featured_idx" ON "loops"("featured");

-- CreateIndex
CREATE INDEX "loops_published_idx" ON "loops"("published");

-- AddForeignKey
ALTER TABLE "loops" ADD CONSTRAINT "loops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_loopId_fkey" FOREIGN KEY ("loopId") REFERENCES "loops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_loopId_fkey" FOREIGN KEY ("loopId") REFERENCES "loops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_loopId_fkey" FOREIGN KEY ("loopId") REFERENCES "loops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
