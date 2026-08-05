import { useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { Habit } from '../../../../features/habits/types';
import type { PersonalBlockData, PersonalSource, TemplateProvenance } from './HabitWhyBenefitsCard.types';

const LABELS: Record<PersonalSource, { label: string; icon: string }> = {
  identity: { icon: '🌱', label: "Who you're becoming" },
  why: { icon: '💭', label: 'Your why' },
  woopWish: { icon: '⭐', label: 'Your wish' },
};

const ORDER: PersonalSource[] = ['why', 'identity', 'woopWish'];

function trim(value: string | undefined): string | null {
  if (value === undefined) return null;
  const t = value.trim();
  return t.length > 0 ? t : null;
}

export function useResolveAllPersonal(habit: Habit): PersonalBlockData[] {
  return useMemo(() => {
    const out: PersonalBlockData[] = [];
    for (const source of ORDER) {
      const raw = source === 'woopWish' ? habit.woopWish : habit[source];
      const value = trim(raw);
      if (value !== null) {
        out.push({ ...LABELS[source], source, value });
      }
    }
    return out;
  }, [habit.why, habit.identity, habit.woopWish]);
}

export function useNonEmptyBenefits(habit: Habit): string[] {
  return useMemo(() => {
    if (!habit.benefits) return [];
    return habit.benefits
      .map((b) => b.trim())
      .filter((b) => b.length > 0);
  }, [habit.benefits]);
}

export function useScienceNote(habit: Habit): string | null {
  return useMemo(() => trim(habit.scienceNote), [habit.scienceNote]);
}

export interface CardContentFlags {
  hasPersonal: boolean;
  hasBenefits: boolean;
  hasScience: boolean;
  hasAnyContent: boolean;
  summaryText: string;
}

export function useCardContentFlags(
  personal: PersonalBlockData[],
  benefits: string[],
  scienceNote: string | null
): CardContentFlags {
  return useMemo(() => {
    const hasPersonal = personal.length > 0;
    const hasBenefits = benefits.length > 0;
    const hasScience = scienceNote !== null;
    const hasAnyContent = hasPersonal || hasBenefits || hasScience;

    const parts: string[] = [];
    if (hasPersonal) parts.push(personal[0]!.label.toLowerCase());
    if (hasBenefits) {
      parts.push(`${benefits.length} benefit${benefits.length === 1 ? '' : 's'}`);
    }
    if (hasScience) parts.push('science');
    const summaryText = parts.join(' · ');

    return { hasAnyContent, hasBenefits, hasPersonal, hasScience, summaryText };
  }, [personal, benefits, scienceNote]);
}

export function useCollapsibleState(defaultExpanded: boolean) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const toggle = () => setIsExpanded((v) => !v);
  return { isExpanded, toggle };
}

export function useTemplateProvenance(
  habitId: Id<'habits'>
): TemplateProvenance | null {
  const result = useQuery(api.templates.queries.getProvenanceForHabit, { habitId });
  return result ?? null;
}
