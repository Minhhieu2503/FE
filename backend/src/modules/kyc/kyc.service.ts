import Kyc, { IKyc } from '../../models/kyc.model';
import User, { KycStatus } from '../../models/user.model';

export const submitKyc = async (
  userId: string,
  idDocURL: string,
  selfieURL: string,
  portfolioURLs: string[]
): Promise<IKyc> => {
  const kyc = await Kyc.findOneAndUpdate(
    { userId },
    {
      $set: {
        idDocURL,
        selfieURL,
        portfolioURLs,
        status: KycStatus.PENDING,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await User.findByIdAndUpdate(userId, { kycStatus: KycStatus.PENDING });

  return kyc;
};

export const getMyKyc = async (userId: string): Promise<IKyc | null> => {
  return await Kyc.findOne({ userId });
};
