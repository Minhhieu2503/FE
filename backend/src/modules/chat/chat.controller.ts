import { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as chatService from './chat.service';

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { customerId, studioId, senderId, senderRole, text } = req.body;
    const roleFromHeader = req.header('x-role');
    const userIdFromHeader = req.header('x-user-id');

    if (!customerId || !studioId || !senderId || !senderRole || !text) {
      res.status(400).json({
        message: 'customerId, studioId, senderId, senderRole, text are required',
      });
      return;
    }

    if (
      !mongoose.Types.ObjectId.isValid(customerId) ||
      !mongoose.Types.ObjectId.isValid(studioId) ||
      !mongoose.Types.ObjectId.isValid(senderId)
    ) {
      res.status(400).json({ message: 'Invalid object id' });
      return;
    }

    if (!['customer', 'studio'].includes(senderRole)) {
      res.status(400).json({
        message: 'senderRole must be customer or studio',
      });
      return;
    }

    if (roleFromHeader !== senderRole) {
      res.status(403).json({
        message: 'Header role must match senderRole',
      });
      return;
    }

    if (userIdFromHeader !== senderId) {
      res.status(403).json({
        message: 'x-user-id must match senderId',
      });
      return;
    }

    const result = await chatService.sendMessage({
      customerId,
      studioId,
      senderId,
      senderRole,
      text,
    });

    res.status(201).json({
      message: 'Send message successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Send message failed',
    });
  }
};

export const getCustomerConversations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customerId = Array.isArray(req.params.customerId)
      ? req.params.customerId[0]
      : req.params.customerId;

    const roleFromHeader = req.header('x-role');
    const userIdFromHeader = req.header('x-user-id');

    if (roleFromHeader !== 'customer') {
      res.status(403).json({
        message: 'Only customer can view customer chat list',
      });
      return;
    }

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      res.status(400).json({ message: 'Invalid customer id' });
      return;
    }

    if (userIdFromHeader !== customerId) {
      res.status(403).json({
        message: 'You can only view your own chat list',
      });
      return;
    }

    const conversations = await chatService.getCustomerConversations(customerId);

    res.status(200).json({
      message: 'Get customer chat list successfully',
      data: conversations,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : 'Get customer chat list failed',
    });
  }
};

export const getStudioConversations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studioId = Array.isArray(req.params.studioId)
      ? req.params.studioId[0]
      : req.params.studioId;

    const roleFromHeader = req.header('x-role');
    const userIdFromHeader = req.header('x-user-id');

    if (roleFromHeader !== 'studio') {
      res.status(403).json({
        message: 'Only studio can view studio chat list',
      });
      return;
    }

    if (!studioId || !mongoose.Types.ObjectId.isValid(studioId)) {
      res.status(400).json({ message: 'Invalid studio id' });
      return;
    }

    if (userIdFromHeader !== studioId) {
      res.status(403).json({
        message: 'You can only view your own chat list',
      });
      return;
    }

    const conversations = await chatService.getStudioConversations(studioId);

    res.status(200).json({
      message: 'Get studio chat list successfully',
      data: conversations,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : 'Get studio chat list failed',
    });
  }
};

export const getConversationMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const conversationId = Array.isArray(req.params.conversationId)
      ? req.params.conversationId[0]
      : req.params.conversationId;

    const roleFromHeader = req.header('x-role');
    const userIdFromHeader = req.header('x-user-id');

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
      res.status(400).json({ message: 'Invalid conversation id' });
      return;
    }

    if (!roleFromHeader || !userIdFromHeader) {
      res.status(401).json({
        message: 'x-role and x-user-id are required',
      });
      return;
    }

    const conversation = await chatService.getConversationById(conversationId);

    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' });
      return;
    }

    const isCustomerOwner =
      roleFromHeader === 'customer' &&
      String(conversation.customerId) === userIdFromHeader;

    const isStudioOwner =
      roleFromHeader === 'studio' &&
      String(conversation.studioId) === userIdFromHeader;

    if (!isCustomerOwner && !isStudioOwner) {
      res.status(403).json({
        message: 'You are not allowed to view this conversation',
      });
      return;
    }

    const messages = await chatService.getConversationMessages(conversationId);

    res.status(200).json({
      message: 'Get messages successfully',
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Get messages failed',
    });
  }
};