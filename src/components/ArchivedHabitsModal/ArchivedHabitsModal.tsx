import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useArchivedHabitsModalLogic } from './ArchivedHabitsModal.hooks';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { EmptyState, ModalHeader } from './components';
import { CardStack } from './components/CardStack';
import { LoadingState } from './components/LoadingState';
import type { ArchivedHabitsModalProps } from './types';

export default function ArchivedHabitsModal({
  onClose,
  onBack,
}: ArchivedHabitsModalProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReduceMotion();
  const {
    archivedHabits,
    handleRestore,
    handlePermanentDelete,
    isLoading,
  } = useArchivedHabitsModalLogic();

  return (
    <>
      <ModalHeader insets={insets} onBack={onBack} onClose={onClose} />

      {isLoading ? (
        <LoadingState />
      ) : archivedHabits.length === 0 ? (
        <EmptyState />
      ) : (
        <CardStack
          habits={archivedHabits}
          onDelete={handlePermanentDelete}
          onDone={onBack}
          onRestore={handleRestore}
          reducedMotion={reducedMotion}
        />
      )}
    </>
  );
}
