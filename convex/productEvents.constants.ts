import { v } from 'convex/values';

export const PRODUCT_EVENT_NAMES = [
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
  'settings_opened',
  'signup_completed',
] as const;

export type ProductEventName = (typeof PRODUCT_EVENT_NAMES)[number];

export const PRODUCT_EVENT_SOURCES = [
  'clerk_sync',
  'cold_start',
  'habit_toggle',
  'home_hero',
  'home_prompt',
  'manual',
  'paywall',
  'revenuecat_paid',
  'revenuecat_trial',
  'template',
  'template_catalog',
  'template_details',
  'template_pack',
  'template_popular',
  'template_prescription',
  'warm_start',
] as const;

export type ProductEventSource = (typeof PRODUCT_EVENT_SOURCES)[number];

export const productEventNameValidator = v.union(
  v.literal('app_opened'),
  v.literal('checkout_started'),
  v.literal('habit_archived'),
  v.literal('habit_completed'),
  v.literal('habit_created'),
  v.literal('habit_deleted'),
  v.literal('habit_uncompleted'),
  v.literal('habit_week_completed'),
  v.literal('habits_batch_archive_undone'),
  v.literal('habits_batch_archived'),
  v.literal('habits_batch_deleted'),
  v.literal('paywall_viewed'),
  v.literal('purchase_succeeded'),
  v.literal('settings_opened'),
  v.literal('signup_completed')
);

export const productEventSourceValidator = v.union(
  v.literal('clerk_sync'),
  v.literal('cold_start'),
  v.literal('habit_toggle'),
  v.literal('home_hero'),
  v.literal('home_prompt'),
  v.literal('manual'),
  v.literal('paywall'),
  v.literal('revenuecat_paid'),
  v.literal('revenuecat_trial'),
  v.literal('template'),
  v.literal('template_catalog'),
  v.literal('template_details'),
  v.literal('template_pack'),
  v.literal('template_popular'),
  v.literal('template_prescription'),
  v.literal('warm_start')
);
