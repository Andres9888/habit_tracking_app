export function timeStringToDate(time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours || 20, minutes || 0, 0, 0);
  return date;
}

export function dateToTimeString(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatDisplayTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = (hours || 0) >= 12 ? 'PM' : 'AM';
  const hour12 = (hours || 0) % 12 || 12;
  return `${hour12}:${(minutes || 0).toString().padStart(2, '0')} ${ampm}`;
}
