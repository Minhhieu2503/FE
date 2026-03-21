import mongoose, { Document, Schema } from 'mongoose';

export enum DeliveryStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  ACCEPTED = 'ACCEPTED',
  DISPUTED = 'DISPUTED',
}

export interface IDelivery extends Document {
  bookingId: mongoose.Types.ObjectId;
  studioId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  status: DeliveryStatus;
  holdUntil?: Date; // e.g. 3 days auto-release rule
}

const deliverySchema: Schema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    studioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: Object.values(DeliveryStatus),
      default: DeliveryStatus.DELIVERED,
    },
    holdUntil: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Delivery = mongoose.model<IDelivery>('Delivery', deliverySchema);
export default Delivery;
