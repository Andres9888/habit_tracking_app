/**
 * ToggleRow - Row with bell icon, label, and switch
 */

import { memo } from 'react';
import { Switch, Text, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import { shadows } from '../../../../theme/spacing';
import { useThemeColors } from '../../../../theme/ThemeContext';

interface ToggleRowProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

function ToggleRowComponent({ enabled, onToggle }: ToggleRowProps) {
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        ...shadows.subtle,
        alignItems: 'center',
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderRadius: 16,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}
    >
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 12 }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.amber[100],
            borderRadius: 20,
            height: 40,
            justifyContent: 'center',
            width: 40,
          }}
        >
          <Bell color={colors.amber[500]} size={18} />
        </View>
        <Text style={{ color: colors.text.primary, fontSize: 16, fontWeight: '500' }}>
          Daily Reminder
        </Text>
      </View>

      <Switch
        accessibilityLabel={enabled ? 'Disable reminder' : 'Enable reminder'}
        accessibilityRole='switch'
        ios_backgroundColor={colors.toggle.iosBg}
        testID='reminder-toggle'
        thumbColor={colors.toggle.thumb}
        trackColor={{ false: colors.toggle.trackOff, true: colors.toggle.trackOn }}
        value={enabled}
        onValueChange={onToggle}
      />
    </View>
  );
}

export const ToggleRow = memo(ToggleRowComponent);
