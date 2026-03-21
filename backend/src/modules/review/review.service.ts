import mongoose from 'mongoose';
import Review, { IReview } from '../../models/review.model';
import Booking from '../../models/booking.model';

export const getReviewsByStudioId = async (studioId: string) => {
  const oId = new mongoose.Types.ObjectId(studioId);

  // Fetch all reviews aimed at this studio
  const reviews = await Review.find({ studioId: oId, isAIApproved: true })
    .populate('customerId', 'fullName avatar')
    .sort({ createdAt: -1 });

  // Calculate Average Rating dynamically
  const aggregation = await Review.aggregate([
    { $match: { studioId: oId, isAIApproved: true } },
    { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
  ]);

  const stats = aggregation.length > 0 
    ? { averageRating: parseFloat(aggregation[0].averageRating.toFixed(1)), totalReviews: aggregation[0].totalReviews }
    : { averageRating: 0, totalReviews: 0 };

  return { stats, reviews };
};

export const replyToReview = async (
  reviewId: string,
  studioId: string,
  replyContent: string
): Promise<IReview> => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error('Review not found');

  if (review.studioId.toString() !== studioId) {
    throw new Error('Not authorized to reply to this review');
  }

  review.replyContent = replyContent;
  return await review.save();
};

export const createMockReview = async (
  bookingId: string,
  customerId: string,
  rating: number,
  content: string
): Promise<IReview> => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');

  return await Review.create({
    bookingId,
    customerId,
    studioId: booking.studioId,
    rating,
    content
  });
};
