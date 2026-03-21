import mongoose, { Document, Schema } from 'mongoose';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'completed'
  | 'cancelled';

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId;
  studioId: mongoose.Types.ObjectId;

  serviceName: string;
  description?: string;

  bookingDate: Date;
  status: BookingStatus;

  // 💰 Giá tiền
  price: number; // giá dịch vụ gốc
  totalAmount: number; // tổng tiền khách trả
  platformFee: number; // tiền nền tảng ăn (commission)
  payoutAmount: number; // tiền trả cho studio

  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    studioId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    serviceName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'paid', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },

    // 💰 financial fields
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    platformFee: {
      type: Number,
      required: true,
      min: 0,
    },

    payoutAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;