/**
 * Empty state shown when no habits exist
 * ENHANCED: More encouraging, emphasizes the opportunity to start
 */

import { View, Text } from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { useReducedMotionEntry } from '../../EmptyState/useReducedMotionEntry';

export function EmptyState() {
  const { colors, isDark } = useThemeColors();
  const { entry } = useReducedMotionEntry();

  return (
    <View
      accessible
      accessibilityLabel='Perfect day to start! Create your first habit and begin building positive change.'
      accessibilityRole='text'
      style={{ alignItems: 'center', paddingHorizontal: 24, paddingVertical: 40 }}
    >
      {/* Icon */}
      <Animated.View
        entering={entry(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#064E3B' : '#ECFDF5',
          borderRadius: 16,
          height: 72,
          justifyContent: 'center',
          marginBottom: 16,
          shadowColor: '#047857',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          width: 72,
        }}
      >
        <PlusCircle color={isDark ? '#6EE7B7' : '#047857'} size={36} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={entry(60)}
        style={{
          color: colors.text.primary,
          fontSize: 20,
          fontWeight: '700',
          letterSpacing: -0.4,
          marginBottom: 6,
          textAlign: 'center',
        }}
      >
        Perfect Day to Start!
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        entering={entry(120)}
        style={{
          color: colors.text.secondary,
          fontSize: 15,
          lineHeight: 21,
          marginBottom: 16,
          maxWidth: 260,
          textAlign: 'center',
        }}
      >
        Create your first habit and begin building positive change
      </Animated.Text>

      {/* Tip */}
      <Animated.View
        entering={entry(180)}
        style={{
          backgroundColor: isDark ? '#451A03' : '#FFFBEB',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}
      >
        <Text style={{ color: isDark ? '#FCD34D' : '#D97706', fontSize: 12, fontWeight: '500' }}>
          ✨ Tap the + button to get started
        </Text>
      </Animated.View>
    </View>
  );
}
