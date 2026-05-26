/**
 * Empty state — auto-loads the habit library on first open when unseeded.
 */

import { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import EmptyState from '../../../components/EmptyState';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';

interface TemplatesEmptyStateProps {
  isSeeding: boolean;
  onSeedTemplates: () => void;
}

export function TemplatesEmptyState({
  isSeeding,
  onSeedTemplates,
}: TemplatesEmptyStateProps) {
  const { colors } = useThemeColors();
  const didRequestSeed = useRef(false);

  useEffect(() => {
    if (didRequestSeed.current || isSeeding) return;
    didRequestSeed.current = true;
    onSeedTemplates();
  }, [isSeeding, onSeedTemplates]);

  return (
    <View style={styles.container}>
      <EmptyState
        hideCTA
        description={
          isSeeding
            ? 'Loading science-backed habits for you…'
            : 'Preparing your habit library…'
        }
        headline='Setting up your Habit Library'
        icon='📚'
      />
      {isSeeding ? (
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <ActivityIndicator color={colors.primary[600]} size='large' />
        </View>
      ) : null}
    </View>
  );
}
