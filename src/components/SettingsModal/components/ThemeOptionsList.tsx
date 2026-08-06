/** ThemeOptionsList — radio option rows for the Theme disclosure */
import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { triggerHaptic } from '@/utils/haptics';
import type { DarkModePreference } from '../../../../convex/settings/types';
import { useThemeColors } from '../../../theme/ThemeContext';

const OPTIONS: { key: DarkModePreference; label: string }[] = [
  { key: 'system', label: 'System' },
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
];

interface Props {
  selected: DarkModePreference;
  onSelect: (preference: DarkModePreference) => void;
}

export function ThemeOptionsList({ selected, onSelect }: Props) {
  const { colors: themeColors } = useThemeColors();

  const handleSelect = (key: DarkModePreference) => {
    if (key !== selected) void triggerHaptic('selection');
    onSelect(key);
  };

  return (
    <View accessibilityRole='radiogroup' className='px-2.5 pb-3' style={{ gap: 4 }}>
      {OPTIONS.map(({ key, label }) => {
        const on = key === selected;
        return (
          <Pressable
            key={key}
            accessibilityLabel={label}
            accessibilityRole='radio'
            accessibilityState={{ checked: on }}
            className='flex-row items-center justify-between rounded-xl px-2.5'
            style={{
              minHeight: 44,
              backgroundColor: on ? themeColors.surface : 'transparent',
            }}
            onPress={() => handleSelect(key)}
          >
            <Text
              style={{
                ...typography.body,
                fontWeight: on ? fontWeights.semibold : fontWeights.regular,
                color: themeColors.text.primary,
              }}
            >
              {label}
            </Text>
            <View
              className='items-center justify-center rounded-full border'
              style={{
                width: 20,
                height: 20,
                borderColor: on ? themeColors.status.success : themeColors.border,
                backgroundColor: on ? themeColors.status.success : 'transparent',
              }}
            >
              {on ? <Check color='#FFFFFF' size={iconSizes.micro} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
