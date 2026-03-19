import { Router } from 'express';
import { postBooking, getStudioBookings, getCustomerBookings, getBookingDetail, patchHandleBooking } from './booking.controller';
import { validateCreateBooking, validateHandleBooking } from './booking.validator';
import { verifyToken as protect, roleMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../models/user.model';

const router = Router();

// Customer creates booking
router.post('/', protect, roleMiddleware(UserRole.CUSTOMER), validateCreateBooking, postBooking);

// Customer views their own list
router.get('/customer', protect, roleMiddleware(UserRole.CUSTOMER), getCustomerBookings);

// Studio views incoming requests
router.get('/studio', protect, roleMiddleware(UserRole.STUDIO), getStudioBookings);

// Studio approves or rejects a request
router.patch('/:id/:action', protect, roleMiddleware(UserRole.STUDIO), validateHandleBooking, patchHandleBooking);

// View single booking details (both can access if they have token)
router.get('/:id', protect, getBookingDetail);

export default router;
