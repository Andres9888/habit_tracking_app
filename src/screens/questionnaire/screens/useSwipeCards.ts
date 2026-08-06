/**
 * useSwipeCards - Hook managing swipe card state and animations.
 * Handles card ordering by pain points, current index, and dismiss animation.
 */

import { useCallback, useMemo, useState } from 'react';
import {
  useSharedValue,
  withTiming,
  runOnJS,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { PAIN_CARDS } from '../data/painCards';
import { durations } from '@/theme/animations';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_COUNT = 5;

export function useSwipeCards(painPoints: string[], onAllSwiped: () => void, incrementPainCards: () => void) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const cards = useMemo(() => {
    const matching = PAIN_CARDS.filter((c) => painPoints.includes(c.painPointId));
    const rest = PAIN_CARDS.filter((c) => !painPoints.includes(c.painPointId));
    return [...matching, ...rest].slice(0, CARD_COUNT);
  }, [painPoints]);

  const isFinished = currentIndex >= cards.length;

  const advanceCard = useCallback(() => {
    translateX.value = 0;
    rotate.value = 0;
    setCurrentIndex((previous) => {
      const next = previous + 1;
      if (next >= cards.length) {
        onAllSwiped();
      }
      return next;
    });
  }, [cards.length, onAllSwiped, translateX, rotate]);

  const dismiss = useCallback(
    (accepted: boolean) => {
      const direction = accepted ? 1 : -1;
      if (accepted) incrementPainCards();
      translateX.value = withTiming(direction * SCREEN_WIDTH * 1.5, { duration: durations.emphasis });
      rotate.value = withTiming(direction * 20, { duration: durations.emphasis }, () => {
        runOnJS(advanceCard)();
      });
    },
    [advanceCard, incrementPainCards, translateX, rotate],
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return { cards, currentIndex, isFinished, dismiss, cardStyle };
}
