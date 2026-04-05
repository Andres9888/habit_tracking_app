/**
 * Empty state with seed templates button
 */

import { View } from 'react-native';
import Button from '../../../components/Button/Button';
import EmptyState from '../../../components/EmptyState';
import { styles } from '../../templates/templatesScreenStyles';

interface TemplatesEmptyStateProps {
  isSeeding: boolean;
  onSeedTemplates: () => void;
}

export function TemplatesEmptyState({
  isSeeding,
  onSeedTemplates,
}: TemplatesEmptyStateProps) {
  return (
    <View style={styles.container}>
      <EmptyState
        hideCTA
        description='Tap below to load the science-backed template library.'
        headline='No Templates Available'
        icon='📚'
      />
      <View style={{ marginTop: 24, paddingHorizontal: 24 }}>
        <Button
          disabled={isSeeding}
          size='large'
          variant='primary'
          onPress={onSeedTemplates}
        >
          {isSeeding ? 'Loading Templates...' : 'Load Templates'}
        </Button>
      </View>
    </View>
  );
}
