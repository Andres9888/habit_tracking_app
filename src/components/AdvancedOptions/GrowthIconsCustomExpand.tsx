/** Custom progression builder shell (reuses sheet body). */
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontFamilies, fontWeights } from '@/theme/typography';
import type { ProgressEmojiSet } from '@/utils/progressEmojis';
import { GrowthIconsSheetBody } from './GrowthIconsSheetBody';

interface Props {
  value: ProgressEmojiSet | undefined;
  fallback: ProgressEmojiSet;
  onChange: (next: ProgressEmojiSet | undefined) => void;
}

export function GrowthIconsCustomExpand({ value, fallback, onChange }: Props) {
  const { colors } = useThemeColors();
  return (
    <View
      style={{
        marginTop: 10,
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        maxHeight: 420,
      }}
    >
      <Text
        style={{
          fontFamily: fontFamilies.primary.text,
          fontSize: 11,
          fontWeight: fontWeights.bold,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: colors.text.secondary,
          marginBottom: 8,
        }}
      >
        Build your progression
      </Text>
      <GrowthIconsSheetBody
        fallback={fallback}
        showPresets={false}
        value={value}
        onChange={onChange}
      />
    </View>
  );
}
