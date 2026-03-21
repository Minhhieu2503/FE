import mongoose, { Document, Schema } from 'mongoose';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'completed'
  | 'cancelled';

// 👉 thêm type cho photo
export interface IBookingPhoto {
  _id?: mongoose.Types.ObjectId;
  fileName: string;
  url: string;
}

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId;
  studioId: mongoose.Types.ObjectId;

  serviceName: string;
  description?: string;

  bookingDate: Date;
  status: BookingStatus;

  // 💰 Giá tiền
  price: number;
  totalAmount: number;
  platformFee: number;
  payoutAmount: number;

  // 👉 NEW: photos
  photos: IBookingPhoto[];

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

    // =========================
    // 👉 DELIVERY PHOTOS
    // =========================
    photos: [
      {
        fileName: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;