/**
 * Smart Notification Messages
 * 
 * Context-aware notification copy that adapts based on:
 * - Current streak length
 * - Time of day
 * - Days since last completion (comeback scenarios)
 * - Milestone proximity
 * 
 * Research-backed: Personalized reminders increase engagement by 3-5x
 * (Pinder et al., 2018; Morrison et al., 2020)
 */

export interface NotificationContext {
  habitName: string;
  currentStreak?: number;
  bestStreak?: number;
  lastCompletedDate?: string; // ISO date string (YYYY-MM-DD)
  reminderTime: Date;
}

export interface NotificationMessage {
  title: string;
  body: string;
}

/** Get the hour of day from reminder time */
function getTimeOfDay(date: Date): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

/** Get greeting based on time of day */
function getGreeting(timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'): string {
  const greetings = {
    morning: ['Good morning', 'Morning', 'Rise and shine', 'Hey there'],
    afternoon: ['Good afternoon', 'Afternoon check-in', 'Hey', 'Time to shine'],
    evening: ['Good evening', 'Evening time', 'Hey', 'Before bed'],
    night: ['Late night', 'Night check-in', 'Before sleep', 'End of day'],
  };
  
  const options = greetings[timeOfDay];
  return options[Math.floor(Math.random() * options.length)];
}

