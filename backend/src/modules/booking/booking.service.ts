
import Booking, { IBooking, BookingStatus } from '../../models/booking.model';
import Slot, { SlotStatus, ISlot } from '../../models/slot.model';

import Schedule from '../../models/schedule.model';

export const createBooking = async (
  bookingData: Partial<IBooking>
): Promise<IBooking> => {
  // 0. Verify the slot physically exists in the Studio's base schedule
  const schedule = await Schedule.findOne({ studioId: bookingData.studioId });
  if (!schedule) throw new Error('Studio has no schedule setup.');

  const bookDate = new Date(bookingData.date as Date);
  const dayOfWeek = bookDate.getDay();

  const markedDateObj = schedule.markedDates.find(md => new Date(md.date).toDateString() === bookDate.toDateString());

  let isBaseAvailable = false;
  if (markedDateObj) {
    if (!markedDateObj.isAvailable) {
      throw new Error('The studio is completely unavailable on this date.');
    }
    isBaseAvailable = markedDateObj.timeSlots.some(ts => ts.startTime === bookingData.startTime && ts.endTime === bookingData.endTime);
  } else {
    // Fallback to weekly template
    const template = schedule.weeklyTemplate.find(wt => wt.dayOfWeek === dayOfWeek);
    if (!template || !template.isAvailable) {
      throw new Error('The studio is not available on this day of the week.');
    }
    isBaseAvailable = template.timeSlots.some(ts => ts.startTime === bookingData.startTime && ts.endTime === bookingData.endTime);
  }

  if (!isBaseAvailable) {
    throw new Error('The requested time slot does not exist in the studio\'s base schedule.');
  }

  // 1. Check for real-time schedule conflict based on existing locked/unavailable Slots
  const existingConflict = await Slot.findOne({
    studioId: bookingData.studioId,
    date: bookingData.date,
    startTime: bookingData.startTime,
    status: { $ne: SlotStatus.AVAILABLE } // Intersects with LOCKED or UNAVAILABLE
  });

  if (existingConflict) {
    throw new Error('Conflict Schedule: The requested time slot is already booked or blocked.');
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
class BookingService {
  // 🔎 Track status
  async trackBookingStatus(bookingId: string, customerId?: string) {
    const filter: any = { _id: bookingId };

    if (customerId) {
      filter.customerId = customerId;
    }

    const booking = await Booking.findOne(filter)
      .select("status bookingDate updatedAt")
      .lean();

    if (!booking) {
      throw new Error("Booking not found or access denied");
    }

    return {
      bookingId,
      status: booking.status,
      bookingDate: booking.bookingDate,
      lastUpdated: booking.updatedAt,
    };
  }

  // 📄 View full detail
  async viewBookingDetails(bookingId: string, customerId?: string) {
    const filter: any = { _id: bookingId };

    if (customerId) {
      filter.customerId = customerId;
    }

    const booking = await Booking.findOne(filter)
      .populate("customerId", "name email username")
      .populate("studioId", "name email username")
      .lean();

    if (!booking) {
      throw new Error("Booking not found or access denied");
    }

    return booking;
  }

  // 📋 List booking của customer
  async getMyBookings(customerId: string) {
    return await Booking.find({ customerId })
      .select(
        "serviceName bookingDate status totalAmount platformFee payoutAmount"
      )
      .sort({ createdAt: -1 })
      .lean();
  }
}

export default new BookingService();

