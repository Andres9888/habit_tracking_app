/**
 * StrengthChart EmptyState Component
 *
 * Shown when there isn't enough data to display the chart.
 */

import React from 'react';
import { Text, View } from 'react-native';

import { CHART_HEIGHT } from '../constants';

/**
 * Displays a message when chart has insufficient data.
 */
export const EmptyState = React.memo(function EmptyState() {
  return (
    <View
      accessibilityLabel='No strength history available yet'
      className='items-center justify-center'
      style={{ height: CHART_HEIGHT }}
    >
      <Text className='text-sm text-stone-400'>
        Complete more days to see your strength chart
      </Text>
    </View>
  );
});
