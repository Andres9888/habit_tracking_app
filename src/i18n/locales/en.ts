/**
 * English translations — default locale
 *
 * Organized by feature/screen. Keys use dot notation when accessed via t().
 */
const en = {
  // ── Common / shared ──────────────────────────────────────────────
  common: {
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save',
    saving: 'Saving…',
    delete: 'Delete',
    archive: 'Archive',
    back: 'Back',
    continue: 'Continue',
    error: 'Error',
    success: 'Success',
    tryAgain: 'Please try again.',
    loading: 'Loading',
    search: 'Search',
    done: 'Done',
    ok: 'OK',
    skip: 'Skip',
    next: 'Next',
    of: 'of',
    doneLabel: 'done',
  },

  // ── Auth ──────────────────────────────────────────────────────────
  auth: {
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    createPassword: 'Create a password',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    signOutConfirm: 'Are you sure you want to sign out?',
    continueWithApple: 'Continue with Apple',
    continueWithGoogle: 'Continue with Google',
    signInWithProvider: (provider: string) =>
      `Sign in using your ${provider} account`,
    forgotPassword: 'Forgot password?',
    validationErrorEmail: 'Please enter a valid email address',
    failedSignUp: 'Failed to sign up',
    failedSignIn: 'Failed to sign in',
    failedSignOut: 'Failed to sign out.',
    verificationIncomplete: 'Verification incomplete. Please try again.',
    verificationPlaceholder: 'Enter 6-digit code',
    deleteAccount: 'Delete Account',
    deleteAccountConfirm:
      'This will permanently delete your account and all your data. This action cannot be undone.',
    failedDeleteAccount:
      'Failed to delete account. Please try again or contact support.',
  },

  // ── Onboarding ────────────────────────────────────────────────────
  onboarding: {
    stages: ['Starting', 'Building', 'Growing', 'Strong', 'Automatic'] as const,
    heroStages: [
      { emoji: '🌱', label: 'Start' },
      { emoji: '🌿', label: 'Grow' },
      { emoji: '🌳', label: 'Thrive' },
    ],
    buildChains: 'Complete your habits daily to build unbreakable chains',
    scienceBacked: 'Science-Backed Strength',
    chooseTemplates:
      'Choose from science-backed habit templates or create your own',
    skipOnboarding: 'Skip onboarding',
    nextPage: 'Next onboarding page',
    getStartedCta: "Let's Build Your First Habit →",
    getStartedA11y: 'Get started building your first habit',
    chainTitle: "Don't Break the Chain",
    chainSubtitle:
      'Complete your habits daily and watch your chain grow — every link counts.',
    strengthTitle: 'Science-Backed Strength',
    strengthSubtitle:
      'Your habits get stronger over time — backed by behavioral science.',
    templatesTitle: '200+ Ready-Made Templates',
    templatesSubtitle:
      'Pick from science-backed templates or create your own in seconds.',
  },

  // ── Habits ────────────────────────────────────────────────────────
  habits: {
    habit: 'Habit',
    createHabit: 'Create Habit',
    createAction: 'Create habit',
    editHabit: 'Edit Habit',
    habitName: 'Habit name',
    habitNamePlaceholder: 'e.g., Read 10 minutes',
    habitNameHelper: 'Tip: Be specific — time, trigger, place.',
    iconLabel: 'Icon',
    colorLabel: 'Color',
    customColor: 'Custom color',
    motivationHighlight: 'Start your streak today',
    motivationSuffix: ' — consistency is key 🔥',
    deleteConfirmTitle: 'Delete Habit',
    deleteConfirmMessage: 'Are you sure you want to delete this habit?',
    archiveConfirmTitle: 'Archive Habit',
    archiveConfirmMessage: 'Are you sure you want to archive this habit?',
    failedDelete: 'Failed to delete habit. Please try again.',
    failedArchive: 'Failed to archive habit. Please try again.',
    failedUpdate: 'Failed to update habit. Please try again.',
    noHabitsYet: 'No habits yet',
    getStarted: 'Create your first habit to get started!',
    dayStreak: 'day streak',
    today: 'Today',
    completedOfTotal: (completed: number, total: number) =>
      `${completed} of ${total} done`,
  },

  // ── Templates ─────────────────────────────────────────────────────
  templates: {
    browseTemplates: 'Browse curated habits',
    heroTitle: 'Start from Template',
    heroSubtitle: 'Browse curated routines and auto‑fill details.',
    prompt: 'Prefer a ready-made routine?',
    orCreateYourOwn: 'or create your own',
    searchPlaceholder: 'Search habits...',
    searchKeywordsPlaceholder: 'Search habits or science keywords',
    enterHabitName: 'Enter habit name',
    sortPopular: 'Popular',
    sortNewest: 'Newest',
    sortAZ: 'A-Z',
    template: 'Template',
  },

  // ── Reminders ─────────────────────────────────────────────────────
  reminders: {
    label: 'Daily reminder',
    helper: "We'll only remind you at your chosen time.",
    time: 'Reminder time',
    disabled: 'Reminders disabled',
    withTime: (label: string, time: string) =>
      `Selected ${label} reminder at ${time}`,
    sound: 'Sound',
  },

  // ── Streaks & Progress ────────────────────────────────────────────
  streaks: {
    dayStreak: 'Day Streak',
    thisMonth: 'This Month',
    bestStreak: 'Best Streak',
    completionRate: 'Completion Rate',
  },

  // ── Strength levels ───────────────────────────────────────────────
  strength: {
    starting: 'Starting',
    building: 'Building',
    developing: 'Developing',
    strong: 'Strong',
    automatic: 'Automatic',
  },

  // ── Character / Gamification ──────────────────────────────────────
  character: {
    vitality: 'Vitality',
    strength: 'Strength',
    wisdom: 'Wisdom',
    energy: 'Energy',
    weekWarrior: 'Week Warrior',
    habitHero: 'Habit Hero',
  },

  // ── Analytics ─────────────────────────────────────────────────────
  analytics: {
    title: 'Analytics',
    subtitle: 'Track your habit journey',
    export: 'Export',
    totalHabits: 'Total Habits',
    averageStrength: 'Average Strength',
    strongestHabit: 'Strongest Habit',
    weakestHabit: 'Weakest Habit',
    weeklyInsights: 'Weekly Insights',
    habitRankings: 'Habit Rankings',
    noHabitsTitle: 'No habits yet',
    noHabitsMessage: 'Create a habit to see your analytics here.',
  },

  // ── Settings ──────────────────────────────────────────────────────
  settings: {
    title: 'Settings',
    theme: 'Theme',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    soundChime: 'Chime',
    soundPop: 'Pop',
    soundSuccess: 'Success',
    shareTitle: 'Chain Day — Build Better Habits',
    preferences: 'Preferences',
    appearance: 'Appearance',
    sounds: 'Sounds',
    premium: 'Premium',
    data: 'Data',
    archivedHabits: 'Archived Habits',
    closeSettings: 'Close settings',
    checkboxStyle: 'Checkbox style for completed habits',
    circularDayMarkers: 'Circular day markers',
    gradientFill: 'Gradient fill for habit strength',
    playSoundOnCompletion: 'Play sound on habit completion',
    unlockSounds: 'Unlock satisfying sounds when completing habits',
    shareApp: 'Share App',
    rateApp: 'Rate App',
    whatsNew: "What's New",
    sendFeedback: 'Send Feedback',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    about: 'About',
    version: 'Version',
    signOut: 'Sign Out',
    signOutConfirm: 'Are you sure you want to sign out?',
    streakReminders: 'Streak Reminders',
    legal: 'Legal',
  },

  // ── Notes ─────────────────────────────────────────────────────────
  notes: {
    datePlaceholder: 'YYYY-MM-DD',
    notePlaceholder: 'Write your note here...',
    searchPlaceholder: 'Search notes...',
  },

  // ── Quick Actions / Tips ──────────────────────────────────────────
  tips: {
    setDailyReminder: 'Set daily reminder',
    neverForget: 'Never forget with a daily nudge',
    trySmallerVersion: 'Try a smaller version',
    startWith2Min: 'Start with 2 minutes to build momentum',
    reviewYourWhy: 'Review your why',
    reconnectMotivation: 'Reconnect with your motivation',
    keepMomentum: 'Keep the momentum!',
    celebrateProgress: 'Celebrate your progress!',
    weekStreakMilestone: 'A week streak is a major milestone',
    setNewGoal: 'Set a new goal',
    aimFor14Days: 'Aim for 14 days next!',
    completeTodayToStart: 'Complete today to start',
    firstStep: 'Your first step toward building a habit',
    setReminder: 'Set a reminder',
    getNotified: 'Get notified at the right time',
  },

  // ── Frequency labels ──────────────────────────────────────────────
  frequency: {
    daily: 'Daily',
    weekly: 'Weekly',
    custom: 'Custom',
  },

  // ── Category labels ───────────────────────────────────────────────
  categories: {
    creativity: 'Creativity',
    financial: 'Financial',
    general: 'General',
    learning: 'Learning',
    mindfulness: 'Mindfulness',
    productivity: 'Productivity',
    sleep: 'Sleep',
    social: 'Social',
  },

  // ── Date / time (for locale-aware formatting) ─────────────────────
  dateTime: {
    am: 'AM',
    pm: 'PM',
    today: 'Today',
    days: {
      sunday: 'Sunday',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
    },
    daysShort: {
      sun: 'Sun',
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
    },
    months: {
      january: 'January',
      february: 'February',
      march: 'March',
      april: 'April',
      may: 'May',
      june: 'June',
      july: 'July',
      august: 'August',
      september: 'September',
      october: 'October',
      november: 'November',
      december: 'December',
    },
    monthsShort: {
      jan: 'Jan',
      feb: 'Feb',
      mar: 'Mar',
      apr: 'Apr',
      may: 'May',
      jun: 'Jun',
      jul: 'Jul',
      aug: 'Aug',
      sep: 'Sep',
      oct: 'Oct',
      nov: 'Nov',
      dec: 'Dec',
    },
  },

  // ── Detail screen ─────────────────────────────────────────────────
  detail: {
    editHabit: 'Edit habit',
    close: 'Close',
  },

  // ── HabitEdit screen ──────────────────────────────────────────────
  habitEdit: {
    title: 'Edit Habit',
    saveChanges: 'Save Changes',
  },
} as const;

export type TranslationKeys = typeof en;
export default en;
