/**
 * Empty state shown when no habits exist
 * Standardized: animation (respects reduce-motion), proper typography, dark mode, accessible
 */

import { View } from 'react-native';
import { ClipboardList } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { useReducedMotionEntry } from '../../EmptyState/useReducedMotionEntry';
import { fontFamilies } from '@/theme/typography';

export function EmptyState() {
  const { colors } = useThemeColors();
  const { entry } = useReducedMotionEntry();

  return (
    <View
      accessible
      accessibilityLabel='No habits yet. Create your first habit to start tracking.'
      accessibilityRole='text'
      style={{ alignItems: 'center', paddingHorizontal: 24, paddingVertical: 40 }}
    >
      <Animated.View
        entering={entry(0)}
        style={{
          alignItems: 'center',
          backgroundColor: colors.gray[100],
          borderRadius: 12,
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
        entering={entry(60)}
        style={{
          color: colors.text.primary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 17,
          fontWeight: '600',
          marginBottom: 4,
          textAlign: 'center',
        }}
      >
        No Habits Yet
      </Animated.Text>
      <Animated.Text
        entering={entry(120)}
        style={{
          color: colors.text.secondary,
          fontFamily: fontFamilies.primary.text,
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        Create your first habit to start tracking
      </Animated.Text>
    </View>
  );
}
