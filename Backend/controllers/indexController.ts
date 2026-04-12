import bcrypt from "bcryptjs";
import { z, ZodError } from "zod";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";
import multer from "multer";
import cloudinary from "../lib/cloudinary.js";
import { type UploadApiResponse } from "cloudinary";

export const emailLengthErr = "must be between 1 and 254 characters";
export const lengthErrShort = "must be between 1 and 25 characters";
export const passwordAlphaNumericErr = "must contain at least a letter and a number";
export const emailErr = "Must be a valid email Address";

const userMessageSingleSchema = z.object({
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

const userGroupSchema = z.object({
  userIds: z.array(z.number()),
  name: z
    .string()
    .trim()
    .max(25, { message: `Group name: ${lengthErrShort}` }),
});

const userConversationSchema = z.object({
  conversationId: z.number(),
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

export async function createNewGroup(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userIds, name } = userGroupSchema.parse(req.body);

    //existing checks out of scope for now

    const newGroup = await prisma.groups.create({
      // create new group and link it to users by id
      data: {
        name,
        users: {
          connect: userIds.map((id: number) => ({ id })), // array becomes [{ id: number }] objects - go to users and find id 
        },
      },
    });

    return res.status(201).json({ newGroup });
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

interface AuthRequest extends Request {
  token?: string;
  user?: JwtPayload;
}

export function verifyToken( // REVIEW THIS
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (bearerHeader) {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];

    if (!bearerToken) {
      return res.sendStatus(401);
    }

    jwt.verify(bearerToken, process.env.JWT_SECRET as string, (err, decoded ) => { 
      //decoded is the payload if successful verification
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decoded as JwtPayload;
      req.token = bearerToken;
      next();
    })
    
  } else {
    // unauthorised
    res.sendStatus(401);
  }
}

export async function getUserConversations(req: AuthRequest, res: Response) {
  try {

    const id = req.user?.id

    const conversationsSolo = await prisma.conversationsSolo.findMany({
      where: {
        OR: [{ userA: id }, { userB: id }],
      },
      include: {
        messages: {
          take: 1, //just one message for preview
          orderBy: { timeSent: "desc" }, // latest message first
          include: {
            sender: {
              select: {
                username: true,
              },
            },
            receiver: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    const groups = await prisma.groups.findMany({
      where: {
        users: {
          some: {
            id,
          },
        },
      },
      include: {
        messages: {
          take: 1,
          orderBy: {
            timeSent: "desc",
          },
          include: {
            sender: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      conversationsSolo,
      groups,
    });
  } catch (error) {
    console.error("getUserConversations error:", error);
    return res.status(500).json({ error });
  }
}

export async function getUserProfile(req: AuthRequest, res: Response) {
  try {
    const id = req.user?.id;

    const user = await prisma.users.findUnique({
      where: { id: id },
      //include less info
    });
    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

export async function getSoloConversation(req: AuthRequest, res: Response) {
  try {
    const { conversationId } = userConversationSchema.parse({
      conversationId: Number(req.params.conversationId),
    });

    const userId = req.user?.id;

    const conversation = await prisma.conversationsSolo.findMany({
      where: {
        OR: [{ userA: userId }, { userB: userId }],
        AND: { id: conversationId },
      },
      include: {
        messages: {
          orderBy: { timeSent: "asc" },
          include: {
            sender: {
              select: {
                username: true,
                pfpUrl: true,
              },
            },
            receiver: {
              select: { username: true },
            },
          },
        },
      },
    });

    return res.status(200).json({
      conversation,
    });
  } catch (error) {
    console.error("getUserConversations error:", error);
    return res.status(500).json({ error });
  }
}

export async function getGroupConversation(req: AuthRequest, res: Response) {
  try {
    const id = req.user?.id;

    const groups = await prisma.groups.findMany({
      where: {
        users: {
          some: {
            id,
          },
        },
      },
      include: {
        messages: {
          orderBy: {
            timeSent: "asc",
          },
          include: {
            sender: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      groups,
    });
  } catch (error) {
    console.error("getUserConversations error:", error);
    return res.status(500).json({ error });
  }
}
