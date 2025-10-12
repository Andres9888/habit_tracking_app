import { useAuth, useUser } from "@clerk/clerk-expo";
import { useState } from "react";

interface UseSettingsModalLogicProps {
  visible: boolean;
  onClose: () => void;
}

export const useSettingsModalLogic = ({
  visible,
  onClose,
}: UseSettingsModalLogicProps) => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [view, setView] = useState<"settings" | "archived">("settings");

  // Reset to settings view when modal closes
  const handleClose = () => {
    onClose();
    setTimeout(() => setView("settings"), 300); // Reset after animation
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      handleClose();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    handleClose,
    handleSignOut,
    setView,
    user,
    view,
  };
};
