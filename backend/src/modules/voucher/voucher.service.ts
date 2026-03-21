import mongoose from 'mongoose';
import Voucher, { IVoucher, VoucherStatus, VoucherType } from '../../models/voucher.model';

export const createStudioVoucher = async (studioId: string, voucherData: Partial<IVoucher>): Promise<IVoucher> => {
  const codeExists = await Voucher.findOne({ code: voucherData.code });
  if (codeExists) {
    throw new Error(`Voucher code ${voucherData.code} already exists globally`);
  }

  return await Voucher.create({
    ...voucherData,
    studioId: new mongoose.Types.ObjectId(studioId)
  });
};

export const getStudioVouchers = async (studioId: string): Promise<IVoucher[]> => {
  return await Voucher.find({ studioId: new mongoose.Types.ObjectId(studioId) }).sort({ createdAt: -1 });
};

export const toggleVoucherStatus = async (studioId: string, voucherId: string, status: VoucherStatus): Promise<IVoucher> => {
  const voucher = await Voucher.findOne({ _id: voucherId, studioId });
  if (!voucher) throw new Error('Voucher not found or access denied');
  
  voucher.status = status;
  return await voucher.save();
};

export const validateAndCalculateVoucher = async (code: string, orderValue: number, studioId?: string): Promise<{ isValid: boolean; discountAmount: number; message?: string }> => {
  const voucher = await Voucher.findOne({ code: code.toUpperCase() });

  if (!voucher) return { isValid: false, discountAmount: 0, message: 'Voucher does not exist' };
  
  if (voucher.status !== VoucherStatus.ACTIVE) {
    return { isValid: false, discountAmount: 0, message: `Voucher is ${voucher.status}` };
  }

  const now = new Date();
  if (now < voucher.validFrom) {
    return { isValid: false, discountAmount: 0, message: 'Voucher is not yet active' };
  }
  if (now > voucher.validTo) {
    return { isValid: false, discountAmount: 0, message: 'Voucher has expired' };
  }

  if (voucher.usedCount >= voucher.usageLimit) {
    return { isValid: false, discountAmount: 0, message: 'Voucher usage limit reached' };
  }

  if (orderValue < voucher.minOrderValue) {
    return { isValid: false, discountAmount: 0, message: `Minimum order value required is ${voucher.minOrderValue}` };
  }

  // Domain logic tying Voucher specifically to Studio (optional restriction check)
  if (voucher.studioId && studioId && voucher.studioId.toString() !== studioId) {
    return { isValid: false, discountAmount: 0, message: 'This voucher is not applicable to the selected Studio' };
  }

  // Mathematical Calculations
  let discountAmount = 0;
  if (voucher.type === VoucherType.FIXED_AMOUNT) {
    discountAmount = voucher.value;
  } else if (voucher.type === VoucherType.PERCENTAGE) {
    discountAmount = (voucher.value / 100) * orderValue;
    if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
      discountAmount = voucher.maxDiscount;
    }
  }

  // Prevent discount from giving negative orders
  if (discountAmount > orderValue) {
    discountAmount = orderValue;
  }

  return { isValid: true, discountAmount, message: 'Voucher applied successfully' };
};
