import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import Booking from '../../models/booking.model';
import { uploadToCloudinaryWithWatermark } from '../../shared/cloudinary.service';
import {
  createDelivery,
  addPhotoAssets,
  markDeliveryAsDelivered,
  getDeliveryWithPreviewPhotos,
  getDeliveryWithPrivatePhotos
} from './delivery.service';

export const uploadDeliveries = async (req: AuthRequest, res: Response): Promise<void> => {
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

    // 1. Create or Find Delivery
    const delivery = await createDelivery(bookingId, studioId, booking.customerId.toString());

    // 2. Upload to Cloudinary sequentially (or Promise.all if safe limits)
    const uploadedAssets = [];
    for (const file of files) {
      const result = await uploadToCloudinaryWithWatermark(file.buffer, 'snapbook-deliveries');
      uploadedAssets.push(result);
    }

    // 3. Save to PhotoAssets
    await addPhotoAssets(delivery._id.toString(), uploadedAssets);

    // 4. Mark Delivery as DELIVERED and Booking as COMPLETED
    await markDeliveryAsDelivered(delivery._id.toString(), bookingId);

    res.status(201).json({ message: 'Photos uploaded and delivered successfully', totalPhotos: uploadedAssets.length });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error uploading deliveries' });
  }
};

export const getDeliveryPreview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.bookingId as string;
    const data = await getDeliveryWithPreviewPhotos(bookingId);
    // Returns ONLY previewURL (Watermarked)
    res.status(200).json(data);
  } catch (error: any) {
    res.status(404).json({ message: error.message || 'Delivery not found' });
  }
};

export const getDeliveryDownload = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.bookingId as string;
    
    // TODO: Verify Payment Status (Rule: Must have paid 70% remaining)
    // const payment = await Payment.findOne({ bookingId });
    // if (!payment.isFullyPaid) throw new Error('Payment not completed');

    const data = await getDeliveryWithPrivatePhotos(bookingId);
    // Returns privateURL along with previewURL
    res.status(200).json(data);
  } catch (error: any) {
    res.status(403).json({ message: error.message || 'Cannot access private photos yet' });
  }
};
