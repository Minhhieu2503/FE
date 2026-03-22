import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_STORAGE_KEYS } from '../constants/auth.constants';

const memoryStore = new Map<string, string>();

async function safeGetItem(key: string) {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return memoryStore.get(key) ?? null;
  }
}

async function safeSetItem(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    memoryStore.set(key, value);
  }
}

async function safeRemoveItem(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    memoryStore.delete(key);
  }
}

export const tokenService = {
  async getAccessToken() {
    return safeGetItem(AUTH_STORAGE_KEYS.accessToken);
  },

  async getRefreshToken() {
    return safeGetItem(AUTH_STORAGE_KEYS.refreshToken);
  },

  async setTokens(accessToken: string, refreshToken?: string) {
    await safeSetItem(AUTH_STORAGE_KEYS.accessToken, accessToken);
    if (refreshToken) {
      await safeSetItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
    }
  },

  async setRole(role: string) {
    await safeSetItem(AUTH_STORAGE_KEYS.userRole, role);
  },

  async getRole(): Promise<string | null> {
    return safeGetItem(AUTH_STORAGE_KEYS.userRole);
  },

  async clearTokens() {
    await safeRemoveItem(AUTH_STORAGE_KEYS.accessToken);
    await safeRemoveItem(AUTH_STORAGE_KEYS.refreshToken);
    await safeRemoveItem(AUTH_STORAGE_KEYS.userRole);
  },
};

