import bcrypt from "bcryptjs";
import { z, ZodError } from "zod";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma.js";

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
  senderId: z.number(),
  receiverId: z.number(),
  message: z.string().trim(),
  imageUrl: z.string(),
});

const userMessageGroupSchema = z.object({
  senderId: z.number(),
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

const userIdSchema = z.object({
  id: z.number(),
});

const userInitialUpdateSchema = z.object({
  email: z.string(),
  pfpUrl: z.string(),
  blurb: z.string()
})

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
          username: userCheck.username,
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
      message: error instanceof Error? error.message: String(error)
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

export async function initialProfileUpdate(
  req: Request,
  res: Response,
) {
  try {
   const { email, pfpUrl, blurb } = userInitialUpdateSchema.parse(
      req.body,
    );

    //use updatedProfile
    const updatedProfile = await prisma.users.update({
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

export async function sendMessageSingleRecipient(
  req: Request,
  res: Response,
) {
  try {
    const { senderId, receiverId, message, imageUrl } =
      userMessageSingleSchema.parse(req.body);

    await prisma.messagesSolo.create({
      data: {
        senderId,
        receiverId,
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
    return(res.status(500).json({ message: error}))
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
}

export function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];

    if (!bearerToken) {
      return res.status(403);
    }
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

export async function receiveMessages(req: Request, res: Response) {
  try {
    const { id } = userIdSchema.parse(req.body);

    const messagesSolo = await prisma.messagesSolo.findMany({
      orderBy: {
        timeSent: "asc",
      },
    });

    const messagesGroup = await prisma.messagesGroup.findMany({
      orderBy: {
        timeSent: "asc",
      },
    });

    return res.status(200).json({
      messagesSolo,
      messagesGroup,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
