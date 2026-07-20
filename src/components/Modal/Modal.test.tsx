import React from 'react';
import { Modal as RNModal, Text } from 'react-native';
import { render } from '@testing-library/react-native';

import { Modal } from './Modal';

describe('Modal warm mount', () => {
  it('renders hidden inert children before the native modal opens', () => {
    const screen = render(
      <Modal
        visible={false}
        warmMount
        respectReduceMotion={false}
        skipAnimation
        variant='centerAlert'
        onClose={() => {}}
      >
        <Text testID='warm-child'>Warm content</Text>
      </Modal>
    );

    screen.getByTestId('warm-child', {
      includeHiddenElements: true,
    });
    const host = screen.UNSAFE_getByProps({
      accessibilityElementsHidden: true,
    });

    expect(host.props).toMatchObject({
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no-hide-descendants',
      pointerEvents: 'none',
    });
    expect(screen.UNSAFE_queryByType(RNModal)).toBeNull();
  });

  it('switches from the hidden host to the native modal when opened', () => {
    const screen = render(
      <Modal
        visible={false}
        warmMount
        respectReduceMotion={false}
        skipAnimation
        variant='centerAlert'
        onClose={() => {}}
      >
        <Text>Warm content</Text>
      </Modal>
    );

    screen.rerender(
      <Modal
        visible
        warmMount={false}
        respectReduceMotion={false}
        skipAnimation
        variant='centerAlert'
        onClose={() => {}}
      >
        <Text>Warm content</Text>
      </Modal>
    );

    expect(screen.UNSAFE_getByType(RNModal)).toBeTruthy();
    expect(
      screen.UNSAFE_queryByProps({ accessibilityElementsHidden: true })
    ).toBeNull();
  });
});
