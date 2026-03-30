/*
  Warnings:

  - You are about to drop the `Conversations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ConversationsToUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupsToUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MessagesSolo" DROP CONSTRAINT "MessagesSolo_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationsToUsers" DROP CONSTRAINT "_ConversationsToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationsToUsers" DROP CONSTRAINT "_ConversationsToUsers_B_fkey";

-- DropForeignKey
ALTER TABLE "_GroupsToUsers" DROP CONSTRAINT "_GroupsToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupsToUsers" DROP CONSTRAINT "_GroupsToUsers_B_fkey";

-- DropTable
DROP TABLE "Conversations";

-- DropTable
DROP TABLE "_ConversationsToUsers";

-- DropTable
DROP TABLE "_GroupsToUsers";

-- CreateTable
CREATE TABLE "ConversationsSolo" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "ConversationsSolo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_groups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_groups_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserConversations" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserConversations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_groups_B_index" ON "_groups"("B");

-- CreateIndex
CREATE INDEX "_UserConversations_B_index" ON "_UserConversations"("B");

-- AddForeignKey
ALTER TABLE "MessagesSolo" ADD CONSTRAINT "MessagesSolo_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ConversationsSolo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_groups" ADD CONSTRAINT "_groups_A_fkey" FOREIGN KEY ("A") REFERENCES "Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_groups" ADD CONSTRAINT "_groups_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserConversations" ADD CONSTRAINT "_UserConversations_A_fkey" FOREIGN KEY ("A") REFERENCES "ConversationsSolo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserConversations" ADD CONSTRAINT "_UserConversations_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
