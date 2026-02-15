/**
 * Prepare full GDPR-compliant export data from Convex getAllUserData query
 */

import type { FullExportData } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Transform raw Convex data into a clean, portable export format.
 * Strips internal IDs (_id, _creationTime) and normalizes timestamps.
 */
export function prepareFullExportData(rawData: any): FullExportData {
  const toISO = (ts: number | undefined): string =>
    ts ? new Date(ts).toISOString() : '';

  return {
    account: {
      createdAt: toISO(rawData.user?.createdAt),
      email: rawData.user?.email ?? undefined,
      name: rawData.user?.name ?? undefined,
    },
    affirmations: (rawData.affirmations ?? []).map((a: any) => ({
      createdAt: toISO(a.createdAt),
      habitId: a.habitId,
      text: a.text,
      type: a.type ?? undefined,
    })),
    exportDate: new Date().toISOString(),
    exportType: 'full' as const,
    habits: (rawData.habits ?? []).map((h: any) => ({
      archived: h.archived ?? false,
      bestStreak: h.bestStreak ?? 0,
      createdAt: toISO(h.createdAt),
      currentStreak: h.currentStreak ?? 0,
      frequency: h.frequency ?? undefined,
      icon: h.icon ?? undefined,
      id: h._id,
      identity: h.identity ?? undefined,
      name: h.name,
      notes: h.notes ?? undefined,
      paused: h.paused ?? false,
      strength: h.strength ? Math.round(h.strength * 100) : 0,
      tags: h.tags ?? undefined,
      totalCompletions: h.totalCompletions ?? 0,
      why: h.why ?? undefined,
    })),
    letters: (rawData.letters ?? []).map((l: any) => ({
      content: l.content,
      createdAt: toISO(l.createdAt),
      habitId: l.habitId,
      isRead: l.isRead,
      title: l.title ?? undefined,
      unlockAt: toISO(l.unlockAt),
    })),
    notes: (rawData.notes ?? []).map((n: any) => ({
      body: n.body,
      createdAt: toISO(n.createdAt),
      date: n.date,
      habitId: n.habitId ?? undefined,
    })),
    reflections: (rawData.reflections ?? []).map((r: any) => ({
      createdAt: toISO(r.createdAt),
      date: r.date,
      emoji: r.emoji,
      habitId: r.habitId,
      note: r.note ?? undefined,
    })),
    settings: rawData.userSettings
      ? {
          catTheme: rawData.userSettings.catTheme,
          celebrationsEnabled: rawData.userSettings.celebrationsEnabled,
          darkMode: rawData.userSettings.darkMode,
          dayShape: rawData.userSettings.dayShape,
          habitCompletionIcon: rawData.userSettings.habitCompletionIcon,
          habitSortMode: rawData.userSettings.habitSortMode,
          highContrastMode: rawData.userSettings.highContrastMode,
          reduceMotion: rawData.userSettings.reduceMotion,
          showCalendarView: rawData.userSettings.showCalendarView,
          showConsistency: rawData.userSettings.showConsistency,
          showEmojis: rawData.userSettings.showEmojis,
          showMotivationalMessages:
            rawData.userSettings.showMotivationalMessages,
          showStreaks: rawData.userSettings.showStreaks,
          streakRemindersEnabled: rawData.userSettings.streakRemindersEnabled,
          streakReminderTime: rawData.userSettings.streakReminderTime,
          textSize: rawData.userSettings.textSize,
          useDyslexicFont: rawData.userSettings.useDyslexicFont,
        }
      : null,
    tracking: (rawData.tracking ?? []).map((t: any) => ({
      completed: t.completed,
      date: t.date,
      habitId: t.habitId,
    })),
    version: '2.0.0',
    visionBoardItems: (rawData.visionBoardItems ?? []).map((v: any) => ({
      body: v.body ?? undefined,
      createdAt: toISO(v.createdAt),
      habitId: v.habitId,
      title: v.title,
    })),
    voiceNotes: (rawData.voiceNotes ?? []).map((vn: any) => ({
      createdAt: toISO(vn.createdAt),
      duration: vn.duration,
      habitId: vn.habitId,
      isDay1: vn.isDay1 ?? undefined,
      label: vn.label ?? undefined,
    })),
  };
}
