import { z, ZodError } from "zod";
import multer from "multer";
import cloudinary from "../lib/cloudinary.js";
import { type UploadApiResponse } from "cloudinary";
import type { Request, Response, NextFunction } from "express";
import { type AuthRequest } from "./indexController";
import { MessageService } from "../service/message.js";
import { MessageRepo } from "../repo/messages.js";
import prisma from "../lib/prisma.js";
import { config } from "../service/config.js";


const messageRepo = new MessageRepo(prisma); // need db to create service, as it is a dependancy
const messageService = new MessageService(messageRepo, config); // instantiate user service for handlers to call

const userMessageSingleSchema = z.object({
  senderId: z.number(),
  receiverId: z.number(),
  message: z.string().trim(),
  imageUrl: z.string(),
  conversationId: z.number(),
});

const userMessageGroupSchema = z.object({
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

export async function sendMessageSingleRecipient(req: AuthRequest, res: Response) {
  //check for existing conversation and add otherwise create new

  const { receiverId, message, imageUrl, conversationId } = req.body;
  
  const senderId = req.user?.id

  const { success, data, error } = userMessageSingleSchema.safeParse({
    senderId,
    receiverId,
    message,
    imageUrl,
    conversationId,
  })

  if (!success) {
    return res.status(400).json({
      errors: error,
    });
  }


  let newOrExistingConversation = data.conversationId;

  const existingCheck = 

  const newMessageSolo = await messageService.create(data);




  try {
    const { receiverId, message, imageUrl, conversationId } =
      userMessageSingleSchema.parse(req.body);
    
      const senderId = req.user?.id
      let newOrExistingConversation = conversationId;
      const existingCheck = await prisma.conversationsSolo.findUnique({
        where: {
          id: conversationId
        }
      })

      if (!existingCheck) {
        const newConversation = await prisma.conversationsSolo.create({
          data: {
            userA: senderId,
            userB: receiverId,
          }
        })
        newOrExistingConversation = newConversation.id;
      }

    await prisma.messagesSolo.create({
      data: {
        senderId,
        receiverId,
        message,
        imageUrl,
        conversationId: newOrExistingConversation,
      },
    });
    return res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      //if error is a zod error send back
      return res.status(400).json({
        errors: error.issues,
      });
    }
    return res.status(500).json({ message: error });
  }
}

export async function sendMessageGroupRecipient(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { groupId, message, imageUrl } =
      userMessageGroupSchema.parse(req.body);

      const senderId = req.user?.id      

    await prisma.messagesGroup.create({
      data: {
        senderId,
        groupId,
        message,
        imageUrl,
      },
    });
    return res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      //if error is a zod error send back
      return res.status(400).json({
        errors: error.issues,
      });
    }
    next(error);
  }
}

