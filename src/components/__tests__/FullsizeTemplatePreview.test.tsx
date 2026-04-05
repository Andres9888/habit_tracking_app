/**
 * FullsizeTemplatePreview Component Tests
 *
 * Phase 4 Testing Tasks:
 * - Task 4.1: Manual testing verification (component renders correctly)
 * - Task 4.2: Test with various template data (long names, missing research)
 * - Task 4.3: Verify haptic feedback works correctly
 *
 * Tests accessibility, edge cases, and interaction handlers
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Linking } from 'react-native';
import * as Haptics from 'expo-haptics';

import FullsizeTemplatePreview from '../FullsizeTemplatePreview';
import type { Doc, Id } from '../../../convex/_generated/dataModel';

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Pressable, Text } = require('react-native');

  const AnimatedView = React.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) => {
    return React.createElement(View, { ...props, ref });
  });
  AnimatedView.displayName = 'AnimatedView';

  const AnimatedText = React.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) => {
    return React.createElement(Text, { ...props, ref });
  });
  AnimatedText.displayName = 'AnimatedText';

  const createAnimatedComponent = (Component: React.ComponentType<Record<string, unknown>>) => {
    const AnimatedComponent = React.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) => {
      return React.createElement(Component, { ...props, ref });
    });
    AnimatedComponent.displayName = `Animated(${Component.displayName || Component.name || 'Component'})`;
    return AnimatedComponent;
  };

  const Animated = {
    View: AnimatedView,
    Text: AnimatedText,
    createAnimatedComponent,
  };

  return {
    ...Animated,
    default: Animated,
    useAnimatedStyle: () => ({}),
    useSharedValue: (initial: number) => ({ value: initial }),
    withSpring: (value: number) => value,
    withDelay: (_delay: number, value: number) => value,
    withSequence: (...values: number[]) => values[0],
    withTiming: (value: number) => value,
    withRepeat: (value: number) => value,
    Easing: {
      out: () => (x: number) => x,
      inOut: () => (x: number) => x,
      ease: (x: number) => x,
    },
    interpolate: () => 0,
    runOnJS: (fn: Function) => fn,
  };
});

// Mock react-native-confetti-cannon
jest.mock('react-native-confetti-cannon', () => {
  const React = require('react');
  return React.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) => {
    React.useImperativeHandle(ref, () => ({
      start: jest.fn(),
    }));
    return null;
  });
});

// Mock Modal component
jest.mock('../Modal', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockModal({ children, visible }: { children: React.ReactNode; visible: boolean }) {
    if (!visible) return null;
    return React.createElement(View, { testID: 'modal' }, children);
  };
});

// Mock Button component
jest.mock('../Button/Button', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return function MockButton({ children, onPress, testID }: unknown) {
    return React.createElement(
      Pressable,
      { onPress, testID },
      React.createElement(Text, null, children)
    );
  };
});

// Mock useAppTheme
jest.mock('../../theme', () => ({
  useAppTheme: () => ({
    custom: {
      fontFamilies: {
        primary: {
          text: 'System',
        },
      },
    },
  }),
}));

// Mock useReduceMotion
jest.mock('../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => false),
}));

// Mock Linking - we need to use spyOn since Linking is part of react-native
const mockCanOpenURL = jest.fn(() => Promise.resolve(true));
const mockOpenURL = jest.fn(() => Promise.resolve());

beforeEach(() => {
  // Reset and set up Linking mocks
  jest.spyOn(Linking, 'canOpenURL').mockImplementation(mockCanOpenURL);
  jest.spyOn(Linking, 'openURL').mockImplementation(mockOpenURL);
});

// Helper to create mock template
const createMockTemplate = (
  overrides: Partial<Doc<'templates'>> = {}
): Doc<'templates'> => ({
  _id: 'template123' as Id<'templates'>,
  _creationTime: Date.now(),
  name: 'Morning Meditation',
  description: 'Start your day with 5 minutes of mindful breathing.',
  icon: '🧘',
  iconColor: '#10B981',
  category: 'mindfulness',
  frequency: 'daily',
  scientificReference: 'Morning meditation reduces cortisol by 23%.',
  createdAt: Date.now(),
  ...overrides,
});

describe('FullsizeTemplatePreview', () => {
  const mockOnClose = jest.fn();
  const mockOnImport = jest.fn();
  const mockOnCustomize = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders nothing when template is null', () => {
      const { queryByTestId } = render(
        <FullsizeTemplatePreview
          template={null}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(queryByTestId('modal')).toBeNull();
    });

    it('renders nothing when not visible', () => {
      const template = createMockTemplate();
      const { queryByTestId } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={false}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(queryByTestId('modal')).toBeNull();
    });

    it('renders modal when visible with template', () => {
      const template = createMockTemplate();
      const { getByTestId, getByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(getByTestId('modal')).toBeTruthy();
      expect(getByText('Morning Meditation')).toBeTruthy();
    });

    it('displays template icon', () => {
      const template = createMockTemplate({ icon: '🏃' });
      const { getByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(getByText('🏃')).toBeTruthy();
    });

    it('displays template description', () => {
      const template = createMockTemplate({
        description: 'A unique test description for testing.',
      });
      const { getByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(getByText('A unique test description for testing.')).toBeTruthy();
    });
  });

  describe('Task 4.2: Edge Cases - Long Names and Missing Research', () => {
    it('handles very long template names', () => {
      const longName =
        'This is an extremely long habit template name that might overflow and cause layout issues in the UI';
      const template = createMockTemplate({ name: longName });

      const { getByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(getByText(longName)).toBeTruthy();
    });

    it('handles long description text', () => {
      const longDescription =
        'This is an extremely long description that spans multiple lines and tests the ability of the component to handle overflow text properly. It includes various details about the habit, its benefits, and scientific backing. The description continues with more information about why this habit is beneficial and how it can improve your daily life. Adding even more text to ensure we test very long content scenarios that might occur with real-world data.';
      const template = createMockTemplate({ description: longDescription });

      const { getByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(getByText(longDescription)).toBeTruthy();
    });

    it('handles missing iconColor with default', () => {
      const template = createMockTemplate({
        iconColor: '',
      });

      const { getByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      // Component should still render with default color
      expect(getByText('Morning Meditation')).toBeTruthy();
    });

    it('handles special characters in template name', () => {
      const template = createMockTemplate({
        name: '🌅 Morning Routine & Self-Care (v2.0)',
      });

      const { getByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(getByText('🌅 Morning Routine & Self-Care (v2.0)')).toBeTruthy();
    });

    it('displays correct frequency label for daily', () => {
      const template = createMockTemplate({ frequency: 'daily' });

      const { getByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(getByText('Daily')).toBeTruthy();
    });

    it('displays correct frequency label for weekly', () => {
      const template = createMockTemplate({ frequency: 'weekly' });

      const { getByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(getByText('Weekly')).toBeTruthy();
    });

    it('displays correct category label', () => {
      const template = createMockTemplate({ category: 'health_fitness' });

      const { getByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(getByText('Health & Fitness')).toBeTruthy();
    });

    it('handles andrew_huberman category', () => {
      const template = createMockTemplate({ category: 'andrew_huberman' });

      const { getByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(getByText('Andrew Huberman')).toBeTruthy();
    });
  });

  describe('Task 4.3: Haptic Feedback', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('triggers light haptic on close button press', () => {
      const template = createMockTemplate();
      const { getByLabelText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      const closeButton = getByLabelText('Close preview');
      fireEvent.press(closeButton);

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('triggers medium haptic on import button press', () => {
      const template = createMockTemplate();
      const { getByLabelText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      const importButton = getByLabelText(/Import.*habit/i);
      fireEvent.press(importButton);

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
      expect(mockOnImport).toHaveBeenCalledWith(template._id);
    });

    it('triggers light haptic on customize button press', () => {
      const template = createMockTemplate();
      const { getByLabelText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      const customizeButton = getByLabelText('Customize habit before importing');
      fireEvent.press(customizeButton);

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
      expect(mockOnCustomize).toHaveBeenCalledWith(template);
    });

    it('does not trigger haptic when reduced motion is enabled', () => {
      // Re-mock useReduceMotion to return true
      const useReduceMotionMock = require('../../hooks/useReduceMotion');
      useReduceMotionMock.useReduceMotion.mockReturnValue(true);

      const template = createMockTemplate();
      const { getByLabelText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      const closeButton = getByLabelText('Close preview');
      fireEvent.press(closeButton);

      expect(Haptics.impactAsync).not.toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();

      // Reset mock
      useReduceMotionMock.useReduceMotion.mockReturnValue(false);
    });
  });

  describe('Import States', () => {
    it('shows loading state when isImporting is true', () => {
      const template = createMockTemplate();
      const { getByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
          isImporting={true}
        />
      );

      expect(getByText('Importing...')).toBeTruthy();
    });

    it('shows success state when isImported is true', () => {
      const template = createMockTemplate();
      const { getByText, queryByText, queryByLabelText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
          isImported={true}
        />
      );

      expect(getByText('Added!')).toBeTruthy();
      // The import button should not be shown (it's replaced with success button)
      expect(queryByLabelText(/Import.*habit/i)).toBeNull();
      // Customize link should be hidden in success state
      expect(queryByLabelText('Customize habit before importing')).toBeNull();
    });

    it('does not call onImport when already importing', () => {
      const template = createMockTemplate();
      const { getByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
          isImporting={true}
        />
      );

      const importButton = getByText('Importing...');
      fireEvent.press(importButton);

      expect(mockOnImport).not.toHaveBeenCalled();
    });

    it('does not show import button when already imported', () => {
      const template = createMockTemplate();
      const { getByText, queryByLabelText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
          isImported={true}
        />
      );

      // In imported state, the button shows "Added!" - it's not pressable
      const successButton = getByText('Added!');
      expect(successButton).toBeTruthy();

      // There should be no import button
      expect(queryByLabelText(/Import.*habit/i)).toBeNull();

      // onImport should never have been called
      expect(mockOnImport).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has accessible close button', () => {
      const template = createMockTemplate();
      const { getByLabelText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      const closeButton = getByLabelText('Close preview');
      expect(closeButton.props.accessibilityRole).toBe('button');
      expect(closeButton.props.accessibilityHint).toBe(
        'Double tap to close this preview'
      );
    });

    it('has accessible import button with template name', () => {
      const template = createMockTemplate({ name: 'Daily Reading' });
      const { getByLabelText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      const importButton = getByLabelText('Import Daily Reading habit');
      expect(importButton.props.accessibilityRole).toBe('button');
    });

    it('has accessible customize button', () => {
      const template = createMockTemplate();
      const { getByLabelText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      const customizeButton = getByLabelText('Customize habit before importing');
      expect(customizeButton.props.accessibilityRole).toBe('button');
    });

  });

  describe('Tips for Success Section', () => {
    it('renders tips section when tips are provided', () => {
      const template = createMockTemplate();
      // Add tips to the template
      (template as unknown).tips = [
        'Start with just 2 minutes and gradually increase',
        'Practice at the same time each day',
        'Use a timer to stay focused',
      ];

      const { getByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(getByText('TIPS FOR SUCCESS')).toBeTruthy();
      expect(getByText('Start with just 2 minutes and gradually increase')).toBeTruthy();
      expect(getByText('Practice at the same time each day')).toBeTruthy();
      expect(getByText('Use a timer to stay focused')).toBeTruthy();
    });

    it('does not render tips section when tips array is empty', () => {
      const template = createMockTemplate();
      (template as unknown).tips = [];

      const { queryByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(queryByText('TIPS FOR SUCCESS')).toBeNull();
    });

    it('does not render tips section when tips is undefined', () => {
      const template = createMockTemplate();
      // tips is not set (undefined)

      const { queryByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(queryByText('TIPS FOR SUCCESS')).toBeNull();
    });

    it('renders numbered tips with correct order', () => {
      const template = createMockTemplate();
      (template as unknown).tips = ['First tip', 'Second tip'];

      const { getByText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(getByText('1')).toBeTruthy();
      expect(getByText('2')).toBeTruthy();
      expect(getByText('First tip')).toBeTruthy();
      expect(getByText('Second tip')).toBeTruthy();
    });

    it('has accessible tips section with count', () => {
      const template = createMockTemplate();
      (template as unknown).tips = ['Tip one', 'Tip two', 'Tip three'];

      const { getByLabelText } = render(
        <FullsizeTemplatePreview
          template={template}
          visible={true}
          onClose={mockOnClose}
          onImport={mockOnImport}
          onCustomize={mockOnCustomize}
        />
      );

      expect(getByLabelText('Tips for success: 3 tips available')).toBeTruthy();
    });
  });

  describe('Different Template Categories', () => {
    const categories = [
      { value: 'morning_routine', label: 'Morning Routine' },
      { value: 'health_fitness', label: 'Health & Fitness' },
      { value: 'productivity', label: 'Productivity' },
      { value: 'mindfulness', label: 'Mindfulness' },
      { value: 'learning', label: 'Learning' },
      { value: 'social', label: 'Social' },
      { value: 'financial', label: 'Financial' },
      { value: 'creativity', label: 'Creativity' },
      { value: 'sleep', label: 'Sleep' },
    ];

    categories.forEach(({ value, label }) => {
      it(`displays correct label for ${value} category`, () => {
        const template = createMockTemplate({
          category: value as Doc<'templates'>['category'],
        });

        const { getByText } = render(
          <FullsizeTemplatePreview
            template={template}
            visible={true}
            onClose={mockOnClose}
            onImport={mockOnImport}
            onCustomize={mockOnCustomize}
          />
        );

        expect(getByText(label)).toBeTruthy();
      });
    });
  });
});
