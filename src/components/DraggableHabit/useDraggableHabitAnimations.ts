import { useRef, useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';
import {
  runHighlightAnimation,
  runIconPulseLoop,
  runNewRecordAnimation,
  hideNewRecordBadge,
} from './animationSequences';

interface AnimationParams {
  isJustCreated: boolean;
  reduceMotionPreference: boolean;
  isWeekComplete: boolean;
  isNewPersonalRecord: boolean;
  triggerSuccess: () => void;
}

export function useDraggableHabitAnimations({
  isJustCreated,
  reduceMotionPreference,
  isWeekComplete,
  isNewPersonalRecord,
  triggerSuccess,
}: AnimationParams) {
  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const archiveFlash = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const iconPulse = useRef(new Animated.Value(1)).current;
  const highlightGlow = useRef(new Animated.Value(0)).current;
  const newRecordScale = useRef(new Animated.Value(0)).current;
  const newRecordOpacity = useRef(new Animated.Value(0)).current;
  const [showNewRecord, setShowNewRecord] = useState(false);

  useEntranceAnimation(fade, translateY);
  useHighlightAnimation(
    isJustCreated,
    reduceMotionPreference,
    cardScale,
    highlightGlow
  );
  useIconPulse(isWeekComplete, reduceMotionPreference, iconPulse);
  useNewRecordAnimation(
    isNewPersonalRecord,
    reduceMotionPreference,
    triggerSuccess,
    newRecordScale,
    newRecordOpacity,
    cardScale,
    setShowNewRecord
  );

  return {
    archiveFlash,
    cardScale,
    fade,
    highlightGlow,
    iconPulse,
    newRecordOpacity,
    newRecordScale,
    showNewRecord,
    translateY,
  };
}

function useEntranceAnimation(
  fade: Animated.Value,
  translateY: Animated.Value
) {
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, translateY]);
}

function useHighlightAnimation(
  isJustCreated: boolean,
  reduceMotionPreference: boolean,
  cardScale: Animated.Value,
  highlightGlow: Animated.Value
) {
  useEffect(() => {
    if (!isJustCreated || reduceMotionPreference) {
      highlightGlow.setValue(0);
      return;
    }
    highlightGlow.setValue(0);
    cardScale.setValue(0.95);
    const timeout = setTimeout(
      () => runHighlightAnimation(cardScale, highlightGlow),
      200
    );
    return () => clearTimeout(timeout);
  }, [cardScale, highlightGlow, isJustCreated, reduceMotionPreference]);
}

function useIconPulse(
  isWeekComplete: boolean,
  reduceMotionPreference: boolean,
  iconPulse: Animated.Value
) {
  useEffect(() => {
    if (isWeekComplete && !reduceMotionPreference) {
      runIconPulseLoop(iconPulse);
    } else {
      iconPulse.setValue(1);
    }
  }, [isWeekComplete, iconPulse, reduceMotionPreference]);
}

function useNewRecordAnimation(
  isNewPersonalRecord: boolean,
  reduceMotionPreference: boolean,
  triggerSuccess: () => void,
  newRecordScale: Animated.Value,
  newRecordOpacity: Animated.Value,
  cardScale: Animated.Value,
  setShowNewRecord: (show: boolean) => void
) {
  useEffect(() => {
    if (!isNewPersonalRecord || reduceMotionPreference) return;
    setShowNewRecord(true);
    triggerSuccess();
    runNewRecordAnimation(newRecordScale, newRecordOpacity, cardScale);
    const timeout = setTimeout(() => {
      hideNewRecordBadge(newRecordScale, newRecordOpacity, setShowNewRecord);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [isNewPersonalRecord, reduceMotionPreference, triggerSuccess]);
}
