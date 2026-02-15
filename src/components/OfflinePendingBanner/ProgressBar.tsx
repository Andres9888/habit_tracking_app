
import React from 'react';
import { View } from 'react-native';

import type { ProcessingState } from '../OfflineQueueProcessor';
import { styles } from './OfflinePendingBanner.styles';

interface ProgressBarProps {
  isProcessing: boolean;
  processingState?: ProcessingState;
}

export function ProgressBar({
  isProcessing,
  processingState,
}: ProgressBarProps) {
  if (!isProcessing || !processingState) return null;

  return (
    <View style={styles.progressContainer}>
      <View
        style={[
          styles.progressBar,
          { width: `${processingState.progress * 100}%` },
        ]}
      />
    </View>
  );
}
