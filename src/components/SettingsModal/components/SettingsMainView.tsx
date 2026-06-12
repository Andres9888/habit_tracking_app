import { View } from 'react-native';
import type { ReactNode } from 'react';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import ArchivedHabitsModal from '../../ArchivedHabitsModal';
import { SettingsModalSkeleton } from '../../SkeletonLoader';
import { SettingsHeader } from '../SettingsHeader';
import { AccountPage } from '../AccountPage';
import { SettingsContent } from '../SettingsContent';
import type { HabitSortMode } from '../../../features/habits/types';
import { buildSettingsContentProps } from './SettingsMainView.helpers';
import { getSettingsViewEntering } from './SettingsMainView.animations';
import type { SettingsMainViewProps } from './SettingsMainView.types';

export function SettingsMainView(props: SettingsMainViewProps) {
  const reduceMotion = useReducedMotion();
  const handleSortSelect = (mode: HabitSortMode) => {
    void props.setHabitSortMode(mode);
  };

  const entering = getSettingsViewEntering(
    props.view,
    props.viewDirection,
    reduceMotion
  );

  const backgroundStyle = { backgroundColor: props.colors.background };

  let content: ReactNode = null;

  switch (props.view) {
    case 'archived': {
      content = (
        <ArchivedHabitsModal
          onBack={() => props.setView('settings')}
          onClose={props.handleClose}
        />
      );
      break;
    }
    case 'account': {
      content = (
        <AccountPage
          isPremium={props.isPremium}
          onBack={() => props.setView('settings')}
          onClose={props.handleClose}
          onPremiumUpsell={props.onPremiumUpsell}
        />
      );
      break;
    }
    case 'settings': {
      content = props.isLoading ? (
        <SettingsModalSkeleton />
      ) : (
        <>
          <SettingsHeader colors={props.colors} onClose={props.handleClose} />
          <SettingsContent
            {...buildSettingsContentProps(props, handleSortSelect)}
          />
        </>
      );
      break;
    }
    default: {
      break;
    }
  }

  return (
    <View className='flex-1' style={backgroundStyle}>
      <Animated.View
        key={props.view}
        className='flex-1'
        entering={entering}
        style={backgroundStyle}
      >
        {content}
      </Animated.View>
    </View>
  );
}
