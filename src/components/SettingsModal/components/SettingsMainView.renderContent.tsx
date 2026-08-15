import { lazy, Suspense, type ReactNode } from 'react';
import { SettingsModalSkeleton } from '../../SkeletonLoader';
import { SettingsHeader } from '../SettingsHeader';
import { SettingsContent } from '../SettingsContent';
import { AccountPage } from '../AccountPage';
// Statically imported: every dependency (ChainDayItem, StrengthFillBackground,
// SettingsRow) already ships with the habit list, so lazy() bought no bundle
// win while costing a skeleton flash on the first open of the page.
import { CalendarLookPage } from '../CalendarLookPage';
import type { HabitSortMode } from '../../../features/habits/types';
import { buildSettingsContentProps } from './SettingsMainView.helpers';
import type { SettingsMainViewProps } from './SettingsMainView.types';

const ArchivedHabitsModal = lazy(() => import('../../ArchivedHabitsModal'));
const AnalyticsScreen = lazy(() => import('../../../screens/AnalyticsScreen'));

export function renderSettingsMainViewContent(
  props: SettingsMainViewProps,
  handleSortSelect: (mode: HabitSortMode) => void
): ReactNode {
  switch (props.view) {
    case 'analytics': {
      return (
        <Suspense fallback={<SettingsModalSkeleton />}>
          <AnalyticsScreen onBack={() => props.setView('settings')} />
        </Suspense>
      );
    }
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
        <AccountPage
          isPremium={props.isPremium}
          onBack={() => props.setView('settings')}
          onClose={props.handleClose}
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
