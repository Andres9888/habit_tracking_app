/**
 * ToggleRow - Row with bell icon, label, and switch
 */

import { Switch, Text, View } from 'react-native';
import { memo } from 'react';

import { Bell } from 'lucide-react-native';

import { shadows } from '../../../../theme/spacing';

interface ToggleRowProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

function ToggleRowComponent({ enabled, onToggle }: ToggleRowProps) {
  return (
    <View
      className='flex-row items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-4'
      style={shadows.subtle}
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
