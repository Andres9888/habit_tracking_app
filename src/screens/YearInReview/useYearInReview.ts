/**
 * useYearInReview Hook
 * Fetches year-in-review data and builds reveal slides
 */
import { useQuery } from 'convex/react';
import { useMemo } from 'react';
import { api } from '../../../convex/_generated/api';
import type { RevealSlide, YearInReviewData } from './YearInReview.types';

const FUN_COMPARISONS = [
  { threshold: 365, text: (n: number) => `That's ${Math.round(n / 365)} full years of daily habits!` },
  { threshold: 100, text: (n: number) => `That's like running ${Math.round(n / 42)} marathons of consistency 🏃` },
  { threshold: 50, text: (n: number) => `That's ${Math.round(n / 7)} weeks of showing up 💪` },
  { threshold: 1, text: (n: number) => `${n} steps toward becoming your best self ⭐` },
];

function getFunStat(completions: number): string {
  for (const comp of FUN_COMPARISONS) {
    if (completions >= comp.threshold) {
      return comp.text(completions);
    }
  }
  return `${completions} completions — every one counts!`;
}

function buildSlides(data: YearInReviewData): RevealSlide[] {
  const slides: RevealSlide[] = [
    {
      key: 'total',
      title: 'Total Completions',
      emoji: '🔥',
      value: data.totalCompletions.toLocaleString(),
      subtitle: getFunStat(data.totalCompletions),
      color: '#059669',
    },
    {
      key: 'active-days',
      title: 'Active Days',
      emoji: '📅',
      value: `${data.activeDays}`,
      subtitle: `You showed up ${data.activeDays} out of 365 days`,
      color: '#0891b2',
    },
    {
      key: 'streak',
      title: 'Longest Streak',
      emoji: '⚡',
      value: `${data.longestStreak} days`,
      subtitle: `Your best run was with "${data.longestStreakHabitName}"`,
      color: '#8B6208',
    },
  ];

  if (data.mostConsistentHabit) {
    slides.push({
      key: 'consistent',
      title: 'Most Consistent',
      emoji: data.mostConsistentHabit.icon,
      value: data.mostConsistentHabit.name,
      subtitle: `Completed ${data.mostConsistentHabit.count} times this year`,
      color: '#7B52C4',
    });
  }

  slides.push({
    key: 'best-month',
    title: 'Best Month',
    emoji: '🏆',
    value: data.bestMonth,
    subtitle: `${data.bestMonthCount} completions — your peak performance`,
    color: '#B53030',
  });

  return slides;
}

export function useYearInReview(year?: number) {
  const currentYear = year ?? new Date().getFullYear();
  const data = useQuery(api.yearInReview.getYearInReview, { year: currentYear }) as YearInReviewData | null | undefined;

  const slides = useMemo(() => {
    if (!data) return [];
    return buildSlides(data);
  }, [data]);

  const isLoading = data === undefined;

  return { data, slides, isLoading, year: currentYear };
}
