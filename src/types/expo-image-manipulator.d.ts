/**
 * Type declarations for expo-image-manipulator
 * This package provides image manipulation utilities for Expo apps
 */
declare module 'expo-image-manipulator' {
  export interface ImageResult {
    uri: string;
    width: number;
    height: number;
    base64?: string;
  }

  export interface Action {
    resize?: { width?: number; height?: number };
    rotate?: number;
    flip?: { horizontal?: boolean; vertical?: boolean };
    crop?: { originX: number; originY: number; width: number; height: number };
  }

  export interface SaveOptions {
    compress?: number;
    format?: 'jpeg' | 'png';
    base64?: boolean;
  }

  export interface ManipulateOptions {
    compress?: number;
    format?: 'jpeg' | 'png';
    base64?: boolean;
  }

  export function manipulateAsync(
    uri: string,
    actions?: Action[],
    saveOptions?: SaveOptions
  ): Promise<ImageResult>;

  export const FlipType: {
    Horizontal: 'horizontal';
    Vertical: 'vertical';
  };

  export const SaveFormat: {
    JPEG: 'jpeg';
    PNG: 'png';
  };
}
