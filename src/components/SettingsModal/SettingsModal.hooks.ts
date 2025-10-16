import { useState } from "react";

interface UseSettingsModalLogicProps {
  visible: boolean;
  onClose: () => void;
}

// Mock auth hooks for development without Clerk
// TODO: Remove when Clerk authentication is implemented (see docs/stories/6-draft/0.1-implement-clerk-authentication.story.md)
const useMockAuth = () => ({
  signOut: async () => {
    console.warn('Sign out called but Clerk is not configured');
  }
});

const useMockUser = () => ({
  user: null
});

export const useSettingsModalLogic = ({
  visible,
  onClose,
}: UseSettingsModalLogicProps) => {
  // Temporarily using mock auth until Clerk is configured
  const { signOut } = useMockAuth();
  const { user } = useMockUser();
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
