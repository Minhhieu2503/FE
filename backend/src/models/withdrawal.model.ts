import mongoose, { Document, Schema } from 'mongoose';

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export interface IWithdrawal extends Document {
  studioId: mongoose.Types.ObjectId;
  walletId: mongoose.Types.ObjectId;
  amount: number;
  destinationType: string;
  destinationDetails: string;
  status: WithdrawalStatus;
}

const withdrawalSchema: Schema = new Schema(
  {
    studioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
    amount: { type: Number, required: true },
    destinationType: { type: String, required: true }, // e.g. BANK_ACCOUNT, MOMO
    destinationDetails: { type: String, required: true }, // e.g. "VCB - 012345678"
    status: {
      type: String,
      enum: Object.values(WithdrawalStatus),
      default: WithdrawalStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

const Withdrawal = mongoose.model<IWithdrawal>('Withdrawal', withdrawalSchema);
export default Withdrawal;
