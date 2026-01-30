/**
 * ToggleRow - Row with bell icon, label, and switch
 */

import { memo } from 'react';
import { Switch, Text, View } from 'react-native';
import { Bell } from 'lucide-react-native';

interface ToggleRowProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

function ToggleRowComponent({ enabled, onToggle }: ToggleRowProps) {
  return (
    <View
      className='flex-row items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-4'
      style={{
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      }}
    >
      <View className='flex-row items-center gap-3'>
        <View className='h-10 w-10 items-center justify-center rounded-full bg-amber-100'>
          <Bell color='#f59e0b' size={18} />
        </View>
        <Text className='text-base font-medium text-stone-900'>
          Daily Reminder
        </Text>
      </View>

      <Switch
        accessibilityLabel={enabled ? 'Disable reminder' : 'Enable reminder'}
        accessibilityRole='switch'
        ios_backgroundColor='#d6d3d1'
        testID='reminder-toggle'
        thumbColor='#ffffff'
        trackColor={{ false: '#d6d3d1', true: '#10B981' }}
        value={enabled}
        onValueChange={onToggle}
      />
    </View>
  );
}

export const ToggleRow = memo(ToggleRowComponent);
