import { Router } from 'express';
import { uploadDeliveries, getDeliveryPreview, getDeliveryDownload } from './delivery.controller';
import { validateDeliveryUpload } from './delivery.validator';
import { verifyToken as protect, roleMiddleware } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { UserRole } from '../../models/user.model';

const router = Router();

// Studio uploads delivered photos (Accepting up to 50 photos)
router.post(
  '/booking/:bookingId',
  protect,
  roleMiddleware(UserRole.STUDIO),
  upload.array('photos', 50),
  validateDeliveryUpload,
  uploadDeliveries
);

// Customer or Studio fetches the preview (Watermarked links only)
router.get('/booking/:bookingId', protect, getDeliveryPreview);

// Customer downloads full res (Requires simulated 70% payment)
router.get('/booking/:bookingId/download', protect, getDeliveryDownload);

export default router;
