/** PausedEmptyState - Empty state for paused habits */
import { View } from 'react-native';
import { Pause } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function PausedEmptyState() {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      className='items-center py-12'
      entering={anim(0)}
    >
      <Animated.View
        entering={anim(0)}
        style={{
          width: 64,
          height: 64,
          borderRadius: 20,
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
        <Pause color={colors.primary[500]} size={32} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text
        entering={anim(60)}
        style={{
          fontSize: 22,
          fontWeight: '700',
          letterSpacing: -0.35,
          color: colors.text.primary,
          textAlign: 'center',
          marginBottom: 6,
        }}
      >
        All Systems Go
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          fontSize: 15,
          lineHeight: 21,
          color: colors.text.secondary,
          textAlign: 'center',
          maxWidth: 260,
        }}
      >
        No habits on pause right now. Swipe left on any habit to take a breather
        without losing your data.
      </Animated.Text>
    </Animated.View>
  );
}
