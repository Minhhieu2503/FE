import mongoose, { Schema, Document } from "mongoose";

export interface IPolicy extends Document {
  policyType: "cancellation" | "refund" | "financial";
  title: string;
  description: string;
  rules: string[];
  isActive: boolean;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const policySchema = new Schema<IPolicy>(
  {
    policyType: {
      type: String,
      enum: ["cancellation", "refund", "financial"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    rules: {
      type: [String],
      default: [],
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

export default mongoose.model<IPolicy>("Policy", policySchema);