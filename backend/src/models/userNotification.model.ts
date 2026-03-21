import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType = 'booking' | 'payment' | 'message' | 'bulk' | 'system';

export interface IUserNotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedBookingId?: mongoose.Types.ObjectId;
  relatedPaymentId?: mongoose.Types.ObjectId;
  bulkNotificationId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userNotificationSchema = new Schema<IUserNotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['booking', 'payment', 'message', 'bulk', 'system'],
      default: 'system',
      required: true,
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedBookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    relatedPaymentId: {
      type: Schema.Types.ObjectId,
    },
    bulkNotificationId: {
      type: Schema.Types.ObjectId,
      ref: 'BulkNotification',
    },
  },
  {
    timestamps: true,
    collection: 'usernotifications',
  }
);

const UserNotification = mongoose.model<IUserNotification>(
  'UserNotification',
  userNotificationSchema
);

export default UserNotification;