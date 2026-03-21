import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../../models/user.model';
import { sendEmail } from '../../shared/email.service';

export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });

  // Always return success semantics to prevent email enumeration.
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

export const changePasswordService = async (userId: string, oldPassword: string, newPassword: string) => {
  // Query user directly using ID and explicitly select the hidden password string
  const user = await User.findById(userId).select('+password');
  
  if (!user || !user.password) {
    throw new Error('User not found or password undefined');
  }

  // Compare the brute string with the hashed value inside DB
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  
  if (!isMatch) {
    throw new Error('Incorrect current password');
  }

  // Since Mongoose schema pre('save') uses bcrypt itself, we just reassign the raw string!
  user.password = newPassword;
  await user.save();
};
