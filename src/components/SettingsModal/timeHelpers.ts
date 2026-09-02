export function timeStringToDate(time: string): Date {
  const date = new Date();
  if (!time || typeof time !== 'string') {
    date.setHours(20, 0, 0, 0);
    return date;
  }
  const parts = time.split(':').map(Number);
  const hours = Number.isFinite(parts[0]) ? parts[0] : 20;
  const minutes = Number.isFinite(parts[1]) ? parts[1] : 0;
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function dateToTimeString(date: Date): string {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '20:00';
  }
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatDisplayTime(time: string): string {
  if (!time || typeof time !== 'string') return '8:00 PM';
  const parts = time.split(':').map(Number);
  const hours = Number.isFinite(parts[0]) ? parts[0] : 0;
  const minutes = Number.isFinite(parts[1]) ? parts[1] : 0;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

/** Subtitle for the streak-reminder row, split so the time can render as an
 *  emphasised inline span: "Every day at **8:00 PM**". */
export function formatStreakReminderSubtitle(
  enabled: boolean,
  time: string
): { subtitle: string; strong?: string } {
  if (!enabled) return { subtitle: 'Off' };
  return { subtitle: 'Every day at ', strong: formatDisplayTime(time) };
}
