/**
 * Time-aware featured collection data
 */

export interface FeaturedCollectionData {
  badge: string;
  categoryId: string;
  chips: string[];
  description: string;
  gradientColors: readonly [string, string, string];
  title: string;
}

const MORNING: FeaturedCollectionData = {
  badge: '\u{1F305} MORNING PICK',
  categoryId: 'morning_routine',
  chips: ['\u{1F305} Wake Early', '\u{1F4A7} Hydrate', '\u{1F4DD} Journal', '\u{1F9D8} Meditate'],
  description: 'Start your day with science-backed habits for energy and focus',
  gradientColors: ['#065F46', '#059669', '#34D399'],
  title: 'Morning Mastery',
};

const AFTERNOON: FeaturedCollectionData = {
  badge: '\u{1F3AF} AFTERNOON PICK',
  categoryId: 'productivity',
  chips: ['\u{1F3AF} Deep Work', '\u{1F6B6} Walk Break', '\u{1F4A7} Hydrate', '\u{1F4D6} Read'],
  description: 'Stay sharp and productive through the afternoon',
  gradientColors: ['#1E3A5F', '#2563EB', '#60A5FA'],
  title: 'Afternoon Focus',
};

const EVENING: FeaturedCollectionData = {
  badge: '\u{1F319} EVENING PICK',
  categoryId: 'sleep',
  chips: ['\u{1F4F5} Screen Off', '\u{1F4D6} Read', '\u{1F9D8} Stretch', '\u{1F634} Wind Down'],
  description: 'End your day with habits that improve sleep quality',
  gradientColors: ['#1E1B4B', '#312E81', '#6366F1'],
  title: 'Wind Down & Restore',
};

const WEEKEND: FeaturedCollectionData = {
  badge: '\u{2728} WEEKEND PICK',
  categoryId: 'mindfulness',
  chips: ['\u{1F9D8} Meditate', '\u{1F4D6} Read', '\u{1F3A8} Create', '\u{1F465} Connect'],
  description: 'Recharge with habits that nourish mind and body',
  gradientColors: ['#701A75', '#A21CAF', '#E879F9'],
  title: 'Weekend Recharge',
};

export function getTimeAwareFeatured(): FeaturedCollectionData {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return MORNING;
  if (hour >= 12 && hour < 17) return AFTERNOON;
  if (hour >= 17 && hour < 22) return EVENING;
  return WEEKEND; // Late night / early morning
}
