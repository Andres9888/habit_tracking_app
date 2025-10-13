type HabitStatus = "done" | "missed" | "planned";

export const useHabitChainVisualizerLogic = (weekStatus: HabitStatus[]) => {
  const getConnectorColor = (index: number): string => {
    // Always render connectors between static circles; only color changes
    if (index >= weekStatus.length - 1) return "transparent";
    const leftDone = weekStatus[index] === "done";
    const rightDone = weekStatus[index + 1] === "done";
    return leftDone && rightDone ? "#48bb78" : "#dde3ed";
  };

  return {
    getConnectorColor,
  };
};
