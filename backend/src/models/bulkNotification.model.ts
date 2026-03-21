import mongoose, { Schema, Document } from "mongoose";

export interface IBulkNotification extends Document {
  title: string;
  message: string;
  targetType: "all" | "customers" | "studios";
  recipientCount: number;
  sentBy?: mongoose.Types.ObjectId;
  status: "sent" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const bulkNotificationSchema = new Schema<IBulkNotification>(
  {
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
    targetType: {
      type: String,
      enum: ["all", "customers", "studios"],
      required: true,
    },
    recipientCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBulkNotification>(
  "BulkNotification",
  bulkNotificationSchema
);