/**
 * Empty state when no habits exist
 * Standardized: FadeInUp animation, icon, proper typography
 * Dark mode aware via useThemeColors
 */

import { View } from 'react-native';
import { BarChart2 } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}>
      <Animated.View
        entering={anim(0)}
        style={{
          marginBottom: 16,
          height: 64,
          width: 64,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          backgroundColor: isDark ? '#78350f' : '#fffbeb',
          shadowColor: '#f59e0b',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: isDark ? 0.2 : 0.08,
          shadowRadius: 16,
        }}
      >
        <BarChart2 color={isDark ? '#fbbf24' : '#f59e0b'} size={32} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{ marginBottom: 8, textAlign: 'center', fontWeight: '700', color: colors.text.primary, fontSize: 22, letterSpacing: -0.5 }}
      >
        No Stats Yet
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{ textAlign: 'center', fontSize: 17, lineHeight: 22, color: colors.text.secondary, maxWidth: 280 }}
      >
        Create your first habit to see stats here
      </Animated.Text>
    </View>
  );
}
