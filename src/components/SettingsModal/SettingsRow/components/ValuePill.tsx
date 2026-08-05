/** ValuePill — binds the shared `ui/Pill` to the settings-row colour set, so
 *  row call sites don't each have to know which tokens a value pill uses. */
import { Pill } from '../../../ui/Pill';
import type { SettingsRowColors } from '../SettingsRow.colors';

interface ValuePillProps {
  value: string;
  colors: SettingsRowColors;
}

export function ValuePill({ value, colors }: ValuePillProps) {
  return (
    <Pill
      backgroundColor={colors.valuePillBg}
      color={colors.valueText}
      label={value}
    />
  );
}
