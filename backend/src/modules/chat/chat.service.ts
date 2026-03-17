import Conversation from './chat.model';
import Message, { SenderRole } from './message.model';
import User from '../user/user.model';

interface SendMessageInput {
  customerId: string;
  studioId: string;
  senderId: string;
  senderRole: SenderRole;
  text: string;
}

export const sendMessage = async (payload: SendMessageInput) => {
  const { customerId, studioId, senderId, senderRole, text } = payload;

  const customer = await User.findById(customerId);
  const studio = await User.findById(studioId);
  const sender = await User.findById(senderId);

  if (!customer) {
    throw new Error('Customer not found');
  }

  if (!studio) {
    throw new Error('Studio not found');
  }

  if (!sender) {
    throw new Error('Sender not found');
  }

  if (customer.role !== 'customer') {
    throw new Error('customerId must belong to customer');
  }

  if (studio.role !== 'studio') {
    throw new Error('studioId must belong to studio');
  }

  if (senderRole === 'customer' && String(sender._id) !== String(customer._id)) {
    throw new Error('Customer senderId is invalid');
  }

  if (senderRole === 'studio' && String(sender._id) !== String(studio._id)) {
    throw new Error('Studio senderId is invalid');
  }

  if (!sender.isActive) {
    throw new Error('Sender account is suspended');
  }

  let conversation = await Conversation.findOne({ customerId, studioId });

  if (!conversation) {
    conversation = await Conversation.create({
      customerId,
      studioId,
      lastMessage: text,
      lastMessageAt: new Date(),
    });
  } else {
    conversation.lastMessage = text;
    conversation.lastMessageAt = new Date();
    await conversation.save();
  }

  const message = await Message.create({
    conversationId: conversation._id,
    senderId,
    senderRole,
    text,
  });

  return {
    conversation,
    message,
  };
};

export const getCustomerConversations = async (customerId: string) => {
  return await Conversation.find({ customerId })
    .populate('studioId', 'fullName email phone role isActive')
    .sort({ lastMessageAt: -1, updatedAt: -1 });
};

export const getStudioConversations = async (studioId: string) => {
  return await Conversation.find({ studioId })
    .populate('customerId', 'fullName email phone role isActive')
    .sort({ lastMessageAt: -1, updatedAt: -1 });
};

export const getConversationMessages = async (conversationId: string) => {
  return await Message.find({ conversationId }).sort({ createdAt: 1 });
};

export const getConversationById = async (conversationId: string) => {
  return await Conversation.findById(conversationId);
};