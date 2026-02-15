/**
 * Empty state shown when no habits exist for a selected day
 * Dark mode: migrated to useThemeColors
 */

import { View } from 'react-native';
import { ClipboardList } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      accessible
      accessibilityLabel="No habits yet. Create your first habit to start tracking."
      style={{ alignItems: 'center', paddingHorizontal: 24, paddingVertical: 40 }}
    >
      <Animated.View
        entering={anim(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
          borderRadius: 16,
          height: 56,
          justifyContent: 'center',
          marginBottom: 16,
          shadowColor: colors.text.primary,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          width: 56,
        }}
      >
        <ClipboardList color={colors.text.tertiary} size={28} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{
          color: colors.text.primary,
          fontSize: 17,
          fontWeight: '600',
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        No Habits Yet
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          color: colors.text.secondary,
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        Create your first habit to start tracking
      </Animated.Text>
    </View>
  );
}
