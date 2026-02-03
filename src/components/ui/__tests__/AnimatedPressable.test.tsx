/**
 * AnimatedPressable Component Tests
 */

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { AnimatedPressable } from '../AnimatedPressable';

describe('AnimatedPressable', () => {
  it('should render children', () => {
    const { getByText } = render(
      <AnimatedPressable>
        <Text>Press me</Text>
      </AnimatedPressable>
    );

    expect(getByText('Press me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AnimatedPressable onPress={onPress}>
        <Text>Press me</Text>
      </AnimatedPressable>
    );

    fireEvent.press(getByText('Press me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should call onPressIn and onPressOut', () => {
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();

    const { getByText } = render(
      <AnimatedPressable onPressIn={onPressIn} onPressOut={onPressOut}>
        <Text>Press me</Text>
      </AnimatedPressable>
    );

    const button = getByText('Press me');
    fireEvent(button, 'pressIn');
    expect(onPressIn).toHaveBeenCalledTimes(1);

    fireEvent(button, 'pressOut');
    expect(onPressOut).toHaveBeenCalledTimes(1);
  });

  it('should disable animation when disableAnimation is true', () => {
    const onPressIn = jest.fn();

    const { getByText } = render(
      <AnimatedPressable disableAnimation onPressIn={onPressIn}>
        <Text>Press me</Text>
      </AnimatedPressable>
    );

    fireEvent(getByText('Press me'), 'pressIn');
    expect(onPressIn).toHaveBeenCalledTimes(1);
  });

  it('should forward other Pressable props', () => {
    const { getByTestId } = render(
      <AnimatedPressable testID='my-button'>
        <Text>Press me</Text>
      </AnimatedPressable>
    );

    expect(getByTestId('my-button')).toBeTruthy();
  });

  it('should accept custom animation config', () => {
    const { getByText } = render(
      <AnimatedPressable animationConfig={{ pressScale: 0.9 }}>
        <Text>Press me</Text>
      </AnimatedPressable>
    );

    expect(getByText('Press me')).toBeTruthy();
  });
});
