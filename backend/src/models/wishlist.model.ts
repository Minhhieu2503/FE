import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlist extends Document {
  customerId: mongoose.Types.ObjectId;
  studioId: mongoose.Types.ObjectId;
}

const wishlistSchema: Schema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studioId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate saves of the same studio by the same user
wishlistSchema.index({ customerId: 1, studioId: 1 }, { unique: true });

const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
export default Wishlist;
