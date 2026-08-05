/** CalendarLookRows — the four appearance pickers, every one inline.
 *  Nothing here navigates away: each choice lands in the live preview above
 *  without leaving the page. */
import { Check, Circle, Droplets, Link2 } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { PickerStackRow } from '../PickerStackRow';
import { SegmentedTextPicker } from '../SegmentedTextPicker';
import { useThemeColors } from '../../../theme/ThemeContext';
import {
  CHAIN_STYLE_OPTIONS,
  COMPLETION_ICON_OPTIONS,
  DAY_FILL_OPTIONS,
  DAY_SHAPE_OPTIONS,
} from '../CalendarLookPage.constants';
import type { CalendarLookPageProps } from '../CalendarLookPage.types';

export function CalendarLookRows(p: CalendarLookPageProps) {
  const { settings } = useThemeColors();
  const size = iconSizes.small;
  const chainOptions = CHAIN_STYLE_OPTIONS[p.dayShape];
  // Square-only "Dots" can survive a switch back to circles — fall back to the
  // connector circles do support rather than showing nothing selected.
  const chainSelected = chainOptions.some((o) => o.key === p.connectorStyle)
    ? p.connectorStyle
    : 'full';

  return (
    <>
      <PickerStackRow
        icon={<Circle color={settings.dayMarker.icon} size={size} />}
        iconBackgroundColor={settings.dayMarker.bg}
        label='Day shape'
      >
        <SegmentedTextPicker
          groupLabel='Day shape'
          options={DAY_SHAPE_OPTIONS}
          selected={p.dayShape}
          onSelect={(v) => void p.onChangeDayShape(v)}
        />
      </PickerStackRow>
      <PickerStackRow
        icon={<Droplets color={settings.gradient.icon} size={size} />}
        iconBackgroundColor={settings.gradient.bg}
        label='Day fill'
      >
        <SegmentedTextPicker
          groupLabel='Day fill'
          options={DAY_FILL_OPTIONS}
          selected={p.showGradientFill ? 'gradient' : 'solid'}
          onSelect={(v) => void p.onChangeShowGradientFill(v === 'gradient')}
        />
      </PickerStackRow>
      <PickerStackRow
        icon={<Link2 color={settings.checkbox.icon} size={size} />}
        iconBackgroundColor={settings.checkbox.bg}
        label='Chain style'
      >
        <SegmentedTextPicker
          groupLabel='Chain style'
          options={chainOptions}
          selected={chainSelected}
          onSelect={(v) => void p.onChangeConnectorStyle(v)}
        />
      </PickerStackRow>
      <PickerStackRow
        icon={<Check color={settings.checkbox.icon} size={size} />}
        iconBackgroundColor={settings.checkbox.bg}
        label='Completion icon'
      >
        <SegmentedTextPicker
          groupLabel='Completion icon'
          options={COMPLETION_ICON_OPTIONS}
          selected={p.habitCompletionIcon}
          onSelect={(v) => void p.onChangeHabitCompletionIcon(v)}
        />
      </PickerStackRow>
    </>
  );
}
