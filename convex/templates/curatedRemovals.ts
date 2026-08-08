import type { TemplateCategory } from './types';

export const PRUNE_LIST = [
  'Cold Shower',
  'Cold Face Splash',
  'Sunrise Viewing',
  'Morning Window Gaze',
  'Evening Sunset Viewing',
  'Yoga Nidra/NSDR',
  'Sauna Recovery',
  'Box Breathing',
  '4-7-8 Breathing',
  'Breathwork Practice',
  '10,000 Steps',
  'Post-Meal Walk',
  'Sleep Optimization',
  'Optimal Sleep Temperature',
  'Sleep in Complete Darkness',
  '16:8 Intermittent Fasting',
  'Consistent Meal Timing',
  'Daily Protein Target',
  'Protein Per Meal Goal',
  'Protein Pacing',
  'Protein Quality Focus',
  'Lacto-Fermented Vegetables',
  'Seasonal Fermented Food Rotation',
  'Eat Greens First',
  'Daily Sun Protection',
  'Interdental Cleaning',
  'Fresh Air Break',
  'Positive Journaling',
  'Gratitude Snapshot',
  'MIT - Most Important Task',
  'Priority First',
  'Weekly Goal Review',
  'Daily Learning',
  'Evening Planning',
  'Tech-Free Break',
  'Toothbrush Calf Raises',
  'Bathroom Squats',
  'Backward Walking',
  'Foot Rolling',
  'Facial Relaxation',
  'Cloud Watching',
  'Rain Walking',
  'Mindful Moisturizing',
  'Face Mask Ritual',
  'Comfort Clothes Transition',
  'Candlelight Relaxation',
  'Silent Eating',
  'Mindful Chewing',
  'Aromatherapy Practice',
  'Brain Games',
] as const;

export const PRUNED_TEMPLATE_NAMES = new Set(
  PRUNE_LIST.map((name) => name.trim().toLowerCase())
);

export const RECATEGORIZE: Record<string, TemplateCategory> = {
  'Express Daily Appreciation': 'social',
  'Love Maps Question': 'social',
  'Six-Second Kiss': 'social',
  'Standing Social Events': 'social',
  'Stress-Reducing Conversation': 'social',
  // Aug 2026 review: four habits sat in `productivity` because that is where
  // they were authored, not because that is what they are. Moving them also
  // gives the two newest categories something to hold.
  'Fresh Air Ventilation': 'environmental_design',
  'House Plant Care': 'mindfulness',
  'Phone-Free Meals': 'social',
  'Social Media Limit': 'subtraction',
};

export const RECATEGORIZE_CATEGORIES: Record<string, TemplateCategory> = {
  relationships: 'social',
};
