
import { useCallback } from 'react';

import {
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

interface UseTemplateListItemHandlersProps {
  templateScale: SharedValue<number>;
  scienceScale: SharedValue<number>;
  reduceMotion: boolean;
  triggerLightImpact: () => void;
}

export function useTemplateListItemHandlers({
  templateScale,
  scienceScale,
  reduceMotion,
  triggerLightImpact,
}: UseTemplateListItemHandlersProps) {
  const handleTemplatePressIn = useCallback(() => {
    triggerLightImpact();
    if (!reduceMotion) {
      templateScale.value = withTiming(0.98, { duration: 50 });
    }
  }, [triggerLightImpact, reduceMotion, templateScale]);

  const handleTemplatePressOut = useCallback(() => {
    if (!reduceMotion) {
      templateScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  }, [reduceMotion, templateScale]);

  const handleSciencePressIn = useCallback(() => {
    triggerLightImpact();
    if (!reduceMotion) {
      scienceScale.value = withTiming(0.95, { duration: 50 });
    }
  }, [triggerLightImpact, reduceMotion, scienceScale]);

  const handleSciencePressOut = useCallback(() => {
    if (!reduceMotion) {
      scienceScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  }, [reduceMotion, scienceScale]);

  return {
    handleSciencePressIn,
    handleSciencePressOut,
    handleTemplatePressIn,
    handleTemplatePressOut,
  };
}
