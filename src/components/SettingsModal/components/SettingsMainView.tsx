import { View } from 'react-native';
import ArchivedHabitsModal from '../../ArchivedHabitsModal';
import { SettingsModalSkeleton } from '../../SkeletonLoader';
import { SettingsHeader } from '../SettingsHeader';
import { AccountPage } from '../AccountPage';
import { SettingsContent } from '../SettingsContent';
import type { HabitSortMode } from '../../../features/habits/types';
import { buildSettingsContentProps } from './SettingsMainView.helpers';
import type { SettingsMainViewProps } from './SettingsMainView.types';

export function SettingsMainView(props: SettingsMainViewProps) {
  const handleSortSelect = (mode: HabitSortMode) => {
    void props.setHabitSortMode(mode);
  };

  if (props.view === 'archived') {
    return (
      <View
        className='flex-1'
        style={{ backgroundColor: props.colors.background }}
      >
        <ArchivedHabitsModal
          onBack={() => props.setView('settings')}
          onClose={props.handleClose}
        />
      </View>
    );
  }

  if (props.view === 'account') {
    return (
      <View
        className='flex-1'
        style={{ backgroundColor: props.colors.background }}
      >
        <AccountPage
          highContrastMode={props.isHighContrastActive}
          isPremium={props.isPremium}
          onBack={() => props.setView('settings')}
          onClose={props.handleClose}
          onPremiumUpsell={props.onPremiumUpsell}
        />
      </View>
    );
  }

  if (props.view !== 'settings') return null;

  return (
    <View
      className='flex-1'
      style={{ backgroundColor: props.colors.background }}
    >
      {props.isLoading ? (
        <SettingsModalSkeleton />
      ) : (
        <>
          <SettingsHeader colors={props.colors} onClose={props.handleClose} />
          <SettingsContent
            {...buildSettingsContentProps(props, handleSortSelect)}
          />
        </>
      )}
    </View>
  );
}
