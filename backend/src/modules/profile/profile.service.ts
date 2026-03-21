import Profile, { IProfile } from '../../models/profile.model';

export const getProfileByUserId = async (userId: string): Promise<IProfile | null> => {
  return await Profile.findOne({ userId }).populate('userId', 'email role kycStatus isActive');
};

export const upsertProfile = async (
  userId: string,
  profileData: Partial<IProfile>
): Promise<IProfile> => {
  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $set: profileData },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return profile;
};
