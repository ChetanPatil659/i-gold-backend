-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_id_fkey";

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_phone_fkey" FOREIGN KEY ("phone") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
