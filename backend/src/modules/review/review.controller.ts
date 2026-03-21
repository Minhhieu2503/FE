import { Request, Response } from 'express';
import {
  approveContent,
  approvePortfolio,
  getAllContents,
  getAllPortfolios,
  getContentDetailByAdmin,
  getMyContentDetail,
  getMyContents,
  getMyPortfolioDetail,
  getMyPortfolios,
  getPortfolioDetailByAdmin,
  getProfileForReview,
  hideContent,
  rejectContent,
  rejectPortfolio,
  submitPortfolio,
  submitStudioContent,

  // NEW
  createReviewForStudio,
  getReviewsByStudio,
} from './review.service';

// STUDIO PORTFOLIO

export const submitStudioPortfolio = async (req: Request, res: Response) => {
  try {
    const studioId = req.header('x-user-id');

    if (!studioId) {
      return res.status(401).json({ message: 'Missing x-user-id' });
    }

    const portfolio = await submitPortfolio(studioId, req.body);

    return res.status(201).json({
      message: 'Portfolio submitted successfully.',
      portfolio,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getMyStudioPortfolios = async (req: Request, res: Response) => {
  try {
    const studioId = req.header('x-user-id');

    const portfolios = await getMyPortfolios(studioId as string);

    return res.status(200).json({
      message: 'My portfolios fetched successfully.',
      portfolios,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getMyStudioPortfolioDetail = async (req: Request, res: Response) => {
  try {
    const studioId = req.header('x-user-id');
    const requestId = String(req.params.id);

    const portfolio = await getMyPortfolioDetail(studioId as string, requestId);

    return res.status(200).json({
      message: 'Portfolio detail fetched successfully.',
      portfolio,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

// ADMIN PORTFOLIO

export const getAllStudioPortfolios = async (_req: Request, res: Response) => {
  try {
    const portfolios = await getAllPortfolios();

    return res.status(200).json({
      message: 'All portfolios fetched successfully.',
      portfolios,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getStudioPortfolioDetailByAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const requestId = String(req.params.id);
    const portfolio = await getPortfolioDetailByAdmin(requestId);

    return res.status(200).json({
      message: 'Portfolio detail fetched successfully.',
      portfolio,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

export const approveStudioPortfolio = async (req: Request, res: Response) => {
  try {
    const adminId = req.header('x-user-id');
    const requestId = String(req.params.id);

    const portfolio = await approvePortfolio(requestId, adminId as string);

    return res.status(200).json({
      message: 'Portfolio approved successfully.',
      portfolio,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const rejectStudioPortfolio = async (req: Request, res: Response) => {
  try {
    const adminId = req.header('x-user-id');
    const { rejectionReason } = req.body;
    const requestId = String(req.params.id);

    const portfolio = await rejectPortfolio(
      requestId,
      adminId as string,
      rejectionReason
    );

    return res.status(200).json({
      message: 'Portfolio rejected successfully.',
      portfolio,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// PROFILE REVIEW

export const getProfileReviewDetail = async (req: Request, res: Response) => {
  try {
    const requestId = String(req.params.id);
    const result = await getProfileForReview(requestId);

    return res.status(200).json({
      message: 'Profile review detail fetched successfully.',
      data: result,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message || 'Failed to fetch profile review detail.',
    });
  }
};

// STUDIO CONTENT

export const createStudioContent = async (req: Request, res: Response) => {
  try {
    const studioId = req.header('x-user-id');

    if (!studioId) {
      return res.status(401).json({ message: 'Missing x-user-id' });
    }

    const content = await submitStudioContent(studioId, req.body);

    return res.status(201).json({
      message: 'Content submitted successfully.',
      content,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getMyStudioContents = async (req: Request, res: Response) => {
  try {
    const studioId = req.header('x-user-id');

    const contents = await getMyContents(studioId as string);

    return res.status(200).json({
      message: 'My contents fetched successfully.',
      contents,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getMyStudioContentDetail = async (req: Request, res: Response) => {
  try {
    const studioId = req.header('x-user-id');
    const contentId = String(req.params.id);

    const content = await getMyContentDetail(studioId as string, contentId);

    return res.status(200).json({
      message: 'Content detail fetched successfully.',
      content,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

// ADMIN CONTENT

export const getAllStudioContents = async (_req: Request, res: Response) => {
  try {
    const contents = await getAllContents();

    return res.status(200).json({
      message: 'All contents fetched successfully.',
      contents,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getStudioContentDetailByAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const contentId = String(req.params.id);
    const content = await getContentDetailByAdmin(contentId);

    return res.status(200).json({
      message: 'Content detail fetched successfully.',
      content,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

export const approveStudioContent = async (req: Request, res: Response) => {
  try {
    const adminId = req.header('x-user-id');
    const contentId = String(req.params.id);

    const content = await approveContent(contentId, adminId as string);

    return res.status(200).json({
      message: 'Content approved successfully.',
      content,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const rejectStudioContent = async (req: Request, res: Response) => {
  try {
    const adminId = req.header('x-user-id');
    const { moderationReason } = req.body;
    const contentId = String(req.params.id);

    const content = await rejectContent(
      contentId,
      adminId as string,
      moderationReason
    );

    return res.status(200).json({
      message: 'Content rejected successfully.',
      content,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const hideStudioContent = async (req: Request, res: Response) => {
  try {
    const adminId = req.header('x-user-id');
    const { moderationReason } = req.body;
    const contentId = String(req.params.id);

    const content = await hideContent(
      contentId,
      adminId as string,
      moderationReason
    );

    return res.status(200).json({
      message: 'Content hidden successfully.',
      content,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// =========================
// CUSTOMER REVIEW & RATING
// =========================

export const createStudioReview = async (req: Request, res: Response) => {
  try {
    const customerId = req.header('x-user-id');
    const studioId = String(req.params.studioId);

    if (!customerId) {
      return res.status(401).json({ message: 'Missing x-user-id' });
    }

    const review = await createReviewForStudio(customerId, studioId, req.body);

    return res.status(201).json({
      message: 'Studio review submitted successfully.',
      review,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getStudioReviews = async (req: Request, res: Response) => {
  try {
    const studioId = String(req.params.studioId);

    const result = await getReviewsByStudio(studioId);

    return res.status(200).json({
      message: 'Studio reviews fetched successfully.',
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};