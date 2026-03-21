import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import Booking from '../../models/booking.model';
import { uploadToCloudinaryWithWatermark } from '../../shared/cloudinary.service';
import {
  createDelivery,
  addPhotoAssets,
  markDeliveryAsDelivered,
  getDeliveryWithPreviewPhotos,
  getDeliveryWithPrivatePhotos,
  getDeliveredPhotosForCustomer,
  getDownloadPhotoForCustomer,
} from './delivery.service';

// Studio uploads delivered photos
export const uploadDeliveries = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const studioId = req.user?._id?.toString() as string;
    const bookingId = req.params.bookingId as string;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (booking.studioId.toString() !== studioId) {
      res.status(403).json({ message: 'Not authorized for this booking' });
      return;
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ message: 'No photos provided' });
      return;
    }

    // 1. Create or find delivery
    const delivery = await createDelivery(
      bookingId,
      studioId,
      booking.customerId.toString()
    );

    // 2. Upload photos to cloud
    const uploadedAssets: { privateURL: string; previewURL: string }[] = [];
    for (const file of files) {
      const result = await uploadToCloudinaryWithWatermark(
        file.buffer,
        'snapbook-deliveries'
      );
      uploadedAssets.push(result);
    }

    // 3. Save photo assets
    await addPhotoAssets(delivery._id.toString(), uploadedAssets);

    // 4. Mark delivery + booking completed
    await markDeliveryAsDelivered(delivery._id.toString(), bookingId);

    res.status(201).json({
      message: 'Photos uploaded and delivered successfully',
      totalPhotos: uploadedAssets.length,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Error uploading deliveries',
    });
  }
};

// Customer or studio fetches preview photos
export const getDeliveryPreview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const bookingId = req.params.bookingId as string;

    const data = await getDeliveryWithPreviewPhotos(bookingId);

    res.status(200).json({
      message: 'Delivery preview fetched successfully',
      data,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message || 'Delivery not found',
    });
  }
};

// Customer downloads full photos
export const getDeliveryDownload = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const bookingId = req.params.bookingId as string;

    // TODO: Verify payment status here
    // Rule: must have paid enough to unlock original photos

    const data = await getDeliveryWithPrivatePhotos(bookingId);

    res.status(200).json({
      message: 'Delivery download fetched successfully',
      data,
    });
  } catch (error: any) {
    res.status(403).json({
      message: error.message || 'Cannot access private photos yet',
    });
  }
};

// Customer views delivered photos after booking completed
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

// Customer gets single photo download link after booking completed
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