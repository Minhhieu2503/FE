import mongoose, { Schema, Document, Types } from 'mongoose';

export type StudioRegistrationStatus = 'pending' | 'approved' | 'rejected';

export interface IVerificationDocument {
  name: string;
  fileUrl: string;
  type: string;
}

export interface IStudioRegistrationRequest extends Document {
  userId: Types.ObjectId;
  studioName: string;
  phone: string;
  address: string;
  description: string;
  verificationDocuments: IVerificationDocument[];
  status: StudioRegistrationStatus;
  rejectReason?: string;
  reviewedBy?: Types.ObjectId | null;
  reviewedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationDocumentSchema = new Schema<IVerificationDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const StudioRegistrationRequestSchema = new Schema<IStudioRegistrationRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studioName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    verificationDocuments: {
      type: [VerificationDocumentSchema],
      validate: {
        validator: function (value: IVerificationDocument[]) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'At least one verification document is required',
      },
      required: true,
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectReason: {
      type: String,
      default: '',
      trim: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'studio_registration_requests',
  }
);

export default mongoose.model<IStudioRegistrationRequest>(
  'StudioRegistrationRequest',
  StudioRegistrationRequestSchema
);