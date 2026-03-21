import mongoose, { Document, Schema } from 'mongoose';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  FINAL_PAYMENT = 'FINAL_PAYMENT',
  WITHDRAWAL = 'WITHDRAWAL',
  REFUND = 'REFUND',
  PENALTY = 'PENALTY',
  EARNING = 'EARNING'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export interface ITransaction extends Document {
  bookingId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Customer or Studio receiving/sending funds
  amount: number;
  sourceAmount?: number; // Raw amount before platform fee
  type: TransactionType;
  status: TransactionStatus;
}

const transactionSchema: Schema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    sourceAmount: { type: Number },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.SUCCESS,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;
