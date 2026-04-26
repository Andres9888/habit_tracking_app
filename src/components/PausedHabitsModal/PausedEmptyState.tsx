/** PausedEmptyState — uses canonical EmptyState primitive (compact). */
import { EmptyState } from '../EmptyState/EmptyState';

export function PausedEmptyState() {
  return (
    <EmptyState
      variant='noResults'
      size='compact'
      icon='⏸️'
      headline='No paused habits'
      description='Paused habits will appear here'
      hideCTA
    />
  );
}
