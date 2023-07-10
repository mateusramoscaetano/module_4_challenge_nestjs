/*
  Warnings:

  - Changed the type of `origin_account_id` on the `Tranfer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `destiny_account_id` on the `Tranfer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Tranfer" DROP COLUMN "origin_account_id",
ADD COLUMN     "origin_account_id" INTEGER NOT NULL,
DROP COLUMN "destiny_account_id",
ADD COLUMN     "destiny_account_id" INTEGER NOT NULL;
