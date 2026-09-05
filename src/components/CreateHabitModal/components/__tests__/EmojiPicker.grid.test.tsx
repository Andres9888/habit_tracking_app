/**
 * EmojiPicker — grid layout (spec 2a §2)
 * 5-column square tiles: 9 suggested emojis + a dashed "+" tile that opens the
 * full emoji sheet.
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { EmojiPicker } from '../EmojiPicker';

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

const defaultProps = {
  habitName: '',
  layout: 'grid' as const,
  onSelect: jest.fn(),
  selectedEmoji: null,
};

describe('EmojiPicker - grid layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => jest.useRealTimers());

  it('renders 10 tiles — 9 emojis plus the browse tile', () => {
    const { getAllByRole } = render(<EmojiPicker {...defaultProps} />);
    const tiles = getAllByRole('button');
    expect(tiles).toHaveLength(10);
  });

  it('sizes tiles as exact squares from the measured container width', () => {
    const { getByTestId } = render(<EmojiPicker {...defaultProps} />);
    act(() => {
      fireEvent(getByTestId('emoji-tile-grid'), 'layout', {
        nativeEvent: { layout: { height: 100, width: 332 } },
      });
    });
    // (332 - 4 gaps * 8) / 5 = 60
    const tile = getByTestId('emoji-browse-tile');
    expect(tile.props.style).toEqual(
      expect.objectContaining({ borderStyle: 'dashed', height: 60, width: 60 })
    );
  });

  it('opens the emoji sheet from the "+" tile when no onBrowse is given', () => {
    const { getByTestId, queryByTestId } = render(
      <EmojiPicker {...defaultProps} />
    );
    expect(queryByTestId('emoji-sheet')).toBeNull();
    fireEvent.press(getByTestId('emoji-browse-tile'));
    expect(getByTestId('emoji-sheet')).toBeTruthy();
  });

  it('delegates the "+" tile to onBrowse when provided', () => {
    const onBrowse = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <EmojiPicker {...defaultProps} onBrowse={onBrowse} />
    );
    fireEvent.press(getByTestId('emoji-browse-tile'));
    expect(onBrowse).toHaveBeenCalledTimes(1);
    expect(queryByTestId('emoji-sheet')).toBeNull();
  });

  it('selects an emoji from a grid tile', () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(
      <EmojiPicker {...defaultProps} onSelect={onSelect} />
    );
    fireEvent.press(getByLabelText('Select emoji 🎯'));
    expect(onSelect).toHaveBeenCalledWith('🎯');
  });
});
