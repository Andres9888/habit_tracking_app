/**
 * LoadingSkeleton Component Tests
 *
 * Tests for the loading skeleton component:
 * - Renders correct skeleton elements
 * - Has correct accessibility label
 * - Displays shimmer elements
 *
 * Reference: docs/specs/empty-habit-screen/ui-ux-improvements-spec.md (Task 2)
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { LoadingSkeleton } from '../LoadingSkeleton';
import { LoadingSkeleton as ExportedLoadingSkeleton } from '../index';

describe('LoadingSkeleton', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByLabelText } = render(<LoadingSkeleton />);
      expect(getByLabelText('Loading')).toBeDefined();
    });

    it('should have correct accessibility label', () => {
      const { getByLabelText } = render(<LoadingSkeleton />);
      const container = getByLabelText('Loading');
      expect(container).toBeDefined();
    });

    it('should have progressbar accessibility role', () => {
      const { getByLabelText } = render(<LoadingSkeleton />);
      const container = getByLabelText('Loading');
      expect(container.props.accessibilityRole).toBe('progressbar');
    });
  });

  describe('Skeleton Elements', () => {
    it('should render the skeleton container', () => {
      const { getByLabelText } = render(<LoadingSkeleton />);
      const container = getByLabelText('Loading');
      expect(container.children).toBeDefined();
    });

    it('should render multiple skeleton elements', () => {
      const { getByLabelText } = render(<LoadingSkeleton />);
      const container = getByLabelText('Loading');
      // Should have at least 5 direct children (hero, headline, input container, chips container, cta container)
      expect(container.children.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Layout', () => {
    it('should have centered container layout', () => {
      const { getByLabelText } = render(<LoadingSkeleton />);
      const container = getByLabelText('Loading');
      expect(container.props.style).toMatchObject({
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      });
    });

    it('should have horizontal padding matching main component', () => {
      const { getByLabelText } = render(<LoadingSkeleton />);
      const container = getByLabelText('Loading');
      expect(container.props.style.paddingHorizontal).toBe(24);
    });
  });

  describe('Acceptance Criteria (Task 2)', () => {
    it('✅ Renders skeleton elements matching layout (hero, headline, input, chips, CTA)', () => {
      const { getByLabelText } = render(<LoadingSkeleton />);
      const container = getByLabelText('Loading');
      // Container should have 5 direct children representing the layout elements
      expect(container.children.length).toBe(5);
    });

    it('✅ Includes accessibilityLabel="Loading"', () => {
      const { getByLabelText } = render(<LoadingSkeleton />);
      expect(getByLabelText('Loading')).toBeDefined();
    });

    it('✅ Component is exported from index.ts', () => {
      // Verify the export is available and matches the component
      expect(ExportedLoadingSkeleton).toBeDefined();
      expect(ExportedLoadingSkeleton).toBe(LoadingSkeleton);
    });
  });
});
