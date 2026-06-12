/**
 * SoundPicker - Animated inline sound type selector with tap-to-preview
 */

import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useExpandAnimation } from '@/hooks/useExpandAnimation';
import { useThemeColors } from '../../theme/ThemeContext';
import { useSoundPreview } from './SoundPicker.hooks';
import { SoundPickerOptions } from './components/SoundPickerOptions';
import type { CompletionSoundType } from '../../../convex/settings/types';

interface SoundPickerProps {
  visible: boolean;
  selected: CompletionSoundType;
  onSelect: (type: CompletionSoundType) => void;
}

export function SoundPicker({ visible, selected, onSelect }: SoundPickerProps) {
  const { colors, isDark } = useThemeColors();
  const handleSelect = useSoundPreview(onSelect);
  const reduceMotion = useReduceMotion();
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [hasContentMeasured, setHasContentMeasured] = useState(false);
  const [everVisible, setEverVisible] = useState(visible);

  const { contentAnimatedStyle } = useExpandAnimation({
    contentHeight: naturalHeight,
    defaultExpanded: visible,
    hasContentMeasured,
    reduceMotion,
  });

  useEffect(() => {
    if (visible) setEverVisible(true);
  }, [visible]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const h = event.nativeEvent.layout.height;
      if (h <= 0) return;
      if (hasContentMeasured && !visible) return;
      setNaturalHeight((prev) => (prev === h ? prev : h));
      setHasContentMeasured(true);
    },
    [hasContentMeasured, visible]
  );

  if (!everVisible) return null;

  const trayBg = isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)';

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={contentAnimatedStyle}
    >
      <View
        className='border-b px-4 py-2.5'
        style={{ borderColor: colors.border, backgroundColor: trayBg }}
        onLayout={handleLayout}
      >
        <SoundPickerOptions
          isDark={isDark}
          secondaryColor={colors.text.secondary}
          selected={selected}
          onSelect={handleSelect}
        />
      </View>
    </Animated.View>
  );
}
