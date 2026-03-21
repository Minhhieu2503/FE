import { Request, Response } from 'express';
import * as authService from './auth.service';
import admin from '../../config/firebase.config';
import User from '../../models/user.model';

const DEFAULT_APP_REDIRECT_URI = 'snapbook://oauth/google-callback';

const decodeAppRedirectUri = (state?: string) => {
  if (!state) return process.env.GOOGLE_APP_REDIRECT_URI || DEFAULT_APP_REDIRECT_URI;

  try {
    const decoded = Buffer.from(state, 'base64url').toString('utf8');
    if (decoded.startsWith('snapbook://') || decoded.startsWith('exp://') || decoded.startsWith('http://') || decoded.startsWith('https://')) {
      return decoded;
    }
  } catch {
    // Fallback to default when state cannot be decoded.
  }

  return process.env.GOOGLE_APP_REDIRECT_URI || DEFAULT_APP_REDIRECT_URI;
};

const encodeState = (value: string) => Buffer.from(value, 'utf8').toString('base64url');

const withQuery = (targetUrl: string, params: Record<string, string | undefined>) => {
  const url = new URL(targetUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authService.registerUserService(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUserService(email, password);
    
    res.status(200).json({
      message: 'Login successful',
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Login failed' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokenService(refreshToken);
    
    res.status(200).json({
      message: 'Token refreshed successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Token refresh failed' });
  }
};

export const loginGoogle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUser = await admin.auth().getUser(decodedToken.uid);

    // Sync with MongoDB
    const user = await User.findOrCreateFromFirebase(firebaseUser);

    if (!user.isActive) {
      res.status(403).json({ message: 'Account is banned or inactive' });
      return;
    }

    // Generate SnapBook tokens
    const accessToken = authService.generateAccessToken(user._id as unknown as string, user.role);
    const refreshToken = authService.generateRefreshToken(user._id as unknown as string, user.role);

    res.status(200).json({
      message: 'Google login successful',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          kycStatus: user.kycStatus,
        },
        accessToken,
        refreshToken,
      }
    });
  } catch (error: any) {
    console.error('Firebase Google login error:', error);
    res.status(401).json({ message: 'Invalid or expired Firebase token' });
  }
};

export const startGoogleOAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const appRedirectUri =
      typeof req.query.appRedirectUri === 'string' && req.query.appRedirectUri
        ? req.query.appRedirectUri
        : process.env.GOOGLE_APP_REDIRECT_URI || DEFAULT_APP_REDIRECT_URI;

    const { clientId, callbackUrl } = authService.getGoogleOAuthConfig();

    const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    oauthUrl.searchParams.set('client_id', clientId);
    oauthUrl.searchParams.set('redirect_uri', callbackUrl);
    oauthUrl.searchParams.set('response_type', 'code');
    oauthUrl.searchParams.set('scope', 'openid email profile');
    oauthUrl.searchParams.set('access_type', 'offline');
    oauthUrl.searchParams.set('prompt', 'consent');
    oauthUrl.searchParams.set('state', encodeState(appRedirectUri));

    res.redirect(oauthUrl.toString());
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Cannot start Google OAuth flow' });
  }
};

export const googleOAuthCallback = async (req: Request, res: Response): Promise<void> => {
  const appRedirectUri = decodeAppRedirectUri(typeof req.query.state === 'string' ? req.query.state : undefined);

  try {
    const error = typeof req.query.error === 'string' ? req.query.error : undefined;
    if (error) {
      res.redirect(withQuery(appRedirectUri, { error }));
      return;
    }

    const code = typeof req.query.code === 'string' ? req.query.code : undefined;
    if (!code) {
      res.redirect(withQuery(appRedirectUri, { error: 'missing_code' }));
      return;
    }

    const tokenResponse = await authService.exchangeGoogleCodeForTokens(code);
    const googleUser = await authService.fetchGoogleUserInfo(tokenResponse.access_token);
    const user = await authService.findOrCreateUserFromGoogle(googleUser);

    const accessToken = authService.generateAccessToken(user._id as unknown as string, user.role);
    const refreshToken = authService.generateRefreshToken(user._id as unknown as string, user.role);

    res.redirect(
      withQuery(appRedirectUri, {
        accessToken,
        refreshToken,
      })
    );
  } catch (error: any) {
    res.redirect(withQuery(appRedirectUri, { error: error.message || 'google_oauth_failed' }));
  }
};
