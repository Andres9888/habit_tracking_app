/**
 * Empty state for filtered template list
 * ENHANCED: Better messaging, search tips, clearer CTA
 */

import { View, Text } from 'react-native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Button from '../../../components/Button/Button';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';

interface TemplatesListEmptyProps {
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function TemplatesListEmpty({
  hasActiveFilters,
  onResetFilters,
}: TemplatesListEmptyProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={[styles.emptyStateWrapper, { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 40 }]}>
      {/* Icon */}
      <Animated.View
        entering={anim(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#1E3A5F' : '#EFF6FF',
          borderRadius: 16,
          height: 72,
          justifyContent: 'center',
          marginBottom: 20,
          width: 72,
        }}
      >
        <Search color={isDark ? '#93C5FD' : '#3B82F6'} size={36} strokeWidth={1.5} />
      </Animated.View>

      {/* Headline */}
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
        No Matching Habits
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        entering={anim(120)}
        style={{
          color: colors.text.secondary,
          fontSize: 17,
          lineHeight: 22,
          marginBottom: 24,
          maxWidth: 300,
          textAlign: 'center',
        }}
      >
        {hasActiveFilters
          ? 'Try adjusting your filters or search terms'
          : 'No habits match your search'}
      </Animated.Text>

      {/* Tips Card */}
      <Animated.View
        entering={anim(180)}
        style={{
          backgroundColor: colors.card,
          borderRadius: 12,
          marginBottom: 24,
          padding: 16,
          shadowColor: colors.text.primary,
          shadowOffset: { height: 2, width: 0 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          width: '100%',
        }}
      >
        <Text
          style={{
            color: colors.text.primary,
            fontSize: 13,
            fontWeight: '600',
            marginBottom: 8,
          }}
        >
          💡 Search Tips:
        </Text>
        <Text style={{ color: colors.text.secondary, fontSize: 13, lineHeight: 18 }}>
          • Try broader terms (e.g., "health" instead of "cardio")
          {'\n'}• Search by category (fitness, mindfulness, productivity)
          {'\n'}• Or create a custom habit instead!
        </Text>
      </Animated.View>

      {/* CTA */}
      {hasActiveFilters && (
        <Animated.View entering={anim(240)} style={{ width: '100%' }}>
          <Button
            size='medium'
            variant='secondary'
            onPress={onResetFilters}
          >
            Clear All Filters
          </Button>
        </Animated.View>
      )}
    </View>
  );
}
