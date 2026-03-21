import mongoose, { Schema, Document } from "mongoose";

export interface ICommissionSetting extends Document {
  commissionRate: number;
  isActive: boolean;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commissionSettingSchema = new Schema<ICommissionSetting>(
  {
    commissionRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICommissionSetting>(
  "CommissionSetting",
  commissionSettingSchema
);