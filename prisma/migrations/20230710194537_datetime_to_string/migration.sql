/*
  Warnings:

  - Added the required column `date` to the `Tranfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tranfer" ADD COLUMN     "date" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Withdrawal" ALTER COLUMN "date" DROP DEFAULT,
ALTER COLUMN "date" SET DATA TYPE TEXT;
