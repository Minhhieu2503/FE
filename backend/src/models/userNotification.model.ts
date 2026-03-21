import mongoose, { Schema, Document } from "mongoose";

export interface IUserNotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "bulk" | "system" | "promotion";
  isRead: boolean;
  bulkNotificationId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userNotificationSchema = new Schema<IUserNotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      enum: ["bulk", "system", "promotion"],
      default: "bulk",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    bulkNotificationId: {
      type: Schema.Types.ObjectId,
      ref: "BulkNotification",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUserNotification>(
  "UserNotification",
  userNotificationSchema
);