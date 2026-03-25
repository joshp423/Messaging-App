/*
  Warnings:

  - Added the required column `conversationId` to the `MessagesSolo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MessagesSolo" ADD COLUMN     "conversationId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Conversations" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConversationsToUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ConversationsToUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ConversationsToUsers_B_index" ON "_ConversationsToUsers"("B");

-- AddForeignKey
ALTER TABLE "MessagesSolo" ADD CONSTRAINT "MessagesSolo_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationsToUsers" ADD CONSTRAINT "_ConversationsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationsToUsers" ADD CONSTRAINT "_ConversationsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
