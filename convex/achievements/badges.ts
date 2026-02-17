/**
 * Achievement Badge Definitions
 *
 * 18 badges organized by category with unlock criteria.
 * Premium badges have exclusive designs with ✦ marker.
 */

export type BadgeCategory =
  | 'streak'
  | 'completion'
  | 'collection'
  | 'timing'
  | 'mastery'
  | 'special';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  tier: BadgeTier;
  premium: boolean;
  /** Criteria key used by the evaluation engine */
  criteriaKey: string;
  /** Threshold value to unlock */
  threshold: number;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ── Streak Badges ──────────────────────────────────────────
  {
    id: 'first_streak',
    name: 'First Flame',
    description: 'Achieve a 3-day streak',
    icon: '🔥',
    category: 'streak',
    tier: 'bronze',
    premium: false,
    criteriaKey: 'maxStreak',
    threshold: 3,
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Achieve a 7-day streak',
    icon: '⚔️',
    category: 'streak',
    tier: 'silver',
    premium: false,
    criteriaKey: 'maxStreak',
    threshold: 7,
  },
  {
    id: 'monthly_master',
    name: 'Monthly Master',
    description: 'Achieve a 30-day streak',
    icon: '🏅',
    category: 'streak',
    tier: 'gold',
    premium: false,
    criteriaKey: 'maxStreak',
    threshold: 30,
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: 'Achieve a 100-day streak',
    icon: '👑',
    category: 'streak',
    tier: 'platinum',
    premium: true,
    criteriaKey: 'maxStreak',
    threshold: 100,
  },

  // ── Completion Badges ──────────────────────────────────────
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your first habit',
    icon: '👣',
    category: 'completion',
    tier: 'bronze',
    premium: false,
    criteriaKey: 'totalCompletions',
    threshold: 1,
  },
  {
    id: 'half_century',
    name: 'Half Century',
    description: 'Complete 50 habit check-ins',
    icon: '🎯',
    category: 'completion',
    tier: 'silver',
    premium: false,
    criteriaKey: 'totalCompletions',
    threshold: 50,
  },
  {
    id: 'dedication',
    name: 'Dedication',
    description: 'Complete 500 habit check-ins',
    icon: '💎',
    category: 'completion',
    tier: 'gold',
    premium: false,
    criteriaKey: 'totalCompletions',
    threshold: 500,
  },
  {
    id: 'thousand_strong',
    name: 'Thousand Strong',
    description: 'Complete 1,000 habit check-ins',
    icon: '🏆',
    category: 'completion',
    tier: 'platinum',
    premium: true,
    criteriaKey: 'totalCompletions',
    threshold: 1000,
  },

  // ── Collection Badges ──────────────────────────────────────
  {
    id: 'habit_starter',
    name: 'Habit Starter',
    description: 'Create your first habit',
    icon: '🌱',
    category: 'collection',
    tier: 'bronze',
    premium: false,
    criteriaKey: 'activeHabits',
    threshold: 1,
  },
  {
    id: 'five_alive',
    name: 'Five Alive',
    description: 'Have 5 active habits',
    icon: '🖐️',
    category: 'collection',
    tier: 'silver',
    premium: false,
    criteriaKey: 'activeHabits',
    threshold: 5,
  },
  {
    id: 'habit_collector',
    name: 'Habit Collector',
    description: 'Have 10 active habits',
    icon: '📚',
    category: 'collection',
    tier: 'gold',
    premium: false,
    criteriaKey: 'activeHabits',
    threshold: 10,
  },

  // ── Timing Badges ──────────────────────────────────────────
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a habit before 7 AM',
    icon: '🌅',
    category: 'timing',
    tier: 'silver',
    premium: false,
    criteriaKey: 'earlyCompletions',
    threshold: 1,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a habit after 10 PM',
    icon: '🦉',
    category: 'timing',
    tier: 'silver',
    premium: false,
    criteriaKey: 'lateCompletions',
    threshold: 1,
  },

  // ── Mastery Badges ─────────────────────────────────────────
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Complete all habits every day for a week',
    icon: '⭐',
    category: 'mastery',
    tier: 'gold',
    premium: false,
    criteriaKey: 'perfectWeeks',
    threshold: 1,
  },
  {
    id: 'perfect_month',
    name: 'Perfect Month',
    description: 'Complete all habits every day for 30 days',
    icon: '🌟',
    category: 'mastery',
    tier: 'platinum',
    premium: true,
    criteriaKey: 'perfectWeeks',
    threshold: 4,
  },
  {
    id: 'category_master',
    name: 'Category Master',
    description: 'Have habits in 3+ categories',
    icon: '🎨',
    category: 'mastery',
    tier: 'silver',
    premium: false,
    criteriaKey: 'uniqueCategories',
    threshold: 3,
  },

  // ── Special Badges ─────────────────────────────────────────
  {
    id: 'level_up',
    name: 'Level Up',
    description: 'Reach character level 5',
    icon: '⬆️',
    category: 'special',
    tier: 'silver',
    premium: false,
    criteriaKey: 'level',
    threshold: 5,
  },
  {
    id: 'powerhouse',
    name: 'Powerhouse',
    description: 'Reach 200 total power',
    icon: '⚡',
    category: 'special',
    tier: 'gold',
    premium: true,
    criteriaKey: 'totalPower',
    threshold: 200,
  },
];

export const TIER_COLORS = {
  bronze: { bg: '#FEF3C7', border: '#D97706', text: '#92400E' },
  silver: { bg: '#F3F4F6', border: '#9CA3AF', text: '#4B5563' },
  gold: { bg: '#FEF9C3', border: '#EAB308', text: '#854D0E' },
  platinum: { bg: '#EDE9FE', border: '#8B5CF6', text: '#5B21B6' },
} as const;

export const TIER_DARK_COLORS = {
  bronze: { bg: '#451A03', border: '#D97706', text: '#FDE68A' },
  silver: { bg: '#1F2937', border: '#6B7280', text: '#D1D5DB' },
  gold: { bg: '#422006', border: '#EAB308', text: '#FEF08A' },
  platinum: { bg: '#2E1065', border: '#8B5CF6', text: '#DDD6FE' },
} as const;
