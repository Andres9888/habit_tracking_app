/**
 * PLACEHOLDER — Phase 2 ("reminder" agent) replaces this with the full row
 * (presets, inline time wheel, permission banner). It renders the head only so
 * the panel composes and types stay honest.
 */
import { Switch, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { useThemeColors } from '@/theme/ThemeContext';
import { PanelRow } from '../panel/PanelRow';
import { usePanelTokens } from '../panel/panelTokens';
import type { ReminderRowLayoutProps } from './ReminderRow.types';

export function ReminderRow({ reminder, divided }: ReminderRowLayoutProps) {
  const { colors } = useThemeColors();
  const t = usePanelTokens();
  return (
    <View collapsable={false} ref={reminder.sectionRef}>
      <PanelRow
        divided={divided}
        hint='Off'
        hue='reminder'
        icon={
          <Bell
            color={t.hues.reminder.ink}
            size={iconSizes.small}
            strokeWidth={2}
          />
        }
        open={false}
        title='Daily reminder'
        trailing={
          <Switch
            accessibilityLabel={
              reminder.enabled ? 'Disable reminder' : 'Enable reminder'
            }
            accessibilityRole='switch'
            ios_backgroundColor={colors.border}
            testID='reminder-toggle'
            thumbColor={colors.text.inverse}
            trackColor={{ false: colors.border, true: colors.primary[600] }}
            value={reminder.enabled}
            onValueChange={reminder.onToggle}
          />
        }
      />
    </View>
  );
}
