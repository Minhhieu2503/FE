import { Request, Response } from 'express';
import { getProfileByUserId, upsertProfile } from './profile.service';
import { uploadToCloudinary } from '../../shared/cloudinary.service';
import User from '../../models/user.model';

export interface AuthRequest extends Request {
  user?: any;
}

export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id as string;
    const profile = await getProfileByUserId(userId);

    if (!profile) {
      const user = await User.findById(userId).select('-password');
      res.status(200).json({
        userId: user, // Simulate populated response
        fullName: '',
        phone: '',
        avatar: null,
      });
      return;
    }

    res.status(200).json(profile);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching profile' });
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id as string;
    const { fullName, phone, bio, packages } = req.body;
    let avatarUrl: string | undefined = undefined;

    // Handle avatar upload if file is present
    if (req.file) {
      avatarUrl = await uploadToCloudinary(req.file.buffer, 'snapbook/avatars');
    }

    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (packages !== undefined) updateData.packages = packages;
    if (avatarUrl !== undefined) updateData.avatar = avatarUrl;

    const updatedProfile = await upsertProfile(userId, updateData);
    res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating profile' });
  }
};

export const getProfileById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const profile = await getProfileByUserId(id);
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching profile' });
  }
};
