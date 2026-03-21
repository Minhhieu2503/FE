import cron from 'node-cron';
import Booking, { BookingStatus } from '../models/booking.model';
import Slot from '../models/slot.model';

/**
 * Sweeps the database every 5 minutes backwards for 24h+ hanging pending bookings.
 * Auto rejects them to clear the pipeline and refunds the customer.
 */
export const startAutoRejectBookingCron = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      console.log('⏳ [Cron] Running autoRejectBooking job...');
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Find all PENDING bookings created before 24 hours ago
      const expiredBookings = await Booking.find({
        status: BookingStatus.PENDING,
        createdAt: { $lt: twentyFourHoursAgo }
      });

      if (expiredBookings.length === 0) {
        return; // Nothing to do
      }

      console.log(`⚠️ [Cron] Found ${expiredBookings.length} expired pending bookings to auto-reject.`);

      for (const booking of expiredBookings) {
        // 1. Mark as REJECTED
        booking.status = BookingStatus.REJECTED;
        await booking.save();

        // 2. Free up the reserved slot
        await Slot.findOneAndDelete({
          studioId: booking.studioId,
          date: booking.date,
          startTime: booking.startTime
        });

        // 3. TODO: Call Refund Customer 100% Logic (Wallet/Payment module)
        console.log(`💸 [Cron] TODO: Refund 100% deposit to Customer ${booking.customerId} for Booking ${booking._id}`);

        // 4. TODO: Call Record Penalty Studio Logic 
        console.log(`📉 [Cron] TODO: Record penalty for Studio ${booking.studioId} due to ignoring Booking ${booking._id}`);
      }

      console.log('✅ [Cron] autoRejectBooking job completed.');
    } catch (error) {
      console.error('❌ [Cron] Error in autoRejectBooking job:', error);
    }
  });
};
