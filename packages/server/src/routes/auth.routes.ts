import { Router } from 'express';
import { register, login, refresh, logout, googleAuth, updateProfile } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/google', googleAuth);
router.put('/update-profile', protect, updateProfile);

// Example protected route
router.get('/me', protect, (req: any, res) => {
  res.json({ user: req.user });
});

export default router;
