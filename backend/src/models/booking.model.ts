import mongoose, { Document, Schema } from 'mongoose';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export interface IBookingPhoto {
  _id?: mongoose.Types.ObjectId;
  fileName: string;
  url: string;
}

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId;
  studioId: mongoose.Types.ObjectId;
  voucherId?: mongoose.Types.ObjectId;

  serviceName?: string;
  description?: string;

  bookingDate?: Date;
  date?: Date;
  startTime?: string;
  endTime?: string;

  status: BookingStatus;

  price?: number;
  totalAmount?: number;
  platformFee?: number;
  payoutAmount?: number;
  deposit: number;

  packageDetails?: {
    name: string;
    price: number;
  };

  photos: IBookingPhoto[];

  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema: Schema = new Schema(
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
    voucherId: {
      type: Schema.Types.ObjectId,
      ref: 'Voucher',
      default: null,
    },

    serviceName: {
      type: String,
      trim: true,
      default: null,
    },
    description: {
      type: String,
      trim: true,
    },

    bookingDate: {
      type: Date,
    },

    date: {
      type: Date,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },

    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
      index: true,
    },

    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    platformFee: {
      type: Number,
      min: 0,
      default: 0,
    },
    payoutAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    deposit: {
      type: Number,
      required: true,
      default: 0,
    },

    packageDetails: {
      name: { type: String },
      price: { type: Number },
    },

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

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;