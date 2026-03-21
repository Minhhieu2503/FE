import Schedule, { ISchedule } from '../../models/schedule.model';
import Booking, { BookingStatus } from '../../models/booking.model';

export const getScheduleByStudioId = async (studioId: string): Promise<ISchedule | null> => {
  return await Schedule.findOne({ studioId });
};

export const updateStudioSchedule = async (
  studioId: string,
  updateData: Partial<ISchedule>
): Promise<ISchedule> => {

  // Business Logic: Conflict Schedule - Block save if trying to mark unavailable when a booking exists
  if (updateData.markedDates && updateData.markedDates.length > 0) {
    for (const md of updateData.markedDates) {
      if (!md.isAvailable) {
        const blockDateStart = new Date(md.date);
        blockDateStart.setHours(0, 0, 0, 0);
        const blockDateEnd = new Date(md.date);
        blockDateEnd.setHours(23, 59, 59, 999);

        const conflictingBooking = await Booking.findOne({
          studioId,
          date: { $gte: blockDateStart, $lte: blockDateEnd },
          status: { $in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] }
        });

        if (conflictingBooking) {
           throw new Error(`Conflict Schedule: You have a ${conflictingBooking.status} booking on ${blockDateStart.toDateString()}. Please chat with the customer to resolve this before blocking the date.`);
        }
      }
    }
  }

  return await Schedule.findOneAndUpdate(
    { studioId },
    { $set: updateData },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};
