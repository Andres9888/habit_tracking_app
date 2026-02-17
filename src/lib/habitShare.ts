/**
 * Habit Sharing Utility
 * Generate shareable links and QR codes for habits
 */

/**
 * Shareable habit data format
 * Includes only user-editable/relevant fields for sharing
 */
export interface ShareableHabit {
  name: string;
  icon?: string;
  color?: string;
  iconColor?: string;
  notes?: string;
  frequency?: string;
  daysOfWeek?: number[];
  preferredTime?: string;
  goalDuration?: number;
  goalUnit?: string;
  cueTime?: string;
  cueLocation?: string;
  cueAfterBehavior?: string;
  why?: string;
  identity?: string;
  tags?: string[];
  // Visualization fields
  vizSuccessBody?: string;
  vizSuccessEmotion?: string;
  vizSuccessMind?: string;
  vizFailureBody?: string;
  vizFailureEmotion?: string;
  vizFailureMind?: string;
  // WOOP fields
  woopWish?: string;
  woopOutcome?: string;
  woopObstacle?: string;
  woopPlan?: string;
}

/**
 * Convert habit data to shareable format
 */
export function toShareableFormat(habit: any): ShareableHabit {
  return {
    name: habit.name,
    icon: habit.icon,
    color: habit.color,
    iconColor: habit.iconColor,
    notes: habit.notes,
    frequency: habit.frequency,
    daysOfWeek: habit.daysOfWeek,
    preferredTime: habit.preferredTime,
    goalDuration: habit.goalDuration,
    goalUnit: habit.goalUnit,
    cueTime: habit.cueTime,
    cueLocation: habit.cueLocation,
    cueAfterBehavior: habit.cueAfterBehavior,
    why: habit.why,
    identity: habit.identity,
    tags: habit.tags,
    vizSuccessBody: habit.vizSuccessBody,
    vizSuccessEmotion: habit.vizSuccessEmotion,
    vizSuccessMind: habit.vizSuccessMind,
    vizFailureBody: habit.vizFailureBody,
    vizFailureEmotion: habit.vizFailureEmotion,
    vizFailureMind: habit.vizFailureMind,
    woopWish: habit.woopWish,
    woopOutcome: habit.woopOutcome,
    woopObstacle: habit.woopObstacle,
    woopPlan: habit.woopPlan,
  };
}

/**
 * Encode string to base64 URL-safe format (React Native compatible)
 */
function base64UrlEncode(str: string): string {
  // Use built-in btoa for base64 encoding
  const base64 = btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
  // Make URL-safe
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode base64 URL-safe format to string (React Native compatible)
 */
function base64UrlDecode(str: string): string {
  // Restore base64 format
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if needed
  while (base64.length % 4) {
    base64 += '=';
  }
  // Decode
  const decoded = atob(base64);
  return decodeURIComponent(
    decoded
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

/**
 * Generate a shareable deep link for a habit
 * Uses the app's custom URL scheme (habit-tracker://)
 */
export function generateShareLink(habit: any): string {
  const shareableData = toShareableFormat(habit);
  
  // Compress and encode the data
  const jsonString = JSON.stringify(shareableData);
  const base64Data = base64UrlEncode(jsonString);
  
  return `habit-tracker://import?data=${base64Data}`;
}

/**
 * Parse a habit from a deep link
 */
export function parseShareLink(url: string): ShareableHabit | null {
  try {
    const urlObj = new URL(url);
    
    // Check if it's our import URL
    if (urlObj.pathname !== '//import' && urlObj.pathname !== 'import') {
      return null;
    }
    
    const data = urlObj.searchParams.get('data');
    if (!data) {
      return null;
    }
    
    // Decode and parse
    const jsonString = base64UrlDecode(data);
    const habit = JSON.parse(jsonString) as ShareableHabit;
    
    // Basic validation
    if (!habit.name || typeof habit.name !== 'string') {
      return null;
    }
    
    return habit;
  } catch (error) {
    console.error('Failed to parse share link:', error);
    return null;
  }
}

/**
 * Generate a web-compatible share link (for QR codes that work on any device)
 */
export function generateWebShareLink(habit: any): string {
  const shareableData = toShareableFormat(habit);
  const jsonString = JSON.stringify(shareableData);
  const base64Data = btoa(jsonString);
  
  // Use a web URL that redirects to the app if installed, or shows install page
  return `https://chainday.app/import?data=${encodeURIComponent(base64Data)}`;
}
