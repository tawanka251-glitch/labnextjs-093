-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "hearts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "tag" TEXT;
