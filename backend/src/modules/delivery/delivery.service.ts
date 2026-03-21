import mongoose from 'mongoose';
import Booking from '../../models/booking.model';

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

  if (booking.status !== 'completed') {
    throw new Error(
      'Customer can only view photos after booking is marked as completed'
    );
  }

  if (!booking.photos || !Array.isArray(booking.photos) || booking.photos.length === 0) {
    throw new Error('No delivered photos found for this booking');
  }

  return {
    bookingId: booking._id,
    status: booking.status,
    totalPhotos: booking.photos.length,
    photos: booking.photos,
  };
};

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

  if (booking.status !== 'completed') {
    throw new Error(
      'Customer can only download photos after booking is marked as completed'
    );
  }

  if (!booking.photos || !Array.isArray(booking.photos) || booking.photos.length === 0) {
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