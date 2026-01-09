/**
 * Chain Data Utilities
 * Build chain data and day labels for the streak visualization
 */

/**
 * Build chain data from lastSevenDays array
 */
export function buildChainData(
  lastSevenDays: boolean[],
  todayCompleted: boolean
) {
  const days: boolean[] = [
    ...(Array.from({ length: 7 - lastSevenDays.length }).fill(
      false
    ) as boolean[]),
    ...lastSevenDays,
  ];

  const chainData = days.map((completed, idx) => ({
    completed,
    isToday: idx === 6,
  }));

  // Override today's completion status
  chainData[6].completed = todayCompleted;

  return chainData;
}

/**
 * Generate day labels ending with current day as "Now"
 */
export function getDayLabels(): string[] {
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date().getDay();
  const result: string[] = [];

  for (let i = 6; i >= 0; i--) {
    result.push(labels[(today - i + 7) % 7]);
  }

  result[6] = 'Now';
  return result;
}
