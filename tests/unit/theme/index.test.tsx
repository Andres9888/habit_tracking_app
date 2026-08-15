/**
 * Theme integration — Paper + custom tokens
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import {
  theme,
  extendedTheme,
  useAppTheme,
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  componentSpacing,
} from '@/theme';

function TestComponent() {
  const appTheme = useAppTheme();
  return <Text testID='theme-test'>{appTheme.custom.colors.primary[500]}</Text>;
}

describe('Theme Integration', () => {
  it('exports theme modules and custom tokens', () => {
    expect(theme.colors).toBeDefined();
    expect(extendedTheme.custom.colors).toBe(colors);
    expect(extendedTheme.custom.typography).toBe(typography);
    expect(extendedTheme.custom.spacing).toBe(spacing);
    expect(borderRadius).toBeDefined();
    expect(shadows).toBeDefined();
    expect(componentSpacing).toBeDefined();
  });

  describe('React Native Paper', () => {
    it('maps brand and surface colors', () => {
      expect(theme.colors.primary).toBe('#10B981');
      expect(theme.colors.background).toBe('#F5F1ED');
      expect(theme.colors.surface).toBe('#EDEAE5');
      expect(theme.colors.secondary).toBe(colors.secondary[500]);
      expect(theme.colors.error).toBe(colors.error);
    });

    it('uses airy medium roundness', () => {
      expect(theme.roundness).toBe(borderRadius.medium);
      expect(theme.roundness).toBe(14);
    });

    it('maps MD3 type sizes to the current scale', () => {
      expect(theme.fonts.displayLarge.fontSize).toBe(34);
      expect(theme.fonts.displayMedium.fontSize).toBe(22);
      expect(theme.fonts.headlineLarge.fontSize).toBe(22);
      expect(theme.fonts.headlineMedium.fontSize).toBe(22);
      expect(theme.fonts.headlineSmall.fontSize).toBe(20);
      expect(theme.fonts.bodyLarge.fontSize).toBe(17);
      expect(theme.fonts.bodyMedium.fontSize).toBe(14);
      expect(theme.fonts.bodySmall.fontSize).toBe(13);
    });

    it('uses Literata / DMSans', () => {
      expect(theme.fonts.displayLarge.fontFamily).toBe('Literata');
      expect(theme.fonts.bodyLarge.fontFamily).toBe('DMSans');
    });
  });

  describe('useAppTheme', () => {
    it('exposes custom tokens through PaperProvider', () => {
      const result = render(
        <PaperProvider theme={extendedTheme}>
          <TestComponent />
        </PaperProvider>
      );
      expect(result.getByTestId('theme-test').props.children).toBe('#10B981');
    });
  });

  it('matches current semantic hex values', () => {
    expect(colors.primary[500]).toBe('#10B981');
    expect(colors.secondary[500]).toBe('#3B82F6');
    expect(colors.error).toBe('#B53030');
  });
});
