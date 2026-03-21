import mongoose, { Schema, Document } from "mongoose";

export interface ICommissionHistory extends Document {
  oldRate: number;
  newRate: number;
  changedBy?: mongoose.Types.ObjectId;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const commissionHistorySchema = new Schema<ICommissionHistory>(
  {
    oldRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    newRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICommissionHistory>(
  "CommissionHistory",
  commissionHistorySchema
);