import mongoose, { Document, Schema } from 'mongoose';

export enum SlotStatus {
  AVAILABLE = 'AVAILABLE', // Genraated slot that is free
  LOCKED = 'LOCKED',       // PENDING or CONFIRMED booking is holding it
  UNAVAILABLE = 'UNAVAILABLE', // Studio explicitly blocked it
}

export interface ISlot extends Document {
  scheduleId?: mongoose.Types.ObjectId;
  studioId: mongoose.Types.ObjectId;
  date: Date; // The full Date object including the exact day
  startTime: string; // e.g., "08:00"
  endTime: string;   // e.g., "10:00"
  status: SlotStatus;
}

const slotSchema: Schema = new Schema(
  {
    scheduleId: { type: Schema.Types.ObjectId, ref: 'Schedule' },
    studioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(SlotStatus),
      default: SlotStatus.AVAILABLE,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent overlapping slots for same studio on same exact date + start time
slotSchema.index({ studioId: 1, date: 1, startTime: 1 }, { unique: true });

const Slot = mongoose.model<ISlot>('Slot', slotSchema);
export default Slot;
