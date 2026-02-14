/**
 * OnboardingTooltipManager
 *
 * Manages sequential display of tutorial tooltips on first use.
 * Shows tooltips for: day toggle navigation and streak explanation.
 *
 * Created by Opus.
 */

import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { OnboardingTooltip } from './OnboardingTooltip';

interface OnboardingTooltipManagerProps {
  /** Whether tooltips should show at all (from useFirstTimeUser) */
  enabled: boolean;
  /** Called when all tooltips have been shown/dismissed */
  onComplete: () => void;
}

const TOOLTIPS = [
  {
    id: 'day_toggle',
    text: '← Swipe or tap arrows to navigate between weeks and track past days',
    position: 'below' as const,
    delayMs: 1500,
  },
  {
    id: 'streaks',
    text: '🔥 Complete habits daily to build streaks — the longer your chain, the stronger your habit becomes!',
    position: 'below' as const,
    delayMs: 500,
  },
] as const;

export function OnboardingTooltipManager({
  enabled,
  onComplete,
}: OnboardingTooltipManagerProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => {
      setCurrentIndex(0);
    }, TOOLTIPS[0].delayMs);
    return () => clearTimeout(timer);
  }, [enabled]);

  const handleDismiss = useCallback(() => {
    setCurrentIndex((prev: number) => {
      const next = prev + 1;
      if (next >= TOOLTIPS.length) {
        onComplete();
        return prev;
      }
      return next;
    });
  }, [onComplete]);

  if (!enabled || currentIndex < 0 || currentIndex >= TOOLTIPS.length) {
    return null;
  }

  const tooltip = TOOLTIPS[currentIndex];

  return (
    <View style={styles.container} pointerEvents="box-none">
      <OnboardingTooltip
        id={tooltip.id}
        text={tooltip.text}
        visible={true}
        position={tooltip.position}
        onDismiss={handleDismiss}
        autoDismissMs={8000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
});
