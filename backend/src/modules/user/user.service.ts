import User, { IUser, UserRole } from './../../models/user.model';

export interface CreateUserInput {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UpdateUserInput {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
}

export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find().sort({ createdAt: -1 });
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

export const createUser = async (payload: CreateUserInput): Promise<IUser> => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  return await User.create(payload);
};

export const updateUser = async (
  id: string,
  payload: UpdateUserInput
): Promise<IUser | null> => {
  if (payload.email) {
    const existingUser = await User.findOne({
      email: payload.email,
      _id: { $ne: id },
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }
  }

  return await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};
export const suspendUser = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true, runValidators: true }
  );
};

export const activateUser = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true, runValidators: true }
  );
};