import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { Card, CardHeader, CardContent } from '../Card';

describe('Card Component', () => {
  describe('Card', () => {
    it('renders children correctly', () => {
      const { getByText } = render(
        <Card>
          <Text>Test Content</Text>
        </Card>
      );
      expect(getByText('Test Content')).toBeTruthy();
    });

    it('renders as a View component', () => {
      const { UNSAFE_root } = render(
        <Card testID="test-card">
          <Text>Test</Text>
        </Card>
      );
      const views = UNSAFE_root.findAllByType(View);
      expect(views.length).toBeGreaterThan(0);
    });

    it('accepts custom className prop', () => {
      const { getByTestId } = render(
        <Card testID="custom-card" className="custom-class">
          <Text>Test</Text>
        </Card>
      );
      const card = getByTestId('custom-card');
      expect(card).toBeTruthy();
      // className prop should be present even if not applied in test env
      expect(card.props.className).toBeDefined();
    });

    it('accepts custom style prop', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(
        <Card testID="styled-card" style={customStyle}>
          <Text>Test</Text>
        </Card>
      );
      const card = getByTestId('styled-card');
      expect(card.props.style).toEqual(customStyle);
    });

    it('forwards other View props', () => {
      const { getByTestId, getByLabelText } = render(
        <Card testID="custom-card" accessibilityLabel="Test Card">
          <Text>Test</Text>
        </Card>
      );

      expect(getByTestId('custom-card')).toBeTruthy();
      expect(getByLabelText('Test Card')).toBeTruthy();
    });

    it('can be composed with multiple children', () => {
      const { getByText } = render(
        <Card>
          <Text>First Child</Text>
          <Text>Second Child</Text>
        </Card>
      );

      expect(getByText('First Child')).toBeTruthy();
      expect(getByText('Second Child')).toBeTruthy();
    });
  });

  describe('CardHeader', () => {
    it('renders children correctly', () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <Text>Header Content</Text>
          </CardHeader>
        </Card>
      );
      expect(getByText('Header Content')).toBeTruthy();
    });

    it('renders as a View component', () => {
      const { UNSAFE_root } = render(
        <Card>
          <CardHeader testID="test-header">
            <Text>Header</Text>
          </CardHeader>
        </Card>
      );
      const views = UNSAFE_root.findAllByType(View);
      // Should have both Card and CardHeader Views
      expect(views.length).toBeGreaterThanOrEqual(2);
    });

    it('accepts custom className prop', () => {
      const { getByTestId } = render(
        <Card>
          <CardHeader testID="custom-header" className="custom-header">
            <Text>Header</Text>
          </CardHeader>
        </Card>
      );
      const header = getByTestId('custom-header');
      expect(header).toBeTruthy();
      expect(header.props.className).toBeDefined();
    });

    it('accepts custom style prop', () => {
      const customStyle = { paddingVertical: 20 };
      const { getByTestId } = render(
        <Card>
          <CardHeader testID="styled-header" style={customStyle}>
            <Text>Header</Text>
          </CardHeader>
        </Card>
      );
      const header = getByTestId('styled-header');
      expect(header.props.style).toEqual(customStyle);
    });

    it('can contain multiple children', () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <Text>Title</Text>
            <Text>Subtitle</Text>
          </CardHeader>
        </Card>
      );

      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Subtitle')).toBeTruthy();
    });
  });

  describe('CardContent', () => {
    it('renders children correctly', () => {
      const { getByText } = render(
        <Card>
          <CardContent>
            <Text>Content Text</Text>
          </CardContent>
        </Card>
      );
      expect(getByText('Content Text')).toBeTruthy();
    });

    it('renders as a View component', () => {
      const { UNSAFE_root } = render(
        <Card>
          <CardContent testID="test-content">
            <Text>Content</Text>
          </CardContent>
        </Card>
      );
      const views = UNSAFE_root.findAllByType(View);
      // Should have both Card and CardContent Views
      expect(views.length).toBeGreaterThanOrEqual(2);
    });

    it('accepts custom className prop', () => {
      const { getByTestId } = render(
        <Card>
          <CardContent testID="custom-content" className="custom-content">
            <Text>Content</Text>
          </CardContent>
        </Card>
      );
      const content = getByTestId('custom-content');
      expect(content).toBeTruthy();
      expect(content.props.className).toBeDefined();
    });

    it('accepts custom style prop', () => {
      const customStyle = { padding: 20 };
      const { getByTestId } = render(
        <Card>
          <CardContent testID="styled-content" style={customStyle}>
            <Text>Content</Text>
          </CardContent>
        </Card>
      );
      const content = getByTestId('styled-content');
      expect(content.props.style).toEqual(customStyle);
    });

    it('can contain complex children', () => {
      const { getByText } = render(
        <Card>
          <CardContent>
            <View>
              <Text>Nested Content</Text>
            </View>
          </CardContent>
        </Card>
      );

      expect(getByText('Nested Content')).toBeTruthy();
    });
  });

  describe('Card Composition', () => {
    it('renders complete card with header and content', () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <Text>Card Title</Text>
          </CardHeader>
          <CardContent>
            <Text>Card Body</Text>
          </CardContent>
        </Card>
      );

      expect(getByText('Card Title')).toBeTruthy();
      expect(getByText('Card Body')).toBeTruthy();
    });

    it('maintains proper component hierarchy', () => {
      const { getByTestId } = render(
        <Card testID="main-card">
          <CardHeader testID="header-section">
            <Text>Title</Text>
          </CardHeader>
          <CardContent testID="content-section">
            <Text>Body</Text>
          </CardContent>
        </Card>
      );

      expect(getByTestId('main-card')).toBeTruthy();
      expect(getByTestId('header-section')).toBeTruthy();
      expect(getByTestId('content-section')).toBeTruthy();
    });

    it('supports multiple content sections', () => {
      const { getByText } = render(
        <Card>
          <CardContent>
            <Text>First Section</Text>
          </CardContent>
          <CardContent>
            <Text>Second Section</Text>
          </CardContent>
        </Card>
      );

      expect(getByText('First Section')).toBeTruthy();
      expect(getByText('Second Section')).toBeTruthy();
    });

    it('supports header-only cards', () => {
      const { getByText, queryByText } = render(
        <Card>
          <CardHeader>
            <Text>Header Only</Text>
          </CardHeader>
        </Card>
      );

      expect(getByText('Header Only')).toBeTruthy();
    });

    it('supports content-only cards', () => {
      const { getByText } = render(
        <Card>
          <CardContent>
            <Text>Content Only</Text>
          </CardContent>
        </Card>
      );

      expect(getByText('Content Only')).toBeTruthy();
    });
  });

  describe('NativeWind Integration', () => {
    it('Card accepts className prop for NativeWind', () => {
      const { getByTestId } = render(
        <Card testID="nw-card" className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <Text>Test</Text>
        </Card>
      );

      const card = getByTestId('nw-card');
      expect(card.props.className).toBeTruthy();
    });

    it('CardHeader accepts className prop for NativeWind', () => {
      const { getByTestId } = render(
        <Card>
          <CardHeader testID="nw-header" className="p-4 border-b border-slate-200">
            <Text>Header</Text>
          </CardHeader>
        </Card>
      );

      const header = getByTestId('nw-header');
      expect(header.props.className).toBeTruthy();
    });

    it('CardContent accepts className prop for NativeWind', () => {
      const { getByTestId } = render(
        <Card>
          <CardContent testID="nw-content" className="p-4">
            <Text>Content</Text>
          </CardContent>
        </Card>
      );

      const content = getByTestId('nw-content');
      expect(content.props.className).toBeTruthy();
    });

    it('merges custom className with base classes', () => {
      const { getByTestId } = render(
        <Card testID="merged-card" className="custom-class">
          <Text>Test</Text>
        </Card>
      );

      const card = getByTestId('merged-card');
      // In NativeWind, className prop should be present
      expect(card.props.className).toBeTruthy();
    });
  });

  describe('Interface Compatibility', () => {
    it('maintains ViewProps interface for Card', () => {
      const { getByTestId } = render(
        <Card
          testID="card-test"
          accessible={true}
          accessibilityLabel="Test Card"
          accessibilityRole="button"
        >
          <Text>Test</Text>
        </Card>
      );

      const card = getByTestId('card-test');
      expect(card.props.accessible).toBe(true);
      expect(card.props.accessibilityLabel).toBe('Test Card');
      expect(card.props.accessibilityRole).toBe('button');
    });

    it('maintains ViewProps interface for CardHeader', () => {
      const { getByTestId } = render(
        <Card>
          <CardHeader
            testID="header-test"
            accessibilityLabel="Test Header"
          >
            <Text>Header</Text>
          </CardHeader>
        </Card>
      );

      const header = getByTestId('header-test');
      expect(header.props.accessibilityLabel).toBe('Test Header');
    });

    it('maintains ViewProps interface for CardContent', () => {
      const { getByTestId } = render(
        <Card>
          <CardContent
            testID="content-test"
            accessibilityLabel="Test Content"
          >
            <Text>Content</Text>
          </CardContent>
        </Card>
      );

      const content = getByTestId('content-test');
      expect(content.props.accessibilityLabel).toBe('Test Content');
    });

    it('supports all standard View event handlers', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Card testID="interactive-card" onTouchEnd={onPress}>
          <Text>Test</Text>
        </Card>
      );

      const card = getByTestId('interactive-card');
      expect(card.props.onTouchEnd).toBe(onPress);
    });
  });

  describe('Real-world Usage Scenarios', () => {
    it('works as a habit card container', () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <Text>Morning Exercise</Text>
          </CardHeader>
          <CardContent>
            <Text>Streak: 5 days</Text>
          </CardContent>
        </Card>
      );

      expect(getByText('Morning Exercise')).toBeTruthy();
      expect(getByText('Streak: 5 days')).toBeTruthy();
    });

    it('supports styled habit cards with custom classes', () => {
      const { getByTestId } = render(
        <Card testID="habit-card" className="mb-4">
          <CardHeader className="pb-2">
            <Text>Reading</Text>
          </CardHeader>
          <CardContent className="pt-2">
            <Text>30 minutes daily</Text>
          </CardContent>
        </Card>
      );

      expect(getByTestId('habit-card')).toBeTruthy();
    });
  });
});
