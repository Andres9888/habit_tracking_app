import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFormedHabitsModalLogic } from './FormedHabitsModal.hooks';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { ModalHeader, EmptyState } from '../ArchivedHabitsModal/components';
import { CardStack } from '../ArchivedHabitsModal/components/CardStack';
import { LoadingState } from '../ArchivedHabitsModal/components/LoadingState';

interface FormedHabitsModalProps {
  onClose: () => void;
  onBack: () => void;
}

export default function FormedHabitsModal({
  onClose,
  onBack,
}: FormedHabitsModalProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReduceMotion();
  const { formedHabits, handleRestore, handlePermanentDelete, isLoading } =
    useFormedHabitsModalLogic();

  return (
    <>
      <ModalHeader
        insets={insets}
        onBack={onBack}
        onClose={onClose}
        title="Formed Habits"
      />

      {isLoading ? (
        <LoadingState />
      ) : formedHabits.length === 0 ? (
        <EmptyState />
      ) : (
        <CardStack
          habits={formedHabits}
          onDelete={handlePermanentDelete}
          onDone={onBack}
          onRestore={handleRestore}
          reducedMotion={reducedMotion}
        />
      )}
    </>
  );
}
