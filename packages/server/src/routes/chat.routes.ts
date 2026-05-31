import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import {
  getConversations,
  getMessages,
  sendMessage,
  createOrGetDirectConversation,
  createGroupConversation,
  addGroupMember,
  removeGroupMember
} from '../controllers/chat.controller';

const router = Router();

router.use(protect); // Secure all chat routes

router.get('/conversations', getConversations);
router.post('/conversations/direct', createOrGetDirectConversation);
router.post('/conversations/group', createGroupConversation);
router.put('/conversations/group/:conversationId/add', addGroupMember);
router.put('/conversations/group/:conversationId/remove', removeGroupMember);
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/messages', sendMessage);

export default router;
