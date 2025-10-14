type HabitStatus = "done" | "missed" | "planned";

export const useHabitChainVisualizerLogic = (weekStatus: HabitStatus[]) => {
  const getConnectorColor = (index: number): string => {
    if (index >= weekStatus.length - 1) return "#dde3ed";
    const currentDone = weekStatus[index] === "done";
    const nextDone = weekStatus[index + 1] === "done";
    return currentDone && nextDone ? "#48bb78" : "#dde3ed";
  };

  return {
    getConnectorColor,
  };
};
