/**
 * Empty state for filtered template list
 */

import { View } from 'react-native';
import Button from '../../../components/Button/Button';
import EmptyState from '../../../components/EmptyState';
import { useTemplatesStyles } from '../../templates/templatesScreenStyles';

interface TemplatesListEmptyProps {
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export function TemplatesListEmpty({
  hasActiveFilters,
  onResetFilters,
}: TemplatesListEmptyProps) {
  const styles = useTemplatesStyles();
  return (
    <View style={styles.emptyStateWrapper}>
      <EmptyState
        hideCTA
        description='Try adjusting filters or search keywords.'
        headline='No habits match your filters'
        icon='🔍'
      />
      {hasActiveFilters && (
        <Button
          size='medium'
          style={{ marginTop: 16 }}
          variant='secondary'
          onPress={onResetFilters}
        >
          Reset filters
        </Button>
      )}
    </View>
  );
}
