import mongoose from 'mongoose';
import StudioRegistrationRequest, {
  IVerificationDocument,
  IStudioRegistrationRequest,
} from '../../models/studioRegistrationRequest.model';
import User from '../user/user.model';

export interface SubmitStudioRegistrationInput {
  studioName: string;
  phone: string;
  address: string;
  description: string;
  verificationDocuments: IVerificationDocument[];
}

export const submitStudioRegistration = async (
  userId: string,
  payload: SubmitStudioRegistrationInput
): Promise<IStudioRegistrationRequest> => {
  const { studioName, phone, address, description, verificationDocuments } = payload;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user id');
  }

  if (!studioName?.trim()) {
    throw new Error('Studio name is required');
  }

  if (!phone?.trim()) {
    throw new Error('Phone is required');
  }

  if (!address?.trim()) {
    throw new Error('Address is required');
  }

  if (!description?.trim()) {
    throw new Error('Description is required');
  }

  if (!Array.isArray(verificationDocuments) || verificationDocuments.length === 0) {
    throw new Error('At least one verification document is required');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.role === 'studio') {
    throw new Error('You are already a studio');
  }

  if (user.role !== 'customer') {
    throw new Error('Only customer can register to become a studio');
  }

  const existingPending = await StudioRegistrationRequest.findOne({
    userId,
    status: 'pending',
  });

  if (existingPending) {
    throw new Error('You already have a pending registration request');
  }

  const request = await StudioRegistrationRequest.create({
    userId,
    studioName: studioName.trim(),
    phone: phone.trim(),
    address: address.trim(),
    description: description.trim(),
    verificationDocuments,
    status: 'pending',
  });

  return request;
};

export const getMyStudioRegistrations = async (
  userId: string
): Promise<IStudioRegistrationRequest[]> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user id');
  }

  return await StudioRegistrationRequest.find({ userId }).sort({ createdAt: -1 });
};

export const getMyStudioRegistrationDetail = async (
  userId: string,
  requestId: string
): Promise<IStudioRegistrationRequest | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user id');
  }

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    throw new Error('Invalid request id');
  }

  const request = await StudioRegistrationRequest.findOne({
    _id: requestId,
    userId,
  });

  if (!request) {
    throw new Error('Request not found');
  }

  return request;
};

export const getAllStudioRegistrations = async () => {
  return await StudioRegistrationRequest.find()
    .populate('userId', 'fullName email phone role isActive')
    .populate('reviewedBy', 'fullName email')
    .sort({ createdAt: -1 });
};

export const getStudioRegistrationDetailByAdmin = async (requestId: string) => {
  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    throw new Error('Invalid request id');
  }

  const request = await StudioRegistrationRequest.findById(requestId)
    .populate('userId', 'fullName email phone role isActive')
    .populate('reviewedBy', 'fullName email');

  if (!request) {
    throw new Error('Request not found');
  }

  return request;
};

export const approveStudioRegistration = async (
  requestId: string,
  adminId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    throw new Error('Invalid request id');
  }

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    throw new Error('Invalid admin id');
  }

  const request = await StudioRegistrationRequest.findById(requestId);

  if (!request) {
    throw new Error('Request not found');
  }

  if (request.status !== 'pending') {
    throw new Error('Request has already been processed');
  }

  const user = await User.findById(request.userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.role = 'studio';
  await user.save();

  request.status = 'approved';
  request.rejectReason = '';
  request.reviewedBy = new mongoose.Types.ObjectId(adminId);
  request.reviewedAt = new Date();

  await request.save();

  return request;
};

export const rejectStudioRegistration = async (
  requestId: string,
  adminId: string,
  rejectReason: string
) => {
  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    throw new Error('Invalid request id');
  }

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    throw new Error('Invalid admin id');
  }

  if (!rejectReason?.trim()) {
    throw new Error('Reject reason is required');
  }

  const request = await StudioRegistrationRequest.findById(requestId);

  if (!request) {
    throw new Error('Request not found');
  }

  if (request.status !== 'pending') {
    throw new Error('Request has already been processed');
  }

  request.status = 'rejected';
  request.rejectReason = rejectReason.trim();
  request.reviewedBy = new mongoose.Types.ObjectId(adminId);
  request.reviewedAt = new Date();

  await request.save();

  return request;
};