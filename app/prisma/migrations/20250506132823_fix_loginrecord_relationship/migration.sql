/*
  Warnings:

  - Added the required column `userId` to the `LoginRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LoginRecord" DROP CONSTRAINT "LoginRecord_id_fkey";

-- AlterTable
ALTER TABLE "LoginRecord" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LoginRecord" ADD CONSTRAINT "LoginRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
