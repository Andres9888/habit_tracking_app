/**
 * SoundPicker - Animated inline sound type selector with tap-to-preview
 */

import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Volume1, Droplet, TrendingUp } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '../../theme/ThemeContext';
import { useSoundPreview } from './SoundPicker.hooks';
import type { CompletionSoundType } from '../../../convex/settings/types';

const OPTIONS: { key: CompletionSoundType; label: string; Icon: typeof Volume1 }[] = [
  { key: 'chime', label: 'Ding', Icon: Volume1 },
  { key: 'pop', label: 'Pop', Icon: Droplet },
  { key: 'success', label: 'Rise', Icon: TrendingUp },
];

interface SoundPickerProps {
  selected: CompletionSoundType;
  onSelect: (type: CompletionSoundType) => void;
}

export function SoundPicker({ selected, onSelect }: SoundPickerProps) {
  const { colors, isDark } = useThemeColors();
  const handleSelect = useSoundPreview(onSelect);

  const accent = colors.primary[600];
  /* Intentional rgba — alpha overlays on theme surfaces */
  const accentBg = isDark ? 'rgba(52,211,153,0.12)' : 'rgba(5,150,105,0.08)';
  const pillBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const trayBg = isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)';

  return (
    <Animated.View
      entering={FadeInDown.duration(250).springify().damping(20)}
      exiting={FadeOutUp.duration(150)}
    >
      <View
        className="flex-row items-center border-b px-4 py-2.5"
        style={{
          borderColor: colors.border,
          backgroundColor: trayBg,
        }}
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
              style={{ backgroundColor: on ? accentBg : pillBg }}
              onPress={() => handleSelect(key)}
            >
              <Icon
                color={on ? accent : colors.text.secondary}
                size={iconSizes.small}
                strokeWidth={on ? 2.5 : 2}
              />
              <Text
                className="text-[13px]"
                style={{
                  color: on ? accent : colors.text.secondary,
                  fontWeight: on ? '600' : '400',
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
