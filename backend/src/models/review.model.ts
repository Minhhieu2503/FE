import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  studioId: mongoose.Types.ObjectId;
  rating: number; // 1 to 5
  content: string;
  isAIApproved: boolean; // Moderation flag
  replyContent?: string; // Studio's response
}

const reviewSchema: Schema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, required: true },
    isAIApproved: { type: Boolean, default: true },
    replyContent: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
