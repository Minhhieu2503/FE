import { Request, Response } from 'express';
import {
  createBooking,
  getBookingsByStudio,
  getBookingsByCustomer,
  getBookingById,
  handleBookingRequest,
} from './booking.service';
import bookingService from './booking.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

class BookingController {
  // UC-11: Customer creates a booking
  async postBooking(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const customerId = req.user?._id?.toString();

      if (!customerId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const booking = await createBooking({
        ...req.body,
        customerId,
      });

      return res.status(201).json({
        message: 'Booking created successfully',
        booking,
      });
    } catch (error: any) {
      if (error.message?.includes('Conflict')) {
        return res.status(409).json({ message: error.message });
      }

      return res.status(500).json({
        message: error.message || 'Error creating booking',
      });
    }
  }

  // UC-31: Studio views incoming booking requests
  async getStudioBookings(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const studioId = req.user?._id?.toString();

      if (!studioId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const bookings = await getBookingsByStudio(studioId);

      return res.status(200).json({
        message: 'Studio bookings fetched successfully',
        data: bookings,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || 'Error fetching bookings',
      });
    }
  }

  // UC-14: Customer views their own bookings
  async getCustomerBookings(
    req: AuthRequest,
    res: Response
  ): Promise<Response> {
    try {
      const customerId = req.user?._id?.toString();

      if (!customerId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const bookings = await getBookingsByCustomer(customerId);

      return res.status(200).json({
        message: 'Customer bookings fetched successfully',
        data: bookings,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || 'Error fetching bookings',
      });
    }
  }

  // UC-38 & UC-16: Get single booking detail
  async getBookingDetail(req: Request, res: Response): Promise<Response> {
  try {
    const bookingId = req.params.id;

    // 🔥 fix lỗi type tại đây
    if (!bookingId || Array.isArray(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking id' });
    }

    const booking = await getBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json({
      message: 'Booking fetched successfully',
      data: booking,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || 'Error fetching booking',
    });
  }
}

  // UC-32: Studio approves/rejects booking
  async patchHandleBooking(
  req: AuthRequest,
  res: Response
): Promise<Response> {
  try {
    const studioId = req.user?._id?.toString();
    const bookingId = req.params.id;
    const actionParam = req.params.action;

    if (!studioId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!bookingId || Array.isArray(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking id' });
    }

    if (!actionParam || Array.isArray(actionParam)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const action = actionParam as 'approve' | 'reject';

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        message: 'Action must be approve or reject',
      });
    }

    const updatedBooking = await handleBookingRequest(
      bookingId,
      studioId,
      action
    );

    return res.status(200).json({
      message: `Booking ${action}d successfully`,
      booking: updatedBooking,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || 'Error handling booking',
    });
  }
}

  // Track booking status
  async trackBookingStatus(
    req: AuthRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { bookingId } = req.params;

      if (!bookingId || Array.isArray(bookingId)) {
        return res.status(400).json({ message: 'Invalid bookingId' });
      }

      const customerId = req.user?._id?.toString();

      const result = await bookingService.trackBookingStatus(
        bookingId,
        customerId
      );

      return res.status(200).json({
        message: 'Booking status fetched successfully',
        data: result,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: error.message || 'Track booking failed',
      });
    }
  }

  // View booking details
  async viewBookingDetails(
    req: AuthRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { bookingId } = req.params;

      if (!bookingId || Array.isArray(bookingId)) {
        return res.status(400).json({ message: 'Invalid bookingId' });
      }

      const customerId = req.user?._id?.toString();

      const result = await bookingService.viewBookingDetails(
        bookingId,
        customerId
      );

      return res.status(200).json({
        message: 'Booking details fetched successfully',
        data: result,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: error.message || 'View booking failed',
      });
    }
  }

  // List current customer's bookings
  async getMyBookings(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const customerId = req.user?._id?.toString();

      if (!customerId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const result = await bookingService.getMyBookings(customerId);

      return res.status(200).json({
        message: 'My bookings fetched successfully',
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || 'Fetch bookings failed',
      });
    }
  }
}

export default new BookingController();