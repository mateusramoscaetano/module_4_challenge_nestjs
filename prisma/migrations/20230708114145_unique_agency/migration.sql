/*
  Warnings:

  - A unique constraint covering the columns `[agency]` on the table `Bank` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bank_agency_key" ON "Bank"("agency");
