/**
 * Empty state when no habits exist
 * Standardized: FadeInUp animation, icon, proper typography, dark mode
 */

import { View } from 'react-native';
import { BarChart2 } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}>
      <Animated.View
        entering={anim(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#451A03' : '#FFFBEB',
          borderRadius: 12,
          height: 64,
          justifyContent: 'center',
          marginBottom: 16,
          shadowColor: '#f59e0b',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          width: 64,
        }}
      >
        <BarChart2 color={isDark ? '#FCD34D' : '#F59E0B'} size={32} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{
          color: colors.text.primary,
          fontSize: 22,
          fontWeight: '700',
          letterSpacing: -0.5,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        No Stats Yet
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          color: colors.text.secondary,
          fontSize: 17,
          lineHeight: 22,
          maxWidth: 280,
          textAlign: 'center',
        }}
      >
        Create your first habit to see stats here
      </Animated.Text>
    </View>
  );
}
