import React, { memo } from 'react';
import { ChainDayItem } from './ChainDayItem';
import type { CompletionIcon, DayShape } from './types';

interface ChainDayListProps {
  weekDateStrings: string[];
  isCompleted: (index: number) => boolean;
  isFutureDate: (index: number) => boolean;
  isStreakBreak: (index: number) => boolean;
  isToday: (index: number) => boolean;
  dateLabels: string[];
  todayLabel: string;
  activeBurst: string | null;
  handleToggleDay: (
    dateString: string,
    completed: boolean,
    disabled: boolean,
    index: number
  ) => void;
  onBurstComplete: () => void;
  accentColor?: string;
  celebrationsEnabled: boolean;
  completionIcon: CompletionIcon;
  strengthPercent: number;
  shape: DayShape;
  shouldReduceMotion: boolean;
  showConnectors: boolean;
}

function getAccessibilityLabel(
  dateLabel: string,
  todayLabel: string,
  completed: boolean
) {
  return dateLabel === todayLabel
    ? `Today, ${completed ? 'Completed' : 'Not completed'}`
    : `${dateLabel}: ${completed ? 'Completed' : 'Not completed'}`;
}

function ChainDayListComponent(props: ChainDayListProps) {
  const accent = props.accentColor ?? '';
  const lastIndex = props.weekDateStrings.length - 1;
  return (
    <>
      {props.weekDateStrings.map((dateString, index) => {
        const completed = props.isCompleted(index);
        const disabled = props.isFutureDate(index);
        const showConnector =
          props.showConnectors &&
          index !== lastIndex &&
          completed &&
          props.isCompleted(index + 1);
        return (
          <ChainDayItem
            key={index}
            accentColor={accent}
            accessibilityHint={
              disabled
                ? 'Future dates are unavailable'
                : `Tap to toggle completion for ${props.dateLabels[index]}`
            }
            accessibilityLabel={getAccessibilityLabel(
              props.dateLabels[index],
              props.todayLabel,
              completed
            )}
            burstActive={
              props.activeBurst === dateString
                ? props.celebrationsEnabled
                : false
            }
            completed={completed}
            completionIcon={props.completionIcon}
            strengthPercent={props.strengthPercent}
            dateString={dateString}
            disabled={disabled}
            index={index}
            isToday={props.isToday(index)}
            missed={props.isStreakBreak(index)}
            shape={props.shape}
            shouldReduceMotion={props.shouldReduceMotion}
            showConnector={showConnector}
            onBurstComplete={props.onBurstComplete}
            onToggle={props.handleToggleDay}
          />
        );
      })}
    </>
  );
}

export const ChainDayList = memo(ChainDayListComponent);
