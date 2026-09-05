/**
 * CustomizeFields — spec 2a icon/colour block.
 * Caps section labels, the BROWSE ALL action, the 5-col grid and the colour row.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CustomizeFields } from '../CustomizeFields';
import { HABIT_COLORS } from '../../constants';

jest.mock('../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
    triggerSelection: jest.fn(),
  }),
}));

jest.mock('../../../EmojiPickerV2', () => {
  const { View } = require('react-native');
  return {
    EmojiPickerSheet: ({ visible }: { visible: boolean }) =>
      visible ? <View testID='emoji-sheet' /> : null,
  };
});

const props = {
  colors: HABIT_COLORS,
  emojiQueryName: '',
  isEmojiLocked: false,
  onColorSelect: jest.fn(),
  onEmojiSelect: jest.fn(),
  selectedColor: HABIT_COLORS[3],
  selectedEmoji: null,
};

describe('CustomizeFields', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => jest.useRealTimers());

  it('renders the ICON and COLOR section labels', () => {
    const { getByText } = render(<CustomizeFields {...props} />);
    expect(getByText('ICON')).toBeTruthy();
    expect(getByText('COLOR')).toBeTruthy();
  });

  it('opens the emoji sheet from the BROWSE ALL action', () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <CustomizeFields {...props} />
    );
    expect(queryByTestId('emoji-sheet')).toBeNull();
    fireEvent.press(getByText('BROWSE ALL'));
    expect(getByTestId('emoji-sheet')).toBeTruthy();
  });

  it('opens the emoji sheet from the "+" tile', () => {
    const { getByTestId } = render(<CustomizeFields {...props} />);
    fireEvent.press(getByTestId('emoji-browse-tile'));
    expect(getByTestId('emoji-sheet')).toBeTruthy();
  });

  it('renders the single colour row and selects a colour', () => {
    const { getByTestId } = render(<CustomizeFields {...props} />);
    expect(getByTestId('color-picker-row')).toBeTruthy();
    fireEvent.press(getByTestId('color-swatch-EC4899'));
    expect(props.onColorSelect).toHaveBeenCalledWith('#EC4899');
  });
});
