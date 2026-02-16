import React from 'react';
import { View } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import { shadows } from '../../theme/spacing';
import { ChainLinkIcon } from '../ChainLinkIcon/ChainLinkIcon';

/**
 * ChainConnector - Visual connector between habit cards
 *
 * Displays a vertical line with a chain link icon to visually
 * connect consecutive habits in the list, creating a "chain" effect.
 *
 * Design:
 * - Height: 24px with negative margins to maintain original spacing
 * - Vertical line: 3px wide, stone-400 (#a8a29e)
 * - Chain icon: 16px, stone-600 (#57534e) on white background
 * - White circle: 24px diameter with shadow
 */
export const ChainConnector: React.FC = () => {
  const { colors: themeColors } = useThemeColors();
  return (
    <View
      style={{
        alignItems: 'center',
        height: 24,
        justifyContent: 'center',
        marginVertical: -4, // Negative margin to maintain original gap-4 spacing
      }}
    >
      {/* Vertical connecting line */}
      <View
        style={{
          backgroundColor: themeColors.gray[300],
          height: '100%',
          position: 'absolute',
          width: 3, // stone-400
        }}
      />

      {/* Chain link icon with white circular background */}
      <View
        style={{
          ...shadows.subtle,
          alignItems: 'center',
          backgroundColor: themeColors.card,
          borderRadius: 12,
          height: 24,
          justifyContent: 'center',
          shadowOpacity: 0.1,
          width: 24,
          zIndex: 1, // Ensure icon appears above the line
        }}
      >
        <ChainLinkIcon color={themeColors.text.secondary} size={16} variant='stroke' />
      </View>
    </View>
  );
};
