import { useCallback } from 'react';
import type { HubermanPhase } from '../../../constants/hubermanPhases';
import {
  type ReminderOption,
  getReminderTimeForOption,
} from '../components/ReminderSelector';

interface ReminderStateSetter {
  setRemindersEnabled: (enabled: boolean) => void;
  setReminderTime: (time: Date) => void;
  setDayPhase: (phase: HubermanPhase | null) => void;
}

/**
 * Hook to sync reminder option with related states
 */
export function useReminderOptionSync(setters: ReminderStateSetter) {
  const { setRemindersEnabled, setReminderTime, setDayPhase } = setters;

  return useCallback(
    (option: ReminderOption) => {
      if (option === 'none') {
        setRemindersEnabled(false);
        setDayPhase(null);
      } else {
        setRemindersEnabled(true);
        const time = getReminderTimeForOption(option);
        if (time) {
          setReminderTime(time);
        }

        const phaseMap: Record<
          Exclude<ReminderOption, 'none'>,
          HubermanPhase
        > = {
          evening: 'phase3_pull',
          midday: 'phase2_pivot',
          morning: 'phase1_push',
        };
        setDayPhase(phaseMap[option]);
      }
    },
    [setRemindersEnabled, setReminderTime, setDayPhase]
  );
}
