const COMPACT_KEY = "habitTrackerSettings.compactMode";

export const getCompactMode = async (): Promise<boolean> => {
  try {
    const raw = localStorage?.getItem(COMPACT_KEY);
    if (raw == null) return false;
    return raw === "true";
  } catch {
    return false;
  }
};

export const setCompactMode = async (value: boolean): Promise<void> => {
  try {
    localStorage?.setItem(COMPACT_KEY, value ? "true" : "false");
  } catch {
    // no-op
  }
};


