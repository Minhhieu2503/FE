import mongoose from 'mongoose';
import Wishlist, { IWishlist } from '../../models/wishlist.model';
import User, { UserRole } from '../../models/user.model';
import Profile from '../../models/profile.model';

export const toggleWishlistService = async (customerId: string, studioId: string) => {
  // Validate that the target exists and is actually a STUDIO
  const studio = await User.findOne({ _id: studioId, role: UserRole.STUDIO });
  if (!studio) {
    throw new Error('Target studio not found or invalid role');
  }

  // Check if already favorited
  const existing = await Wishlist.findOne({ customerId, studioId });
  
  if (existing) {
    // Unsave
    await Wishlist.deleteOne({ _id: existing._id });
    return { isSaved: false, message: 'Studio removed from wishlist' };
  } else {
    // Save
    await Wishlist.create({ customerId, studioId });
    return { isSaved: true, message: 'Studio saved to wishlist' };
  }
};

export const getMyWishlistService = async (customerId: string) => {
  // Find all raw wishlist documents for this customer
  const wishlists = await Wishlist.find({ customerId }).sort({ createdAt: -1 }).lean() as any[];

  // Map and populate Studio details (Name, Avatar, Rating)
  const populatedResults = await Promise.all(
    wishlists.map(async (item) => {
      const studio = await User.findById(item.studioId).select('fullName').lean() as any;
      const profile = await Profile.findOne({ userId: item.studioId }).select('avatar avgRating').lean() as any;

      return {
        _id: item._id, // the wishlist record ID
        studio: {
          _id: studio?._id,
          fullName: studio?.fullName || 'Unknown Studio',
          avatar: profile?.avatar || null,
          avgRating: profile?.avgRating || 0
        },
        savedAt: item.createdAt
      };
    })
  );

  return populatedResults;
};
