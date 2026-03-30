/*
  Warnings:

  - You are about to drop the `_conversations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userA` to the `ConversationsSolo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userB` to the `ConversationsSolo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_conversations" DROP CONSTRAINT "_conversations_A_fkey";

-- DropForeignKey
ALTER TABLE "_conversations" DROP CONSTRAINT "_conversations_B_fkey";

-- AlterTable
ALTER TABLE "ConversationsSolo" ADD COLUMN     "userA" INTEGER NOT NULL,
ADD COLUMN     "userB" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_conversations";

-- AddForeignKey
ALTER TABLE "ConversationsSolo" ADD CONSTRAINT "ConversationsSolo_userA_fkey" FOREIGN KEY ("userA") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationsSolo" ADD CONSTRAINT "ConversationsSolo_userB_fkey" FOREIGN KEY ("userB") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
