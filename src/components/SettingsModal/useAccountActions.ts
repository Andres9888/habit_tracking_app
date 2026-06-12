/** useAccountActions — Shared settings handlers for account/support actions */
import { useAccountDangerActions } from './useAccountDangerActions';
import { useSupportActions } from './useSupportActions';

export function useAccountActions() {
  const dangerActions = useAccountDangerActions();
  const supportActions = useSupportActions();

  return { ...dangerActions, ...supportActions };
}
