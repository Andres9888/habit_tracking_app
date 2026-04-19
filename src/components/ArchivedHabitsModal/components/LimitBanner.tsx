import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Lock } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { durations, springs } from '@/theme/animations';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights } from '@/theme/typography';

const ENTERING = FadeInDown.duration(durations.enter).springify().damping(springs.standard.damping);
const AMBER = '#D97706';
const AMBER_DARK = '#B45309';
const AMBER_TINT = 'rgba(217, 119, 6, 0.08)';
const AMBER_BORDER = 'rgba(217, 119, 6, 0.25)';
const AMBER_ICON_BG = 'rgba(217, 119, 6, 0.15)';
const AMBER_TEXT = '#7A5A1E';
const AMBER_TEXT_STRONG = '#5C4214';

interface LimitBannerProps {
  onUpgradePress: () => void;
}

export function LimitBanner({ onUpgradePress }: LimitBannerProps) {
  const { isDark, colors } = useThemeColors();
  const textColor = isDark ? colors.text.secondary : AMBER_TEXT;
  const strongColor = isDark ? colors.text.primary : AMBER_TEXT_STRONG;

  return (
    <Animated.View
      entering={ENTERING}
      style={{
        flexDirection: 'row', alignItems: 'flex-start', gap: 10,
        marginHorizontal: 20, marginBottom: 12, padding: 12,
        borderRadius: 14, borderWidth: 1,
        backgroundColor: AMBER_TINT, borderColor: AMBER_BORDER,
      }}
    >
      <View
        style={{
          width: 28, height: 28, borderRadius: 8,
          backgroundColor: AMBER_ICON_BG,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Lock color={AMBER} size={iconSizes.small} strokeWidth={2.5} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, lineHeight: 18, color: textColor, letterSpacing: -0.1 }}>
          You're at the free-tier limit of{' '}
          <Text style={{ fontWeight: fontWeights.semibold, color: strongColor }}>3 active habits</Text>.
          Upgrade to restore, or delete an active habit to make room.
        </Text>
      </View>
      <Pressable
        accessibilityLabel='Upgrade to Premium' accessibilityRole='button'
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={({ pressed }) => ({
          paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
          backgroundColor: pressed ? AMBER_DARK : AMBER,
        })}
        onPress={onUpgradePress}
      >
        <Text style={{ fontSize: 12, fontWeight: fontWeights.semibold, color: '#FFFFFF' }}>
          Upgrade
        </Text>
      </Pressable>
    </Animated.View>
  );
}
