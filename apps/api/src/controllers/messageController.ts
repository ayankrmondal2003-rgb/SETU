import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ApiError } from '../utils/apiError.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

const initiateSchema = z.object({
  vendorId: z.string(),
  message: z.string().optional()
});

const messageSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty')
});

// Initiate or retrieve conversation between tourist and vendor
export async function initiateOrGetConversation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const { vendorId, message } = initiateSchema.parse(req.body);

    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new ApiError(404, 'Vendor not found');

    // Find existing or create new conversation
    let conversation = await prisma.conversation.findUnique({
      where: {
        vendorId_touristUserId: {
          vendorId,
          touristUserId: req.user.userId
        }
      },
      include: {
        vendor: { select: { id: true, businessName: true, logo: true, city: true, phone: true } },
        touristUser: { select: { id: true, name: true, email: true, avatar: true } }
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          vendorId,
          touristUserId: req.user.userId
        },
        include: {
          vendor: { select: { id: true, businessName: true, logo: true, city: true, phone: true } },
          touristUser: { select: { id: true, name: true, email: true, avatar: true } }
        }
      });
    }

    // If initial message supplied, create message
    if (message && message.trim()) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: req.user.userId,
          content: message.trim()
        }
      });

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() }
      });

      // Auto-create Notification for Vendor
      await prisma.notification.create({
        data: {
          vendorId,
          type: 'message_new',
          title: 'New Tourist Message',
          message: `New message from ${req.user.name || 'Tourist'}: "${message.trim().substring(0, 80)}${message.trim().length > 80 ? '...' : ''}"`
        }
      }).catch(() => {});
    }

    // Return conversation with messages
    const messages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' }
    });

    return res.status(200).json({
      success: true,
      data: {
        conversation,
        messages
      }
    });
  } catch (error) {
    next(error);
  }
}

// Get all conversations for logged-in tourist
export async function getTouristConversations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const conversations = await prisma.conversation.findMany({
      where: { touristUserId: req.user.userId },
      include: {
        vendor: {
          select: { id: true, businessName: true, logo: true, city: true, district: true, phone: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Unread count across conversations for this tourist
    const unreadCount = await prisma.message.count({
      where: {
        conversation: { touristUserId: req.user.userId },
        isRead: false,
        senderId: { not: req.user.userId }
      }
    });

    return res.json({
      success: true,
      unreadCount,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
}

// Get messages in a conversation (ownership checked)
export async function getConversationThread(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const { id } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        vendor: { select: { id: true, userId: true, businessName: true, logo: true, city: true, phone: true } },
        touristUser: { select: { id: true, name: true, email: true, avatar: true } }
      }
    });

    if (!conversation) throw new ApiError(404, 'Conversation not found');

    const isTourist = conversation.touristUserId === req.user.userId;
    const isVendorOwner = conversation.vendor.userId === req.user.userId;

    if (!isTourist && !isVendorOwner) {
      throw new ApiError(403, 'Forbidden: You do not have permission to view this conversation');
    }

    // Mark messages sent by opposite party as read
    await prisma.message.updateMany({
      where: {
        conversationId: id,
        senderId: { not: req.user.userId },
        isRead: false
      },
      data: { isRead: true }
    });

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' }
    });

    return res.json({
      success: true,
      data: {
        conversation,
        messages
      }
    });
  } catch (error) {
    next(error);
  }
}

// Post a message in conversation (ownership checked)
export async function sendMessageInConversation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError(401, 'Unauthorized');

    const { id } = req.params;
    const { content } = messageSchema.parse(req.body);

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        vendor: { select: { id: true, userId: true, businessName: true } }
      }
    });

    if (!conversation) throw new ApiError(404, 'Conversation not found');

    const isTourist = conversation.touristUserId === req.user.userId;
    const isVendorOwner = conversation.vendor.userId === req.user.userId;

    if (!isTourist && !isVendorOwner) {
      throw new ApiError(403, 'Forbidden: You do not have permission to reply in this conversation');
    }

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: req.user.userId,
        content: content.trim()
      }
    });

    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    // If tourist sent message, trigger vendor Notification
    if (isTourist) {
      await prisma.notification.create({
        data: {
          vendorId: conversation.vendorId,
          type: 'message_new',
          title: 'New Message from Tourist',
          message: `New message from ${req.user.name || 'Tourist'}: "${content.trim().substring(0, 80)}${content.trim().length > 80 ? '...' : ''}"`
        }
      }).catch(() => {});
    }

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
}
