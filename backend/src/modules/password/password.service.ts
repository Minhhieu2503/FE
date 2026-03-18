import crypto from 'crypto';
import User from '../../models/user.model';
import { sendEmail } from '../../shared/email.service';

export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });

  // Always return success semantics to prevent email enumeration.
  if (!user) {
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetToken = crypto.createHash('sha256').update(otp).digest('hex');

  user.passwordResetToken = hashedResetToken;
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const subject = 'SnapBook Password Reset OTP';
  const text = `We received a request to reset your password.\n\nYour 6-digit verification code is: ${otp}\n\nThis code is valid for 15 minutes.\n\nIf you did not request this, please ignore this email.`;

  const sent = await sendEmail({
    to: user.email,
    subject,
    text,
    html: `<p>We received a request to reset your password.</p><p>Your 6-digit verification code is: <strong style="font-size: 24px; letter-spacing: 2px;">${otp}</strong></p><p>This code is valid for 15 minutes.</p><p>If you did not request this, please ignore this email.</p>`,
  });

  if (!sent) {
    console.log(`Password reset OTP for ${user.email}: ${otp}`);
  }
};

export const resetPasswordService = async (otp: string, newPassword: string, email?: string) => {
  const hashedResetToken = crypto.createHash('sha256').update(String(otp)).digest('hex');

  console.log('--- DEBUG RESET PASSWORD ---');
  console.log('Incoming raw OTP:', otp);
  console.log('Hashed incoming OTP:', hashedResetToken);

  const query: Record<string, any> = {
    passwordResetToken: hashedResetToken,
    passwordResetExpires: { $gt: new Date() },
  };

  if (email) {
    query.email = email.toLowerCase().trim();
  }

  console.log('Query:', query);

  // For debugging, let's see what the DB actually has for this email:
  if (email) {
    const dbUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (dbUser) {
      console.log('DB User reset token:', dbUser.passwordResetToken);
      console.log('DB User reset expires:', dbUser.passwordResetExpires);
      console.log('Current time:', new Date());
    } else {
      console.log('No user found with this email in DB.');
    }
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
