import jwt from 'jsonwebtoken';
import User, { IUser } from '../../models/user.model';

// Generate Token
export const generateAccessToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: '7d',
  });
};

export const registerUserService = async (userData: any) => {
  const { email, password, role } = userData;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    email,
    password, // Password hashed via pre-save hook
    role: role || 'CUSTOMER',
  });

  return {
    _id: user._id,
    email: user.email,
    role: user.role,
    kycStatus: user.kycStatus,
  };
};

export const loginUserService = async (email: string, password: string) => {
  // Find user by email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const accessToken = generateAccessToken(user._id as unknown as string, user.role);
    const refreshToken = generateRefreshToken(user._id as unknown as string, user.role);

    return {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        kycStatus: user.kycStatus,
      },
      accessToken,
      refreshToken,
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

export const refreshTokenService = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as jwt.JwtPayload;
    
    // Create new access token
    const accessToken = generateAccessToken(decoded.id, decoded.role);
    return { accessToken };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};