/** Calculate days since last completion */
function getDaysSinceLastCompletion(lastCompletedDate?: string): number | null {
  if (!lastCompletedDate) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastDate = new Date(lastCompletedDate);
  lastDate.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/** Check if streak is approaching a milestone */
function getUpcomingMilestone(currentStreak: number): { milestone: number; daysAway: number } | null {
  const milestones = [7, 14, 21, 30, 50, 75, 100, 200, 365];
  
  for (const milestone of milestones) {
    if (currentStreak < milestone) {
      const daysAway = milestone - currentStreak;
      if (daysAway <= 3) {
        return { milestone, daysAway };
      }
      break;
    }
  }
  
  return null;
}

/** Generate streak-aware message */
function getStreakMessage(context: NotificationContext): NotificationMessage | null {
  const { habitName, currentStreak = 0 } = context;
  
  // No streak yet - encouragement
  if (currentStreak === 0) {
    const messages = [
      { title: habitName, body: "Ready to start your streak? 💪" },
      { title: habitName, body: "Day 1 starts now! Let's go 🚀" },
      { title: habitName, body: "Every expert was once a beginner ⭐" },
      { title: habitName, body: "Your future self will thank you 🌟" },
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  // Active streak - celebrate it!
  if (currentStreak >= 1) {
    const messages = [
      { title: habitName, body: `Day ${currentStreak + 1}! Don't break the chain 🔥` },
      { title: habitName, body: `${currentStreak} day streak! Keep it alive 💪` },
      { title: habitName, body: `Streak: ${currentStreak} days. You're crushing it! ⚡` },
      { title: habitName, body: `${currentStreak} days strong! One more today? 🎯` },
    ];
    
    // Special messages for significant streaks
    if (currentStreak >= 7 && currentStreak < 14) {
      messages.push(
        { title: habitName, body: `Week ${Math.floor(currentStreak / 7) + 1}! You're building momentum 🚀` }
      );
    }
    
    if (currentStreak >= 30) {
      messages.push(
        { title: habitName, body: `${currentStreak} days! You're a habit master 👑` },
        { title: habitName, body: `${currentStreak}-day streak! Legendary status 🏆` }
      );
    }
    
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  return null;
}

/** Generate milestone proximity message */
function getMilestoneMessage(context: NotificationContext): NotificationMessage | null {
  const { habitName, currentStreak = 0 } = context;
  const milestone = getUpcomingMilestone(currentStreak);
  
  if (!milestone) return null;
  
  const { milestone: target, daysAway } = milestone;
  
  if (daysAway === 1) {
    return {
      title: habitName,
      body: `Tomorrow hits ${target} days! So close 🎯`,
    };
  }
  
  if (daysAway === 2) {
    return {
      title: habitName,
      body: `Just ${daysAway} days to ${target}-day milestone! 🔥`,
    };
  }
  
  if (daysAway === 3) {
    return {
      title: habitName,
      body: `${target} days coming up! Keep pushing 💪`,
    };
  }
  
  return null;
}

/** Generate comeback message for lapsed habits */
function getComebackMessage(context: NotificationContext): NotificationMessage | null {
  const { habitName, currentStreak = 0, bestStreak = 0, lastCompletedDate } = context;
  const daysSince = getDaysSinceLastCompletion(lastCompletedDate);
  
  // If completed recently, not a comeback scenario
  if (daysSince === null || daysSince <= 1) return null;
  
  const messages = [
    { title: habitName, body: `We miss you! Your ${habitName} streak was at ${bestStreak} days 💙` },
    { title: habitName, body: `Ready to start again? You did ${bestStreak} days before! 🌟` },
    { title: habitName, body: `Comeback time! Remember that ${bestStreak}-day streak? 💪` },
    { title: habitName, body: `${daysSince} days away. Let's rebuild that streak! 🚀` },
    { title: habitName, body: `You've done this before. Time to start fresh! ⭐` },
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

/** Generate time-aware message */
function getTimeAwareMessage(context: NotificationContext): NotificationMessage | null {
  const { habitName, reminderTime } = context;
  const timeOfDay = getTimeOfDay(reminderTime);
  const greeting = getGreeting(timeOfDay);
  
  const messages = {
    morning: [
      { title: habitName, body: `${greeting}! Start your day strong 💪` },
      { title: habitName, body: `${greeting}! Time for ${habitName} ☀️` },
      { title: habitName, body: `Morning routine time! Let's go 🌅` },
    ],
    afternoon: [
      { title: habitName, body: `${greeting}! Quick ${habitName} check-in ✨` },
      { title: habitName, body: `Midday boost! Time for ${habitName} ⚡` },
      { title: habitName, body: `Don't forget your ${habitName} today! 🎯` },
    ],
    evening: [
      { title: habitName, body: `${greeting}! Before the day ends 🌙` },
      { title: habitName, body: `Evening check-in for ${habitName} 🌆` },
      { title: habitName, body: `Finish strong today! ${habitName} time 💫` },
    ],
    night: [
      { title: habitName, body: `Before bed: ${habitName} check-in 😴` },
      { title: habitName, body: `Last call for ${habitName} today! 🌙` },
      { title: habitName, body: `End your day right with ${habitName} ⭐` },
    ],
  };
  
  const options = messages[timeOfDay];
  return options[Math.floor(Math.random() * options.length)];
}

/** Generate generic encouraging message (fallback) */
function getGenericMessage(context: NotificationContext): NotificationMessage {
  const { habitName } = context;
  
  const messages = [
    { title: habitName, body: "Time to check in on your progress! 📊" },
    { title: habitName, body: "Your daily reminder is here! 🔔" },
    { title: habitName, body: "Consistency is key! Let's do this 🔑" },
    { title: habitName, body: "Small steps, big results 🎯" },
    { title: habitName, body: "You've got this! 💪" },
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Generate a smart, context-aware notification message
 * 
 * Priority order:
 * 1. Comeback messages (if lapsed for 2+ days)
 * 2. Milestone proximity (if within 3 days of milestone)
 * 3. Streak-aware (if active streak exists)
 * 4. Time-aware (based on reminder time)
 * 5. Generic encouraging message (fallback)
 */
export function generateSmartNotification(context: NotificationContext): NotificationMessage {
  // 1. Check for comeback scenario (highest priority - re-engagement)
  const daysSince = getDaysSinceLastCompletion(context.lastCompletedDate);
  if (daysSince !== null && daysSince >= 2 && context.bestStreak && context.bestStreak > 0) {
    const comeback = getComebackMessage(context);
    if (comeback) return comeback;
  }
  
  // 2. Check for upcoming milestones (motivation boost)
  const milestone = getMilestoneMessage(context);
  if (milestone) return milestone;
  
  // 3. Streak-aware messaging (celebrate progress)
  const streak = getStreakMessage(context);
  if (streak) return streak;
  
  // 4. Time-aware messaging (contextual)
  const timeAware = getTimeAwareMessage(context);
  if (timeAware) return timeAware;
  
  // 5. Fallback to generic message
  return getGenericMessage(context);
}
