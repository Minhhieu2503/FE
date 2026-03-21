import { Router } from 'express';
import { toggleWishlistItem, getMyWishlist } from './wishlist.controller';
import { verifyToken as protect, roleMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../models/user.model';

const router = Router();

// Endpoint bound strictly to CUSTOMERS to view their own saved studios
router.get('/', protect, roleMiddleware(UserRole.CUSTOMER), getMyWishlist);

// Universal toggle endpoint (Customer clicks Heart icon on a Studio's profile or card)
router.post('/:studioId/toggle', protect, roleMiddleware(UserRole.CUSTOMER), toggleWishlistItem);

export default router;
