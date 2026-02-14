import { View } from 'react-native';
import { Archive } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors } = useThemeColors();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 64 }}>
      {/* Icon */}
      <Animated.View
        entering={anim(0)}
        style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary[100],
          marginBottom: 20,
          shadowColor: colors.primary[500],
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
        }}
      >
        <Archive color={colors.primary[500]} size={36} strokeWidth={1.5} />
      </Animated.View>

      {/* Copy */}
      <Animated.Text
        entering={anim(60)}
        style={{
          fontSize: 22,
          fontWeight: '700',
          letterSpacing: -0.35,
          color: colors.text.primary,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        All Habits Active
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          fontSize: 15,
          lineHeight: 21,
          color: colors.text.secondary,
          textAlign: 'center',
          maxWidth: 280,
          marginBottom: 24,
        }}
      >
        Nothing archived yet. Swipe left on any habit to tuck it away without losing your progress.
      </Animated.Text>

      {/* Tip Card */}
      <Animated.View
        entering={anim(180)}
        style={{
          width: '100%',
          maxWidth: 320,
          borderRadius: 16,
          backgroundColor: colors.primary[100],
          borderWidth: 1,
          borderColor: colors.primary[300],
          padding: 16,
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <Animated.Text style={{ fontSize: 20 }}>💡</Animated.Text>
        <View style={{ flex: 1 }}>
          <Animated.Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.primary[500],
              marginBottom: 4,
            }}
          >
            Good to Know
          </Animated.Text>
          <Animated.Text
            style={{
              fontSize: 13,
              lineHeight: 18,
              color: colors.text.secondary,
            }}
          >
            Archiving keeps all your streaks and data safe. Restore anytime and pick up right where you left off.
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
}
