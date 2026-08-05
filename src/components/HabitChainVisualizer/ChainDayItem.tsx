import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { SparkleBurst } from '../microinteractions/SparkleBurst';
import { DayConnector } from './DayConnector';
import { HabitDayToggle } from './HabitDayToggle';
import type { CompletionIcon, DayShape } from './types';

const styles = StyleSheet.create({
  connectorContainer: {
    height: 3,
    left: '50%',
    marginLeft: 20,
    marginTop: -1.5,
    position: 'absolute',
    right: -16,
    top: '50%',
    zIndex: -1,
  },
  dayConnector: {
    flex: 1,
  },
});

interface ChainDayItemProps {
  accentColor: string;
  activeBurst: string | null;
  celebrationsEnabled: boolean;
  completionIcon: CompletionIcon;
  completed: boolean;
  connectorColor: string;
  currentStreak: number;
  dateString: string;
  disabled: boolean;
  highContrastMode: boolean;
  isToday: boolean;
  onBurstComplete: () => void;
  onPress: () => void;
  shape: DayShape;
  shouldReduceMotion: boolean;
  showConnector: boolean;
  accessibilityHint: string;
  accessibilityLabel: string;
}

const ChainDayItemComponent: React.FC<ChainDayItemProps> = ({
  accentColor,
  activeBurst,
  celebrationsEnabled,
  completionIcon,
  completed,
  connectorColor,
  currentStreak,
  dateString,
  disabled,
  highContrastMode,
  isToday,
  onBurstComplete,
  onPress,
  shape,
  shouldReduceMotion,
  showConnector,
  accessibilityHint,
  accessibilityLabel,
}) => (
  <View className='relative flex-1 items-center'>
    <HabitDayToggle
      accentColor={accentColor}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      completed={completed}
      completionIcon={completionIcon}
      disabled={disabled}
      highContrastMode={highContrastMode}
      isToday={isToday}
      shape={shape}
      onPress={onPress}
    />
    <SparkleBurst
      color={accentColor}
      isActive={activeBurst === dateString && celebrationsEnabled}
      reduceMotion={shouldReduceMotion}
      onComplete={onBurstComplete}
    />
    {showConnector ? <View pointerEvents='none' style={styles.connectorContainer}>
        <DayConnector
          visible
          accentColor={accentColor}
          baseColor={connectorColor}
          currentStreak={currentStreak}
          style={styles.dayConnector}
        />
      </View> : null}
  </View>
);

export const ChainDayItem = memo(ChainDayItemComponent);
