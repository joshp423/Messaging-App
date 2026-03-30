-- AddForeignKey
ALTER TABLE "MessagesGroup" ADD CONSTRAINT "MessagesGroup_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
