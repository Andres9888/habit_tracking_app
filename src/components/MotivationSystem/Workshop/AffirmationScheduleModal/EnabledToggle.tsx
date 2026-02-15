/**
 * EnabledToggle Component
 * Toggle switch for enabling/disabling scheduled delivery
 */

import React from 'react';
import { View, Text, Switch } from 'react-native';

import { Bell, BellOff } from 'lucide-react-native';

interface EnabledToggleProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

export function EnabledToggle({ isEnabled, onToggle }: EnabledToggleProps) {
  return (
    <View className='mb-6 flex-row items-center justify-between rounded-xl bg-stone-50 p-4'>
      <View className='flex-row items-center gap-3'>
        {isEnabled ? (
          <Bell className='text-amber-500' size={20} />
        ) : (
          <BellOff className='text-stone-400' size={20} />
        )}
        <View>
          <Text className='font-medium text-stone-800'>Scheduled Delivery</Text>
          <Text className='text-xs text-stone-500'>
            Receive push notifications
          </Text>
        </View>
      </View>
      <Switch
        accessibilityLabel='Enable scheduled delivery'
        ios_backgroundColor='#d6d3d1'
        thumbColor='white'
        trackColor={{ false: '#d6d3d1', true: '#f59e0b' }}
        value={isEnabled}
        onValueChange={onToggle}
      />
    </View>
  );
}

export default EnabledToggle;
