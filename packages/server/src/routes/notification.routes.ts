import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller';

const router = Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/mark-all-read', markAllAsRead);
router.put('/:notificationId/read', markAsRead);

export default router;
