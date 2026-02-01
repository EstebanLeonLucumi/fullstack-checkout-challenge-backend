/*
  Warnings:

  - You are about to drop the column `wompiTransactionId` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalTransactionId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "full_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "wompiTransactionId",
ADD COLUMN     "externalTransactionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
