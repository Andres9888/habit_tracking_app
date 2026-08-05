/**
 * PackConfirmSheet migration tests
 * Verifies the component uses the shared Modal with bottomSheet variant
 * and renders pack content correctly.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PackConfirmSheet } from '../../../src/components/PackConfirmSheet';
import type { PremiumPack } from '../../../src/screens/TemplatesScreen/data/premiumPacks';

// Capture Modal props to verify variant and dismiss behavior
let lastModalProps: Record<string, unknown> = {};

jest.mock('../../../src/components/Modal', () => {
  const { View } = require('react-native');
  function MockModal(props: Record<string, unknown>) {
    lastModalProps = props;
    return props.visible ? <View testID="shared-modal">{props.children as React.ReactNode}</View> : null;
  }
  MockModal.displayName = 'MockModal';
  return { __esModule: true, default: MockModal, Modal: MockModal };
});

const TEST_PACK: PremiumPack = {
  backgroundGradient: ['#7C3AED', '#4F46E5'],
  description: 'Test pack description',
  emojiGroup: ['🎯'],
  habits: [
    { emoji: '🌅', frequency: 'Daily', name: 'Morning Sunlight' },
    { emoji: '🧊', frequency: '3x/week', name: 'Cold Exposure' },
  ],
  id: 'test-pack',
  name: 'Test Pack',
};

describe('PackConfirmSheet', () => {
  const defaultProps = {
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
    pack: TEST_PACK,
    visible: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    lastModalProps = {};
  });

  it('uses the shared Modal with bottomSheet variant', () => {
    render(<PackConfirmSheet {...defaultProps} />);
    expect(lastModalProps.variant).toBe('bottomSheet');
  });

  it('passes visible and onClose to Modal', () => {
    render(<PackConfirmSheet {...defaultProps} />);
    expect(lastModalProps.visible).toBe(true);
    expect(lastModalProps.onClose).toBe(defaultProps.onCancel);
  });

  it('renders pack name and habit count', () => {
    const { getByText } = render(<PackConfirmSheet {...defaultProps} />);
    expect(getByText('Test Pack')).toBeTruthy();
    expect(getByText('2 habits will be added')).toBeTruthy();
  });

  it('renders all habit rows with emoji and name', () => {
    const { getByText, getByTestId } = render(<PackConfirmSheet {...defaultProps} />);
    expect(getByText('🌅')).toBeTruthy();
    expect(getByText('Morning Sunlight')).toBeTruthy();
    expect(getByText('🧊')).toBeTruthy();
    expect(getByText('Cold Exposure')).toBeTruthy();
    expect(getByTestId('templates-pack-confirm-item-0')).toBeTruthy();
    expect(getByTestId('templates-pack-confirm-item-1')).toBeTruthy();
  });

  it('calls onCancel when Cancel button is pressed', () => {
    const { getByTestId } = render(<PackConfirmSheet {...defaultProps} />);
    fireEvent.press(getByTestId('templates-pack-confirm-cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Add All button is pressed', () => {
    const { getByTestId } = render(<PackConfirmSheet {...defaultProps} />);
    fireEvent.press(getByTestId('templates-pack-confirm-add-all'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('returns null when pack is null', () => {
    const { queryByTestId } = render(
      <PackConfirmSheet {...defaultProps} pack={null} />,
    );
    expect(queryByTestId('templates-pack-confirm')).toBeNull();
  });

  it('renders nothing when visible is false', () => {
    const { queryByTestId } = render(
      <PackConfirmSheet {...defaultProps} visible={false} />,
    );
    expect(queryByTestId('templates-pack-confirm')).toBeNull();
  });

  it('does not import Modal from react-native directly', () => {
    // Structural verification: the component file should import Modal from shared, not RN
    const fs = require('fs');
    const source = fs.readFileSync(
      require.resolve('../../../src/components/PackConfirmSheet/PackConfirmSheet.tsx'),
      'utf8',
    );
    // Ensure Modal is NOT in the react-native import (StyleSheet, Text, View are fine)
    expect(source).not.toMatch(/import\s*\{[^}]*\bModal\b[^}]*\}\s*from\s*['"]react-native['"]/);
    // Ensure Modal is imported from the shared component
    expect(source).toMatch(/from ['"]\.\.\/Modal['"]/);
  });
});
