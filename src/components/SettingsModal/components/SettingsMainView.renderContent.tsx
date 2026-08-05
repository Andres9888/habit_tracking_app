import type { ReactNode } from 'react';
import ArchivedHabitsModal from '../../ArchivedHabitsModal';
import { SettingsModalSkeleton } from '../../SkeletonLoader';
import { SettingsHeader } from '../SettingsHeader';
import { AccountPage } from '../AccountPage';
import { CalendarLookPage } from '../CalendarLookPage';
import { SettingsContent } from '../SettingsContent';
import type { HabitSortMode } from '../../../features/habits/types';
import { buildSettingsContentProps } from './SettingsMainView.helpers';
import type { SettingsMainViewProps } from './SettingsMainView.types';

export function renderSettingsMainViewContent(
  props: SettingsMainViewProps,
  handleSortSelect: (mode: HabitSortMode) => void
): ReactNode {
  switch (props.view) {
    case 'archived': {
      return (
        <ArchivedHabitsModal
          onBack={() => props.setView('settings')}
          onClose={props.handleClose}
        />
      );
    }
    case 'account': {
      return (
        <AccountPage
          isPremium={props.isPremium}
          onBack={() => props.setView('settings')}
          onClose={props.handleClose}
          onExportHabitsData={props.onExportHabitsData}
          onPremiumUpsell={props.onPremiumUpsell}
        />
      );
    }
    case 'calendar': {
      return (
        <CalendarLookPage
          compactView={props.compactView}
          dayShape={props.dayShape ?? 'square'}
          habitCompletionIcon={props.habitCompletionIcon ?? 'chain'}
          connectorStyle={props.connectorStyle}
          showGradientFill={props.showGradientFill}
          stickyCalendarHeader={props.stickyCalendarHeader ?? false}
          onBack={() => props.setView('settings')}
          onChangeConnectorStyle={props.setConnectorStyle}
          onChangeDayShape={props.onChangeDayShape ?? (() => {})}
          onChangeHabitCompletionIcon={
            props.onChangeHabitCompletionIcon ?? (() => {})
          }
          onChangeShowGradientFill={props.setShowGradientFill}
          onChangeStickyCalendarHeader={
            props.onChangeStickyCalendarHeader ?? (() => {})
          }
          onClose={props.handleClose}
        />
      );
    }
    case 'settings': {
      return props.isLoading ? (
        <SettingsModalSkeleton />
      ) : (
        <>
          <SettingsHeader onClose={props.handleClose} />
          <SettingsContent
            {...buildSettingsContentProps(props, handleSortSelect)}
          />
        </>
      );
    }
    default: {
      return null;
    }
  }
}
