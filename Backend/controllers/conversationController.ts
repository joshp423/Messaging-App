import { z } from "zod";
import prisma from "../lib/prisma.js";
import { ConversationService } from "../service/conversation.js";
import { ConversationRepo } from "../repo/conversations.js";
import { config } from "../service/config.js";
import { lengthErrShort, type AuthRequest } from "./indexController.js";
import type { Request, Response } from "express";

const conversationRepo = new ConversationRepo(prisma);
const conversationService = new ConversationService(conversationRepo, config);

const userGroupSchema = z.object({
  userIds: z.array(z.number()),
  name: z
    .string()
    .trim()
    .max(25, { message: `Group name: ${lengthErrShort}` }),
});

const userConversationSchema = z.object({
  userId: z.number(),
  conversationId: z.number(),
});

export async function getUserConversations(req: AuthRequest, res: Response) {
  const id = req.user?.id;

  const conversationsSolo = await conversationService.getAllSolo(id);
  const groups = await conversationService.getAllGroups(id);

  if (!conversationsSolo && !groups) {
    return res.status(500).json({
      message: "an unexpected error occured",
    });
  }

  return res.status(200).json({
    conversationsSolo,
    groups,
  });
}

export async function getSoloConversation(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  const { conversationId } = req.body;

  const { success, data, error } = userConversationSchema.safeParse({
    userId,
    conversationId,
  });

  if (!success) {
    return res.status(400).json({
      errors: error,
    });
  }

  const conversation = await conversationService.getSelectedSolo(
    data.userId,
    data.conversationId,
  );

  if (!conversation) {
    return res.status(500).json({
      message: "an unexpected error occured",
    });
  }

  return res.status(200).json({ conversation });
}

export async function getGroupConversation(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  const { conversationId } = req.body;

  const { success, data, error } = userConversationSchema.safeParse({
    userId,
    conversationId,
  });

  if (!success) {
    return res.status(400).json({
      errors: error,
    });
  }

  const group = await conversationService.getSelectedGroup(
    data.userId,
    data.conversationId,
  );

  if (!group) {
    return res.status(500).json({
      message: "an unexpected error occured",
    });
  }

  return res.status(200).json({ group });
}

export async function createNewGroup(req: Request, res: Response) {
  const { userIds, name } = req.body;

  const { success, data, error } = userGroupSchema.safeParse({
    userIds,
    name,
  });

  if (!success) {
    return res.status(400).json({
      errors: error,
    });
  }

  const newGroup = await conversationService.createGroup(data);

  if (!newGroup) {
    return res.status(500).json({
      message: "an unexpected error occured",
    });
  }

  return res.status(201).json({ newGroup });
}
