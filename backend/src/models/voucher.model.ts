import mongoose, { Document, Schema } from 'mongoose';

export enum VoucherType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT'
}

export enum VoucherStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED'
}

export interface IVoucher extends Document {
  studioId?: mongoose.Types.ObjectId; // Nullable if system-wide
  code: string;
  type: VoucherType;
  value: number;
  minOrderValue: number;
  maxDiscount?: number; // Caps percentage discount
  usageLimit: number; // Max total usages globally
  usedCount: number;
  validFrom: Date;
  validTo: Date;
  status: VoucherStatus;
}

const voucherSchema: Schema = new Schema(
  {
    studioId: { type: Schema.Types.ObjectId, ref: 'User' },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: Object.values(VoucherType), required: true },
    value: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    usageLimit: { type: Number, required: true, min: 1 },
    usedCount: { type: Number, default: 0 },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    status: { type: String, enum: Object.values(VoucherStatus), default: VoucherStatus.ACTIVE },
  },
  {
    timestamps: true,
  }
);

const Voucher = mongoose.model<IVoucher>('Voucher', voucherSchema);
export default Voucher;
