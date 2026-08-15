import { useCallback, useRef } from 'react';
import { shouldGuardFreeHabitAction } from '@/constants/habitLimit';

export function useImportGuard(
  isPremiumUser: boolean,
  userHabitCount: number,
  onShowPaywall?: () => void
) {
  const isPremiumRef = useRef(isPremiumUser);
  isPremiumRef.current = isPremiumUser;
  const habitCountRef = useRef(userHabitCount);
  habitCountRef.current = userHabitCount;
  const showPaywallRef = useRef(onShowPaywall);
  showPaywallRef.current = onShowPaywall;

  return useCallback(() => {
    if (!shouldGuardFreeHabitAction(isPremiumRef.current, habitCountRef.current)) {
      return false;
    }
    showPaywallRef.current?.();
    return true;
  }, []);
}
