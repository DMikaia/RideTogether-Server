-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL,
    "departure_place" TEXT NOT NULL,
    "destination_place" TEXT NOT NULL,
    "departure_date" TIMESTAMP(3) NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "seats" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "offerId" TEXT,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT,
    "content" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OfferParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UserConversationsAsParticipant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "offers_id_key" ON "offers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_id_key" ON "conversations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "messages_id_key" ON "messages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_OfferParticipants_AB_unique" ON "_OfferParticipants"("A", "B");

-- CreateIndex
CREATE INDEX "_OfferParticipants_B_index" ON "_OfferParticipants"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserConversationsAsParticipant_AB_unique" ON "_UserConversationsAsParticipant"("A", "B");

-- CreateIndex
CREATE INDEX "_UserConversationsAsParticipant_B_index" ON "_UserConversationsAsParticipant"("B");

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfferParticipants" ADD CONSTRAINT "_OfferParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfferParticipants" ADD CONSTRAINT "_OfferParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserConversationsAsParticipant" ADD CONSTRAINT "_UserConversationsAsParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserConversationsAsParticipant" ADD CONSTRAINT "_UserConversationsAsParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
