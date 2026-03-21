import mongoose from 'mongoose';
import Delivery, { IDelivery, DeliveryStatus } from '../../models/delivery.model';
import PhotoAsset, { IPhotoAsset } from '../../models/photo_asset.model';
import Booking, { BookingStatus } from '../../models/booking.model';

export const createDelivery = async (
  bookingId: string,
  studioId: string,
  customerId: string
): Promise<IDelivery> => {
  // Check if delivery already exists
  let delivery = await Delivery.findOne({ bookingId });
  if (!delivery) {
    delivery = await Delivery.create({
      bookingId,
      studioId,
      customerId,
      status: DeliveryStatus.PENDING,
    });
  }
  return delivery;
};

export const addPhotoAssets = async (
  deliveryId: string,
  assets: { privateURL: string; previewURL: string }[]
): Promise<IPhotoAsset[]> => {
  const docs = assets.map(a => ({
    deliveryId: new mongoose.Types.ObjectId(deliveryId),
    privateURL: a.privateURL,
    previewURL: a.previewURL,
  }));
  return await PhotoAsset.insertMany(docs);
};

export const markDeliveryAsDelivered = async (
  deliveryId: string,
  bookingId: string
): Promise<void> => {
   // Calculate Auto-Release Date (3 days from now)
   const holdUntilDate = new Date();
   holdUntilDate.setDate(holdUntilDate.getDate() + 3);

   await Delivery.findByIdAndUpdate(deliveryId, { 
      status: DeliveryStatus.DELIVERED,
      holdUntil: holdUntilDate
   });

   // Move booking to COMPLETED
   await Booking.findByIdAndUpdate(bookingId, { status: BookingStatus.COMPLETED });
};

export const getDeliveryWithPreviewPhotos = async (
  bookingId: string
): Promise<any> => {
  const delivery = await Delivery.findOne({ bookingId });
  if (!delivery) throw new Error('Delivery not found');

  const assets = await PhotoAsset.find({ deliveryId: delivery._id }).select('previewURL createdAt');
  
  return {
    delivery,
    photos: assets
  };
};

export const getDeliveryWithPrivatePhotos = async (
  bookingId: string
): Promise<any> => {
  const delivery = await Delivery.findOne({ bookingId });
  if (!delivery) throw new Error('Delivery not found');

  const assets = await PhotoAsset.find({ deliveryId: delivery._id }).select('privateURL previewURL createdAt');
  return {
    delivery,
    photos: assets
  };
};
