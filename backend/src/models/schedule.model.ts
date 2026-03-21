import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeSlot {
  startTime: string; // e.g., "08:00"
  endTime: string;   // e.g., "10:00"
}

export interface IWeeklyTemplate {
  dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
  isAvailable: boolean;
  timeSlots: ITimeSlot[];
}

export interface IMarkedDate {
  date: Date;
  isAvailable: boolean; // false to block the whole day
  timeSlots: ITimeSlot[]; // if isAvailable=true but want to override specific slots
}

export interface ISchedule extends Document {
  studioId: mongoose.Types.ObjectId;
  weeklyTemplate: IWeeklyTemplate[];
  markedDates: IMarkedDate[];
}

const scheduleSchema: Schema = new Schema(
  {
    studioId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    weeklyTemplate: [
      {
        dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
        isAvailable: { type: Boolean, required: true },
        timeSlots: [
          {
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
          },
        ],
      },
    ],
    markedDates: [
      {
        date: { type: Date, required: true },
        isAvailable: { type: Boolean, required: true },
        timeSlots: [
          {
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema);
export default Schedule;
