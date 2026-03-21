import api from '../api/api';
import { AUTH_ENDPOINTS } from '../constants/auth.constants';
import { tokenService } from './token.service';

interface LoginResponseData {
  user: {
    _id: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken?: string;
}

const unwrap = <T>(payload: any): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }
  return payload as T;
};

export const authService = {
  async register(email: string, password: string, role: 'CUSTOMER' | 'STUDIO' = 'CUSTOMER') {
    const response = await api.post(AUTH_ENDPOINTS.register, { email, password, role });
    return unwrap<{ _id: string; email: string; role: string }>(response.data);
  },

  async login(email: string, password: string) {
    const response = await api.post(AUTH_ENDPOINTS.login, { email, password });
    const data = unwrap<LoginResponseData>(response.data);

    await tokenService.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async forgotPassword(email: string) {
    await api.post(AUTH_ENDPOINTS.forgotPassword, { email });
  },

  async resetPassword(token: string, password: string, email?: string) {
    await api.post(AUTH_ENDPOINTS.resetPassword, { token, password, email });
  },

  async googleLogin(idToken: string) {
    const response = await api.post(AUTH_ENDPOINTS.googleLogin, { idToken });
    const data = unwrap<LoginResponseData>(response.data);

    await tokenService.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async completeOAuthLogin(accessToken: string, refreshToken?: string) {
    await tokenService.setTokens(accessToken, refreshToken);
  },

  async logout() {
    try {
      const refreshToken = await tokenService.getRefreshToken();
      if (refreshToken) {
        await api.post(AUTH_ENDPOINTS.logout, { refreshToken });
      }
    } catch {
      // Backend may not expose logout yet. Local clear is mandatory.
    } finally {
      await tokenService.clearTokens();
    }
  },

  async isAuthenticated() {
    const token = await tokenService.getAccessToken();
    return !!token;
  },
};

export function getApiErrorMessage(error: any) {
  const message = error?.response?.data?.message;
  if (typeof message === 'string' && message.trim()) return message;
  if (Array.isArray(message)) return message.join(', ');
  if (error?.message === 'Network Error') {
    return 'Khong ket noi duoc backend. Kiem tra URL API va backend.';
  }
  return error?.message || 'Da co loi xay ra';
}
