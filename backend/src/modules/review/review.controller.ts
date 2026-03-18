import { Request, Response } from 'express';
import {
  approvePortfolio,
  getAllPortfolios,
  getMyPortfolioDetail,
  getMyPortfolios,
  getPortfolioDetailByAdmin,
  getProfileForReview,
  rejectPortfolio,
  submitPortfolio,
} from './review.service';

// STUDIO

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
    const portfolio = await getMyPortfolioDetail(
      studioId as string,
      requestId
    );

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

// ADMIN

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