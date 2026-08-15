export interface UseHabitsAppHandlersParams {
  hasReachedHabitLimit: boolean;
  isPremiumUser: boolean;
  openCreateHabitScreen: () => void;
  triggerSelection: () => void;
}

export interface UseHabitsAppHandlersResult {
  handleCreateHabitRequest: () => void;
  handlePaywallClose: () => void;
  handlePaywallSuccess: () => void;
  handleUpgradeConfirm: () => void;
  handleUpgradeDismiss: () => void;
  handleUpgradeIntent: () => void;
  paywallVisible: boolean;
  upgradePromptVisible: boolean;
}
