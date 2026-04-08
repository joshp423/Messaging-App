import bcrypt from "bcryptjs";
import { z, ZodError } from "zod";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";
import multer from "multer";
import cloudinary from "../lib/cloudinary.js";
import { type UploadApiResponse } from "cloudinary";

const emailLengthErr = "must be between 1 and 254 characters";
const lengthErrShort = "must be between 1 and 25 characters";
const passwordAlphaNumericErr = "must contain at least a letter and a number";
const emailErr = "Must be a valid email Address";

const userSignUpSchema = z.object({
  //parses the object to the schema, narrowing the types that are allowed
  username: z
    .string()
    .trim()
    .max(25, { message: `Username: ${lengthErrShort}` })
    .min(1, { message: lengthErrShort }),
  password: z
    .string()
    .trim()
    .max(25, { message: `Password: ${lengthErrShort}` })
    .min(1, { message: lengthErrShort })
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: passwordAlphaNumericErr }),
  email: z
    .email({ message: emailErr })
    .max(254, { message: `Email: ${emailLengthErr}` })
    .trim(),
});

const userLogInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

const userEditProfileSchema = z.object({
  id: z.number(),
  username: z
    .string()
    .trim()
    .max(25, { message: `Username: ${lengthErrShort}` })
    .min(1, { message: lengthErrShort }),
  pfpUrl: z.string().trim(),
  blurb: z.string().trim(),
});

const userMessageSingleSchema = z.object({
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

const userGetIdSchema = z.object({
  selectedUsername: z.string()
});

const userGroupSchema = z.object({
  userIds: z.array(z.number()),
  name: z
    .string()
    .trim()
    .max(25, { message: `Group name: ${lengthErrShort}` }),
});

const userInitialUpdateSchema = z.object({
  email: z.string(),
  pfpUrl: z.string(),
  blurb: z.string(),
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

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const user = {
    username: req.body["username"],
    email: req.body["email"],
    password: req.body["password"],
  };

  try {
    const parsedUser = userSignUpSchema.parse(user);

    if (typeof parsedUser.username != "string") {
      return res.status(400).json({ message: "Incorrect header" });
    }

    const hashedPassword = await bcrypt.hash(parsedUser.password, 10);

    await prisma.users.create({
      data: {
        username: parsedUser.username,
        email: parsedUser.email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "Successful Sign-Up" });
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

export async function logIn(req: Request, res: Response) {
  const user = {
    email: req.body["email"],
    password: req.body["password"],
  };

  try {
    const parsedUser = userLogInSchema.parse(user);

    if (typeof parsedUser.email != "string") {
      return res.status(400).json({ message: "Incorrect header" });
    }
    const userCheck = await prisma.users.findUnique({
      where: {
        email: parsedUser.email,
      },
    });

    if (!userCheck) {
      return res.status(400).json({ message: "Incorrect username" });
    }

    const match = await bcrypt.compare(parsedUser.password, userCheck.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT secret is not defined");
    }

    jwt.sign(
      { id: userCheck.id, username: userCheck.username },
      secret,
      { expiresIn: "1w" },
      function (err, token) {
        if (err || !token) {
          //need to account for an error or no token
          return res.status(500).json({ message: "Token generation failed" });
        }
        return res.json({
          message: "Successfully logged in",
          token,
        });
      },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      //if error is a zod error send back
      return res.status(400).json({
        errors: error.issues,
      });
    }
    return res.status(500).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function editProfile(req: Request, res: Response) {
  try {
    const { id, username, pfpUrl, blurb } = userEditProfileSchema.parse(
      req.body,
    );

    //use updatedProfile
    const updatedProfile = await prisma.users.update({
      where: { id },
      data: {
        username,
        pfpUrl,
        blurb,
      },
    });

    return res.status(201).json({ message: "successfully updated profile" });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

export async function initialProfileUpdate(req: Request, res: Response) {
  try {
    const { email, pfpUrl, blurb } = userInitialUpdateSchema.parse(req.body);

    //use updatedProfile
    await prisma.users.update({
      where: { email },
      data: {
        pfpUrl,
        blurb,
      },
    });

    return res.status(201).json({ message: "successfully updated profile" });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

export const uploadPFP = [
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

      return res.status(201).json({ pfpUrl: uploadResult.secure_url });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },
];

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

export async function getUserId(req: Request, res: Response) {
  try {
    const { selectedUsername } =
      userGetIdSchema.parse(req.body);

    const selectedUserId = await prisma.users.findUnique({
      where: {
        username: selectedUsername
      },
    });
    return res.status(201).json({ selectedUserId });
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
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { senderId, groupId, message, imageUrl } =
      userMessageGroupSchema.parse(req.body);

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

    await prisma.groups.create({
      // create new group and link it to users by id
      data: {
        name,
        users: {
          connect: userIds.map((id: number) => ({ id })), // array becomes [{ id: number }] objects - go to users and find id =
        },
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
