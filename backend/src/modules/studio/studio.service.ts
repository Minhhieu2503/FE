import User, { UserRole } from '../../models/user.model';
import Profile from '../../models/profile.model';
import Kyc from '../../models/kyc.model';

export const searchStudiosService = async (page: number, limit: number, searchQuery: string) => {
  const skip = (page - 1) * limit;

  // Step 1: Filter users who are specifically STUDIOS and have passed the KYC check
  let matchQuery: any = { 
    role: UserRole.STUDIO, 
    kycStatus: 'APPROVED' 
  };

  if (searchQuery) {
    matchQuery.fullName = { $regex: searchQuery, $options: 'i' };
  }

  const users = await User.find(matchQuery)
    .skip(skip)
    .limit(limit)
    .select('fullName')
    .lean();

  const total = await User.countDocuments(matchQuery);

  // Step 2: Fetch corresponding Profiles to get Avatars and Ratings
  const results = await Promise.all(
    (users as any[]).map(async (u) => {
      const profile = await Profile.findOne({ userId: u._id }).select('avatar avgRating bio').lean() as any;
      return {
        _id: u._id,
        fullName: u.fullName,
        avatar: profile?.avatar || null,
        avgRating: profile?.avgRating || 0,
        bio: profile?.bio || ''
      };
    })
  );

  return { 
    data: results, 
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    } 
  };
};

export const getStudioProfileData = async (studioId: string) => {
  // Grab the base User Object
  const user = await User.findOne({ _id: studioId, role: UserRole.STUDIO }).select('fullName kycStatus').lean() as any;
  if (!user) {
    throw new Error('Studio User not found or invalid role');
  }

  // Grab the customizable Profile (Packages, Bio, Address, Avatar, Rating)
  const profile = await Profile.findOne({ userId: studioId }).lean();

  // Grab the Portfolio from within the KYC Documents (UC-08)
  const kyc = await Kyc.findOne({ userId: studioId }).select('portfolioURLs').lean() as any;

  return {
    studio: {
      _id: user._id,
      fullName: user.fullName,
      kycStatus: user.kycStatus
    },
    profile: profile || {},
    portfolio: kyc?.portfolioURLs || []
  };
};
