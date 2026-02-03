/**
 * CalendarTabs Component
 * Tab switcher for Month vs Year (Heatmap) calendar views
 */

import { View, Text, Pressable } from 'react-native';

type CalendarView = 'month' | 'year';

interface CalendarTabsProps {
  activeView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export function CalendarTabs({ activeView, onViewChange }: CalendarTabsProps) {
  return (
    <View className='mb-4 flex-row rounded-lg bg-stone-100 p-1'>
      {/* Month Tab */}
      <Pressable
        accessibilityLabel='Month view'
        accessibilityRole='tab'
        accessibilityState={{ selected: activeView === 'month' }}
        className={`flex-1 rounded-md py-2 ${
          activeView === 'month' ? 'bg-white' : 'bg-transparent'
        }`}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        onPress={() => onViewChange('month')}
      >
        <Text
          className={`text-center text-sm font-semibold ${
            activeView === 'month' ? 'text-stone-900' : 'text-stone-500'
          }`}
        >
          Month
        </Text>
      </Pressable>

      {/* Year Tab */}
      <Pressable
        accessibilityLabel='Year view'
        accessibilityRole='tab'
        accessibilityState={{ selected: activeView === 'year' }}
        className={`flex-1 rounded-md py-2 ${
          activeView === 'year' ? 'bg-white' : 'bg-transparent'
        }`}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        onPress={() => onViewChange('year')}
      >
        <Text
          className={`text-center text-sm font-semibold ${
            activeView === 'year' ? 'text-stone-900' : 'text-stone-500'
          }`}
        >
          Year
        </Text>
      </Pressable>
    </View>
  );
}
