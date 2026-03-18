import mongoose from 'mongoose';
import StudioPortfolio, {
  IPortfolioCredential,
  IPortfolioSample,
  IStudioPortfolio,
} from '../../models/studioPortfolio.model';
import User from '../user/user.model';

export interface SubmitPortfolioInput {
  title: string;
  description: string;
  samples: IPortfolioSample[];
  credentials: IPortfolioCredential[];
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