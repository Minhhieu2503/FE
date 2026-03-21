import mongoose, { Schema, Document } from "mongoose";

export interface IWalletTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  walletId: mongoose.Types.ObjectId;
  type: "deposit" | "withdraw" | "refund" | "payment";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: "pending" | "success" | "failed";
  referenceId?: mongoose.Types.ObjectId;
  description?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const walletTransactionSchema = new Schema<IWalletTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdraw", "refund", "payment"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    balanceBefore: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "success",
    },
    referenceId: {
      type: Schema.Types.ObjectId,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IWalletTransaction>(
  "WalletTransaction",
  walletTransactionSchema
);