import { DayStatus } from "./StreakChain";

export const useStreakChainLogic = (
  statuses: DayStatus[],
  size: number = 28
) => {
  const circleSize = size;
  const iconSize = Math.max(12, Math.floor(circleSize * 0.55));

  // Compute current streak (consecutive "done" from end)
  let streakDays = 0;
  for (let i = statuses.length - 1; i >= 0; i -= 1) {
    if (statuses[i] === "done") streakDays += 1;
    else break;
  }

  return {
    circleSize,
    iconSize,
    streakDays,
  };
};
