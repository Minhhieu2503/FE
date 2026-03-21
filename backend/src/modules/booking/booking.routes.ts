import { Router } from 'express';
import { validateCreateBooking, validateHandleBooking } from './booking.validator';
import { verifyToken as protect, roleMiddleware } from '../../middlewares/auth.middleware';
import { UserRole } from '../../models/user.model';
import bookingController from "./booking.controller";
import customerMiddleware from "../../middlewares/customer.middleware";

const router = Router();    

// Customer creates booking
router.post('/', protect, roleMiddleware(UserRole.CUSTOMER), validateCreateBooking, bookingController.postBooking);

// Customer views their own list
router.get('/customer', protect, roleMiddleware(UserRole.CUSTOMER), bookingController.getCustomerBookings);

// Studio views incoming requests
router.get('/studio', protect, roleMiddleware(UserRole.STUDIO), bookingController.getStudioBookings);

// Studio approves or rejects a request
router.patch('/:id/:action', protect, roleMiddleware(UserRole.STUDIO), validateHandleBooking, bookingController.patchHandleBooking);

// View single booking details (both can access if they have token)
router.get('/:id', protect, bookingController.getBookingDetail);
router.get("/my-bookings", customerMiddleware, bookingController.getMyBookings);

router.get(
  "/:bookingId/status",
  customerMiddleware,
  bookingController.trackBookingStatus
);

router.get(
  "/:bookingId/details",
  customerMiddleware,
  bookingController.viewBookingDetails
);
export default router;
