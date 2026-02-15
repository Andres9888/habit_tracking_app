/**
 * Metric Card Tests
 * Tests for the metric display card component.
 */

import React from 'react';

import { render } from '@testing-library/react-native';

import { MetricCard } from '../components/MetricCard';

describe('MetricCard', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { root } = render(
        <MetricCard label='Test' value='100' status='good' />
      );
      expect(root).toBeTruthy();
    });

    it('displays label text', () => {
      const { getByText } = render(
        <MetricCard label='FPS' value='60' status='good' />
      );
      expect(getByText('FPS')).toBeDefined();
    });

    it('displays value text', () => {
      const { getByText } = render(
        <MetricCard label='FPS' value='60' status='good' />
      );
      expect(getByText('60')).toBeDefined();
    });
  });

  describe('Value types', () => {
    it('displays numeric value', () => {
      const { getByText } = render(
        <MetricCard label='Count' value={42} status='good' />
      );
      expect(getByText('42')).toBeDefined();
    });

    it('displays string value', () => {
      const { getByText } = render(
        <MetricCard label='Memory' value='150 MB' status='warning' />
      );
      expect(getByText('150 MB')).toBeDefined();
    });
  });

  describe('Status integration', () => {
    it('renders with good status', () => {
      const { root } = render(
        <MetricCard label='Test' value='OK' status='good' />
      );
      expect(root).toBeTruthy();
    });

    it('renders with warning status', () => {
      const { root } = render(
        <MetricCard label='Test' value='High' status='warning' />
      );
      expect(root).toBeTruthy();
    });

    it('renders with critical status', () => {
      const { root } = render(
        <MetricCard label='Test' value='Error' status='critical' />
      );
      expect(root).toBeTruthy();
    });
  });

  describe('Subtitle', () => {
    it('renders subtitle when provided', () => {
      const { getByText } = render(
        <MetricCard label='FPS' value='60' status='good' subtitle='Avg: 58' />
      );
      expect(getByText('Avg: 58')).toBeDefined();
    });

    it('does not render subtitle when not provided', () => {
      const { queryByText } = render(
        <MetricCard label='FPS' value='60' status='good' />
      );
      // No subtitle text should be present
      expect(queryByText('Avg:')).toBeNull();
    });
  });
});
