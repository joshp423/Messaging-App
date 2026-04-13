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
export const passwordAlphaNumericErr =
  "must contain at least a letter and a number";
export const emailErr = "Must be a valid email Address";

export interface AuthRequest extends Request {
  token?: string;
  user?: JwtPayload;
}

export function verifyToken(
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

    jwt.verify(
      bearerToken,
      process.env.JWT_SECRET as string,
      (err, decoded) => {
        //decoded is the payload if successful verification
        if (err) {
          return res.sendStatus(403);
        }
        req.user = decoded as JwtPayload;
        req.token = bearerToken;
        next();
      },
    );
  } else {
    // unauthorised
    res.sendStatus(401);
  }
}
