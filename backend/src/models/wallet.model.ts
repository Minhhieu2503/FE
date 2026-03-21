import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
  studioId: mongoose.Types.ObjectId;
  totalRevenue: number;
  holdingBalance: number;
  availableBalance: number;
}

const walletSchema: Schema = new Schema(
  {
    studioId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    totalRevenue: { type: Number, default: 0 },
    holdingBalance: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);
export default Wallet;
