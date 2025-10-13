type HabitStatus = "done" | "missed" | "planned";

export const useHabitChainVisualizerLogic = (weekStatus: HabitStatus[]) => {
  const isConnected = (index: number): boolean => {
    if (weekStatus[index] !== "done") {
      return false;
    }

    const hasPrevious = index > 0 && weekStatus[index - 1] === "done";
    const hasNext = index < weekStatus.length - 1 && weekStatus[index + 1] === "done";

    return hasPrevious || hasNext;
  };

  const getCircleFill = (index: number): string => {
    const status = weekStatus[index];

    if (status === "done") {
      return isConnected(index) ? "bg-[#276749]" : "bg-[#48bb78]";
    }

    if (status === "missed") {
      return "bg-[#fed7d7]";
    }

    return "bg-[#dde3ed]";
  };

  return {
    getCircleFill,
  };
};
