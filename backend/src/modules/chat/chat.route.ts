import { Router } from 'express';
import {
  getConversationMessages,
  getCustomerConversations,
  getStudioConversations,
  sendMessage,
} from './chat.controller';

const router = Router();

router.post('/send', sendMessage);
router.get('/customer/:customerId/conversations', getCustomerConversations);
router.get('/studio/:studioId/conversations', getStudioConversations);
router.get('/conversations/:conversationId/messages', getConversationMessages);

export default router;