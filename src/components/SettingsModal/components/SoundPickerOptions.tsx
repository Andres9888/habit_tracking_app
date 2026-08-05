import { Pressable, Text, View } from 'react-native';
import { Volume1, Droplet, TrendingUp } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { getSegmentedControlColors } from '../SegmentedControl.colors';
import type { CompletionSoundType } from '../../../../convex/settings/types';

const OPTIONS: {
  key: CompletionSoundType;
  label: string;
  Icon: typeof Volume1;
}[] = [
  // These segments are now the only place a tone is named — the Completion
  // sound row above carries on/off and nothing else.
  { key: 'chime', label: 'Chime', Icon: Volume1 },
  { key: 'pop', label: 'Pop', Icon: Droplet },
  { key: 'success', label: 'Rise', Icon: TrendingUp },
];

interface SoundPickerOptionsProps {
  selected: CompletionSoundType;
  isDark: boolean;
  secondaryColor: string;
  onSelect: (type: CompletionSoundType) => void;
}

export function SoundPickerOptions({
  selected,
  isDark,
  secondaryColor,
  onSelect,
}: SoundPickerOptionsProps) {
  const { accent, selectedBg, containerBg } = getSegmentedControlColors(isDark);

  return (
    <View
      accessibilityRole='radiogroup'
      className='flex-row items-center gap-2'
    >
      {OPTIONS.map(({ key, label, Icon }) => {
        const on = key === selected;
        return (
          <Pressable
            key={key}
            accessibilityLabel={`${label} sound`}
            accessibilityRole='radio'
            accessibilityState={{ selected: on }}
            className='flex-1 flex-row items-center justify-center gap-1.5 rounded-xl py-2'
            style={{ backgroundColor: on ? selectedBg : containerBg }}
            onPress={() => onSelect(key)}
          >
            <Icon
              color={on ? accent : secondaryColor}
              size={iconSizes.small}
              strokeWidth={on ? 2.5 : 2}
            />
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.85}
              numberOfLines={1}
              style={{
                ...typography.caption,
                color: on ? accent : secondaryColor,
                fontWeight: on ? fontWeights.semibold : fontWeights.regular,
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
