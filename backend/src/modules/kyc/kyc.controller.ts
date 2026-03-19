import { Request, Response } from 'express';
import { submitKyc, getMyKyc } from './kyc.service';
import { uploadToCloudinary } from '../../shared/cloudinary.service';
import { AuthRequest } from '../../middlewares/auth.middleware'; // Optional casting
import { UserRole } from '../../models/user.model';

export const uploadKyc = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as any;
    const userId = authReq.user?._id as string;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files || !files['idDocument'] || !files['selfie']) {
      res.status(400).json({ message: 'Both idDocument and selfie image files are required.' });
      return;
    }

    const idDocumentFile = files['idDocument'][0];
    const selfieFile = files['selfie'][0];

    // Upload to Cloudinary
    const [idDocURL, selfieURL] = await Promise.all([
      uploadToCloudinary(idDocumentFile.buffer, 'snapbook/kyc'),
      uploadToCloudinary(selfieFile.buffer, 'snapbook/kyc'),
    ]);

    const { portfolioURLs } = req.body;
    
    const kycRecord = await submitKyc(userId, idDocURL, selfieURL, portfolioURLs || []);

    res.status(201).json({ message: 'KYC submitted successfully', kyc: kycRecord });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error submitting KYC' });
  }
};

export const viewMyKyc = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?._id as string;
    const kycRecord = await getMyKyc(userId);
    if (!kycRecord) {
      res.status(404).json({ message: 'KYC record not found' });
      return;
    }
    res.status(200).json(kycRecord);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching KYC' });
  }
};
