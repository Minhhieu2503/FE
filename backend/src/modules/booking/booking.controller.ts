import { Request, Response } from 'express';
import { createBooking, getBookingsByStudio, getBookingsByCustomer, getBookingById, handleBookingRequest } from './booking.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

// UC-11: Customer creates a booking
export const postBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?._id?.toString() as string;
    const booking = await createBooking({ ...req.body, customerId });
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error: any) {
    if (error.message.includes('Conflict')) {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: error.message || 'Error creating booking' });
  }
};

// UC-31: Studio views their incoming requests
export const getStudioBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studioId = req.user?._id?.toString() as string;
    const bookings = await getBookingsByStudio(studioId);
    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching bookings' });
  }
};

// UC-14: Customer views their own bookings
export const getCustomerBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?._id?.toString() as string;
    const bookings = await getBookingsByCustomer(customerId);
    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching bookings' });
  }
};

// UC-38 & UC-16: Get single booking detail
export const getBookingDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.id as string;
    const booking = await getBookingById(bookingId);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }
    res.status(200).json(booking);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching booking' });
  }
};

// UC-32: Studio approves/rejects booking
export const patchHandleBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studioId = req.user?._id?.toString() as string;
    const bookingId = req.params.id as string;
    const action = req.params.action as 'approve' | 'reject';

    const updatedBooking = await handleBookingRequest(bookingId, studioId, action);
    res.status(200).json({ message: `Booking ${action}d successfully`, booking: updatedBooking });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error handling booking' });
  }
};
