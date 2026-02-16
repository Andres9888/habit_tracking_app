/**
 * Empty state with seed templates button
 * ENHANCED: More engaging copy, better icon, encouraging message
 */

import { View, Text } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Button from '../../../components/Button/Button';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';

interface TemplatesEmptyStateProps {
  isSeeding: boolean;
  onSeedTemplates: () => void;
}

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function TemplatesEmptyState({
  isSeeding,
  onSeedTemplates,
}: TemplatesEmptyStateProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }]}>
      {/* Icon */}
      <Animated.View
        entering={anim(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#431407' : '#FFF7ED',
          borderRadius: 20,
          height: 80,
          justifyContent: 'center',
          marginBottom: 20,
          shadowColor: '#f59e0b',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          width: 80,
        }}
      >
        <Sparkles color={isDark ? '#FDBA74' : '#F59E0B'} size={40} strokeWidth={1.5} />
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
        Science-Backed Habits Ready!
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        entering={anim(120)}
        style={{
          color: colors.text.secondary,
          fontSize: 17,
          lineHeight: 22,
          marginBottom: 32,
          maxWidth: 320,
          textAlign: 'center',
        }}
      >
        Load expertly-crafted habit templates to kickstart your journey. Each one is designed to help you succeed.
      </Animated.Text>

      {/* CTA */}
      <Animated.View entering={anim(180)} style={{ width: '100%' }}>
        <Button
          disabled={isSeeding}
          size='large'
          variant='primary'
          onPress={onSeedTemplates}
        >
          {isSeeding ? 'Loading Habits...' : '✨ Load Habit Templates'}
        </Button>
      </Animated.View>

      {/* Tip */}
      <Animated.View
        entering={anim(240)}
        style={{
          backgroundColor: isDark ? '#064E3B' : '#ECFDF5',
          borderRadius: 12,
          marginTop: 24,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Text style={{ color: isDark ? '#6EE7B7' : '#047857', fontSize: 13, textAlign: 'center' }}>
          💡 You can customize any template to fit your lifestyle
        </Text>
      </Animated.View>
    </View>
  );
}
