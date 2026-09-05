/**
 * Props for the Daily reminder row inside the "More to customize" panel.
 * Owned by the reminder phase; the section only forwards this bundle.
 */
import type { RefObject } from 'react';
import type { View } from 'react-native';

export interface ReminderRowProps {
  enabled: boolean;
  reminderTime: Date;
  onToggle: (enabled: boolean) => void;
  onTimeChange: (time: Date) => void;
  /**
   * Create-flow only: snap the seeded fallback time to the nearest preset the
   * first time the reminder is enabled.
   */
  snapDefaultToPresetOnEnable?: boolean;
  /** Attached to the row's outer View so parents can scroll it into view. */
  sectionRef?: RefObject<View | null>;
}

export interface ReminderRowLayoutProps {
  reminder: ReminderRowProps;
  /** True when this row is the open row of the panel. */
  open: boolean;
  onToggleOpen: () => void;
  divided: boolean;
}
