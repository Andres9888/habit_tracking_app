/**
 * Type Declarations for reanimated-color-picker
 *
 * Provides TypeScript types for the color picker library.
 * The library lacks official type definitions, so we define them here.
 *
 * @see https://github.com/alabsi91/reanimated-color-picker
 */

declare module 'reanimated-color-picker' {
  import type { ComponentType } from 'react';
  import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

  export interface ColorPickerValue {
    hex: string;
    rgb: { r: number; g: number; b: number; a: number };
    hsv: { h: number; s: number; v: number; a: number };
    hsl: { h: number; s: number; l: number; a: number };
  }

  export interface ColorPickerProps extends ViewProps {
    value?: string;
    onChange?: (color: ColorPickerValue) => void;
    onComplete?: (color: ColorPickerValue) => void;
    style?: StyleProp<ViewStyle>;
  }

  const ColorPicker: ComponentType<ColorPickerProps>;
  export default ColorPicker;

  export interface PreviewProps {
    style?: StyleProp<ViewStyle>;
  }

  export const Preview: ComponentType<PreviewProps>;
  export const PreviewText: ComponentType<PreviewProps>;
  export const Panel1: ComponentType<PreviewProps>;

  export interface BrightnessSliderProps {
    style?: StyleProp<ViewStyle>;
  }

  export const BrightnessSlider: ComponentType<BrightnessSliderProps>;

  export interface SwatchesProps {
    colors?: string[];
    style?: StyleProp<ViewStyle>;
    swatchStyle?: StyleProp<ViewStyle>;
    onSelect?: (color: string) => void;
  }

  export const Swatches: ComponentType<SwatchesProps>;
}

declare module '*.css';
