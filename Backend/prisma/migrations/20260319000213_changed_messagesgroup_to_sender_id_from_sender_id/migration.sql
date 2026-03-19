/*
  Warnings:

  - You are about to drop the column `senderID` on the `MessagesGroup` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `MessagesGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MessagesGroup" DROP COLUMN "senderID",
ADD COLUMN     "senderId" INTEGER NOT NULL;
