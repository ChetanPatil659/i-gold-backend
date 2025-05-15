/*
  Warnings:

  - Added the required column `userPhone` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_phone_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "userPhone" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userPhone_fkey" FOREIGN KEY ("userPhone") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
