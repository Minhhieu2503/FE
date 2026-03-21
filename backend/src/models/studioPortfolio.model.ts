import mongoose, { Document, Schema } from 'mongoose';

export type PortfolioReviewStatus = 'pending' | 'approved' | 'rejected';

export interface IPortfolioSample {
  type: 'image' | 'video';
  url: string;
  title?: string;
}

export interface IPortfolioCredential {
  name: string;
  issuer?: string;
  fileUrl: string;
}

export interface IStudioPortfolio extends Document {
  studioId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  samples: IPortfolioSample[];
  credentials: IPortfolioCredential[];
  status: PortfolioReviewStatus;
  rejectionReason?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSampleSchema = new Schema<IPortfolioSample>(
  {
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const PortfolioCredentialSchema = new Schema<IPortfolioCredential>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    issuer: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const StudioPortfolioSchema = new Schema<IStudioPortfolio>(
  {
    studioId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    samples: {
      type: [PortfolioSampleSchema],
      default: [],
    },
    credentials: {
      type: [PortfolioCredentialSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const StudioPortfolio = mongoose.model<IStudioPortfolio>(
  'StudioPortfolio',
  StudioPortfolioSchema
);

export default StudioPortfolio;