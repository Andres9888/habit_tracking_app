/**
 * Onboarding Storage Hook
 * Manages AsyncStorage for onboarding completion state
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_STORAGE_KEYS } from '../constants';
import type { OnboardingData } from '../types';

interface UseOnboardingStorageResult {
  isLoading: boolean;
  hasCompletedOnboarding: boolean | null;
  markOnboardingComplete: () => Promise<void>;
  saveOnboardingData: (data: OnboardingData) => Promise<void>;
  getOnboardingData: () => Promise<OnboardingData | null>;
  resetOnboarding: () => Promise<void>;
}

export function useOnboardingStorage(): UseOnboardingStorageResult {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  // Check onboarding completion status on mount
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.ONBOARDING_COMPLETED);
      setHasCompletedOnboarding(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasCompletedOnboarding(false);
    } finally {
      setIsLoading(false);
    }
  };

  const markOnboardingComplete = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
      throw error;
    }
  }, []);

  const saveOnboardingData = useCallback(async (data: OnboardingData) => {
    try {
      await AsyncStorage.setItem(
        ASYNC_STORAGE_KEYS.ONBOARDING_DATA,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      throw error;
    }
  }, []);

  const getOnboardingData = useCallback(async (): Promise<OnboardingData | null> => {
    try {
      const value = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.ONBOARDING_DATA);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting onboarding data:', error);
      return null;
    }
  }, []);

  const resetOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        ASYNC_STORAGE_KEYS.ONBOARDING_COMPLETED,
        ASYNC_STORAGE_KEYS.ONBOARDING_DATA,
      ]);
      setHasCompletedOnboarding(false);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      throw error;
    }
  }, []);

  return {
    isLoading,
    hasCompletedOnboarding,
    markOnboardingComplete,
    saveOnboardingData,
    getOnboardingData,
    resetOnboarding,
  };
}
