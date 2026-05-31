import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { generateSmartReplies, summarizeConversation } from '../controllers/ai.controller';

const router = Router();

router.use(protect);

router.get('/:conversationId/smart-replies', generateSmartReplies);
router.get('/:conversationId/summarize', summarizeConversation);

export default router;
