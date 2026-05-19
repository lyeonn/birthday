/*
  Warnings:

  - A unique constraint covering the columns `[nickname,pin]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pin` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pin" VARCHAR(4) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_pin_key" ON "User"("nickname", "pin");
