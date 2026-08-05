import { lazy, Suspense, type ReactNode } from 'react';
import { SettingsModalSkeleton } from '../../SkeletonLoader';
import { SettingsHeader } from '../SettingsHeader';
import { SettingsContent } from '../SettingsContent';
import type { HabitSortMode } from '../../../features/habits/types';
import { buildSettingsContentProps } from './SettingsMainView.helpers';
import type { SettingsMainViewProps } from './SettingsMainView.types';

const ArchivedHabitsModal = lazy(() => import('../../ArchivedHabitsModal'));
const AccountPage = lazy(() =>
  import('../AccountPage').then((module) => ({ default: module.AccountPage }))
);
const CalendarLookPage = lazy(() =>
  import('../CalendarLookPage').then((module) => ({
    default: module.CalendarLookPage,
  }))
);

export function renderSettingsMainViewContent(
  props: SettingsMainViewProps,
  handleSortSelect: (mode: HabitSortMode) => void
): ReactNode {
  switch (props.view) {
    case 'archived': {
      return (
        <Suspense fallback={<SettingsModalSkeleton />}>
          <ArchivedHabitsModal
            onBack={() => props.setView('settings')}
            onClose={props.handleClose}
          />
        </Suspense>
      );
    }
    case 'account': {
      return (
        <Suspense fallback={<SettingsModalSkeleton />}>
          <AccountPage
            isPremium={props.isPremium}
            onBack={() => props.setView('settings')}
            onClose={props.handleClose}
            onPremiumUpsell={props.onPremiumUpsell}
          />
        </Suspense>
      );
    }
    case 'calendar': {
      return (
        <Suspense fallback={<SettingsModalSkeleton />}>
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
        </Suspense>
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
