import z from "zod";
import {
  emailErr,
  emailLengthErr,
  lengthErrShort,
  passwordAlphaNumericErr,
} from "./indexController.js";
import { type Request, type Response } from "express";
import prisma from "../lib/prisma.js";
import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../lib/cloudinary.js";
import multer from "multer";
import { UserService } from "../service/user.js";
import { UserRepo } from "../repo/users.js";
import { config } from "../service/config.js";

const userRepo = new UserRepo(prisma); // need db to create service, as it is a dependancy
const userService = new UserService(userRepo, config); // instantiate user service for handlers to call

const SignUpSchema = z.object({
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

const LogInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

const EditProfileSchema = z.object({
  id: z.number(),
  username: z
    .string()
    .trim()
    .max(25, { message: `Username: ${lengthErrShort}` })
    .min(1, { message: lengthErrShort }),
  pfpUrl: z.string().trim(),
  blurb: z.string().trim(),
});

const GetUserIdSchema = z.object({
  selectedUsername: z.string(),
});

const GetUserIdsSchema = z.object({
  usernames: z.array(z.string()),
});

const userInitialUpdateSchema = z.object({
  email: z.string(),
  pfpUrl: z.string(),
  blurb: z.string(),
});

export async function signUp(req: Request, res: Response) {
  const { username, email, password } = req.body;

  const { success, data, error } = SignUpSchema.safeParse({
    username,
    email,
    password,
  });

  if (!success) {
    return res.status(400).json({
      errors: error,
    });
  }

  await userService.create(data);

  return res.status(201).json({ message: "Successful Sign-Up" });
}

export async function logIn(req: Request, res: Response) {
  const { email, password } = req.body;

  const { success, data, error } = LogInSchema.safeParse({
    email,
    password,
  });

  if (!success) {
    return res.status(400).json({
      errors: error,
    });
  }

  const user = await userService.get(data.email);

  if (!user) {
    return res.status(403).json({ message: "Login failed" });
  }

  const token = await userService.login(user.id, user.username, data.password);

  if (!token) {
    return res.status(500).json({
      message: "an unexpected error occured",
    });
  }

  return res.json({
    message: "Successfully logged in",
    token,
  });
}

export async function editProfile(req: Request, res: Response) {
  const { id, username, pfpUrl, blurb } = req.body;

  const { success, data, error } = EditProfileSchema.safeParse({
    id,
    username,
    pfpUrl,
    blurb,
  });

  if (!success) {
    return res.status(400).json({
      errors: error,
    });
  }

  const updatedUser = await userService.edit(
    data.id,
    data.username,
    data.pfpUrl,
    data.blurb,
  );

  if (!updatedUser) {
    return res.status(500).json({
      message: "an unexpected error occured",
    });
  }

  return res.status(201).json({ message: "successfully updated profile" });
}

export async function getUserId(req: Request, res: Response) {
  const { selectedUsername } = req.body;

  const { success, data, error } = GetUserIdSchema.safeParse({
    selectedUsername,
  });

  if (!success) {
    return res.status(400).json({
      errors: error,
    });
  }

  const selectedUserId = await userService.getId(data.selectedUsername);

  if (!selectedUserId) {
    return res.status(500).json({
      message: "an unexpected error occured",
    });
  }

  return res.status(200).json({ selectedUserId });
}

export async function getUserIds(req: Request, res: Response) {
  const { usernames } = req.body;

  const { success, data, error } = GetUserIdsSchema.safeParse({
    usernames,
  });

  if (!success) {
    return res.status(400).json({
      errors: error,
    });
  }

  const selectedUserIds = await userService.getIds(data.usernames);

  if (!selectedUserIds) {
    return res.status(500).json({
      message: "an unexpected error occured",
    });
  }

  return res.status(200).json({ selectedUserIds });
}

export async function initialProfileUpdate(req: Request, res: Response) {
  const { email, pfpUrl, blurb } = req.body;

  const { success, data, error } = userInitialUpdateSchema.safeParse({
    email,
    pfpUrl,
    blurb,
  });

  if (!success) {
    return res.status(400).json({
      errors: error,
    });
  }

  const initialUpdate = await userService.initialUpdateEdit(
    data.email,
    data.pfpUrl,
    data.blurb,
  );

  if (!initialUpdate) {
    return res.status(500).json({
      message: "an unexpected error occured",
    });
  }

  return res.status(201);
}

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

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
