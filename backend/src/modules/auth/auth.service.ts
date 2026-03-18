import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../../models/user.model';
import { sendEmail } from '../../shared/email.service';

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

export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });

  // Always return a generic message to avoid email enumeration.
  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedResetToken;
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const resetBaseUrl =
    process.env.RESET_PASSWORD_URL ||
    process.env.FRONTEND_URL ||
    'http://localhost:3000/reset-password';

  const link = new URL(resetBaseUrl);
  link.searchParams.set('token', resetToken);
  link.searchParams.set('email', user.email);

  const subject = 'SnapBook Password Reset';
  const text = `We received a request to reset your password.\n\nUse this link within 15 minutes:\n${link.toString()}\n\nIf you did not request this, you can ignore this email.`;

  const sent = await sendEmail({
    to: user.email,
    subject,
    text,
    html: `<p>We received a request to reset your password.</p><p>Use this link within <strong>15 minutes</strong>:</p><p><a href="${link.toString()}">${link.toString()}</a></p><p>If you did not request this, you can ignore this email.</p>`,
  });

  if (!sent) {
    console.log(`Password reset link for ${user.email}: ${link.toString()}`);
  }
};

export const resetPasswordService = async (token: string, newPassword: string, email?: string) => {
  const hashedResetToken = crypto.createHash('sha256').update(token).digest('hex');

  const query: Record<string, any> = {
    passwordResetToken: hashedResetToken,
    passwordResetExpires: { $gt: new Date() },
  };

  if (email) {
    query.email = email.toLowerCase().trim();
  }

  const user = await User.findOne(query);

  if (!user) {
    throw new Error('Reset token is invalid or expired');
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
};
