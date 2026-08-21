const { prisma } = require('../../config/database');

async function findConversationsByUserId(userId) {
  return prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId,
        },
      },
    },
    include: {
      item: {
        include: {
          images: {
            orderBy: {
              position: 'asc',
            },
          },
        },
      },
      booking: true,
      participants: {
        include: {
          user: {
            select: {
              id: true,
              profile: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async function findConversationById(conversationId) {
  return prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      participants: true,
    },
  });
}

async function findMessages(conversationId, skip, take) {
  return prisma.message.findMany({
    where: {
      conversationId,
    },
    include: {
      sender: {
        select: {
          id: true,
          profile: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
    skip,
    take,
  });
}

async function countMessages(conversationId) {
  return prisma.message.count({
    where: {
      conversationId,
    },
  });
}

async function createMessage({ conversationId, senderId, content }) {
  return prisma.message.create({
    data: {
      conversationId,
      senderId,
      content,
    },
    include: {
      sender: {
        select: {
          id: true,
          profile: true,
        },
      },
    },
  });
}

async function findConversationByItemAndParticipants(itemId, user1Id, user2Id) {
  return prisma.conversation.findFirst({
    where: {
      itemId,
      participants: {
        some: { userId: user1Id },
      },
      AND: {
        participants: {
          some: { userId: user2Id },
        },
      },
    },
    include: {
      participants: true,
    }
  });
}

async function createConversation(itemId, userIds) {
  return prisma.conversation.create({
    data: {
      itemId,
      participants: {
        create: userIds.map((userId) => ({ userId })),
      },
    },
    include: {
      participants: true,
    }
  });
}

module.exports = {
  findConversationsByUserId,
  findConversationById,
  findMessages,
  countMessages,
  createMessage,
  findConversationByItemAndParticipants,
  createConversation,
};
