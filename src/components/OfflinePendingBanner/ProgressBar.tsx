import React from 'react';
import { View } from 'react-native';
import { useStyles } from './OfflinePendingBanner.styles';
import type { ProcessingState } from '../OfflineQueueProcessor';

interface ProgressBarProps {
  isProcessing: boolean;
  processingState?: ProcessingState;
}

export function ProgressBar({
  isProcessing,
  processingState,
}: ProgressBarProps) {
  const styles = useStyles();
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
