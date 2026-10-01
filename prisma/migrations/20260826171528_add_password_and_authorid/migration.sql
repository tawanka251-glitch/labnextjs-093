/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "authorId" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Message_email_key" ON "Message"("email");
