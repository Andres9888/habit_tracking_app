/**
 * useNPSSurvey Hook
 *
 * Manages NPS survey display logic:
 * - Checks if user is eligible (14 days or 30 completions)
 * - Only shows once every 90 days
 * - Persists "dismissed" state in localStorage to avoid annoying users
 */

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../../convex/_generated/api';

const NPS_DISMISSED_KEY = 'nps_survey_dismissed_at';
const SHOW_DELAY_MS = 3000; // Wait 3 seconds after app opens before showing

export function useNPSSurvey() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [hasCheckedEligibility, setHasCheckedEligibility] = useState(false);

  const eligibility = useQuery(api.nps.checkNPSEligibility);

  useEffect(() => {
    if (!eligibility || hasCheckedEligibility) return;

    const checkEligibility = async () => {
      try {
        // Check if user dismissed survey recently (within 30 days)
        const dismissedAt = await AsyncStorage.getItem(NPS_DISMISSED_KEY);
        if (dismissedAt) {
          const dismissedTime = parseInt(dismissedAt, 10);
          const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
          if (dismissedTime > thirtyDaysAgo) {
            // User dismissed recently, don't show
            setHasCheckedEligibility(true);
            return;
          }
        }

        // If eligible, show survey after a delay
        if (eligibility.eligible) {
          setTimeout(() => {
            setShowSurvey(true);
            setHasCheckedEligibility(true);
          }, SHOW_DELAY_MS);
        } else {
          setHasCheckedEligibility(true);
        }
      } catch (error) {
        console.error('Error checking NPS eligibility:', error);
        setHasCheckedEligibility(true);
      }
    };

    void checkEligibility();
  }, [eligibility, hasCheckedEligibility]);

  const handleClose = async () => {
    setShowSurvey(false);
    // Record dismissal time
    try {
      await AsyncStorage.setItem(NPS_DISMISSED_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error saving NPS dismissal:', error);
    }
  };

  return {
    handleClose,
    showSurvey,
  };
}
