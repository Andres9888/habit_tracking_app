/**
 * SmartSuggestion - Shows popular reminder time suggestion
 *
 * Displays "Most users set reminders at X" to encourage adoption
 * and reduce decision fatigue.
 */

import { Text, View } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface SmartSuggestionProps {
  /** The suggested time label (e.g., "8:00 AM") */
  suggestedTime: string;
}

/**
 * SmartSuggestion - Displays a contextual suggestion about popular reminder times.
 * 
 * Features:
 * - Shows "Most users set reminders at [time]" 
 * - Uses subtle styling to not overpower the UI
 * - Icon + text layout
 * - Accessible for screen readers
 * 
 * @example
 * <SmartSuggestion suggestedTime="8:00 AM" />
 */
export function SmartSuggestion({ suggestedTime }: SmartSuggestionProps) {
  const { colors } = useThemeColors();

  return (
    <View
      accessibilityLabel={`Most users set reminders at ${suggestedTime}`}
      accessibilityRole='text'
      className='mb-3 flex-row items-center justify-center gap-1.5'
    >
      <TrendingUp color={colors.text.secondary} size={12} />
      <Text 
        className='text-xs'
        style={{ color: colors.text.secondary }}
      >
        Most users set reminders at{' '}
        <Text className='font-semibold' style={{ color: colors.primary[500] }}>
          {suggestedTime}
        </Text>
      </Text>
    </View>
  );
}

export default SmartSuggestion;
