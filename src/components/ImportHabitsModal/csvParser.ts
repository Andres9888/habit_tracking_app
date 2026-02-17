/* CSV Parser - Handles Streaks, Habitica, and generic CSV formats */

export type CSVFormat = 'generic' | 'streaks' | 'habitica';

export interface ParsedHabit {
  name: string;
  frequency?: string;
  icon?: string;
  notes?: string;
  color?: string;
  tags?: string[];
  completionHistory?: Array<{ date: string; completed: boolean }>;
}

/**
 * Parse CSV text into habit objects based on the selected format
 */
export function parseCSV(csvText: string, format: CSVFormat): ParsedHabit[] {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0) return [];

  // Remove header row
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
  const dataLines = lines.slice(1);

  const habits: ParsedHabit[] = [];

  for (const line of dataLines) {
    if (!line.trim()) continue;

    const values = parseCSVLine(line);
    const habit = parseHabitFromRow(headers, values, format);
    
    if (habit && habit.name) {
      habits.push(habit);
    }
  }

  return habits;
}

/**
 * Parse a single CSV line, handling quoted values and commas
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

/**
 * Parse a habit from CSV row based on format
 */
function parseHabitFromRow(
  headers: string[],
  values: string[],
  format: CSVFormat
): ParsedHabit | null {
  const row: Record<string, string> = {};
  headers.forEach((header, index) => {
    row[header] = values[index] || '';
  });

  switch (format) {
    case 'streaks':
      return parseStreaksFormat(row);
    case 'habitica':
      return parseHabiticaFormat(row);
    case 'generic':
    default:
      return parseGenericFormat(row);
  }
}

/**
 * Parse Streaks app CSV format
 * Expected columns: Task, Frequency, Icon, Color
 */
function parseStreaksFormat(row: Record<string, string>): ParsedHabit | null {
  const name = row.task || row.name;
  if (!name) return null;

  const frequencyMap: Record<string, string> = {
    'daily': 'daily',
    'weekdays': 'weekdays',
    'weekends': 'weekends',
    'custom': 'custom',
  };

  const frequency = frequencyMap[row.frequency?.toLowerCase()] || 'daily';

  return {
    name,
    frequency,
    icon: row.icon || mapStreaksIcon(name),
    color: row.color || '#047857',
  };
}

/**
 * Parse Habitica CSV export format
 * Expected columns: habit, type, notes, tags, difficulty
 */
function parseHabiticaFormat(row: Record<string, string>): ParsedHabit | null {
  const name = row.habit || row.name || row.title;
  if (!name) return null;

  // Habitica uses "type" column: daily, habit, todo
  const type = row.type?.toLowerCase();
  const frequency = type === 'daily' ? 'daily' : 'custom';

  const tags = row.tags
    ? row.tags.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return {
    name,
    frequency,
    notes: row.notes,
    tags,
    icon: mapHabiticaIcon(name, tags),
    color: '#047857',
  };
}

/**
 * Parse generic CSV format
 * Expected columns: name, frequency, icon, notes, color
 */
function parseGenericFormat(row: Record<string, string>): ParsedHabit | null {
  const name = row.name || row.habit || row.task || row.title;
  if (!name) return null;

  return {
    name,
    frequency: row.frequency || 'daily',
    icon: row.icon || mapGenericIcon(name),
    notes: row.notes || row.description,
    color: row.color || '#047857',
  };
}

/**
 * Smart icon mapping based on habit name keywords
 */
function mapGenericIcon(habitName: string): string {
  const name = habitName.toLowerCase();

  // Exercise & Fitness
  if (name.includes('run') || name.includes('jog')) return '🏃';
  if (name.includes('gym') || name.includes('workout') || name.includes('exercise')) return '💪';
  if (name.includes('yoga') || name.includes('stretch')) return '🧘';
  if (name.includes('walk')) return '🚶';
  if (name.includes('swim')) return '🏊';
  if (name.includes('bike') || name.includes('cycle')) return '🚴';

  // Health & Wellness
  if (name.includes('water') || name.includes('hydrat')) return '💧';
  if (name.includes('sleep') || name.includes('bed')) return '😴';
  if (name.includes('meditat')) return '🧘';
  if (name.includes('vitamin') || name.includes('supplement')) return '💊';

  // Food & Nutrition
  if (name.includes('eat') || name.includes('meal')) return '🍽️';
  if (name.includes('cook')) return '👨‍🍳';
  if (name.includes('fruit') || name.includes('vegetable')) return '🥗';

  // Productivity & Learning
  if (name.includes('read')) return '📚';
  if (name.includes('write') || name.includes('journal')) return '✍️';
  if (name.includes('study') || name.includes('learn')) return '📖';
  if (name.includes('code') || name.includes('program')) return '💻';

  // Mindfulness
  if (name.includes('grateful') || name.includes('gratitude')) return '🙏';
  if (name.includes('affirm')) return '💭';
  if (name.includes('reflect')) return '🪞';

  // Social & Relationships
  if (name.includes('call') || name.includes('family')) return '📞';
  if (name.includes('friend')) return '👥';

  // Hygiene & Self-care
  if (name.includes('shower') || name.includes('bath')) return '🚿';
  if (name.includes('teeth') || name.includes('brush')) return '🪥';
  if (name.includes('skin') || name.includes('skincare')) return '🧴';

  // Default
  return '⭐';
}

function mapStreaksIcon(habitName: string): string {
  return mapGenericIcon(habitName);
}

function mapHabiticaIcon(habitName: string, tags: string[]): string {
  // Check tags first
  if (tags.includes('health') || tags.includes('fitness')) return '💪';
  if (tags.includes('mindfulness') || tags.includes('mental health')) return '🧘';
  if (tags.includes('productivity')) return '💻';
  if (tags.includes('learning')) return '📚';

  return mapGenericIcon(habitName);
}

/**
 * Generate sample CSV for user reference
 */
export function generateSampleCSV(format: CSVFormat): string {
  switch (format) {
    case 'streaks':
      return `Task,Frequency,Icon,Color
Morning Run,Daily,🏃,#047857
Read 30 min,Daily,📚,#0284c7
Meditate,Daily,🧘,#7c3aed`;

    case 'habitica':
      return `habit,type,notes,tags
Exercise for 30 minutes,daily,Gym or home workout,health,fitness
Journal before bed,daily,Gratitude and reflections,mindfulness
Practice Spanish,daily,Duolingo or conversation,learning`;

    case 'generic':
    default:
      return `name,frequency,icon,notes
Drink 8 glasses of water,daily,💧,Stay hydrated
10,000 steps,daily,🚶,Track with phone
Cold shower,daily,🚿,2 minutes`;
  }
}
