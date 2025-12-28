/**
 * ThemePickerSheet Component
 *
 * A modal sheet for selecting grid themes for the CalendarHeatmap component.
 * Displays all available themes with visual previews and descriptions.
 */

import React, { useCallback, useMemo } from 'react';
import {
  AccessibilityInfo,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Check, Palette, X } from 'lucide-react-native';
import useHapticFeedback from '../../hooks/useHapticFeedback';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { GRID_THEMES, type GridTheme, type GridThemeName } from './types';

export interface ThemePickerSheetProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Currently selected theme name */
  selectedTheme: GridThemeName;
  /** Callback when a theme is selected */
  onSelectTheme: (theme: GridThemeName) => void;
  /** Callback when the modal is closed */
  onClose: () => void;
}

/**
 * Render a mini preview grid showing the theme's visual style
 * Shows a 3x3 grid of cells with theme colors
 */
function ThemePreviewGrid({ theme }: { theme: GridTheme }) {
  const cellSize = 12;
  const gap = theme.cellGap > 4 ? 3 : 2;

  // Calculate border radius from theme cell shape
  const getBorderRadius = (): number => {
    switch (theme.cellShape) {
      case 'rounded-none': {
        return 0;
      }
      case 'rounded-sm': {
        return 1;
      }
      case 'rounded-md': {
        return 2;
      }
      case 'rounded-lg': {
        return 3;
      }
      case 'rounded-full': {
        return cellSize / 2;
      }
      default: {
        return 1;
      }
    }
  };

  const borderRadius = getBorderRadius();

  // Pattern: 4 completed cells to show streak color progression
  const cells = [
    { filled: true, level: 1 },
    { filled: true, level: 2 },
    { filled: true, level: 3 },
    { filled: false, level: 0 },
    { filled: true, level: 4 },
    { filled: true, level: 2 },
    { filled: false, level: 0 },
    { filled: true, level: 1 },
    { filled: false, level: 0 },
  ];

  const getColor = (level: number): string => {
    switch (level) {
      case 1: {
        return theme.streakColors.level1;
      }
      case 2: {
        return theme.streakColors.level2;
      }
      case 3: {
        return theme.streakColors.level3;
      }
      case 4: {
        return theme.streakColors.level4;
      }
      default: {
        return theme.incompleteBackground;
      }
    }
  };

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap,
        width: cellSize * 3 + gap * 2,
      }}
    >
      {cells.map((cell, index) => (
        <View
          key={index}
          style={{
            backgroundColor: getColor(cell.level),
            borderColor: cell.filled
              ? 'transparent'
              : theme.incompleteBorder === 'none'
                ? 'transparent' // stone-300
                : '#d6d3d1',
            borderRadius,
            borderStyle:
              theme.incompleteBorder === 'dashed' ? 'dashed' : 'solid',
            borderWidth:
              theme.incompleteBorder !== 'none' && !cell.filled ? 1 : 0,
            height: cellSize,
            width: cellSize,
          }}
        />
      ))}
    </View>
  );
}

/**
 * Single theme option card with preview, name, and description
 */
