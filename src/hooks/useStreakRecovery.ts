/**
 * useStreakRecovery - Custom hook for streak recovery functionality
 *
 * Provides:
 * - canRecover: Whether the habit's streak can be recovered
 * - cost: Recovery cost in coins
 * - remainingRecoveries: Number of recoveries remaining this month
 * - showRecoveryModal: Function to show the recovery modal
 * - StreakRecoveryModal: The modal component
 */

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { StreakRecoveryModal } from '../components/StreakRecoveryModal';

interface UseStreakRecoveryProps {
  habitId: string;
  habitName: string;
  onRecoverySuccess?: () => void;
}

export function useStreakRecovery({
  habitId,
  habitName,
  onRecoverySuccess,
}: UseStreakRecoveryProps) {
  const [modalVisible, setModalVisible] = useState(false);

  // Check if recovery is possible
  const canRecover = useQuery(api.habits.recoverStreak.canRecoverStreak, {
    habitId: habitId as any,
  });

  const showRecoveryModal = () => {
    setModalVisible(true);
  };

  const hideRecoveryModal = () => {
    setModalVisible(false);
  };

  const handleRecoverySuccess = () => {
    onRecoverySuccess?.();
    hideRecoveryModal();
  };

  const StreakRecoveryModalComponent = () => (
    <StreakRecoveryModal
      visible={modalVisible}
      onClose={hideRecoveryModal}
      habitId={habitId}
      habitName={habitName}
      onSuccess={handleRecoverySuccess}
    />
  );

  return {
    canRecover: canRecover?.canRecover ?? false,
    streakLength: canRecover?.canRecover ? canRecover.streakLength : undefined,
    cost: canRecover?.canRecover ? canRecover.cost : undefined,
    remainingRecoveries: canRecover?.canRecover ? canRecover.remainingRecoveries : 0,
    reason: canRecover?.canRecover === false ? canRecover.reason : undefined,
    showRecoveryModal,
    hideRecoveryModal,
    StreakRecoveryModal: StreakRecoveryModalComponent,
  };
}
