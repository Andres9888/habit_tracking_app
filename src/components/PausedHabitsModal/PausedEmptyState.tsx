/** 
 * PausedEmptyState - Empty state for paused habits
 * ENHANCED: More encouraging, explains pause feature, respects reduce-motion
 */
import { Text, View } from 'react-native';
import { Zap } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { useReducedMotionEntry } from '../EmptyState/useReducedMotionEntry';

export function PausedEmptyState() {
  const { colors, isDark } = useThemeColors();
  const { entry } = useReducedMotionEntry();

  return (
    <Animated.View
      accessible
      accessibilityLabel='Great momentum! All habits are active. Pause habits when you need a break.'
      accessibilityRole='text'
      entering={entry(60)}
      style={{ alignItems: 'center', paddingHorizontal: 24, paddingVertical: 48 }}
    >
      {/* Icon */}
      <Animated.View
        entering={entry(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#451A03' : '#FFFBEB',
          borderRadius: 16,
          height: 80,
          justifyContent: 'center',
          marginBottom: 20,
          width: 80,
        }}
      >
        <Zap color={isDark ? '#FCD34D' : '#F59E0B'} fill={isDark ? '#FCD34D' : '#F59E0B'} size={40} />
      </Animated.View>

      {/* Headline */}
      <Animated.Text
        entering={entry(60)}
        style={{
          color: colors.text.primary,
          fontSize: 22,
          fontWeight: '700',
          letterSpacing: -0.5,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        Great Momentum!
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        entering={entry(120)}
        style={{
          color: colors.text.secondary,
          fontSize: 17,
          lineHeight: 22,
          marginBottom: 24,
          maxWidth: 280,
          textAlign: 'center',
        }}
      >
        All your habits are active and running strong
      </Animated.Text>

      {/* Info Card */}
      <Animated.View
        entering={entry(180)}
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: 12,
          borderWidth: 1,
          padding: 16,
          shadowColor: colors.text.primary,
          shadowOffset: { height: 2, width: 0 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          width: '100%',
        }}
      >
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Text style={{ fontSize: 20 }}>💡</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.text.primary,
                fontSize: 14,
                fontWeight: '600',
                marginBottom: 4,
              }}
            >
              Need a Break?
            </Text>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 13,
                lineHeight: 18,
              }}
            >
              Swipe left on any habit and tap "Pause" when you need time off. Your progress stays safe, and you can resume anytime!
            </Text>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
