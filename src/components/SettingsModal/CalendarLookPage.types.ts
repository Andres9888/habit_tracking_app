/** CalendarLookPage prop contract */
export interface CalendarLookPageProps {
  compactView: boolean;
  dayShape: 'circle' | 'square';
  habitCompletionIcon: 'chain' | 'checkbox';
  showGradientFill: boolean;
  showStreakConnections: boolean;
  stickyCalendarHeader: boolean;
  onBack: () => void;
  onClose: () => void;
  onChangeDayShape: (value: 'circle' | 'square') => void | Promise<void>;
  onChangeHabitCompletionIcon: (
    value: 'chain' | 'checkbox'
  ) => void | Promise<void>;
  onChangeShowGradientFill: (value: boolean) => void | Promise<void>;
  onChangeShowStreakConnections: (value: boolean) => void | Promise<void>;
  onChangeStickyCalendarHeader: (value: boolean) => void | Promise<void>;
}
