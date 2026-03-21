import { Router } from "express";
import bookingController from "./booking.controller";
import customerMiddleware from "../../middlewares/customer.middleware";

const router = Router();

/*
  GET /booking/my-bookings
  GET /booking/:bookingId/status
  GET /booking/:bookingId/details
*/

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