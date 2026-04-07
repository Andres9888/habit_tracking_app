import React from 'react';
import { render } from '@testing-library/react-native';
import Animated from 'react-native-reanimated';

import { useTodayGlow } from '../hooks/useTodayGlow';

interface WrapperProps {
  isCurrentDay: boolean;
  isComplete: boolean;
  reduceMotion: boolean;
  isDark: boolean;
}

/** Thin test component — renders a View with the glow style */
function GlowCell(props: WrapperProps) {
  const glowStyle = useTodayGlow(props);
  return <Animated.View testID='cell' style={[glowStyle]} />;
}

const DEFAULT: WrapperProps = {
  isCurrentDay: true,
  isComplete: false,
  reduceMotion: false,
  isDark: false,
};

describe('useTodayGlow', () => {
  it('applies shadow style for today incomplete cell', () => {
    const { getByTestId } = render(<GlowCell {...DEFAULT} />);
    const cell = getByTestId('cell');
    const style = cell.props.style;
    const flat = Array.isArray(style) ? Object.assign({}, ...style) : style;
    expect(flat).toMatchObject({
      shadowColor: '#E8B94D',
      shadowRadius: 8,
      elevation: 4,
    });
  });

  it('uses dark shadow color when isDark is true', () => {
    const { getByTestId } = render(
      <GlowCell {...DEFAULT} isDark />
    );
    const flat = Object.assign(
      {},
      ...([].concat(getByTestId('cell').props.style))
    );
    expect(flat.shadowColor).toBe('#936A08');
  });

  it('returns empty style when not current day', () => {
    const { getByTestId } = render(
      <GlowCell {...DEFAULT} isCurrentDay={false} />
    );
    const flat = Object.assign(
      {},
      ...([].concat(getByTestId('cell').props.style))
    );
    expect(flat.shadowColor).toBeUndefined();
  });

  it('returns empty style when already complete', () => {
    const { getByTestId } = render(
      <GlowCell {...DEFAULT} isComplete />
    );
    const flat = Object.assign(
      {},
      ...([].concat(getByTestId('cell').props.style))
    );
    expect(flat.shadowColor).toBeUndefined();
  });

  it('returns empty style when reduceMotion is enabled', () => {
    const { getByTestId } = render(
      <GlowCell {...DEFAULT} reduceMotion />
    );
    const flat = Object.assign(
      {},
      ...([].concat(getByTestId('cell').props.style))
    );
    expect(flat.shadowColor).toBeUndefined();
  });

  it('renders without crashing for all-false props', () => {
    const { getByTestId } = render(
      <GlowCell
        isCurrentDay={false}
        isComplete={false}
        reduceMotion={false}
        isDark={false}
      />
    );
    expect(getByTestId('cell')).toBeTruthy();
  });
});
