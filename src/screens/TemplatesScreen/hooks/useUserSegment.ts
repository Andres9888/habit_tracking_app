/**
 * Classifies users into segments for landing variant selection.
 * Tracks dwell time to detect "lost" users who need extra guidance.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export type BaseSegment = 'first_time' | 'returning' | 'power';
export type LandingVariant =
  | 'landing-new-user'
  | 'landing-returning-user'
  | 'landing-power-user';

export interface UserSegmentResult {
  baseSegment: BaseSegment;
  isLost: boolean;
  landingVariant: LandingVariant;
  helpMeChooseCopy: string;
  registerAction: () => void;
  registerSearchChange: () => void;
}

const COPY: Record<BaseSegment, string> = {
  first_time: 'Not sure? 30-sec guide',
  returning: 'Help me choose',
  power: 'Need inspiration?',
};

const LOST_COPY: Record<BaseSegment, string> = {
  first_time: 'Let me help you pick one →',
  returning: 'Having trouble choosing?',
  power: 'Let me find one for you',
};

const VARIANT: Record<BaseSegment, LandingVariant> = {
  first_time: 'landing-new-user',
  returning: 'landing-returning-user',
  power: 'landing-power-user',
};

const DWELL_THRESHOLD_MS = 18000;

export function useUserSegment(input: {
  userHabitCount: number;
  isPremiumUser: boolean;
}): UserSegmentResult {
  const count = input?.userHabitCount ?? 0;
  const isPremium = input?.isPremiumUser ?? false;

  let baseSegment: BaseSegment;
  if (isPremium || count >= 6) {
    baseSegment = 'power';
  } else if (count >= 2 && count <= 5) {
    baseSegment = 'returning';
  } else {
    baseSegment = 'first_time';
  }

  const [landingDwellMs, setLandingDwellMs] = useState(0);
  const [searchChangeCount, setSearchChangeCount] = useState(0);
  const hadAction = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLandingDwellMs((ms) => ms + 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isLost =
    (!hadAction.current && landingDwellMs >= DWELL_THRESHOLD_MS) ||
    (searchChangeCount >= 4 && !hadAction.current);

  const registerAction = useCallback(() => {
    hadAction.current = true;
  }, []);

  const registerSearchChange = useCallback(() => {
    setSearchChangeCount((c) => c + 1);
  }, []);

  const copy = isLost ? LOST_COPY[baseSegment] : COPY[baseSegment];

  return {
    baseSegment,
    helpMeChooseCopy: copy,
    isLost,
    landingVariant: VARIANT[baseSegment],
    registerAction,
    registerSearchChange,
  };
}
