/** CalendarLookPage prop contract */
export interface CalendarLookPageProps {
  compactView: boolean;
  dayShape: 'circle' | 'square';
  habitCompletionIcon: 'chain' | 'checkbox';
  connectorStyle: 'none' | 'small' | 'full';
  showGradientFill: boolean;
  stickyCalendarHeader: boolean;
  onBack: () => void;
  onClose: () => void;
  onChangeConnectorStyle: (
    value: 'none' | 'small' | 'full'
  ) => void | Promise<void>;
  onChangeDayShape: (value: 'circle' | 'square') => void | Promise<void>;
  onChangeHabitCompletionIcon: (
    value: 'chain' | 'checkbox'
  ) => void | Promise<void>;
  onChangeShowGradientFill: (value: boolean) => void | Promise<void>;
  onChangeStickyCalendarHeader: (value: boolean) => void | Promise<void>;
}
