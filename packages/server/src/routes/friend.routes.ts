import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests,
  getFriends
} from '../controllers/friend.controller';

const router = Router();

router.use(protect); // All friend routes are protected

router.get('/search', searchUsers);
router.get('/', getFriends);
router.get('/requests/pending', getPendingRequests);
router.post('/requests', sendFriendRequest);
router.put('/requests/:requestId/accept', acceptFriendRequest);
router.put('/requests/:requestId/reject', rejectFriendRequest);

export default router;
