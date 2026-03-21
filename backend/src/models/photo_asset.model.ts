import mongoose, { Document, Schema } from 'mongoose';

export interface IPhotoAsset extends Document {
  deliveryId: mongoose.Types.ObjectId;
  privateURL: string;
  previewURL: string;
}

const photoAssetSchema: Schema = new Schema(
  {
    deliveryId: { type: Schema.Types.ObjectId, ref: 'Delivery', required: true },
    privateURL: { type: String, required: true },
    previewURL: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const PhotoAsset = mongoose.model<IPhotoAsset>('PhotoAsset', photoAssetSchema);
export default PhotoAsset;
