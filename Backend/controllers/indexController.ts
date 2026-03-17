import bcrypt from "bcryptjs";
import { z, ZodError } from "zod";
import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

const emailLengthErr = "must be between 1 and 50 characters";
const lengthErrShort = "must be between 1 and 25 characters";
const passwordAlphaNumericErr = "must contain at least a letter and a number";
const emailErr = "Must be a valid email Adress"

const userSchema = z.object({
  //parses the object to the schema, narrowing the types that are allowed
  username: z.string().trim().max(25, { message: `Username: ${lengthErrShort}` }).min(1, { message: lengthErrShort }),
  password: z.string().trim().max(25, { message: `Password: ${lengthErrShort}` }).min(1, { message: lengthErrShort }).regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: passwordAlphaNumericErr}),
  email: z.email({message: emailErr}).max(25, { message: `Email: ${emailLengthErr}` }).trim()
});


export async function signUp (req: Request, res: Response, next: NextFunction) {
    const user = {
        username: req.body["username"],
        email: req.body["email"],
        password: req.body["password"],
    }
    const parsedUser = userSchema.parse(user);

    if (typeof parsedUser.username != "string") {
        return res.status(400).json({ message: "Incorrect header" });
    }

    try {
        const hashedPassword = await bcrypt.hash(parsedUser.password, 10);
        await prisma.users.create({
            data: {
                username: parsedUser.username,
                email: parsedUser.email,
                password: hashedPassword
            }
        })
        return res.status(201).json({ message: "Successful Sign-Up" });
    } catch (error) {
        if (error instanceof ZodError) { //if error is a zod error send back
            return res.status(400).json({
                errors: error.issues
            });
        }
      next(error);
    }
}

export async function logIn