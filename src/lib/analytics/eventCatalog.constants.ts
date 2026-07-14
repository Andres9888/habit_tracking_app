export const EVENT_NAMES = [
  'app_opened',
  'checkout_started',
  'habit_archived',
  'habit_completed',
  'habit_created',
  'habit_deleted',
  'habit_uncompleted',
  'habit_week_completed',
  'habits_batch_archive_undone',
  'habits_batch_archived',
  'habits_batch_deleted',
  'paywall_viewed',
  'purchase_succeeded',
  'signup_completed',
] as const;

export const CLIENT_SOURCES = [
  'cold_start',
  'home_hero',
  'home_prompt',
  'paywall',
  'warm_start',
] as const;

export type ProductEventName = (typeof EVENT_NAMES)[number];
export type ClientEventSource = (typeof CLIENT_SOURCES)[number];

export const EVENT_ALIASES: Readonly<Record<string, ProductEventName>> = {
  habit_archived: 'habit_archived',
  habit_deleted: 'habit_deleted',
  habit_week_complete: 'habit_week_completed',
  habits_batch_archive_undone: 'habits_batch_archive_undone',
  habits_batch_archived: 'habits_batch_archived',
  habits_batch_deleted: 'habits_batch_deleted',
  premium_home_cta_view: 'paywall_viewed',
  premium_upgrade_cta: 'paywall_viewed',
};
