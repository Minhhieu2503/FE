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

export const uploadToCloudinaryWithWatermark = (
  fileBuffer: Buffer,
  folder: string = 'snapbook-deliveries'
): Promise<{ privateURL: string; previewURL: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (result) {
          const privateURL = result.secure_url;
          // Apply Text Overlay for Watermark
          const previewURL = cloudinary.url(result.public_id, {
            transformation: [
              { width: 1200, crop: 'limit' },
              {
                overlay: { font_family: "Arial", font_size: 150, font_weight: "bold", text: "SNAPBOOK" },
                opacity: 50,
                gravity: "center",
                angle: -45,
                color: "white"
              }
            ]
          });
          return resolve({ privateURL, previewURL });
        }
        reject(new Error('Unknown upload error'));
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
