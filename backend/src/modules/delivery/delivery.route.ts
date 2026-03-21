import { Router } from 'express';
import {
  getDeliveredPhotos,
  downloadDeliveredPhoto,
} from './delivery.controller';

// 👉 thêm middleware
import customerMiddleware from '../../middlewares/customer.middleware';

const router = Router();

// Customer view delivered photos after booking completed
router.get('/:bookingId/photos', customerMiddleware, getDeliveredPhotos);

// Customer get download link of a photo after booking completed
router.get(
  '/:bookingId/photos/:photoId/download',
  customerMiddleware,
  downloadDeliveredPhoto
);

export default router;