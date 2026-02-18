/**
 * ToggleRow - Row with bell icon, label, and switch
 */

import { memo } from 'react';
import { Switch, Text, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme';
import { shadows } from '../../../../theme/spacing';

interface ToggleRowProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

function ToggleRowComponent({ enabled, onToggle }: ToggleRowProps) {
  const { colors } = useThemeColors();

  return (
    <View
      className='flex-row items-center justify-between rounded-2xl border px-4 py-4'
      style={[
        shadows.subtle,
        {
          borderColor: colors.border,
          backgroundColor: colors.card,
        },
      ]}
    >
      <View className='flex-row items-center gap-3'>
        <View
          className='h-10 w-10 items-center justify-center rounded-full'
          style={{ backgroundColor: colors.warning[50] }}
        >
          <Bell color={colors.warning[600]} size={18} />
        </View>
        <Text className='text-base font-medium' style={{ color: colors.text.primary }}>
          Daily Reminder
        </Text>
      </View>

      <Switch
        accessibilityLabel={enabled ? 'Disable reminder' : 'Enable reminder'}
        accessibilityRole='switch'
        ios_backgroundColor={colors.border}
        testID='reminder-toggle'
        thumbColor='#ffffff'
        trackColor={{ false: colors.border, true: colors.primary[600] }}
        value={enabled}
        onValueChange={onToggle}
      />
    </View>
  );
}

export const ToggleRow = memo(ToggleRowComponent);
