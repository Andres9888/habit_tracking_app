import React from 'react';
import { ChainDayItem } from './ChainDayItem';
import type { CompletionIcon, DayShape } from './types';

interface ChainDayListProps {
  weekDateStrings: string[];
  isCompleted: (index: number) => boolean;
  isFutureDate: (index: number) => boolean;
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
  connectorColor: string;
  currentStreak: number;
  highContrastMode: boolean;
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

export function ChainDayList(props: ChainDayListProps) {
  return (
    <>
      {props.weekDateStrings.map((dateString, index) => {
        const completed = props.isCompleted(index);
        const disabled = props.isFutureDate(index);
        const isLastItem = index === props.weekDateStrings.length - 1;
        return (
          <ChainDayItem
            key={dateString}
            accentColor={props.accentColor ?? ''}
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
            activeBurst={props.activeBurst}
            celebrationsEnabled={props.celebrationsEnabled}
            completed={completed}
            completionIcon={props.completionIcon}
            connectorColor={props.connectorColor}
            currentStreak={props.currentStreak}
            dateString={dateString}
            disabled={disabled}
            highContrastMode={props.highContrastMode}
            isToday={props.isToday(index)}
            shape={props.shape}
            shouldReduceMotion={props.shouldReduceMotion}
            showConnector={
              props.showConnectors &&
              !isLastItem &&
              completed &&
              props.isCompleted(index + 1)
            }
            onBurstComplete={props.onBurstComplete}
            onPress={() =>
              props.handleToggleDay(dateString, completed, disabled, index)
            }
          />
        );
      })}
    </>
  );
}
