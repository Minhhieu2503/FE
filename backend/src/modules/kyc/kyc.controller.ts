import { Request, Response } from 'express';
import * as kycService from './kyc.service';

const getUserIdFromHeader = (req: Request): string => {
  const userId = req.header('x-user-id');

  if (!userId) {
    throw new Error('Missing x-user-id header');
  }

  return userId;
};

export const submitStudioRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserIdFromHeader(req);

    const result = await kycService.submitStudioRegistration(userId, req.body);

    res.status(201).json({
      message: 'Studio registration submitted successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to submit studio registration',
    });
  }
};

export const getMyStudioRegistrations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserIdFromHeader(req);

    const result = await kycService.getMyStudioRegistrations(userId);

    res.status(200).json({
      message: 'Fetched studio registration requests successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to fetch studio registrations',
    });
  }
};

export const getMyStudioRegistrationDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = getUserIdFromHeader(req);
    const requestId = String(req.params.id);
    const result = await kycService.getMyStudioRegistrationDetail(
      userId,
      requestId
    );

    res.status(200).json({
      message: 'Fetched studio registration detail successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to fetch studio registration detail',
    });
  }
};

export const getAllStudioRegistrations = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await kycService.getAllStudioRegistrations();

    res.status(200).json({
      message: 'Fetched all studio registration requests successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to fetch all studio registrations',
    });
  }
};

export const getStudioRegistrationDetailByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const requestId = String(req.params.id);
    const result = await kycService.getStudioRegistrationDetailByAdmin(requestId);
    res.status(200).json({
      message: 'Fetched studio registration detail successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to fetch studio registration detail',
    });
  }
};

export const approveStudioRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const adminId = getUserIdFromHeader(req);
    const requestId = String(req.params.id);
    const result = await kycService.approveStudioRegistration(
      requestId,
      adminId
    );

    res.status(200).json({
      message: 'Studio registration approved successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to approve studio registration',
    });
  }
};

export const rejectStudioRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const adminId = getUserIdFromHeader(req);
    const { rejectReason } = req.body;
     const requestId = String(req.params.id);
    const result = await kycService.rejectStudioRegistration(
      requestId,
      adminId,
      rejectReason
    );

    res.status(200).json({
      message: 'Studio registration rejected successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to reject studio registration',
    });
  }
};