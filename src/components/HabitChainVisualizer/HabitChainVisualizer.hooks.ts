import { parse, startOfDay } from "date-fns";

type HabitStatus = "done" | "missed" | "planned";

export const useHabitChainVisualizerLogic = (
  weekDateStrings: string[],
  weekStatus: HabitStatus[]
) => {
  const today = startOfDay(new Date());

  const isFutureDate = (index: number): boolean => {
    const parsed = parse(weekDateStrings[index], "yyyy-MM-dd", new Date());
    const normalized = startOfDay(parsed);
    return normalized.getTime() > today.getTime();
  };

  const isCompleted = (index: number): boolean =>
    weekStatus[index] === "done";

  return {
    isFutureDate,
    isCompleted,
  };
};
