



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

export async function getUserConversations(req: AuthRequest, res: Response) {
  try {
    const id = req.user?.id;

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
