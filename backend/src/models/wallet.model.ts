import mongoose, { Schema, Document } from "mongoose";

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "VND",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IWallet>("Wallet", walletSchema);