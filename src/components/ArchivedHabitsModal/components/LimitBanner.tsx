import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Lock } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { durations, enterEasing } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';
import { borderRadius } from '@/theme/spacing';
import { fontWeights, typography } from '@/theme/typography';

const ENTERING = FadeInDown.duration(durations.enter).easing(enterEasing);

interface LimitBannerProps {
  onUpgradePress: () => void;
}

export function LimitBanner({ onUpgradePress }: LimitBannerProps) {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      entering={ENTERING}
      style={{
        flexDirection: 'row', alignItems: 'flex-start', gap: 10,
        marginHorizontal: 20, marginBottom: 12, padding: 12,
        borderRadius: borderRadius.medium, borderWidth: 1,
        backgroundColor: colors.status.warningLight,
        borderColor: colors.status.warning,
      }}
    >
      <View
        style={{
          width: 28, height: 28, borderRadius: borderRadius.small,
          backgroundColor: colors.status.warningLight,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Lock color={colors.status.warning} size={iconSizes.small} strokeWidth={2.5} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: typography.caption.fontSize, lineHeight: 18, color: colors.status.warningText, letterSpacing: -0.1 }}>
          You're at the free-tier limit of{' '}
          <Text style={{ fontWeight: fontWeights.semibold, color: colors.status.warningText }}>3 active habits</Text>.
          Upgrade to restore, or delete an active habit to make room.
        </Text>
      </View>
      <Pressable
        accessibilityLabel='Upgrade to Premium' accessibilityRole='button'
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={({ pressed }) => ({
          paddingHorizontal: 12, paddingVertical: 6, borderRadius: borderRadius.full,
          backgroundColor: colors.status.warning,
          opacity: pressed ? 0.85 : 1,
        })}
        onPress={onUpgradePress}
      >
        <Text style={{ fontSize: 12, fontWeight: fontWeights.semibold, color: colors.text.inverse }}>
          Upgrade
        </Text>
      </Pressable>
    </Animated.View>
  );
}
