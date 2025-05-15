/*
  Warnings:

  - You are about to drop the column `userId` on the `LoginRecord` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LoginRecord" DROP CONSTRAINT "LoginRecord_userId_fkey";

-- AlterTable
ALTER TABLE "LoginRecord" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "LoginRecord" ADD CONSTRAINT "LoginRecord_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
