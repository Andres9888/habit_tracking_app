/**
 * Calendar Timeline Comparison Demo
 *
 * Test all three variants side-by-side:
 * - Original (current implementation)
 * - Option A: Permanent edge gradients
 * - Option B: First-time pulsing chevrons
 *
 * Usage: Import this into your app to test which variant works best
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { addDays, startOfWeek } from 'date-fns';
import { CalendarTimeline } from '../../components/CalendarTimeline/CalendarTimeline';
import { CalendarTimelineOptionA } from '../../components/CalendarTimeline/CalendarTimelineWithEdgeFade';
import { CalendarTimelineOptionB } from '../../components/CalendarTimeline/CalendarTimelineWithPulse';

export default function CalendarTimelineComparison() {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<'original' | 'optionA' | 'optionB'>('original');

  // Generate week dates based on offset
  const generateWeekDates = (offset: number): Date[] => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 0 });
    const offsetStart = addDays(weekStart, offset * 7);
    return Array.from({ length: 7 }, (_, i) => addDays(offsetStart, i));
  };

  const weekDates = generateWeekDates(currentWeekOffset);
  const canNavigateForward = currentWeekOffset >= 0;

  const handlePreviousWeek = () => {
    setCurrentWeekOffset((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    if (canNavigateForward) return;
    setCurrentWeekOffset((prev) => prev + 1);
  };

  const variants = [
    { id: 'original', label: 'Original', description: 'Current implementation' },
    { id: 'optionA', label: 'Option A', description: 'Permanent edge gradients' },
    { id: 'optionB', label: 'Option B', description: 'Pulsing chevrons (first-time)' },
  ] as const;

  return (
    <ScrollView className='flex-1 bg-white'>
      <View className='mx-auto w-full max-w-[448px] gap-6 px-6 py-8'>
        {/* Header */}
        <View className='gap-2'>
          <Text className='text-[28px] font-bold text-stone-900'>
            📅 Calendar Timeline Variants
          </Text>
          <Text className='text-[15px] leading-[22px] text-stone-600'>
            Test which navigation hint works best for your users
          </Text>
        </View>

        {/* Variant Selector */}
        <View className='gap-3'>
          <Text className='text-[13px] font-semibold uppercase tracking-wide text-stone-500'>
            Select variant to test
          </Text>
          <View className='flex-row gap-2'>
            {variants.map((variant) => (
              <Pressable
                key={variant.id}
                accessibilityLabel={`Select ${variant.label}`}
                accessibilityRole='button'
                className={`flex-1 rounded-xl border-2 p-3 ${
                  selectedVariant === variant.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-stone-200 bg-white'
                }`}
                onPress={() => setSelectedVariant(variant.id)}
              >
                <Text
                  className={`text-center text-[13px] font-semibold ${
                    selectedVariant === variant.id ? 'text-indigo-600' : 'text-stone-700'
                  }`}
                >
                  {variant.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Live Preview */}
        <View className='gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4'>
          <View className='flex-row items-center justify-between'>
            <Text className='text-[13px] font-semibold uppercase tracking-wide text-stone-500'>
              Live Preview
            </Text>
            <View className='rounded-full bg-green-100 px-3 py-1'>
              <Text className='text-[11px] font-semibold text-green-700'>
                {selectedVariant === 'original' && 'ORIGINAL'}
                {selectedVariant === 'optionA' && 'OPTION A'}
                {selectedVariant === 'optionB' && 'OPTION B'}
              </Text>
            </View>
          </View>

          {/* Render selected variant */}
          {selectedVariant === 'original' && (
            <CalendarTimeline
              canNavigateForward={canNavigateForward}
              dates={weekDates}
              showSeparator
              onNextWeek={handleNextWeek}
              onPreviousWeek={handlePreviousWeek}
            />
          )}

          {selectedVariant === 'optionA' && (
            <CalendarTimelineOptionA
              canNavigateForward={canNavigateForward}
              dates={weekDates}
              showSeparator
              onNextWeek={handleNextWeek}
              onPreviousWeek={handlePreviousWeek}
            />
          )}

          {selectedVariant === 'optionB' && (
            <CalendarTimelineOptionB
              canNavigateForward={canNavigateForward}
              dates={weekDates}
              showSeparator
              onNextWeek={handleNextWeek}
              onPreviousWeek={handlePreviousWeek}
            />
          )}
        </View>

        {/* Feature Comparison Table */}
        <View className='gap-4 rounded-2xl border border-stone-200 bg-white p-5'>
          <Text className='text-[16px] font-semibold text-stone-900'>
            Feature Comparison
          </Text>

          {/* Original */}
          <View className='gap-2 rounded-xl border border-stone-200 bg-stone-50 p-4'>
            <Text className='text-[14px] font-semibold text-stone-900'>
              🔹 Original (Current)
            </Text>
            <Text className='text-[13px] leading-[20px] text-stone-600'>
              • Basic chevron buttons{'\n'}
              • No visual hints for scrollability{'\n'}
              • Minimal navigation affordance{'\n'}
              • Works, but requires discovery
            </Text>
          </View>

          {/* Option A */}
          <View className='gap-2 rounded-xl border border-indigo-200 bg-indigo-50 p-4'>
            <Text className='text-[14px] font-semibold text-indigo-900'>
              ✨ Option A: Edge Gradients
            </Text>
            <Text className='text-[13px] leading-[20px] text-indigo-700'>
              • Permanent gradient fades on edges{'\n'}
              • Subtle, always-visible affordance{'\n'}
              • Professional, minimalist look{'\n'}
              • Best for: Clean design preference
            </Text>
          </View>

          {/* Option B */}
          <View className='gap-2 rounded-xl border border-purple-200 bg-purple-50 p-4'>
            <Text className='text-[14px] font-semibold text-purple-900'>
              💫 Option B: Pulsing Chevrons
            </Text>
            <Text className='text-[13px] leading-[20px] text-purple-700'>
              • Chevrons pulse 3x on first load{'\n'}
              • Auto-stops after 4s or first navigation{'\n'}
              • Guides first-time users effectively{'\n'}
              • Best for: User onboarding focus
            </Text>
          </View>
        </View>

        {/* Usage Instructions */}
        <View className='gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5'>
          <Text className='text-[14px] font-semibold text-blue-900'>
            🧪 Testing Instructions
          </Text>
          <Text className='text-[13px] leading-[20px] text-blue-700'>
            1. Switch between variants using the buttons above{'\n'}
            2. Try navigating weeks with chevrons{'\n'}
            3. Notice how each variant hints at navigation{'\n'}
            4. Choose your favorite based on your design goals
          </Text>
        </View>

        {/* Implementation Guide */}
        <View className='gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5'>
          <Text className='text-[14px] font-semibold text-amber-900'>
            📝 How to Implement
          </Text>
          <Text className='text-[13px] leading-[20px] text-amber-700'>
            Once you decide, replace the import in HabitsList.tsx:{'\n\n'}
            {selectedVariant === 'original' &&
              "import { CalendarTimeline } from '...';"}
            {selectedVariant === 'optionA' &&
              "import { CalendarTimelineOptionA as CalendarTimeline } from '...';"}
            {selectedVariant === 'optionB' &&
              "import { CalendarTimelineOptionB as CalendarTimeline } from '...';"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
