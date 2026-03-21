import mongoose, { Document, Schema } from 'mongoose';

export type ContentStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export interface IContentImage {
  url: string;
  caption?: string;
}

export interface IStudioContent extends Document {
  studioId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  images: IContentImage[];
  status: ContentStatus;
  moderationReason?: string;
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContentImageSchema = new Schema<IContentImage>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const StudioContentSchema = new Schema<IStudioContent>(
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
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [ContentImageSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'hidden'],
      default: 'pending',
      index: true,
    },
    moderationReason: {
      type: String,
      trim: true,
    },
    moderatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    moderatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const StudioContent = mongoose.model<IStudioContent>(
  'StudioContent',
  StudioContentSchema
);

export default StudioContent;