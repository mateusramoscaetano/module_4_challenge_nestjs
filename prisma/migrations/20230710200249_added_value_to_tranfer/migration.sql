/*
  Warnings:

  - Added the required column `value` to the `Tranfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tranfer" ADD COLUMN     "value" INTEGER NOT NULL;
