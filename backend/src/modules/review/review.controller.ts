import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { getReviewsByStudioId, replyToReview, createMockReview } from './review.service';

export const getStudioReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studioId = req.user?._id?.toString() as string;
    const data = await getReviewsByStudioId(studioId);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching reviews' });
  }
};

export const patchReviewReply = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studioId = req.user?._id?.toString() as string;
    const reviewId = req.params.id as string;
    const { replyContent } = req.body;

    if (!replyContent || typeof replyContent !== 'string') {
      res.status(400).json({ message: 'replyContent string is required' });
      return;
    }

    const updatedReview = await replyToReview(reviewId, studioId, replyContent);
    res.status(200).json({ message: 'Reply posted successfully', review: updatedReview });
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};

export const postMockReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?._id?.toString() as string;
    const { bookingId, rating, content } = req.body;
    
    if (!bookingId || !rating || !content) {
      res.status(400).json({ message: 'bookingId, rating, content required' });
      return;
    }

    const review = await createMockReview(bookingId, customerId, rating, content);
    res.status(201).json({ message: 'Mock review created', review });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
