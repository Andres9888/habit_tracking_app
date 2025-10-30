import React from 'react';
import { View } from 'react-native';
import { ChainLinkIcon } from '../ChainLinkIcon/ChainLinkIcon';

/**
 * ChainConnector - Visual connector between habit cards
 *
 * Displays a vertical line with a chain link icon to visually
 * connect consecutive habits in the list, creating a "chain" effect.
 *
 * Design:
 * - Height: 24px with negative margins to maintain original spacing
 * - Vertical line: 3px wide, slate-400 (#94a3b8)
 * - Chain icon: 16px, slate-600 (#475569) on white background
 * - White circle: 24px diameter with shadow
 */
export const ChainConnector: React.FC = () => {
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
          backgroundColor: '#94a3b8',
          height: '100%',
          position: 'absolute',
          width: 3, // slate-400
        }}
      />

      {/* Chain link icon with white circular background */}
      <View
        style={{
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: 12,
          elevation: 2,
          height: 24,
          justifyContent: 'center',

          // Ensure icon appears above the line
          shadowColor: '#000',

          shadowOffset: { height: 1, width: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          width: 24,
          zIndex: 1, // Android shadow
        }}
      >
        <ChainLinkIcon color='#475569' size={16} variant='stroke' />
      </View>
    </View>
  );
};
