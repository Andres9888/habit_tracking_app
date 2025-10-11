type HabitStatus = "done" | "missed" | "planned";

export const useHabitChainVisualizerLogic = (weekStatus: HabitStatus[]) => {
  const renderConnectingLine = (index: number): boolean => {
    // Show connecting line if current day is done AND next day is done
    return (
      index < weekStatus.length - 1 &&
      weekStatus[index] === "done" &&
      weekStatus[index + 1] === "done"
    );
  };

  return {
    renderConnectingLine,
  };
};
