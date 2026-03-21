import mongoose, { Schema, Document } from "mongoose";

export interface IPolicyHistory extends Document {
  policyId: mongoose.Types.ObjectId;
  policyType: "cancellation" | "refund" | "financial";
  oldTitle?: string;
  newTitle: string;
  oldDescription?: string;
  newDescription: string;
  oldRules?: string[];
  newRules: string[];
  changedBy?: mongoose.Types.ObjectId;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const policyHistorySchema = new Schema<IPolicyHistory>(
  {
    policyId: {
      type: Schema.Types.ObjectId,
      ref: "Policy",
      required: true,
    },
    policyType: {
      type: String,
      enum: ["cancellation", "refund", "financial"],
      required: true,
    },
    oldTitle: {
      type: String,
      trim: true,
    },
    newTitle: {
      type: String,
      required: true,
      trim: true,
    },
    oldDescription: {
      type: String,
      trim: true,
    },
    newDescription: {
      type: String,
      required: true,
      trim: true,
    },
    oldRules: {
      type: [String],
      default: [],
    },
    newRules: {
      type: [String],
      default: [],
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

export default mongoose.model<IPolicyHistory>(
  "PolicyHistory",
  policyHistorySchema
);