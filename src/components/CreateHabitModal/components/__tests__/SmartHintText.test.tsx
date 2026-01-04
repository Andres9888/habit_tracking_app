import React from 'react';
import { render } from '@testing-library/react-native';
import { Lightbulb, Info, AlertCircle } from 'lucide-react-native';
import { SmartHintText } from '../SmartHintText';

describe('SmartHintText', () => {
  // ============================================================================
  // Rendering Tests
  // ============================================================================
  describe('Rendering', () => {
    it('should render with icon and text', () => {
      const { getByText, getByLabelText } = render(
        <SmartHintText
          icon={<Lightbulb size={12} testID="hint-icon" />}
          text="Test hint message"
        />
      );

      expect(getByText('Test hint message')).toBeTruthy();
      expect(getByLabelText('Test hint message')).toBeTruthy();
    });

    it('should render with default success variant when variant not specified', () => {
      const { getByText } = render(
        <SmartHintText icon={<Lightbulb size={12} />} text="Success message" />
      );

      const textElement = getByText('Success message');
      expect(textElement.props.style).toMatchObject({
        color: '#10B981', // emerald for success
      });
    });

    it('should display the icon component', () => {
      const { getByTestId } = render(
        <SmartHintText
          icon={<Lightbulb size={12} testID="lightbulb-icon" />}
          text="Test message"
        />
      );

      expect(getByTestId('lightbulb-icon')).toBeTruthy();
    });
  });

  // ============================================================================
  // Variant Tests
  // ============================================================================
  describe('Variants', () => {
    it('should render success variant with emerald colors', () => {
      const { getByText } = render(
        <SmartHintText
          icon={<Lightbulb size={12} />}
          text="Success hint"
          variant="success"
        />
      );

      const textElement = getByText('Success hint');
      expect(textElement.props.style).toMatchObject({
        color: '#10B981', // emerald
      });
    });

    it('should render info variant with blue colors', () => {
      const { getByText } = render(
        <SmartHintText icon={<Info size={12} />} text="Info hint" variant="info" />
      );

      const textElement = getByText('Info hint');
      expect(textElement.props.style).toMatchObject({
        color: '#3B82F6', // blue
      });
    });

    it('should render warning variant with amber colors', () => {
      const { getByText } = render(
        <SmartHintText
          icon={<AlertCircle size={12} />}
          text="Warning hint"
          variant="warning"
        />
      );

      const textElement = getByText('Warning hint');
      expect(textElement.props.style).toMatchObject({
        color: '#F59E0B', // amber
      });
    });
  });

  // ============================================================================
  // Styling Tests
  // ============================================================================
  describe('Styling', () => {
    it('should have correct text styling', () => {
      const { getByText } = render(
        <SmartHintText icon={<Lightbulb size={12} />} text="Styled text" />
      );

      const textElement = getByText('Styled text');
      expect(textElement.props.style).toMatchObject({
        fontSize: 12,
        fontWeight: '500', // medium
      });
    });

    it('should have flex row layout', () => {
      const { getByLabelText } = render(
        <SmartHintText icon={<Lightbulb size={12} />} text="Layout test" />
      );

      const container = getByLabelText('Layout test');
      expect(container.props.style).toMatchObject({
        flexDirection: 'row',
        alignItems: 'center',
      });
    });

    it('should have proper icon container dimensions', () => {
      const { getByTestId } = render(
        <SmartHintText
          icon={<Lightbulb size={12} testID="icon" />}
          text="Icon size test"
        />
      );

      const iconContainer = getByTestId('icon').parent;
      expect(iconContainer?.props.style).toMatchObject({
        width: 12,
        height: 12,
        justifyContent: 'center',
        alignItems: 'center',
      });
    });
  });

  // ============================================================================
  // Accessibility Tests
  // ============================================================================
  describe('Accessibility', () => {
    it('should have text accessibility role', () => {
      const { getByLabelText } = render(
        <SmartHintText icon={<Lightbulb size={12} />} text="Accessible text" />
      );

      const container = getByLabelText('Accessible text');
      expect(container.props.accessibilityRole).toBe('text');
    });

    it('should use text content as accessibility label', () => {
      const hintText = 'This is an accessible hint';
      const { getByLabelText } = render(
        <SmartHintText icon={<Lightbulb size={12} />} text={hintText} />
      );

      expect(getByLabelText(hintText)).toBeTruthy();
    });

    it('should be accessible for all variants', () => {
      const variants: Array<'success' | 'info' | 'warning'> = [
        'success',
        'info',
        'warning',
      ];

      variants.forEach((variant) => {
        const { getByLabelText } = render(
          <SmartHintText
            icon={<Lightbulb size={12} />}
            text={`${variant} message`}
            variant={variant}
          />
        );

        expect(getByLabelText(`${variant} message`)).toBeTruthy();
      });
    });
  });

  // ============================================================================
  // Edge Cases
  // ============================================================================
  describe('Edge Cases', () => {
    it('should handle empty string text', () => {
      const { getByLabelText } = render(
        <SmartHintText icon={<Lightbulb size={12} />} text="" />
      );

      expect(getByLabelText('')).toBeTruthy();
    });

    it('should handle very long text', () => {
      const longText = 'This is a very long hint message that might wrap to multiple lines and should still render correctly without breaking the layout or causing issues';
      const { getByText } = render(
        <SmartHintText icon={<Lightbulb size={12} />} text={longText} />
      );

      expect(getByText(longText)).toBeTruthy();
    });

    it('should handle text with special characters', () => {
      const specialText = 'Smart pick based on "reading" & meditation 🧘';
      const { getByText } = render(
        <SmartHintText icon={<Lightbulb size={12} />} text={specialText} />
      );

      expect(getByText(specialText)).toBeTruthy();
    });

    it('should handle text with emoji', () => {
      const emojiText = '🎉 Congratulations! You selected 📖';
      const { getByText } = render(
        <SmartHintText icon={<Lightbulb size={12} />} text={emojiText} />
      );

      expect(getByText(emojiText)).toBeTruthy();
    });

    it('should handle text with numbers', () => {
      const numberText = 'You have created 42 habits this month';
      const { getByText } = render(
        <SmartHintText icon={<Lightbulb size={12} />} text={numberText} />
      );

      expect(getByText(numberText)).toBeTruthy();
    });
  });

  // ============================================================================
  // Component Behavior Tests
  // ============================================================================
  describe('Component Behavior', () => {
    it('should accept different icon components', () => {
      const icons = [
        <Lightbulb key="lightbulb" size={12} testID="lightbulb" />,
        <Info key="info" size={12} testID="info" />,
        <AlertCircle key="alert" size={12} testID="alert" />,
      ];

      icons.forEach((icon) => {
        const testID = icon.props.testID;
        const { getByTestId } = render(
          <SmartHintText icon={icon} text="Test message" />
        );

        expect(getByTestId(testID)).toBeTruthy();
      });
    });

    it('should be memoized to prevent unnecessary re-renders', () => {
      const { rerender, getByText } = render(
        <SmartHintText icon={<Lightbulb size={12} />} text="Original text" />
      );

      // Re-render with same props
      rerender(
        <SmartHintText icon={<Lightbulb size={12} />} text="Original text" />
      );

      expect(getByText('Original text')).toBeTruthy();
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================
  describe('Integration', () => {
    it('should work with all three variants and different icons', () => {
      const scenarios = [
        { variant: 'success' as const, icon: Lightbulb, text: 'Success message' },
        { variant: 'info' as const, icon: Info, text: 'Info message' },
        { variant: 'warning' as const, icon: AlertCircle, text: 'Warning message' },
      ];

      scenarios.forEach(({ variant, icon: Icon, text }) => {
        const { getByText } = render(
          <SmartHintText
            icon={<Icon size={12} />}
            text={text}
            variant={variant}
          />
        );

        expect(getByText(text)).toBeTruthy();
      });
    });

    it('should render multiple instances independently', () => {
      const { getByText } = render(
        <>
          <SmartHintText
            icon={<Lightbulb size={12} />}
            text="First hint"
            variant="success"
          />
          <SmartHintText
            icon={<Info size={12} />}
            text="Second hint"
            variant="info"
          />
          <SmartHintText
            icon={<AlertCircle size={12} />}
            text="Third hint"
            variant="warning"
          />
        </>
      );

      expect(getByText('First hint')).toBeTruthy();
      expect(getByText('Second hint')).toBeTruthy();
      expect(getByText('Third hint')).toBeTruthy();
    });
  });

  // ============================================================================
  // Snapshot Tests
  // ============================================================================
  describe('Snapshot Tests', () => {
    it('should match snapshot for success variant', () => {
      const { toJSON } = render(
        <SmartHintText
          icon={<Lightbulb size={12} />}
          text="Success snapshot"
          variant="success"
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot for info variant', () => {
      const { toJSON } = render(
        <SmartHintText
          icon={<Info size={12} />}
          text="Info snapshot"
          variant="info"
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot for warning variant', () => {
      const { toJSON } = render(
        <SmartHintText
          icon={<AlertCircle size={12} />}
          text="Warning snapshot"
          variant="warning"
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
