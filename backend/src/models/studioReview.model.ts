import mongoose, { Document, Schema } from 'mongoose';

export interface IStudioReview extends Document {
  customerId: mongoose.Types.ObjectId;
  studioId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const studioReviewSchema = new Schema<IStudioReview>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studioId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// mỗi customer chỉ review 1 lần cho 1 studio
studioReviewSchema.index({ customerId: 1, studioId: 1 }, { unique: true });

export default mongoose.model<IStudioReview>('StudioReview', studioReviewSchema);