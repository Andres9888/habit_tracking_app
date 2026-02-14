import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

// Permanently delete soft-deleted habits after 30-day retention period
// Runs daily at 3:00 AM UTC
crons.daily(
  'purge deleted habits',
  { hourUTC: 3, minuteUTC: 0 },
  internal.habits.purgeDeleted.purgeDeleted
);

export default crons;
