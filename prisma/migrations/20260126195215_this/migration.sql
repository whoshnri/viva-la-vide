/*
  Warnings:

  - Added the required column `levelId` to the `Level` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Level" ADD COLUMN     "levelId" TEXT NOT NULL;
