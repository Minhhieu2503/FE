import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = 'snapbook-uploads'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result.secure_url);
        reject(new Error('Unknown upload error'));
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
