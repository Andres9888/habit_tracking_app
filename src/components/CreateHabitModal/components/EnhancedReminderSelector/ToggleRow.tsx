/**
 * ToggleRow - Row with bell icon, label, and switch
 * Shows a PRO badge and locks the toggle for non-premium users
 */

import { memo } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { Bell, Crown } from 'lucide-react-native';
import { shadows } from '../../../../theme/spacing';

interface ToggleRowProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
  /** Whether user has premium access */
  isPremium?: boolean;
  /** Called when non-premium user taps the locked toggle */
  onPremiumUpsell?: () => void;
}

function ToggleRowComponent({
  enabled,
  onToggle,
  isPremium = true,
  onPremiumUpsell,
}: ToggleRowProps) {
  const handleTogglePress = (value: boolean) => {
    if (!isPremium) {
      onPremiumUpsell?.();
      return;
    }
    onToggle(value);
  };

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
        {!isPremium && (
          <Pressable
            accessibilityLabel='Premium feature — tap to upgrade'
            accessibilityRole='button'
            className='flex-row items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1'
            onPress={onPremiumUpsell}
          >
            <Crown color='#d97706' size={12} />
            <Text className='text-[11px] font-bold tracking-wide text-amber-700'>
              PRO
            </Text>
          </Pressable>
        )}
      </View>

      {isPremium ? (
        <Switch
          accessibilityLabel={enabled ? 'Disable reminder' : 'Enable reminder'}
          accessibilityRole='switch'
          ios_backgroundColor='#d6d3d1'
          testID='reminder-toggle'
          thumbColor='#ffffff'
          trackColor={{ false: '#d6d3d1', true: '#10B981' }}
          value={enabled}
          onValueChange={handleTogglePress}
        />
      ) : (
        <Pressable
          accessibilityLabel='Upgrade to enable reminders'
          accessibilityRole='button'
          onPress={onPremiumUpsell}
        >
          <View
            className='h-[31px] w-[51px] items-end justify-center rounded-full bg-stone-200 px-0.5'
          >
            <View className='h-[27px] w-[27px] rounded-full bg-white' />
          </View>
        </Pressable>
      )}
    </View>
  );
}

export const ToggleRow = memo(ToggleRowComponent);
