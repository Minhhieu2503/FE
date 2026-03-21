import Booking from "../../models/booking.model";

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