function ThemeOption({
  theme,
  isSelected,
  onSelect,
  index,
  reduceMotion,
}: {
  theme: GridTheme;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
  reduceMotion: boolean;
}) {
  const staggerDelay = reduceMotion ? 0 : index * 50;

  return (
    <Animated.View
      entering={
        reduceMotion ? undefined : FadeInDown.delay(staggerDelay).springify()
      }
    >
      <Pressable
        accessibilityHint={
          isSelected ? 'Currently selected' : 'Double tap to select this theme'
        }
        accessibilityLabel={`${theme.name} theme. ${theme.description}`}
        accessibilityRole='radio'
        accessibilityState={{ selected: isSelected }}
        className={`flex-row items-center rounded-xl border-2 p-3 ${
          isSelected
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-stone-200 bg-white'
        }`}
        style={{ marginBottom: 12 }}
        onPress={onSelect}
      >
        {/* Theme Preview Grid */}
        <View
          className='mr-3 items-center justify-center rounded-lg p-2'
          style={{
            backgroundColor:
              theme.id === 'pixels' ? theme.incompleteBackground : '#f5f5f4',
          }}
        >
          <ThemePreviewGrid theme={theme} />
        </View>

        {/* Theme Info */}
        <View className='flex-1'>
          <Text className='text-base font-semibold text-stone-800'>
            {theme.name}
          </Text>
          <Text className='text-sm text-stone-500' numberOfLines={2}>
            {theme.description}
          </Text>
        </View>

        {/* Selected Indicator */}
        {isSelected && (
          <View className='ml-2 h-6 w-6 items-center justify-center rounded-full bg-emerald-500'>
            <Check color='#ffffff' size={14} strokeWidth={3} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

/**
 * ThemePickerSheet - Modal for selecting calendar heatmap themes
 *
 * Displays all available themes with visual previews and allows
 * the user to select their preferred theme. Selection is applied
 * immediately and the modal closes.
 *
 * @example
 * ```tsx
 * <ThemePickerSheet
 *   visible={showThemePicker}
 *   selectedTheme={currentTheme}
 *   onSelectTheme={(theme) => setCurrentTheme(theme)}
 *   onClose={() => setShowThemePicker(false)}
 * />
 * ```
 */
export function ThemePickerSheet({
  visible,
  selectedTheme,
  onSelectTheme,
  onClose,
}: ThemePickerSheetProps) {
  const { triggerSelection, triggerLightImpact } = useHapticFeedback();
  const reduceMotion = useReduceMotion();

  // Get sorted theme list - github first (default), then alphabetically
  const themeList = useMemo((): GridTheme[] => {
    const themes = Object.values(GRID_THEMES);
    return themes.sort((a, b) => {
      if (a.id === 'github') return -1;
      if (b.id === 'github') return 1;
      return a.name.localeCompare(b.name);
    });
  }, []);

  const handleSelectTheme = useCallback(
    (themeName: GridThemeName) => {
      if (themeName === selectedTheme) {
        // Already selected - just close
        onClose();
        return;
      }

      // Haptic feedback on selection
      triggerSelection();

      // Apply the theme
      onSelectTheme(themeName);

      // Get theme name for announcement
      const theme = GRID_THEMES[themeName];
      AccessibilityInfo.announceForAccessibility(
        `${theme.name} theme selected`
      );

      // Close the modal
      onClose();
    },
    [selectedTheme, onSelectTheme, onClose, triggerSelection]
  );

  const handleClose = useCallback(() => {
    triggerLightImpact();
    onClose();
  }, [onClose, triggerLightImpact]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      accessibilityViewIsModal
      transparent
      accessibilityLabel='Theme picker'
      animationType={reduceMotion ? 'none' : 'slide'}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className='flex-1 justify-end bg-black/50'>
        <Animated.View
          className='rounded-t-3xl bg-white px-4 pb-8 pt-5 shadow-2xl'
          entering={reduceMotion ? undefined : FadeIn.duration(200)}
        >
          {/* Header */}
          <View className='mb-4 flex-row items-center justify-between'>
            <View className='flex-row items-center gap-2'>
              <View className='h-8 w-8 items-center justify-center rounded-lg bg-emerald-100'>
                <Palette className='text-emerald-500' size={18} />
              </View>
              <Text
                accessibilityRole='header'
                className='text-lg font-semibold text-stone-800'
              >
                Choose Theme
              </Text>
            </View>

            <TouchableOpacity
              accessibilityHint='Closes the theme selection modal'
              accessibilityLabel='Close theme picker'
              accessibilityRole='button'
              className='h-8 w-8 items-center justify-center rounded-full bg-stone-100'
              hitSlop={{ bottom: 12, left: 12, right: 12, top: 12 }}
              onPress={handleClose}
            >
              <X className='text-stone-500' size={18} />
            </TouchableOpacity>
          </View>

          {/* Theme Options */}
          <View
            accessibilityLabel='Theme options'
            accessibilityRole='radiogroup'
          >
            {themeList.map((theme, index) => (
              <ThemeOption
                key={theme.id}
                index={index}
                isSelected={theme.id === selectedTheme}
                reduceMotion={reduceMotion}
                theme={theme}
                onSelect={() => handleSelectTheme(theme.id)}
              />
            ))}
          </View>

          {/* Footer hint */}
          <Text className='mt-2 text-center text-xs text-stone-400'>
            Theme is applied instantly to your calendar
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default ThemePickerSheet;
