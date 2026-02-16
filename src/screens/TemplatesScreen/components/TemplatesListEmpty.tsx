/**
 * Empty state for filtered template list
 */

import { View } from 'react-native';
import Button from '../../../components/Button/Button';
import EmptyState from '../../../components/EmptyState';
import { styles } from '../../templates/templatesScreenStyles';

interface TemplatesListEmptyProps {
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export function TemplatesListEmpty({
  hasActiveFilters,
  onResetFilters,
}: TemplatesListEmptyProps) {
  return (
    <View style={styles.emptyStateWrapper}>
      <EmptyState
        hideCTA
        description='Try different keywords, remove filters, or browse by category to find what you need.'
        headline='No habits found'
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
