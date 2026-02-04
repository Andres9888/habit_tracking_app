/** Format today's date as "Today · Mon D" per spec */
export const formatTodayDate = (): string => {
  const d = new Date();
  return `Today · ${d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
};
