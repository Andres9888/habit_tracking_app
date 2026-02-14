/**
 * Empty state shown when no habits exist for a selected day
 * Theme-aware with encouraging copy
 */

import { View } from 'react-native';
import { CalendarPlus } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 24, paddingVertical: 40 }}>
      <Animated.View
        entering={anim(0)}
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary[100],
          marginBottom: 16,
          shadowColor: colors.text.primary,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        }}
      >
        <CalendarPlus color={colors.primary[500]} size={28} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{
          fontSize: 17,
          fontWeight: '600',
          color: colors.text.primary,
          textAlign: 'center',
          marginBottom: 4,
        }}
      >
        A Fresh Start
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          fontSize: 13,
          color: colors.text.secondary,
          textAlign: 'center',
          lineHeight: 18,
          maxWidth: 240,
        }}
      >
        No habits tracked this day yet. Head to the Home tab to create one and get going.
      </Animated.Text>
    </View>
  );
}
