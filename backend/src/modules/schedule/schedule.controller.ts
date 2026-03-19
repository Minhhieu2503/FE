import { Request, Response } from 'express';
import { getScheduleByStudioId, updateStudioSchedule } from './schedule.service';
import { UserRole } from '../../models/user.model';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const getMySchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studioId = req.user?._id?.toString() as string;
    const schedule = await getScheduleByStudioId(studioId);

    if (!schedule) {
      res.status(200).json({
        studioId,
        weeklyTemplate: [],
        markedDates: [],
      });
      return;
    }

    res.status(200).json(schedule);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching schedule' });
  }
};

export const updateMySchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studioId = req.user?._id?.toString() as string;
    const { weeklyTemplate, markedDates } = req.body;

    const updateData: any = {};
    if (weeklyTemplate !== undefined) updateData.weeklyTemplate = weeklyTemplate;
    if (markedDates !== undefined) updateData.markedDates = markedDates;

    const updatedSchedule = await updateStudioSchedule(studioId, updateData);
    res.status(200).json({ message: 'Schedule updated successfully', schedule: updatedSchedule });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating schedule' });
  }
};

export const getPublicSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const studioId = req.params.studioId as string;
    const schedule = await getScheduleByStudioId(studioId);

    if (!schedule) {
      res.status(404).json({ message: 'Schedule not found for this studio' });
      return;
    }

    res.status(200).json(schedule);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching schedule' });
  }
};
