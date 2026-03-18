import { useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { API_BASE_URL } from '../constants/auth.constants';

WebBrowser.maybeCompleteAuthSession();

type GoogleOAuthResult = {
  accessToken: string;
  refreshToken?: string;
};

export const useGoogleFirebaseIdToken = () => {
  const signInAndGetFirebaseIdToken = useCallback(async (): Promise<GoogleOAuthResult> => {
    const appRedirectUri = Linking.createURL('oauth/google-callback');
    const startUrl = `${API_BASE_URL}/auth/google/oauth/start?appRedirectUri=${encodeURIComponent(appRedirectUri)}`;

    const result = await WebBrowser.openAuthSessionAsync(startUrl, appRedirectUri);

    if (result.type !== 'success' || !result.url) {
      if (result.type === 'cancel' || result.type === 'dismiss') {
        throw new Error('Google sign-in was cancelled');
      }
      throw new Error('Google sign-in failed');
    }

    const parsed = Linking.parse(result.url);
    const accessToken =
      typeof parsed.queryParams?.accessToken === 'string' ? parsed.queryParams.accessToken : undefined;
    const refreshToken =
      typeof parsed.queryParams?.refreshToken === 'string' ? parsed.queryParams.refreshToken : undefined;
    const error = typeof parsed.queryParams?.error === 'string' ? parsed.queryParams.error : undefined;

    if (error) {
      throw new Error(error);
    }

    if (!accessToken) {
      throw new Error('No access token returned from backend OAuth callback');
    }

    return { accessToken, refreshToken };
  }, []);

  return {
    googleReady: true,
    signInAndGetFirebaseIdToken,
  };
};
