/*
  Warnings:

  - You are about to drop the `Tranfer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tranfer" DROP CONSTRAINT "Tranfer_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Tranfer" DROP CONSTRAINT "Tranfer_bankId_fkey";

-- DropTable
DROP TABLE "Tranfer";

-- CreateTable
CREATE TABLE "Transfer" (
    "id" SERIAL NOT NULL,
    "origin_account_id" INTEGER NOT NULL,
    "destiny_account_id" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "bankId" INTEGER,
    "accountId" INTEGER,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
