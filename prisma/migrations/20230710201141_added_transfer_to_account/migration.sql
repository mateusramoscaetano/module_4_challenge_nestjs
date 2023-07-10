-- AlterTable
ALTER TABLE "Tranfer" ADD COLUMN     "accountId" INTEGER;

-- AddForeignKey
ALTER TABLE "Tranfer" ADD CONSTRAINT "Tranfer_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
