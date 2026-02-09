/*
  Warnings:

  - You are about to drop the column `deptPrefix` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `matricFormat` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `levelId` on the `Level` table. All the data in the column will be lost.
  - Added the required column `matricFormat` to the `Level` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Department" DROP COLUMN "deptPrefix",
DROP COLUMN "matricFormat";

-- AlterTable
ALTER TABLE "Level" DROP COLUMN "levelId",
ADD COLUMN     "matricFormat" TEXT NOT NULL;
