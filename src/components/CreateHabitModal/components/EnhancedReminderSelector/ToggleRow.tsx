/**
 * ToggleRow - Row with bell icon, label, and switch
 */

import { Pressable, Switch, Text, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { shadows } from '../../../../theme/spacing';
import { iconSizes } from '@/theme/iconSizes';

interface ToggleRowProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

const noopToggle = (_value: boolean) => {};

export function ToggleRow(props?: ToggleRowProps) {
  const { enabled = false, onToggle = noopToggle } = props ?? {};
  const { colors } = useThemeColors();

  return (
    <Pressable
      // Whole row toggles — the bare Switch alone is below the 44pt target.
      accessible={false}
      className='flex-row items-center justify-between rounded-2xl border px-4 py-4'
      style={[
        shadows.subtle,
        {
          borderColor: colors.border,
          backgroundColor: colors.card,
        },
      ]}
      onPress={() => onToggle(!enabled)}
    >
      <View className='flex-row items-center gap-3'>
        <View
          className='h-9 w-9 items-center justify-center rounded-xl'
          style={{ backgroundColor: colors.surface }}
        >
          <Bell color={colors.primary[700]} size={iconSizes.small} />
        </View>
        <Text
          className='text-base font-medium'
          style={{ color: colors.text.primary }}
        >
          Daily Reminder
        </Text>
      </View>

      <Switch
        accessibilityLabel={enabled ? 'Disable reminder' : 'Enable reminder'}
        accessibilityRole='switch'
        ios_backgroundColor={colors.border}
        testID='reminder-toggle'
        thumbColor={colors.text.inverse}
        trackColor={{ false: colors.border, true: colors.primary[600] }}
        value={enabled}
        onValueChange={onToggle}
      />
    </Pressable>
  );
}
