/** Open body of the Daily reminder row: banner · chips · wheel · helper. */
import { View } from 'react-native';
import { HelperLine } from '../panel/HelperLine';
import { InlineTimeWheel } from './InlineTimeWheel';
import { ReminderChips } from './ReminderChips';
import { ReminderPermissionBanner } from './ReminderPermissionBanner';
import type { useReminderRow } from './useReminderRow';

const HELPER_PRESET = 'ONE NOTIFICATION A DAY. CHANGE OR TURN OFF ANYTIME.';
const HELPER_WHEEL = 'SAVES AS YOU SCROLL. NO CONFIRM STEP.';

interface Props {
  row: ReturnType<typeof useReminderRow>;
  reminderTime: Date;
}

export function ReminderRowBody({ row, reminderTime }: Props) {
  const denied = row.permissionDenied;

  return (
    <View>
      {denied ? <ReminderPermissionBanner /> : null}
      <View style={{ marginTop: denied ? 10 : 0 }}>
        <ReminderChips
          customLabel={row.customLabel}
          customSelected={row.customSelected}
          disabled={denied}
          selectedPreset={row.selectedPreset}
          onCustomPress={row.handleCustom}
          onPresetPress={row.handlePreset}
        />
      </View>
      {row.wheelOpen ? (
        <InlineTimeWheel
          time={reminderTime}
          onChange={row.handleWheelChange}
        />
      ) : null}
      {denied ? null : (
        <HelperLine>{row.wheelOpen ? HELPER_WHEEL : HELPER_PRESET}</HelperLine>
      )}
    </View>
  );
}
