import { useAuth, useUser } from "@clerk/clerk-expo";
import { useCallback, useState } from "react";

export type SettingsView = "settings" | "archived";

interface UseComponentLogicParams {
  onClose: () => void;
}

export function useComponentLogic({ onClose }: UseComponentLogicParams) {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [view, setView] = useState<SettingsView>("settings");

  const handleClose = useCallback(() => {
    onClose();
    // Reset to settings view after close animation ends
    setTimeout(() => setView("settings"), 300);
  }, [onClose]);

  const goToArchived = useCallback(() => setView("archived"), []);
  const goToSettings = useCallback(() => setView("settings"), []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      handleClose();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [handleClose, signOut]);

  return {
    user,
    view,
    goToArchived,
    goToSettings,
    handleClose,
    handleSignOut,
  } as const;
}

export default useComponentLogic;
