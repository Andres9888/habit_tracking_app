import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, InteractionManager } from 'react-native';
import {
  getLastCustomColor,
  saveLastCustomColor,
} from '../../../utils/lastCustomColor';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../../hooks/useReduceMotion';

import { useThrottle } from './useThrottle';
import { getColorName } from './colorUtils';
import type { ColorPickerSheetProps } from './types';

export function useColorPickerSheet({
  visible,
  value,
  onSelect,
  onClose,
}: ColorPickerSheetProps) {
  const [currentColor, setCurrentColor] = useState(value);
  const [isPickerReady, setIsPickerReady] = useState(false);
  const { triggerSelection, triggerLightImpact } = useHapticFeedback();
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (visible) {
      const loadInitialColor = async () => {
        const lastCustom = await getLastCustomColor();
        setCurrentColor(lastCustom ?? value);
      };
      void loadInitialColor();

      if (reduceMotion) {
        setIsPickerReady(true);
        return () => {
          setIsPickerReady(false);
        };
      }

      const handle = InteractionManager.runAfterInteractions(() => {
        setIsPickerReady(true);
      });
      return () => {
        handle.cancel();
        setIsPickerReady(false);
      };
    } else {
      setIsPickerReady(false);
    }
  }, [reduceMotion, value, visible]);

  const updateColor = useCallback((hex: string) => {
    setCurrentColor(hex);
  }, []);

  const throttledSetColor = useThrottle(updateColor, 100);

  const handleColorChange = useCallback(
    (color: { hex: string }) => {
      throttledSetColor(color.hex);
    },
    [throttledSetColor]
  );

  const handleColorComplete = useCallback(
    (color: { hex: string }) => {
      setCurrentColor(color.hex);
      triggerLightImpact();
      const colorName = getColorName(color.hex);
      AccessibilityInfo.announceForAccessibility(`Selected ${colorName}`);
    },
    [triggerLightImpact]
  );

  const handleDone = useCallback(() => {
    triggerSelection();
    onSelect(currentColor);
    void saveLastCustomColor(currentColor);
    const colorName = getColorName(currentColor);
    AccessibilityInfo.announceForAccessibility(`${colorName} color applied`);
    onClose();
  }, [currentColor, onClose, onSelect, triggerSelection]);

  const currentColorName = getColorName(currentColor);

  return {
    currentColor,
    currentColorName,
    handleColorChange,
    handleColorComplete,
    handleDone,
    isPickerReady,
    reduceMotion,
  };
}
