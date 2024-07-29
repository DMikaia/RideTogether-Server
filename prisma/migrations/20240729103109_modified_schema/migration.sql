/*
  Warnings:

  - You are about to drop the column `offerId` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `conversationId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `offers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[offer_id]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[conversation_id]` on the table `messages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `offer_id` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conversation_id` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `offers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_offerId_fkey";

-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_senderId_fkey";

-- DropForeignKey
ALTER TABLE "offers" DROP CONSTRAINT "offers_ownerId_fkey";

-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "offerId",
DROP COLUMN "ownerId",
ADD COLUMN     "offer_id" TEXT NOT NULL,
ADD COLUMN     "owner_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "conversationId",
DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "conversation_id" TEXT NOT NULL,
ADD COLUMN     "sender_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "offers" DROP COLUMN "ownerId",
ADD COLUMN     "owner_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "conversations_offer_id_key" ON "conversations"("offer_id");

-- CreateIndex
CREATE UNIQUE INDEX "messages_conversation_id_key" ON "messages"("conversation_id");

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
