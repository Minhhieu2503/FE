import Booking, { IBooking, BookingStatus } from '../../models/booking.model';
import Slot, { SlotStatus, ISlot } from '../../models/slot.model';

export const createBooking = async (
  bookingData: Partial<IBooking>
): Promise<IBooking> => {
  // 1. Check for schedule conflict based on existing Slots
  const existingConflict = await Slot.findOne({
    studioId: bookingData.studioId,
    date: bookingData.date,
    startTime: bookingData.startTime,
    status: { $ne: SlotStatus.AVAILABLE } // Intersects with LOCKED or UNAVAILABLE
  });

  if (existingConflict) {
    throw new Error('Conflict Schedule: The requested time slot is not available.');
  }

  // 2. Create the Booking
  const booking = await Booking.create({
    ...bookingData,
    status: BookingStatus.PENDING,
  });

  // 3. Mark the Slot as LOCKED
  await Slot.create({
    studioId: bookingData.studioId,
    date: bookingData.date,
    startTime: bookingData.startTime,
    endTime: bookingData.endTime,
    status: SlotStatus.LOCKED,
  });

  return booking;
};

export const getBookingsByStudio = async (studioId: string): Promise<IBooking[]> => {
  return await Booking.find({ studioId }).populate('customerId', 'email kycStatus').sort({ createdAt: -1 });
};

export const getBookingsByCustomer = async (customerId: string): Promise<IBooking[]> => {
  return await Booking.find({ customerId }).populate('studioId', 'email').sort({ createdAt: -1 });
};

export const getBookingById = async (bookingId: string): Promise<IBooking | null> => {
  return await Booking.findById(bookingId).populate('customerId studioId', 'email role');
};

export const handleBookingRequest = async (
  bookingId: string,
  studioId: string,
  action: 'approve' | 'reject'
): Promise<IBooking | null> => {
  const booking = await Booking.findOne({ _id: bookingId, studioId });
  if (!booking) throw new Error('Booking not found or not authorized');

  if (booking.status !== BookingStatus.PENDING) {
    throw new Error('Booking is not in PENDING state');
  }

  if (action === 'approve') {
    booking.status = BookingStatus.CONFIRMED;
  } else {
    booking.status = BookingStatus.REJECTED;
    // Free up the slot
    await Slot.findOneAndDelete({
      studioId,
      date: booking.date,
      startTime: booking.startTime
    });
  }

  await booking.save();
  return booking;
};
