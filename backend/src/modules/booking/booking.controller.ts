import { Request, Response } from "express";
import bookingService from "./booking.service";

class BookingController {
  // 🔎 Track status
  async trackBookingStatus(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;

      if (!bookingId || Array.isArray(bookingId)) {
        return res.status(400).json({ message: "Invalid bookingId" });
      }

      const customerId = (req as any).user?._id;

      const result = await bookingService.trackBookingStatus(
        bookingId,
        customerId
      );

      return res.status(200).json({
        message: "Booking status fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: error.message || "Track booking failed",
      });
    }
  }

  // 📄 View detail
  async viewBookingDetails(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;

      if (!bookingId || Array.isArray(bookingId)) {
        return res.status(400).json({ message: "Invalid bookingId" });
      }

      const customerId = (req as any).user?._id;

      const result = await bookingService.viewBookingDetails(
        bookingId,
        customerId
      );

      return res.status(200).json({
        message: "Booking details fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: error.message || "View booking failed",
      });
    }
  }

  // 📋 List của customer
  async getMyBookings(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?._id;

      const result = await bookingService.getMyBookings(customerId);

      return res.status(200).json({
        message: "My bookings fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Fetch bookings failed",
      });
    }
  }
}

export default new BookingController();