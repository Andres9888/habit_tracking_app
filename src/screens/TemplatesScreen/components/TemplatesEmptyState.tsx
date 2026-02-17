/**
 * Empty state with seed templates button
 */

import { View } from 'react-native';
import Button from '../../../components/Button/Button';
import EmptyState from '../../../components/EmptyState';
import { useTemplatesStyles } from '../../templates/templatesScreenStyles';

interface TemplatesEmptyStateProps {
  isSeeding: boolean;
  onSeedTemplates: () => void;
}

export function TemplatesEmptyState({
  isSeeding,
  onSeedTemplates,
}: TemplatesEmptyStateProps) {
  const styles = useTemplatesStyles();
  return (
    <View style={styles.container}>
      <EmptyState
        hideCTA
        description='Tap the button below to load science-backed habits.'
        headline='No Habits Available'
        icon='📚'
      />
      <View style={{ marginTop: 24, paddingHorizontal: 24 }}>
        <Button
          disabled={isSeeding}
          size='large'
          variant='primary'
          onPress={onSeedTemplates}
        >
          {isSeeding ? 'Loading Habits...' : 'Load Habits'}
        </Button>
      </View>
    </View>
  );
}
