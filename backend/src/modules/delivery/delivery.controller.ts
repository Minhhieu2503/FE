import { Request, Response } from 'express';
import {
  getDeliveredPhotosForCustomer,
  getDownloadPhotoForCustomer,
} from './delivery.service';

export const getDeliveredPhotos = async (req: Request, res: Response) => {
  try {
    const customerId = req.header('x-user-id');
    const bookingId = String(req.params.bookingId);

    if (!customerId) {
      return res.status(401).json({
        message: 'Missing x-user-id',
      });
    }

    const result = await getDeliveredPhotosForCustomer(customerId, bookingId);

    return res.status(200).json({
      message: 'Delivered photos fetched successfully.',
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || 'Failed to fetch delivered photos.',
    });
  }
};

export const downloadDeliveredPhoto = async (req: Request, res: Response) => {
  try {
    const customerId = req.header('x-user-id');
    const bookingId = String(req.params.bookingId);
    const photoId = String(req.params.photoId);

    if (!customerId) {
      return res.status(401).json({
        message: 'Missing x-user-id',
      });
    }

    const result = await getDownloadPhotoForCustomer(
      customerId,
      bookingId,
      photoId
    );

    return res.status(200).json({
      message: 'Photo download link fetched successfully.',
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || 'Failed to get photo download link.',
    });
  }
};