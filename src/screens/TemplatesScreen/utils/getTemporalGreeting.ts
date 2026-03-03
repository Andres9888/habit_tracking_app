/**
 * Returns a time-of-day greeting for the Templates screen header.
 * Based on Temporal Priming (Bargh et al., 1996) — content primed by
 * temporal context increases engagement.
 */
export function getTemporalGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning — build your AM routine';
  if (hour < 17) return 'Good afternoon — find your focus habits';
  return 'Good evening — set up tomorrow for success';
}
