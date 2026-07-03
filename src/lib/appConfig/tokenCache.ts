import * as SecureStore from 'expo-secure-store';

export const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to read token from secure store', error);
      }

      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to save token to secure store', error);
      }
    }
  },
};
