/* eslint-disable max-lines */
import { Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 64,
      }}
    >
      {/* Illustration */}
      <Animated.View
        entering={anim(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? colors.primary[100] : colors.successLight,
          borderRadius: 16,
          height: 112,
          justifyContent: 'center',
          marginBottom: 24,
          width: 128,
        }}
      >
        <Text style={{ fontSize: 48 }}>🌱</Text>
      </Animated.View>

      {/* Text Content */}
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
        Your Habits Are Thriving!
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          color: colors.text.secondary,
          fontSize: 15,
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        All your habits are active and growing.
      </Animated.Text>
      <Animated.Text
        entering={anim(180)}
        style={{
          color: colors.text.secondary,
          fontSize: 14,
          marginBottom: 24,
          maxWidth: 280,
          textAlign: 'center',
        }}
      >
        When you need a break, swipe left on any habit to archive it here for
        safekeeping.
      </Animated.Text>

      {/* Pro Tip Card */}
      <Animated.View
        entering={anim(240)}
        style={{
          backgroundColor: isDark ? colors.primary[100] : colors.successLight,
          borderColor: isDark ? colors.primary[700] : '#D1FAE5',
          borderRadius: 16,
          borderWidth: 1,
          flexDirection: 'row',
          gap: 12,
          maxWidth: 320,
          padding: 16,
          width: '100%',
        }}
      >
        <Text style={{ fontSize: 24 }}>💚</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.primary[700],
              fontSize: 14,
              fontWeight: '500',
              marginBottom: 4,
            }}
          >
            Good to Know
          </Text>
          <Text
            style={{
              color: colors.primary[700],
              fontSize: 12,
              lineHeight: 18,
            }}
          >
            Archiving preserves all your progress and streaks. Restore habits
            anytime and pick up right where you left off!
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
