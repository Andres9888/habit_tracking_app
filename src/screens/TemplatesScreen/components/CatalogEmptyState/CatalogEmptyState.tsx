/**
 * CatalogEmptyState — what the catalog shows when a search returns nothing.
 *
 * Three shapes, because "no results" means three different things:
 *  - matches exist, just not in the selected category → point at them
 *  - nothing matches anywhere                        → offer to clear
 *  - no query at all, the shelf is genuinely empty   → offer to browse
 *
 * The first case is the one that matters: without it the user sits on a blank
 * list while the habit they searched for is one chip away.
 */

import { View } from 'react-native';
import Button from '../../../../components/Button/Button';
import EmptyState from '../../../../components/EmptyState';
import { spacing } from '../../../../theme/spacing';
import { styles as s } from './CatalogEmptyState.styles';

interface CatalogEmptyStateProps {
  /** Label of the selected category, absent when browsing "All". */
  categoryLabel?: string;
  /** Trimmed search query; empty string when not searching. */
  query: string;
  /** Addable matches across the whole catalog for the current query. */
  totalMatches: number;
  onClearSearch: () => void;
  onShowAll: () => void;
}

export function CatalogEmptyState({
  categoryLabel,
  query,
  totalMatches,
  onClearSearch,
  onShowAll,
}: CatalogEmptyStateProps) {
  const isFiltered = Boolean(categoryLabel);
  const hasMatchesElsewhere = query.length > 0 && totalMatches > 0 && isFiltered;

  if (hasMatchesElsewhere) {
    const noun = totalMatches === 1 ? 'match' : 'matches';
    return (
      <View style={s.wrap}>
        <EmptyState
          hideCTA
          description={`But there ${totalMatches === 1 ? 'is' : 'are'} ${totalMatches} ${noun} in other categories.`}
          headline={`No ${categoryLabel} habits match “${query}”`}
          icon='🔍'
          variant='noResults'
        />
        <View style={s.actions}>
          <Button size='medium' variant='primary' onPress={onShowAll}>
            {`Show ${totalMatches} ${noun}`}
          </Button>
          <Button size='medium' variant='ghost' onPress={onClearSearch}>
            Clear search
          </Button>
        </View>
      </View>
    );
  }

  if (query.length > 0) {
    return (
      <View style={s.wrap}>
        <EmptyState
          hideCTA
          description='Try a shorter word, or browse by category above.'
          headline={`No habits match “${query}”`}
          icon='🔍'
          variant='noResults'
        />
        <View style={{ marginTop: spacing.base }}>
          <Button size='medium' variant='primary' onPress={onClearSearch}>
            Clear search
          </Button>
        </View>
      </View>
    );
  }

  // No query — the catalog itself has nothing to show here (a category with no
  // templates, or an empty catalog). Nothing to clear, so send them back.
  // Adds can no longer cause this: added habits stay in their category shelf.
  return (
    <View style={s.wrap}>
      <EmptyState
        hideCTA
        description={
          isFiltered
            ? `There are no ${categoryLabel} habits in the library yet.`
            : 'Nothing to show here yet.'
        }
        headline='Nothing here'
        icon='📭'
        variant='noResults'
      />
      {isFiltered ? (
        <View style={{ marginTop: spacing.base }}>
          <Button size='medium' variant='primary' onPress={onShowAll}>
            Browse all habits
          </Button>
        </View>
      ) : null}
    </View>
  );
}
