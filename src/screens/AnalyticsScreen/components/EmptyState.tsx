/**
 * EmptyState - OPTIMIZED: animation (respects reduce-motion), dark mode, accessible
 */
import React from 'react';
import { View, Text } from 'react-native';
import { BarChart3, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { typography } from '../../../theme/typography';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export const EmptyState: React.FC = () => {
  const { colors, isDark } = useThemeColors();
  const { entry } = useReducedMotionEntry();

  return (
    <View
      accessible
      accessibilityLabel='No analytics yet. Create habits and track them for a few days to unlock your insights dashboard.'
      accessibilityRole='text'
      style={{ alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}
    >
      {/* Illustration */}
      <Animated.View
        entering={entry(0)}
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#2E1065' : '#F5F3FF',
          borderRadius: 24,
          height: 96,
          justifyContent: 'center',
          marginBottom: 24,
          shadowColor: '#8b5cf6',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          width: 96,
        }}
      >
        <BarChart3 color={isDark ? '#C4B5FD' : '#8b5cf6'} size={48} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        className='mb-2 text-center font-bold text-stone-900'
        entering={anim(50)}
        style={typography.heading2}
      >
        No Analytics Yet
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        className='mb-8 text-center text-stone-500'
        entering={anim(100)}
        style={{ ...typography.body, maxWidth: 280 }}
      >
        Create habits and track them for a few days to unlock your insights
        dashboard.
      </Animated.Text>

      {/* Steps Card */}
      <Animated.View
        entering={entry(150)}
        style={{
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 20,
          shadowColor: colors.text.primary,
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          width: '100%',
        }}
      >
        <View className='mb-3 flex-row items-center gap-2'>
          <Sparkles color='#f59e0b' size={16} />
          <Text style={[typography.caption, { fontWeight: '600' }]} className='text-amber-600'>
            GET STARTED
          </Text>
        </View>
        <View style={{ gap: 12 }}>
          <StepItem colors={colors} number='1' text='Go to Home tab' />
          <StepItem colors={colors} number='2' text='Create your first habit' />
          <StepItem colors={colors} number='3' text='Track it daily' />
          <StepItem colors={colors} number='4' text='Come back to see insights!' />
        </View>
      </Animated.View>
    </View>
  );
};

function StepItem({ number, text, colors }: { number: string; text: string; colors: { gray: Record<string, string>; text: { primary: string; secondary: string } } }) {
  return (
    <View className='flex-row items-center gap-3'>
      <View className='h-7 w-7 items-center justify-center rounded-full bg-stone-100'>
        <Text style={[typography.caption, { fontWeight: '600' }]} className='text-stone-600'>
          {number}
        </Text>
      </View>
      <Text style={typography.body} className='text-stone-700'>{text}</Text>
    </View>
  );
}
