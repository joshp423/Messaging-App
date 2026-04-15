import { z } from "zod";
import multer from "multer";
import cloudinary from "../lib/cloudinary.js";
import { type UploadApiResponse } from "cloudinary";
import type { Request, Response, NextFunction } from "express";
import { type AuthRequest } from "./indexController.js";
import { MessageService } from "../service/message.js";
import { MessageRepo } from "../repo/messages.js";
import prisma from "../lib/prisma.js";
import { config } from "../service/config.js";
import { ConversationService } from "../service/conversation.js";
import { ConversationRepo } from "../repo/conversations.js";

const messageRepo = new MessageRepo(prisma);
const messageService = new MessageService(messageRepo, config);
const conversationRepo = new ConversationRepo(prisma);
const conversationService = new ConversationService(conversationRepo, config);

const userMessageSingleSchema = z.object({
  senderId: z.number(),
  receiverId: z.number(),
  message: z.string().trim(),
  imageUrl: z.string(),
  conversationId: z.number(),
});

const userMessageGroupSchema = z.object({
  senderId: z.number(),
  groupId: z.number(),
  message: z.string().trim(),
  imageUrl: z.string(),
});

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export const uploadMessageImage = [
  upload.single("uploaded_file"),
  async (req: Request, res: Response) => {
    try {
      const uploadResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          //convert callback to promise because of async route handler
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result as UploadApiResponse);
            },
          );
          stream.end(req.file?.buffer);
        },
      );
      return res.status(201).json({ imageUrl: uploadResult.secure_url });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
];

export async function sendMessageSingleRecipient(
  req: AuthRequest,
  res: Response,
) {
  //check for existing conversation and add otherwise create new

  const { receiverId, message, imageUrl, conversationId } = req.body;

  const senderId = req.user?.id;

  const { success, data, error } = userMessageSingleSchema.safeParse({
    senderId,
    receiverId,
    message,
    imageUrl,
    conversationId,
  });

  if (!success) {
    return res.status(400).json({
      errors: error,
    });
  }

  const existingCheck = await conversationService.existingCheck(
    data.conversationId,
  );

  if (!existingCheck) {
    const newConversation = await conversationService.createSolo(
      data.senderId,
      data.receiverId,
    );
    data.conversationId = newConversation.id;
  }
  const newMessageSolo = await messageService.create(data);

  if (!newMessageSolo) {
    return res.status(500).json({
      message: "an unexpected error occured",
    });
  }

  return res.status(201).json({ message: "Message sent successfully" });
}

export async function sendMessageGroupRecipient(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const { groupId, message, imageUrl } = req.body;

  const senderId = req.user?.id;

  const { success, data, error } = userMessageGroupSchema.safeParse({
    senderId,
    groupId,
    message,
    imageUrl,
  });

  if (!success) {
    return res.status(400).json({
      errors: error,
    });
  }

  const newGroupMessage = await messageService.createGroupMessage(data);

  if (!newGroupMessage) {
    return res.status(500).json({
      message: "an unexpected error occured",
    });
  }

  return res.status(201).json({ message: "Message sent successfully" });
}
