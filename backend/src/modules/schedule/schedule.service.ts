import Schedule, { ISchedule } from '../../models/schedule.model';

export const getScheduleByStudioId = async (studioId: string): Promise<ISchedule | null> => {
  return await Schedule.findOne({ studioId });
};

export const updateStudioSchedule = async (
  studioId: string,
  updateData: Partial<ISchedule>
): Promise<ISchedule> => {
  return await Schedule.findOneAndUpdate(
    { studioId },
    { $set: updateData },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};
