import { Request, Response } from 'express';
import * as authService from './auth.service';
import admin from '../../config/firebase.config';
import User from '../../models/user.model';

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
