import { Router } from 'express';
import { getMyProfile, updateMyProfile, getProfileById } from './profile.controller';
import { validateUpdateProfile } from './profile.validator';
import { verifyToken as protect } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';

const router = Router();

// Routes for the authenticated user
router.get('/me', protect, getMyProfile);
router.patch('/me', protect, upload.single('avatar'), validateUpdateProfile, updateMyProfile);

// Public route to view another user's profile (like a Studio's profile)
router.get('/:id', getProfileById);

export default router;
