/**
 * Hook to fetch achievement badges from Convex
 */

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export interface BadgeData {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    tier: string;
    premium: boolean;
    criteriaKey: string;
    threshold: number;
  };
  unlocked: boolean;
  progress: number;
  current: number;
}

export function useAchievements(): {
  badges: BadgeData[] | undefined;
  unlockedCount: number;
  totalCount: number;
  isLoading: boolean;
} {
  const badges = useQuery(api.achievements.getAchievements);

  const unlockedCount = badges?.filter((b) => b.unlocked).length ?? 0;
  const totalCount = badges?.length ?? 0;

  return {
    badges,
    unlockedCount,
    totalCount,
    isLoading: badges === undefined,
  };
}
