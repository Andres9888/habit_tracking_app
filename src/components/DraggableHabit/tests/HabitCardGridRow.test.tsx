import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { HabitCardGridRow } from '../HabitCardGridRow';
import {
  CARD_ACCENT_WIDTH,
  CARD_BAR_LEFT,
  CARD_BAR_RIGHT,
  CARD_BORDER_WIDTH,
  CARD_CHAIN_PADDING_RIGHT,
  CARD_COLUMN_COUNT,
  CARD_HORIZONTAL_PADDING,
  CARD_ICON_SIZE,
  CARD_ICON_SIZE_COMPACT,
  HABITS_LIST_HORIZONTAL_PADDING,
  WEEK_STRIP_HORIZONTAL_PADDING,
  getCardIconSize,
} from '../cardLayout.constants';
import { getTitleColumnStyle } from '../CardHeader.styles';

describe('cardLayout.constants', () => {
  it('returns icon size matching compact mode', () => {
    expect(getCardIconSize(true)).toBe(CARD_ICON_SIZE_COMPACT);
    expect(getCardIconSize(false)).toBe(CARD_ICON_SIZE);
  });

  it('aligns chain row insets with calendar week strip', () => {
    expect(CARD_HORIZONTAL_PADDING).toBe(11);
    expect(CARD_CHAIN_PADDING_RIGHT).toBe(15);
    expect(
      HABITS_LIST_HORIZONTAL_PADDING +
        CARD_BORDER_WIDTH +
        CARD_ACCENT_WIDTH +
        CARD_HORIZONTAL_PADDING
    ).toBe(WEEK_STRIP_HORIZONTAL_PADDING);
    expect(
      HABITS_LIST_HORIZONTAL_PADDING +
        CARD_BORDER_WIDTH +
        CARD_CHAIN_PADDING_RIGHT
    ).toBe(WEEK_STRIP_HORIZONTAL_PADDING);
  });
});

describe('getTitleColumnStyle', () => {
  it('sets minHeight to emoji box size for centerline alignment', () => {
    expect(getTitleColumnStyle(false).minHeight).toBe(CARD_ICON_SIZE);
    expect(getTitleColumnStyle(true).minHeight).toBe(CARD_ICON_SIZE_COMPACT);
    expect(getTitleColumnStyle(false).justifyContent).toBe('center');
  });
});

describe('HabitCardGridRow', () => {
  it('renders five equal flex-1 columns', () => {
    const { UNSAFE_getAllByType } = render(
      <HabitCardGridRow col1={<Text>icon</Text>} col5={<Text>chevron</Text>} />
    );

    const flexRows = UNSAFE_getAllByType(View).filter((node) =>
      node.props.className?.includes('flex-1')
    );
    expect(flexRows).toHaveLength(CARD_COLUMN_COUNT);
  });

  it('positions middle overlay with symmetric bar bounds', () => {
    const { UNSAFE_getAllByType } = render(
      <HabitCardGridRow
        col1={<Text>icon</Text>}
        col5={<Text>percent</Text>}
        middleOverlay={<Text>bar</Text>}
      />
    );

    const overlay = UNSAFE_getAllByType(View).find(
      (node) =>
        node.props.style?.left === CARD_BAR_LEFT &&
        node.props.style?.right === CARD_BAR_RIGHT
    );
    expect(overlay).toBeTruthy();
  });

  it('renders inline middle slot with flex 3 for header title alignment', () => {
    const { UNSAFE_getAllByType } = render(
      <HabitCardGridRow
        col1={<Text>icon</Text>}
        col5={<Text>chevron</Text>}
        middle={<Text>title</Text>}
      />
    );

    const middleCol = UNSAFE_getAllByType(View).find(
      (node) => node.props.style?.flex === 3
    );
    expect(middleCol).toBeTruthy();
    const flexOnes = UNSAFE_getAllByType(View).filter((node) =>
      node.props.className?.includes('flex-1')
    );
    expect(flexOnes).toHaveLength(2);
  });

  it('renders no trailing column and middle flex 4 when col5 is omitted', () => {
    const { UNSAFE_getAllByType, queryByText } = render(
      <HabitCardGridRow col1={<Text>icon</Text>} middle={<Text>title</Text>} />
    );

    expect(queryByText('chevron')).toBeNull();
    const middleCol = UNSAFE_getAllByType(View).find(
      (node) => node.props.style?.flex === 4
    );
    expect(middleCol).toBeTruthy();
    const flexOnes = UNSAFE_getAllByType(View).filter((node) =>
      node.props.className?.includes('flex-1')
    );
    expect(flexOnes).toHaveLength(1);
  });
});
