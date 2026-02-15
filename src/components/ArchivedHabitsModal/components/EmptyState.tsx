/**
 * Empty state for archived habits modal
 * Dark mode: migrated to useThemeColors, added accessibility
 */

import { Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      accessible
      accessibilityLabel="All your habits are active. Archived habits will appear here."
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 64,
      }}
    >
      {/* Illustration */}
      <Animated.View entering={anim(0)} style={{ alignItems: 'center', marginBottom: 24 }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: isDark ? colors.gray[800] : '#ecfdf5',
            borderRadius: 16,
            height: 112,
            justifyContent: 'center',
            width: 128,
          }}
        >
          <Text style={{ fontSize: 48, marginTop: 8 }}>🌱</Text>
        </View>
      </Animated.View>

      {/* Text Content */}
      <Animated.Text
        entering={anim(60)}
        style={{
          color: colors.text.primary,
          fontSize: 24,
          fontWeight: '700',
          letterSpacing: -0.5,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        Your Habits Are Thriving!
      </Animated.Text>
      <Animated.Text
        entering={anim(90)}
        style={{
          color: colors.text.secondary,
          fontSize: 16,
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        All your habits are active and growing.
      </Animated.Text>
      <Animated.Text
        entering={anim(120)}
        style={{
          color: colors.text.secondary,
          fontSize: 14,
          maxWidth: 300,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        When you need a break from a habit, swipe left to archive it here for safekeeping.
      </Animated.Text>

      {/* Pro Tip Card */}
      <Animated.View
        entering={anim(150)}
        style={{
          backgroundColor: isDark ? colors.gray[800] : '#ecfdf5',
          borderColor: isDark ? colors.gray[700] : '#D1FAE5',
          borderRadius: 16,
          borderWidth: 1,
          maxWidth: 320,
          padding: 16,
          width: '100%',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
          <Text style={{ fontSize: 24 }}>💚</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: isDark ? colors.primary[300] : '#065F46',
                fontSize: 14,
                fontWeight: '500',
                marginBottom: 4,
              }}
            >
              Good to Know
            </Text>
            <Text
              style={{
                color: isDark ? colors.primary[400] : '#047857',
                fontSize: 12,
                lineHeight: 20,
              }}
            >
              Archiving preserves all your progress and streaks. You can restore habits anytime and
              pick up right where you left off!
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
