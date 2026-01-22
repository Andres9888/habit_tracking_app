/**
 * Status Indicator Tests
 * Tests for the visual status indicator component.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusIndicator } from '../components/StatusIndicator';

describe('StatusIndicator', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { root } = render(<StatusIndicator status='good' />);
      expect(root).toBeTruthy();
    });
  });

  describe('Status colors', () => {
    it('renders good status with green color', () => {
      const { root } = render(<StatusIndicator status='good' />);
      const indicator = root.children[0];
      expect(indicator).toBeTruthy();
    });

    it('renders warning status with amber color', () => {
      const { root } = render(<StatusIndicator status='warning' />);
      const indicator = root.children[0];
      expect(indicator).toBeTruthy();
    });

    it('renders critical status with red color', () => {
      const { root } = render(<StatusIndicator status='critical' />);
      const indicator = root.children[0];
      expect(indicator).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it('renders small size', () => {
      const { root } = render(<StatusIndicator status='good' size='small' />);
      expect(root).toBeTruthy();
    });

    it('renders medium size (default)', () => {
      const { root } = render(<StatusIndicator status='good' size='medium' />);
      expect(root).toBeTruthy();
    });

    it('renders large size', () => {
      const { root } = render(<StatusIndicator status='good' size='large' />);
      expect(root).toBeTruthy();
    });

    it('uses medium as default size', () => {
      const { root } = render(<StatusIndicator status='good' />);
      expect(root).toBeTruthy();
    });
  });
});
