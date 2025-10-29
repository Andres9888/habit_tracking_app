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
    <View className='mb-4 flex-row rounded-lg bg-slate-100 p-1'>
      {/* Month Tab */}
      <Pressable
        className={`flex-1 rounded-md py-2 ${
          activeView === 'month' ? 'bg-white' : 'bg-transparent'
        }`}
        onPress={() => onViewChange('month')}
      >
        <Text
          className={`text-center text-sm font-semibold ${
            activeView === 'month' ? 'text-slate-900' : 'text-slate-500'
          }`}
        >
          Month
        </Text>
      </Pressable>

      {/* Year Tab */}
      <Pressable
        className={`flex-1 rounded-md py-2 ${
          activeView === 'year' ? 'bg-white' : 'bg-transparent'
        }`}
        onPress={() => onViewChange('year')}
      >
        <Text
          className={`text-center text-sm font-semibold ${
            activeView === 'year' ? 'text-slate-900' : 'text-slate-500'
          }`}
        >
          Year
        </Text>
      </Pressable>
    </View>
  );
}
