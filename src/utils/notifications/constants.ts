/**
 * Android notification channel IDs
 */
export const ANDROID_CHANNEL_ID = 'habit-reminders';
export const ANDROID_LETTER_CHANNEL_ID = 'letter-unlocks';
export const ANDROID_AFFIRMATION_CHANNEL_ID = 'affirmation-delivery';

/**
 * Notification type identifier for letter unlocks
 * Used to differentiate from habit reminders in the notification response handler
 */
export const NOTIFICATION_TYPE_LETTER_UNLOCK = 'letterUnlock';

/**
 * Notification type identifier for affirmation delivery
 * Used to differentiate from habit reminders and letter unlocks
 */
export const NOTIFICATION_TYPE_AFFIRMATION_DELIVERY = 'affirmationDelivery';

/**
 * Android notification channel ID for weekly review
 */
export const ANDROID_WEEKLY_REVIEW_CHANNEL_ID = 'weekly-review';

/**
 * Notification type identifier for weekly review
 */
export const NOTIFICATION_TYPE_WEEKLY_REVIEW = 'weeklyReview';
