import mongoose, { Document, Schema } from 'mongoose';
import { KycStatus } from './user.model';

export interface IKyc extends Document {
  userId: mongoose.Types.ObjectId;
  idDocURL: string;
  selfieURL: string;
  portfolioURLs: string[];
  status: KycStatus;
}

const kycSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    idDocURL: { type: String, required: true },
    selfieURL: { type: String, required: true },
    portfolioURLs: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(KycStatus),
      default: KycStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

const Kyc = mongoose.model<IKyc>('Kyc', kycSchema);
export default Kyc;
