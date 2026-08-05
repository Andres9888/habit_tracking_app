/**
 * HabitCardGridRow — Shared 5-column flex row for habit card header and strength bar.
 * Horizontal padding is owned by the parent (CardContent); this row has none.
 */

import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import {
  CARD_BAR_LEFT,
  CARD_BAR_RIGHT,
  CARD_TITLE_GAP,
} from './cardLayout.constants';

export interface HabitCardGridRowProps {
  alignItems?: 'center' | 'flex-start';
  className?: string;
  col1: React.ReactNode;
  col2?: React.ReactNode;
  col3?: React.ReactNode;
  col4?: React.ReactNode;
  col5?: React.ReactNode;
  /** Inline middle slot (cols 2–4). Use for header title so row height follows content. */
  middle?: React.ReactNode;
  /** Absolute middle overlay (cols 2–4). Use for strength bar track bounds. */
  middleOverlay?: React.ReactNode;
  /** Additional absolute overlay (e.g. progress bar track). */
  overlay?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const COL_CLASS = 'flex-1';

export function HabitCardGridRow({
  alignItems = 'center',
  className = '',
  col1,
  col2,
  col3,
  col4,
  col5,
  middle,
  middleOverlay,
  overlay,
  style,
}: HabitCardGridRowProps) {
  if (middle) {
    return (
      <View
        className={`relative flex-row ${className}`}
        style={[{ alignItems }, style]}
      >
        <View className={`${COL_CLASS} items-center justify-center`}>
          {col1}
        </View>
        <View
          className='justify-center'
          style={{ flex: 3, paddingLeft: CARD_TITLE_GAP }}
        >
          {middle}
        </View>
        <View className={`${COL_CLASS} items-center justify-center`}>
          {col5}
        </View>
        {overlay}
      </View>
    );
  }

  return (
    <View
      className={`relative flex-row ${className}`}
      style={[{ alignItems }, style]}
    >
      <View className={`${COL_CLASS} items-center justify-center`}>{col1}</View>
      <View className={COL_CLASS}>{col2}</View>
      <View className={COL_CLASS}>{col3}</View>
      <View className={COL_CLASS}>{col4}</View>
      <View className={`${COL_CLASS} items-center justify-center`}>{col5}</View>
      {middleOverlay ? (
        <View
          pointerEvents='box-none'
          style={{
            bottom: 0,
            justifyContent: 'center',
            left: CARD_BAR_LEFT,
            paddingLeft: CARD_TITLE_GAP,
            position: 'absolute',
            right: CARD_BAR_RIGHT,
            top: 0,
          }}
        >
          {middleOverlay}
        </View>
      ) : null}
      {overlay}
    </View>
  );
}
