import { lazy, Suspense, type ReactNode } from 'react';
import { View } from 'react-native';
import { DEFAULT_SETTINGS } from '../../../../convex/settings/types';
import { SettingsModalSkeleton } from '../../SkeletonLoader';
import { SettingsHeader } from '../SettingsHeader';
import { SettingsContent } from '../SettingsContent';
import type { HabitSortMode } from '../../../features/habits/types';
import { buildSettingsContentProps } from './SettingsMainView.helpers';
import type { SettingsMainViewProps } from './SettingsMainView.types';

const ArchivedHabitsModal = lazy(() => import('../../ArchivedHabitsModal'));
const AccountPage = lazy(() =>
  import('../AccountPage').then((m) => ({ default: m.AccountPage }))
);
const CalendarLookPage = lazy(() =>
  import('../CalendarLookPage').then((m) => ({ default: m.CalendarLookPage }))
);

function SecondaryViewFallback() {
  return (
    <View className='flex-1' testID='settings-secondary-view-fallback'>
      <SettingsModalSkeleton reduceMotion />
    </View>
  );
}

export function renderSettingsMainViewContent(
  props: SettingsMainViewProps,
  handleSortSelect: (mode: HabitSortMode) => void
): ReactNode {
  switch (props.view) {
    case 'archived': {
      return (
        <Suspense fallback={<SecondaryViewFallback />}>
          <ArchivedHabitsModal
            onBack={() => props.setView('settings')}
            onClose={props.handleClose}
          />
        </Suspense>
      );
    }
    case 'account': {
      return (
        <Suspense fallback={<SecondaryViewFallback />}>
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
        <Suspense fallback={<SecondaryViewFallback />}>
          <CalendarLookPage
            compactView={props.compactView}
            dayShape={props.dayShape ?? DEFAULT_SETTINGS.dayShape}
            habitCompletionIcon={
              props.habitCompletionIcon ?? DEFAULT_SETTINGS.habitCompletionIcon
            }
            connectorStyle={props.connectorStyle}
            showGradientFill={props.showGradientFill}
            stickyCalendarHeader={
              props.stickyCalendarHeader ??
              DEFAULT_SETTINGS.stickyCalendarHeader
            }
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
