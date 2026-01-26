/*
  Warnings:

  - Added the required column `deptPrefix` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "deptPrefix" TEXT NOT NULL;
