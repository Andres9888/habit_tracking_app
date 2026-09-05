/** Amber banner shown inside the reminder row when notifications are denied. */
import { Linking, Pressable, Text, View } from 'react-native';
import { BellOff } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';
import { usePanelTokens } from '../panel/panelTokens';

const COPY = 'Your time is saved. Allow notifications in Settings to receive it.';

export function ReminderPermissionBanner() {
  const t = usePanelTokens();
  const { colors } = useThemeColors();
  const hue = t.hues.why;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: hue.tile,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 14,
      }}
      testID='reminder-permission-banner'
    >
      <BellOff color={hue.ink} size={iconSizes.medium} strokeWidth={2} />
      <Text
        style={{
          ...typography.caption,
          flex: 1,
          fontSize: 13,
          lineHeight: 18,
          fontWeight: fontWeights.medium,
          color: t.bannerText,
        }}
      >
        {COPY}
      </Text>
      <Pressable
        accessibilityHint='Opens device settings to enable notifications'
        accessibilityLabel='Open Settings'
        accessibilityRole='button'
        hitSlop={10}
        style={{
          borderRadius: 999,
          paddingVertical: 6,
          paddingHorizontal: 12,
          backgroundColor: hue.ink,
        }}
        onPress={() => void Linking.openSettings()}
      >
        <Text
          style={{
            ...typography.label,
            fontSize: 12,
            fontWeight: fontWeights.bold,
            color: colors.text.inverse,
          }}
        >
          Open Settings
        </Text>
      </Pressable>
    </View>
  );
}
