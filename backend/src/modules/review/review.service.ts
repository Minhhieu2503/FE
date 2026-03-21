import mongoose from 'mongoose';
import StudioPortfolio, {
  IPortfolioCredential,
  IPortfolioSample,
  IStudioPortfolio,
} from '../../models/studioPortfolio.model';
import StudioContent, { IStudioContent } from '../../models/studioContent.model';
import User from '../user/user.model';
import StudioReview, { IStudioReview } from '../../models/studioReview.model';

export interface CreateStudioReviewInput {
  rating: number;
  comment?: string;
}
export interface SubmitPortfolioInput {
  title: string;
  description: string;
  samples: IPortfolioSample[];
  credentials: IPortfolioCredential[];
}

export interface SubmitStudioContentInput {
  title: string;
  description: string;
  price: number;
  images: {
    url: string;
    caption?: string;
  }[];
}

export const submitPortfolio = async (
  studioId: string,
  payload: SubmitPortfolioInput
): Promise<IStudioPortfolio> => {
  const { title, description, samples, credentials } = payload;

  if (!title?.trim()) {
    throw new Error('Portfolio title is required');
  }

  if (!description?.trim()) {
    throw new Error('Portfolio description is required');
  }

  if (!Array.isArray(samples) || samples.length === 0) {
    throw new Error('At least one portfolio sample is required');
  }

  const studio = await User.findById(studioId);

  if (!studio) {
    throw new Error('Studio not found');
  }

  const portfolio = await StudioPortfolio.create({
    studioId,
    title,
    description,
    samples,
    credentials: Array.isArray(credentials) ? credentials : [],
    status: 'pending',
  });

  return portfolio;
};

export const getMyPortfolios = async (studioId: string): Promise<IStudioPortfolio[]> => {
  return StudioPortfolio.find({ studioId }).sort({ createdAt: -1 });
};

export const getMyPortfolioDetail = async (
  studioId: string,
  portfolioId: string
): Promise<IStudioPortfolio> => {
  if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
    throw new Error('Invalid portfolio id');
  }

  const portfolio = await StudioPortfolio.findOne({
    _id: portfolioId,
    studioId,
  });

  if (!portfolio) {
    throw new Error('Portfolio not found');
  }

  return portfolio;
};

export const getAllPortfolios = async (): Promise<IStudioPortfolio[]> => {
  return StudioPortfolio.find()
    .populate('studioId', 'fullName email role')
    .populate('reviewedBy', 'fullName email role')
    .sort({ createdAt: -1 });
};

export const getPortfolioDetailByAdmin = async (
  portfolioId: string
): Promise<IStudioPortfolio> => {
  if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
    throw new Error('Invalid portfolio id');
  }

  const portfolio = await StudioPortfolio.findById(portfolioId)
    .populate('studioId', 'fullName email role')
    .populate('reviewedBy', 'fullName email role');

  if (!portfolio) {
    throw new Error('Portfolio not found');
  }

  return portfolio;
};

export const approvePortfolio = async (
  portfolioId: string,
  adminId: string
): Promise<IStudioPortfolio> => {
  if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
    throw new Error('Invalid portfolio id');
  }

  const portfolio = await StudioPortfolio.findById(portfolioId);

  if (!portfolio) {
    throw new Error('Portfolio not found');
  }

  if (portfolio.status === 'approved') {
    throw new Error('Portfolio is already approved');
  }

  portfolio.status = 'approved';
  portfolio.rejectionReason = undefined;
  portfolio.reviewedBy = new mongoose.Types.ObjectId(adminId);
  portfolio.reviewedAt = new Date();

  await portfolio.save();

  return portfolio;
};

export const rejectPortfolio = async (
  portfolioId: string,
  adminId: string,
  rejectionReason: string
): Promise<IStudioPortfolio> => {
  if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
    throw new Error('Invalid portfolio id');
  }

  if (!rejectionReason?.trim()) {
    throw new Error('Rejection reason is required');
  }

  const portfolio = await StudioPortfolio.findById(portfolioId);

  if (!portfolio) {
    throw new Error('Portfolio not found');
  }

  if (portfolio.status === 'rejected') {
    throw new Error('Portfolio is already rejected');
  }

  portfolio.status = 'rejected';
  portfolio.rejectionReason = rejectionReason.trim();
  portfolio.reviewedBy = new mongoose.Types.ObjectId(adminId);
  portfolio.reviewedAt = new Date();

  await portfolio.save();

  return portfolio;
};

export const getProfileForReview = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user id');
  }

  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  const portfolios = await StudioPortfolio.find({
    studioId: userId,
  }).sort({ createdAt: -1 });

  return {
    user,
    portfolios,
  };
};

// CONTENT

