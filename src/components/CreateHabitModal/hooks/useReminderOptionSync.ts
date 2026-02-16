/**
 * useReminderOptionSync - Sync reminder option with related form states
 *
 * @description
 * When user selects a reminder preset (morning/midday/evening/none),
 * this hook updates multiple related form fields to stay in sync.
 *
 * @role State Synchronizer
 * This hook ensures consistency between:
 * - reminderOption (the user's selection)
 * - remindersEnabled (boolean flag)
 * - reminderTime (actual time for notification)
 * - dayPhase (Huberman phase for habit timing)
 *
 * @flow
 * User selects "Morning" →
 *   - remindersEnabled: true
 *   - reminderTime: 9:00 AM
 *   - dayPhase: "phase1_push"
 *
 * User selects "None" →
 *   - remindersEnabled: false
 *   - dayPhase: null
 *
 * @mapping Reminder Options to Phases
 * - 'morning' → 'phase1_push' (9:00 AM)
 * - 'midday' → 'phase2_pivot' (1:00 PM)
 * - 'evening' → 'phase3_pull' (6:00 PM)
 * - 'none' → null (no reminder)
 *
 * @see {@link ReminderOption} - Available preset options
 * @see {@link HubermanPhase} - Huberman protocol phases
 *
 * @module CreateHabitModal/hooks
 */

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
