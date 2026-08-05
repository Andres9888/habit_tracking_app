import React, { memo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { SparkleBurst } from '../microinteractions/SparkleBurst';
import { DayConnector } from './DayConnector';
import { HabitDayToggle } from './HabitDayToggle';
import type { ChainDayItemProps } from './ChainDayItem.types';

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
    width: '100%',
  },
});

const ChainDayItemComponent: React.FC<ChainDayItemProps> = ({
  accentColor,
  burstActive,
  completionIcon,
  completed,
  strengthPercent,
  dateString,
  disabled,
  index,
  isToday,
  missed,
  onBurstComplete,
  onToggle,
  shape,
  shouldReduceMotion,
  showConnector,
  accessibilityHint,
  accessibilityLabel,
}) => {
  // Built here rather than in ChainDayList so the parent doesn't hand every
  // sibling a fresh closure on each render, which voided this component's memo.
  const handlePress = useCallback(
    () => onToggle(dateString, completed, disabled, index),
    [onToggle, dateString, completed, disabled, index]
  );

  return (
    <View className='relative flex-1 items-center'>
      <HabitDayToggle
        accentColor={accentColor}
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        completed={completed}
        completionIcon={completionIcon}
        strengthPercent={strengthPercent}
        dateString={dateString}
        disabled={disabled}
        isToday={isToday}
        missed={missed}
        shape={shape}
        onPress={handlePress}
      />
      <SparkleBurst
        color={accentColor}
        isActive={burstActive}
        reduceMotion={shouldReduceMotion}
        onComplete={onBurstComplete}
      />
      {showConnector ? (
        <View pointerEvents='none' style={styles.connectorContainer}>
          <DayConnector
            visible
            accentColor={accentColor}
            strengthPercent={strengthPercent}
            style={styles.dayConnector}
          />
        </View>
      ) : null}
    </View>
  );
};

export const ChainDayItem = memo(ChainDayItemComponent);
