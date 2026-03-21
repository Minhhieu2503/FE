import jwt from 'jsonwebtoken';
import User from '../../models/user.model';

type GoogleTokenResponse = {
  access_token: string;
  id_token?: string;
};

type GoogleUserInfo = {
  sub: string;
  email: string;
  email_verified?: boolean;
};

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

const getGoogleClientId = () =>
  process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

const getGoogleClientSecret = () =>
  process.env.GOOGLE_CLIENT_SECRET || process.env.VITE_GOOGLE_CLIENT_SECRET;

const getGoogleCallbackUrl = () =>
  process.env.GOOGLE_REDIRECT_URI || process.env.GOOGLE_CALLBACK_URL;

export const getGoogleOAuthConfig = () => {
  const clientId = getGoogleClientId();
  const clientSecret = getGoogleClientSecret();
  const callbackUrl = getGoogleCallbackUrl();

  if (!clientId || !clientSecret || !callbackUrl) {
    throw new Error('Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI in backend env');
  }

  return { clientId, clientSecret, callbackUrl };
};

export const exchangeGoogleCodeForTokens = async (code: string) => {
  const { clientId, clientSecret, callbackUrl } = getGoogleOAuthConfig();

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: callbackUrl,
    grant_type: 'authorization_code',
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const data = (await response.json()) as GoogleTokenResponse & { error?: string; error_description?: string };

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Cannot exchange Google auth code');
  }

  return data;
};

export const fetchGoogleUserInfo = async (accessToken: string) => {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = (await response.json()) as GoogleUserInfo & { error?: string };

  if (!response.ok || !data.sub || !data.email) {
    throw new Error('Cannot fetch Google user profile');
  }

  return data;
};

export const findOrCreateUserFromGoogle = async (googleUser: GoogleUserInfo) => {
  let user = await User.findOne({ email: googleUser.email });

  if (!user) {
    user = await User.create({
      email: googleUser.email,
      firebaseUid: `google:${googleUser.sub}`,
      role: 'CUSTOMER',
    });
  }

  if (!user.isActive) {
    throw new Error('Account is banned or inactive');
  }

  return user;
};
