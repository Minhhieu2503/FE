import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as wishlistService from './wishlist.service';

export const toggleWishlistItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?._id?.toString() as string;
    const studioId = req.params.studioId as string;

    if (!studioId) {
      res.status(400).json({ message: 'Studio ID is required' });
      return;
    }

    const result = await wishlistService.toggleWishlistService(customerId, studioId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error toggling wishlist' });
  }
};

export const getMyWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customerId = req.user?._id?.toString() as string;
    const items = await wishlistService.getMyWishlistService(customerId);
    
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching wishlist' });
  }
};
