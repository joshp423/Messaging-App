/*
  Warnings:

  - You are about to drop the `_UserConversations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserConversations" DROP CONSTRAINT "_UserConversations_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserConversations" DROP CONSTRAINT "_UserConversations_B_fkey";

-- DropTable
DROP TABLE "_UserConversations";

-- CreateTable
CREATE TABLE "_conversations" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_conversations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_conversations_B_index" ON "_conversations"("B");

-- AddForeignKey
ALTER TABLE "_conversations" ADD CONSTRAINT "_conversations_A_fkey" FOREIGN KEY ("A") REFERENCES "ConversationsSolo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_conversations" ADD CONSTRAINT "_conversations_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