export const submitStudioContent = async (
  studioId: string,
  payload: SubmitStudioContentInput
): Promise<IStudioContent> => {
  const { title, description, price, images } = payload;

  if (!title?.trim()) {
    throw new Error('Title is required');
  }

  if (!description?.trim()) {
    throw new Error('Description is required');
  }

  if (price === undefined || price === null || Number(price) < 0) {
    throw new Error('Valid price is required');
  }

  const studio = await User.findById(studioId);

  if (!studio) {
    throw new Error('Studio not found');
  }

  const content = await StudioContent.create({
    studioId,
    title,
    description,
    price,
    images: Array.isArray(images) ? images : [],
    status: 'pending',
  });

  return content;
};

export const getMyContents = async (studioId: string): Promise<IStudioContent[]> => {
  return StudioContent.find({ studioId }).sort({ createdAt: -1 });
};

export const getMyContentDetail = async (
  studioId: string,
  contentId: string
): Promise<IStudioContent> => {
  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new Error('Invalid content id');
  }

  const content = await StudioContent.findOne({
    _id: contentId,
    studioId,
  });

  if (!content) {
    throw new Error('Content not found');
  }

  return content;
};

export const getAllContents = async (): Promise<IStudioContent[]> => {
  return StudioContent.find()
    .populate('studioId', 'fullName email role')
    .populate('moderatedBy', 'fullName email role')
    .sort({ createdAt: -1 });
};

export const getContentDetailByAdmin = async (
  contentId: string
): Promise<IStudioContent> => {
  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new Error('Invalid content id');
  }

  const content = await StudioContent.findById(contentId)
    .populate('studioId', 'fullName email role')
    .populate('moderatedBy', 'fullName email role');

  if (!content) {
    throw new Error('Content not found');
  }

  return content;
};

export const approveContent = async (
  contentId: string,
  adminId: string
): Promise<IStudioContent> => {
  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new Error('Invalid content id');
  }

  const content = await StudioContent.findById(contentId);

  if (!content) {
    throw new Error('Content not found');
  }

  content.status = 'approved';
  content.moderationReason = undefined;
  content.moderatedBy = new mongoose.Types.ObjectId(adminId);
  content.moderatedAt = new Date();

  await content.save();

  return content;
};

export const rejectContent = async (
  contentId: string,
  adminId: string,
  moderationReason: string
): Promise<IStudioContent> => {
  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new Error('Invalid content id');
  }

  if (!moderationReason?.trim()) {
    throw new Error('Moderation reason is required');
  }

  const content = await StudioContent.findById(contentId);

  if (!content) {
    throw new Error('Content not found');
  }

  content.status = 'rejected';
  content.moderationReason = moderationReason.trim();
  content.moderatedBy = new mongoose.Types.ObjectId(adminId);
  content.moderatedAt = new Date();

  await content.save();

  return content;
};

export const hideContent = async (
  contentId: string,
  adminId: string,
  moderationReason: string
): Promise<IStudioContent> => {
  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new Error('Invalid content id');
  }

  if (!moderationReason?.trim()) {
    throw new Error('Moderation reason is required');
  }

  const content = await StudioContent.findById(contentId);

  if (!content) {
    throw new Error('Content not found');
  }

  content.status = 'hidden';
  content.moderationReason = moderationReason.trim();
  content.moderatedBy = new mongoose.Types.ObjectId(adminId);
  content.moderatedAt = new Date();

  await content.save();

  return content;
};
export const createReviewForStudio = async (
  customerId: string,
  studioId: string,
  payload: CreateStudioReviewInput
): Promise<IStudioReview> => {
  const { rating, comment } = payload;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error('Invalid customer id');
  }

  if (!mongoose.Types.ObjectId.isValid(studioId)) {
    throw new Error('Invalid studio id');
  }

  if (!rating || Number(rating) < 1 || Number(rating) > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  const customer = await User.findById(customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }

  const studio = await User.findById(studioId);
  if (!studio) {
    throw new Error('Studio not found');
  }

  if (String(customerId) === String(studioId)) {
    throw new Error('You cannot review your own studio');
  }

  // nếu muốn mỗi customer chỉ review 1 lần / studio
  const existingReview = await StudioReview.findOne({ customerId, studioId });

  if (existingReview) {
    existingReview.rating = Number(rating);
    existingReview.comment = comment?.trim() || '';
    await existingReview.save();
    return existingReview;
  }

  const review = await StudioReview.create({
    customerId,
    studioId,
    rating: Number(rating),
    comment: comment?.trim() || '',
  });

  return review;
};

export const getReviewsByStudio = async (studioId: string) => {
  if (!mongoose.Types.ObjectId.isValid(studioId)) {
    throw new Error('Invalid studio id');
  }

  const studio = await User.findById(studioId);
  if (!studio) {
    throw new Error('Studio not found');
  }

  const reviews = await StudioReview.find({ studioId })
    .populate('customerId', 'fullName email')
    .populate('studioId', 'fullName email')
    .sort({ createdAt: -1 });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : Number(
          (
            reviews.reduce((sum, item) => sum + item.rating, 0) / totalReviews
          ).toFixed(1)
        );

  return {
    studioId,
    totalReviews,
    averageRating,
    reviews,
  };
};