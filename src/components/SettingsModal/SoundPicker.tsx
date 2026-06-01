/**
 * SoundPicker - Animated inline sound type selector with tap-to-preview
 */

import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Volume1, Droplet, TrendingUp } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { useThemeColors } from '../../theme/ThemeContext';
import { getSegmentedControlColors } from './SegmentedControl.colors';
import { useSoundPreview } from './SoundPicker.hooks';
import type { CompletionSoundType } from '../../../convex/settings/types';

const OPTIONS: { key: CompletionSoundType; label: string; Icon: typeof Volume1 }[] = [
  { key: 'chime', label: 'Ding', Icon: Volume1 },
  { key: 'pop', label: 'Pop', Icon: Droplet },
  { key: 'success', label: 'Rise', Icon: TrendingUp },
];

interface SoundPickerProps {
  visible: boolean;
  selected: CompletionSoundType;
  onSelect: (type: CompletionSoundType) => void;
}

export function SoundPicker({ visible, selected, onSelect }: SoundPickerProps) {
  const { colors, isDark } = useThemeColors();
  const handleSelect = useSoundPreview(onSelect);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [everVisible, setEverVisible] = useState(visible);
  const progress = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    if (visible) setEverVisible(true);
    progress.value = withTiming(visible ? 1 : 0, {
      duration: visible ? 280 : 240,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
    });
  }, [visible, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    if (!naturalHeight) {
      return { opacity: progress.value };
    }
    return {
      height: naturalHeight * progress.value,
      opacity: progress.value,
      overflow: 'hidden' as const,
    };
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const h = event.nativeEvent.layout.height;
    if (h > 0 && naturalHeight === 0) setNaturalHeight(h);
  };

  if (!everVisible) return null;

  const { accent, selectedBg, containerBg } = getSegmentedControlColors(isDark);
  /* Tray wrapper background is unique to the collapsing sound row */
  const trayBg = isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)';

  return (
    <Animated.View style={animatedStyle} pointerEvents={visible ? 'auto' : 'none'}>
      <View
        className="flex-row items-center border-b px-4 py-2.5"
        style={{ borderColor: colors.border, backgroundColor: trayBg }}
        onLayout={handleLayout}
      >
        <View className="mr-4 w-10" />
        <View className="flex-1 flex-row items-center gap-2">
          {OPTIONS.map(({ key, label, Icon }) => {
            const on = key === selected;
            return (
              <Pressable
                key={key}
                accessibilityLabel={`${label} sound`}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl py-2"
                style={{ backgroundColor: on ? selectedBg : containerBg }}
                onPress={() => handleSelect(key)}
              >
                <Icon
                  color={on ? accent : colors.text.secondary}
                  size={iconSizes.small}
                  strokeWidth={on ? 2.5 : 2}
                />
                <Text
                  style={{
                    ...typography.caption,
                    color: on ? accent : colors.text.secondary,
                    fontWeight: on ? fontWeights.semibold : fontWeights.regular,
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}
