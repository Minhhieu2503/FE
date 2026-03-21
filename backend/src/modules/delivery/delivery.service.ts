import mongoose from 'mongoose';
import Delivery, { IDelivery, DeliveryStatus } from '../../models/delivery.model';
import PhotoAsset, { IPhotoAsset } from '../../models/photo_asset.model';
import Booking, { BookingStatus } from '../../models/booking.model';

// =========================
// NEW: Create delivery
// =========================
export const createDelivery = async (
  bookingId: string,
  studioId: string,
  customerId: string
): Promise<IDelivery> => {
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

// =========================
// NEW: Add photo assets
// =========================
export const addPhotoAssets = async (
  deliveryId: string,
  assets: { privateURL: string; previewURL: string }[]
): Promise<IPhotoAsset[]> => {
  const docs = assets.map((a) => ({
    deliveryId: new mongoose.Types.ObjectId(deliveryId),
    privateURL: a.privateURL,
    previewURL: a.previewURL,
  }));

  return await PhotoAsset.insertMany(docs);
};

// =========================
// NEW: Mark delivered
// =========================
export const markDeliveryAsDelivered = async (
  deliveryId: string,
  bookingId: string
): Promise<void> => {
  const holdUntilDate = new Date();
  holdUntilDate.setDate(holdUntilDate.getDate() + 3);

  await Delivery.findByIdAndUpdate(deliveryId, {
    status: DeliveryStatus.DELIVERED,
    holdUntil: holdUntilDate,
  });

  await Booking.findByIdAndUpdate(bookingId, {
    status: BookingStatus.COMPLETED,
  });
};

// =========================
// NEW: Get preview photos
// =========================
export const getDeliveryWithPreviewPhotos = async (
  bookingId: string
): Promise<any> => {
  const delivery = await Delivery.findOne({ bookingId });
  if (!delivery) throw new Error('Delivery not found');

  const assets = await PhotoAsset.find({ deliveryId: delivery._id }).select(
    'previewURL createdAt'
  );

  return {
    delivery,
    photos: assets,
  };
};

// =========================
// NEW: Get private photos
// =========================
export const getDeliveryWithPrivatePhotos = async (
  bookingId: string
): Promise<any> => {
  const delivery = await Delivery.findOne({ bookingId });
  if (!delivery) throw new Error('Delivery not found');

  const assets = await PhotoAsset.find({ deliveryId: delivery._id }).select(
    'privateURL previewURL createdAt'
  );

  return {
    delivery,
    photos: assets,
  };
};

// =========================
// OLD: Customer view delivered photos
// =========================
export const getDeliveredPhotosForCustomer = async (
  customerId: string,
  bookingId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error('Invalid customer id');
  }

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new Error('Invalid booking id');
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    customerId,
  }).lean();

  if (!booking) {
    throw new Error('Booking not found');
  }

  const bookingStatus = String(booking.status).toUpperCase();

  if (bookingStatus !== 'COMPLETED') {
    throw new Error(
      'Customer can only view photos after booking is marked as completed'
    );
  }

  if (
    !booking.photos ||
    !Array.isArray(booking.photos) ||
    booking.photos.length === 0
  ) {
    throw new Error('No delivered photos found for this booking');
  }

  return {
    bookingId: booking._id,
    status: booking.status,
    totalPhotos: booking.photos.length,
    photos: booking.photos,
  };
};

// =========================
// OLD: Customer download 1 photo
// =========================
export const getDownloadPhotoForCustomer = async (
  customerId: string,
  bookingId: string,
  photoId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new Error('Invalid customer id');
  }

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new Error('Invalid booking id');
  }

  if (!mongoose.Types.ObjectId.isValid(photoId)) {
    throw new Error('Invalid photo id');
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    customerId,
  }).lean();

  if (!booking) {
    throw new Error('Booking not found');
  }

  const bookingStatus = String(booking.status).toUpperCase();

  if (bookingStatus !== 'COMPLETED') {
    throw new Error(
      'Customer can only download photos after booking is marked as completed'
    );
  }

  if (
    !booking.photos ||
    !Array.isArray(booking.photos) ||
    booking.photos.length === 0
  ) {
    throw new Error('No delivered photos found for this booking');
  }

  const photo = booking.photos.find(
    (item: any) => String(item._id) === String(photoId)
  );

  if (!photo) {
    throw new Error('Photo not found');
  }

  return {
    photoId: photo._id,
    fileName: photo.fileName,
    url: photo.url,
  };
};