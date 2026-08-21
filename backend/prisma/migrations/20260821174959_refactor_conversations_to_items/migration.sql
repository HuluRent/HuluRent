/*
  Warnings:

  - Added the required column `itemId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_bookingId_fkey";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "itemId" TEXT NOT NULL,
ALTER COLUMN "bookingId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Conversation_itemId_idx" ON "Conversation"("itemId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
