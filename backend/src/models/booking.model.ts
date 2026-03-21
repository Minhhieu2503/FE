import mongoose, { Document, Schema } from 'mongoose';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId;
  studioId: mongoose.Types.ObjectId;
  voucherId?: mongoose.Types.ObjectId;
  date: Date; // e.g., "2026-03-25"
  startTime: string; // e.g., "08:00"
  endTime: string; // e.g., "10:00"
  status: BookingStatus;
  deposit: number; // e.g., 30% held balance
  packageDetails?: {
    name: string;
    price: number;
  };
}

const bookingSchema: Schema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    voucherId: { type: Schema.Types.ObjectId, ref: 'Voucher', default: null },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    deposit: { type: Number, required: true, default: 0 },
    packageDetails: {
      name: { type: String },
      price: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;
