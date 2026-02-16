/**
 * Dark Mode Color Palette
 *
 * ## How Dark Mode Works
 *
 * 1. **Color Definitions**: This file defines `darkColors` and `lightColors` objects
 *    that mirror each other in structure but use different color values.
 *
 * 2. **Selection Logic**: `ThemeContext.tsx` reads the user's dark mode preference
 *    from Convex settings and system color scheme, then selects the appropriate palette.
 *
 * 3. **Consumption**: Components use `useThemeColors()` hook to get the active palette.
 *    The hook returns either `darkColors` or `lightColors` based on current mode.
 *
 * 4. **Semantic Structure**: Both palettes expose the same semantic tokens
 *    (`background`, `card`, `text.primary`, etc.) so components don't need to know
 *    which mode is active.
 *
 * ## Design Philosophy
 *
 * Dark mode isn't just inverted colors — it's a carefully crafted palette that:
 * - Reduces eye strain in low-light environments
 * - Maintains WCAG AA contrast ratios
 * - Preserves brand identity (green accent remains recognizable)
 * - Uses elevated surfaces (lighter grays) to show depth
 *
 * ## Color Inversions
 *
 * - **Light mode**: Dark text on light backgrounds (gray-800 on gray-100)
 * - **Dark mode**: Light text on dark backgrounds (gray-50 on gray-800)
 * - **Primary green**: Lighter/brighter in dark mode for visibility
 * - **Surfaces**: Lighter = higher elevation (matches Material Design)
 *
 * @example
 * ```tsx
 * import { useThemeColors } from '@/theme/ThemeContext';
 *
 * function MyCard() {
 *   const { colors, isDark } = useThemeColors();
 *
 *   return (
 *     <View style={{
 *       backgroundColor: colors.card,
 *       borderColor: colors.border
 *     }}>
 *       <Text style={{ color: colors.text.primary }}>
 *         Auto-adapts to dark/light mode
 *       </Text>
 *     </View>
 *   );
 * }
 * ```
 */

/**
 * Dark Mode Semantic Colors
 *
 * Optimized for low-light viewing with inverted text/background hierarchy.
 * Uses gray-800 (#1F2937) as primary surface, gray-900 (#111827) as background.
 */
export const darkColors = {
  /** App canvas background — darkest layer (gray-900) */
  background: '#111827',

  /** Border color for cards and dividers (gray-700) */
  border: '#374151',

  /** Card surface — elevated above background (gray-800) */
  card: '#1F2937',

  /** Card border — slightly lighter than surface (gray-700) */
  cardBorder: '#374151',

  /**
   * Gray Scale (Inverted)
   *
   * In dark mode, lower numbers = darker (opposite of light mode).
   * 50 is darkest, 900 is lightest.
   */
  gray: {
    50: '#111827', // Darkest — backgrounds
    100: '#1F2937', // Dark surfaces
    200: '#374151', // Borders, dividers
    300: '#4B5563', // Disabled elements
    400: '#6B7280', // Placeholder text
    500: '#9CA3AF', // Secondary text
    600: '#D1D5DB', // Light text
    700: '#E5E7EB', // Lighter text
    800: '#F3F4F6', // Primary text
    900: '#F9FAFB', // Lightest — high emphasis text
  },

  /**
   * Primary Green (Brighter in Dark Mode)
   *
   * Uses lighter shades to maintain visibility against dark backgrounds.
   * The scale is partially inverted to keep semantics consistent.
   */
  primary: {
    100: '#064E3B', // Darkest — emerald-900 for dark backgrounds
    300: '#059669', // Darker accent
    400: '#10B981', // Medium accent
    500: '#34D399', // Brighter — default primary in dark mode
    600: '#6EE7B7', // Lighter accent
    700: '#A7F3D0', // Lightest — high contrast on dark
  },

  /** Elevated surface — same as card (gray-800) */
  surface: '#1F2937',

  /**
   * Text Color Hierarchy
   *
   * Uses inverted gray scale where lighter = higher emphasis.
   */
  text: {
    /** Inverse text — used on light surfaces in dark mode */
    inverse: '#111827',

    /** Primary text — highest emphasis (gray-50) */
    primary: '#F9FAFB',

    /** Secondary text — medium emphasis (gray-500) */
    secondary: '#9CA3AF',

    /** Tertiary text — low emphasis, WCAG AA 4.87:1 on dark card */
    tertiary: '#8E95A2',
  },

  // --- Extended semantic tokens for dark mode ---

  // Status colors
  error: '#F87171', // red-400 — brighter on dark
  errorBg: '#7F1D1D', // red-900
  errorBorder: '#991B1B', // red-800
  success: '#34D399', // emerald-400
  successBg: '#064E3B', // emerald-900
  successBorder: '#059669', // emerald-600
  warning: '#FBBF24', // amber-400
  warningBg: '#78350F', // amber-900
  warningBorder: '#92400E', // amber-800
  warningText: '#FDE68A', // amber-200
  info: '#60A5FA', // blue-400
  infoBg: '#1E3A5F', // blue-900
  infoBorder: '#1D4ED8', // blue-700

  // Overlay / modal
  overlay: '#000000',
  modalBg: '#1F2937',

  // Auth / onboarding screens
  authBg: '#111827',
  authSurface: '#1F2937',
  authMuted: '#9CA3AF',
  authHeading: '#F9FAFB',

  // Accent surfaces
  emeraldSurface: '#064E3B', // green tinted bg
  emeraldBorder: '#059669',
  amberSurface: '#78350F',
  amberBorder: '#B45309',
  amberText: '#FDE68A',
  purpleSurface: '#4C1D95', // violet-900
  purpleBorder: '#6D28D9',
  purpleText: '#C4B5FD',

  // Skeleton / loading
  skeleton: '#374151',
  skeletonShimmer: '#4B5563',

  // Button styles
  buttonPrimaryBg: '#059669',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondaryBg: '#374151',
  buttonSecondaryText: '#E5E7EB',

  // Badge / pill
  badgeMuted: '#374151',
  badgeMutedText: '#D1D5DB',

  // Streak
  streakMuted: '#8E95A2',

  // Science/tip boxes
  scienceBg: '#064E3B',
  scienceBorder: '#059669',
  scienceText: '#A7F3D0',
  scienceIconBg: '#059669',

  tipBg: '#78350F',
  tipBorder: '#B45309',
  tipText: '#FDE68A',
  tipIconBg: '#92400E',

  // Sync status
  syncPendingBg: '#78350F',
  syncPendingBorder: '#B45309',
  syncSuccessBg: '#064E3B',
  syncSuccessBorder: '#059669',
  syncSuccessText: '#A7F3D0',
  syncActiveBg: '#78350F',
  syncActiveBorder: '#92400E',
  syncActiveText: '#FDE68A',
  syncConflictBg: '#78350F',
  syncConflictBorder: '#B45309',
  syncConflictText: '#FDE68A',
  syncOfflineBg: '#1F2937',
  syncOfflineBorder: '#374151',
  syncOfflineText: '#9CA3AF',

  // Category badge
  categoryBadgeBg: '#4C1D95',
  categoryBadgeText: '#C4B5FD',

  // Social proof
  socialProofBg: '#78350F',
  socialProofText: '#FDE68A',

  // Sort/filter
  sortActiveBg: '#064E3B',
  sortActiveText: '#A7F3D0',

  // YouTube / red accent
  youtubeBg: '#7F1D1D',
  youtubeBorder: '#991B1B',
  youtubeText: '#F87171',

  // Notification badge
  notificationBg: '#EF4444',

  // Premium
  premiumBg: '#4C1D95',
  premiumText: '#C4B5FD',
  premiumAccent: '#8B5CF6',

  // Trial banner
  trialBg: '#7C3AED',
  trialText: '#FFFFFF',
  trialDismiss: '#9CA3AF',

  // Offline banner
  offlineBannerBg: '#1F2937',
  offlineBannerText: '#D1D5DB',
  offlineBannerMuted: '#9CA3AF',
  offlineBannerAccent: '#0EA5E9',
  offlineBannerDivider: '#374151',
  offlineBannerStatBg: '#78350F',
  offlineBannerStatText: '#FDE68A',

  // Day state (weekly summary)
  dayCompletedBg: '#10B981',
  dayCompletedBorder: '#10B981',
  dayMissedBg: '#374151',
  dayMissedBorder: '#4B5563',
  dayFutureBg: '#1F2937',
  dayFutureBorder: '#374151',
  dayPartialBg: '#78350F',
  dayPartialBorder: '#FBBF24',

  // Milestone progress
  milestoneBg: '#1F2937',
  milestoneBorder: '#374151',
  milestoneTrackBg: '#374151',
  milestoneText: '#D1D5DB',
  milestoneSecondary: '#9CA3AF',
  milestoneCelebrationBg: '#78350F',
  milestoneCelebrationBorder: '#FBBF24',
  milestoneCelebrationTitle: '#FDE68A',
  milestoneCelebrationSubtitle: '#FCD34D',
  milestoneCelebrationText: '#FDE68A',
  milestoneProgressFill: '#F59E0B',

  // Celebration
  celebrationText: '#FFFFFF',

  // Weekly summary card
  weeklyCardBg: '#1F2937',
  weeklyCardBorder: '#059669',
  weeklyHeaderText: '#9CA3AF',
  weeklyHeaderAccentText: '#F9FAFB',
  weeklyDayText: '#6B7280',

  // Next habit suggestion
  nextHabitBg: '#1F2937',
  nextHabitBadgeBg: '#78350F',
  nextHabitBadgeText: '#FDE68A',
  nextHabitCompletedBg: '#064E3B',
  nextHabitCompletedText: '#34D399',
  nextHabitCompletedTitle: '#A7F3D0',
  nextHabitTitle: '#F9FAFB',
  nextHabitHint: '#6B7280',
  nextHabitProgress: '#6B7280',
  nextHabitIndicatorBg: '#F59E0B',

  // Detail header
  detailHeaderBg: '#064E3B',

  // Medal card
  medalCardBg: '#78350F',
  medalCardText: '#FDE68A',
  emptyMedalBg: '#1F2937',
  emptyMedalText: '#4B5563',

  // Template card
  templateCardBg: '#1F2937',
  templateCardName: '#F9FAFB',
  templateCardDesc: '#9CA3AF',

  // Spotlight hero
  spotlightBadgeText: '#FFFFFF',
  spotlightActionPrimaryText: '#FFFFFF',
  spotlightActionSecondaryText: '#F9FAFB',
  spotlightContent: '#9CA3AF',
  spotlightContentAccent: '#A7F3D0',
  spotlightContentTitle: '#F9FAFB',

  // Collapsible category
  countTextHabits: '#9CA3AF',
  countTextScience: '#34D399',

  // Progress section
  progressSectionBg: '#1F2937',

  // Tip quick actions
  tipSheetTitle: '#F9FAFB',
  tipSheetSubtitle: '#9CA3AF',
  tipSheetDivider: '#374151',
  tipSheetLabel: '#9CA3AF',
  tipSheetValue: '#F9FAFB',

  // Template science modal
  scienceModalBadgeBg: '#78350F',
  scienceModalBadgeBorder: '#92400E',
  scienceModalHeroBg: '#374151',
  scienceModalHeroText: '#9CA3AF',
  scienceModalTitle: '#F9FAFB',
  scienceModalSkeleton: '#1F2937',
  scienceModalSkeletonBorder: '#374151',
  scienceModalSkeletonInner: '#111827',
  scienceModalAnimatedBg: '#1F2937',
  scienceModalAnimatedBorder: '#374151',

  // Form styles (templates)
  formPlaceholder: '#6B7280',
  formInputBg: '#1F2937',
  formInputBorder: '#374151',
  formInputText: '#9CA3AF',
  formSubmitBg: '#059669',
  formSubmitBorder: '#059669',

  // Search styles
  searchBg: '#1F2937',
  searchBorder: '#374151',

  // Browse styles
  browseText: '#9CA3AF',

  // Mini template card
  miniCardSubtext: '#9CA3AF',
  miniCardTitle: '#F9FAFB',
  miniCardImportText: '#FFFFFF',
  miniCardAccentBg: '#10B981',

  // Layout
  layoutBg: '#111827',
  layoutDivider: '#374151',

  // Custom color button border
  colorPickerBorder: '#6B7280',

  // Suggestion chip border
  suggestionChipBorder: '#374151',

  // Create habit suggestion chip
  createChipBorder: '#374151',

  // Insight chip pulse border
  insightPulseBorder: '#FB923C',

  // Filter controls
  filterActiveText: '#FFFFFF',

  // Premium paywall
  paywallActiveBorder: '#10B981',

  // Premium badge
  premiumBadgeBlueBg: '#1E3A5F',
  premiumBadgeBlueBorder: '#1D4ED8',
  premiumBadgeRedBg: '#7F1D1D',
  premiumBadgeRedBorder: '#991B1B',
  premiumBadgeBlueText: '#60A5FA',
  premiumBadgeRedText: '#F87171',

  // Habit card action
  habitCardActionText: '#FFFFFF',

  // Streak reminders
  streakReminderText: '#9CA3AF',

  // Reward toast
  rewardToastBg: '#7C3AED',

  // Error text
  accessibleErrorText: '#F87171',

  // Binary heatmap
  heatmapToggleActive: '#1F2937',
  heatmapToggleInactive: '#374151',
  heatmapStatBg: '#374151',

  // Error fallback
  errorFallbackText: '#F87171',

  // Modal backdrop
  modalBackdropBg: '#000000',

  // Streak celebration
  streakCelebrationText: '#FFFFFF',

  // Header accent bg
  headerAccentBg: '#10B981',

  // Sort styles
  sortBg: '#1F2937',
  sortBorder: '#374151',

  // Skeleton styles
  skeletonCardBg: '#1F2937',

  // Customizer styles
  customizerBg: '#374151',
  customizerLabel: '#9CA3AF',
  customizerTitle: '#F9FAFB',

  // Preview styles
  previewSubtext: '#9CA3AF',
  previewDeleteBg: '#DC2626',
  previewDeleteConfirmBg: '#7F1D1D',
  previewDeleteConfirmBorder: '#991B1B',

  // Control styles
  controlBorder: '#374151',
  controlActiveBg: '#059669',
  controlActiveBorder: '#059669',
  controlActiveText: '#F9FAFB',

  // Fullsize template preview
  fullsizeLayoutBg: '#111827',
  fullsizeHeroSubtext: '#9CA3AF',
  fullsizeHeroTitle: '#F9FAFB',
  fullsizeFooterSubtext: '#9CA3AF',
  fullsizeFooterButtonBg: '#10B981',
  fullsizeFooterButtonText: '#FFFFFF',
  fullsizeSuccessGlowBg: '#10B981',

  // Info box (blue)
  infoBoxBg: '#1E3A5F',
  infoBoxBorder: '#1D4ED8',
  infoBoxText: '#60A5FA',
} as const;

/**
 * Light Mode Semantic Colors
 *
 * Matches the core color palette defaults.
 * Uses warm stone tones for a calm, organic aesthetic.
 */
export const lightColors = {
  /** App canvas background — warm parchment (L0) */
  background: '#F5F1ED',

  /** Border color for cards and dividers */
  border: '#DDD8D2',

  /** Card surface — subtle lift above background (L1) */
  card: '#EDEAE5',

  /** Card border — same as general border */
  cardBorder: '#DDD8D2',

  /**
   * Gray Scale (Standard)
   *
   * Warm stone-based neutrals.
   * Lower numbers = lighter, higher numbers = darker.
   */
  gray: {
    50: '#FAF8F5', // Lightest — muted surfaces
    100: '#F5F1ED', // Background
    200: '#DDD8D2', // Borders, dividers
    300: '#C4BFB7', // Disabled elements
    400: '#6E6660', // Placeholder text, tertiary
    500: '#6B6560', // Secondary text
    600: '#524D47', // Body text
    700: '#3D3833', // Headings
    800: '#2D2A26', // Primary text
    900: '#1A1816', // Darkest — pure black alternative
  },

  /**
   * Primary Green (Forest Tones)
   *
   * Brand color — forest green.
   * Design system standard: #047857 for text, #059669 for buttons.
   */
  primary: {
    100: '#D1FAE5', // Lightest — tinted backgrounds
    300: '#6EE7B7', // Light — decorative, confetti
    400: '#34D399', // Medium — hover states
    500: '#10B981', // Default — success indicators, focus rings
    600: '#059669', // Buttons — primary CTA fills
    700: '#047857', // Darkest — high-contrast text on colored surfaces
  },

  /** Elevated surface — same as card (L1) */
  surface: '#EDEAE5',

  /**
   * Text Color Hierarchy
   *
   * Uses standard gray scale where darker = higher emphasis.
   */
  text: {
    /** Inverse text — white on colored backgrounds */
    inverse: '#FFFFFF',

    /** Primary text — highest emphasis (gray-800) */
    primary: '#2D2A26',

    /** Secondary text — medium emphasis (gray-500) */
    secondary: '#6B6560',

    /** Tertiary text — low emphasis (gray-400), WCAG AA compliant */
    tertiary: '#6E6660',
  },

  // --- Extended semantic tokens for light mode ---

  // Status colors
  error: '#B53030',
  errorBg: '#FEE2E2',
  errorBorder: '#FECACA',
  success: '#15793C',
  successBg: '#ecfdf5',
  successBorder: '#bbf7d0',
  warning: '#9A5504',
  warningBg: '#fef3c7',
  warningBorder: '#fbbf24',
  warningText: '#92400e',
  info: '#2563EB',
  infoBg: '#EFF6FF',
  infoBorder: '#BFDBFE',

  // Overlay / modal
  overlay: '#000000',
  modalBg: '#FFFFFF',

  // Auth / onboarding screens
  authBg: '#FAF8F5',
  authSurface: '#f5f5f4',
  authMuted: '#57534e',
  authHeading: '#1c1917',

  // Accent surfaces
  emeraldSurface: '#ecfdf5',
  emeraldBorder: '#bbf7d0',
  amberSurface: '#fef3c7',
  amberBorder: '#fbbf24',
  amberText: '#92400e',
  purpleSurface: '#ede9fe',
  purpleBorder: '#c4b5fd',
  purpleText: '#7c3aed',

  // Skeleton / loading
  skeleton: '#e5e7eb',
  skeletonShimmer: '#f3f4f6',

  // Button styles
  buttonPrimaryBg: '#111827',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondaryBg: '#f5f5f4',
  buttonSecondaryText: '#1c1917',

  // Badge / pill
  badgeMuted: '#f3f4f6',
  badgeMutedText: '#6B7280',

  // Streak
  streakMuted: '#78716c',

  // Science/tip boxes
  scienceBg: '#f0fdf4',
  scienceBorder: '#bbf7d0',
  scienceText: '#166534',
  scienceIconBg: '#bbf7d0',

  tipBg: '#fefce8',
  tipBorder: '#fef08a',
  tipText: '#854d0e',
  tipIconBg: '#fef08a',

  // Sync status
  syncPendingBg: '#fef3c7',
  syncPendingBorder: '#fcd34d',
  syncSuccessBg: '#f0fdf4',
  syncSuccessBorder: '#86efac',
  syncSuccessText: '#166534',
  syncActiveBg: '#fffbeb',
  syncActiveBorder: '#fde68a',
  syncActiveText: '#92400e',
  syncConflictBg: '#fffbeb',
  syncConflictBorder: '#fcd34d',
  syncConflictText: '#92400e',
  syncOfflineBg: '#fafaf9',
  syncOfflineBorder: '#e7e5e4',
  syncOfflineText: '#78716c',

  // Category badge
  categoryBadgeBg: '#ede9fe',
  categoryBadgeText: '#7c3aed',

  // Social proof
  socialProofBg: '#fffbeb',
  socialProofText: '#92400e',

  // Sort/filter
  sortActiveBg: '#f0fdf4',
  sortActiveText: '#374151',

  // YouTube / red accent
  youtubeBg: '#FEF2F2',
  youtubeBorder: '#FECACA',
  youtubeText: '#DC2626',

  // Notification badge
  notificationBg: '#ef4444',

  // Premium
  premiumBg: '#ede9fe',
  premiumText: '#7c3aed',
  premiumAccent: '#8b5cf6',

  // Trial banner
  trialBg: '#7c3aed',
  trialText: '#ffffff',
  trialDismiss: '#6b7280',

  // Offline banner
  offlineBannerBg: '#F4F4F5',
  offlineBannerText: '#27272A',
  offlineBannerMuted: '#71717A',
  offlineBannerAccent: '#0EA5E9',
  offlineBannerDivider: '#E4E4E7',
  offlineBannerStatBg: '#FEF3C7',
  offlineBannerStatText: '#92400E',

  // Day state (weekly summary)
  dayCompletedBg: '#10b981',
  dayCompletedBorder: '#10b981',
  dayMissedBg: '#e7e5e4',
  dayMissedBorder: '#d6d3d1',
  dayFutureBg: '#f5f5f4',
  dayFutureBorder: '#e7e5e4',
  dayPartialBg: '#fef3c7',
  dayPartialBorder: '#fbbf24',

  // Milestone progress
  milestoneBg: '#ffffff',
  milestoneBorder: '#e5e7eb',
  milestoneTrackBg: '#e5e7eb',
  milestoneText: '#1f2937',
  milestoneSecondary: '#78716c',
  milestoneCelebrationBg: '#fefce8',
  milestoneCelebrationBorder: '#fbbf24',
  milestoneCelebrationTitle: '#92400e',
  milestoneCelebrationSubtitle: '#78350f',
  milestoneCelebrationText: '#92400e',
  milestoneProgressFill: '#f59e0b',

  // Celebration
  celebrationText: '#FFFFFF',

  // Weekly summary card
  weeklyCardBg: '#ffffff',
  weeklyCardBorder: '#a7f3d0',
  weeklyHeaderText: '#78716c',
  weeklyHeaderAccentText: '#1c1917',
  weeklyDayText: '#a8a29e',

  // Next habit suggestion
  nextHabitBg: '#ffffff',
  nextHabitBadgeBg: '#fef3c7',
  nextHabitBadgeText: '#b45309',
  nextHabitCompletedBg: '#ecfdf5',
  nextHabitCompletedText: '#059669',
  nextHabitCompletedTitle: '#065f46',
  nextHabitTitle: '#1c1917',
  nextHabitHint: '#a8a29e',
  nextHabitProgress: '#a8a29e',
  nextHabitIndicatorBg: '#f59e0b',

  // Detail header
  detailHeaderBg: '#ecfdf5',

  // Medal card
  medalCardBg: '#ffedd5',
  medalCardText: '#c2410c',
  emptyMedalBg: '#fafaf9',
  emptyMedalText: '#d6d3d1',

  // Template card
  templateCardBg: '#fff',
  templateCardName: '#1c1917',
  templateCardDesc: '#4b5563',

  // Spotlight hero
  spotlightBadgeText: '#ffffff',
  spotlightActionPrimaryText: '#ffffff',
  spotlightActionSecondaryText: '#1c1917',
  spotlightContent: '#374151',
  spotlightContentAccent: '#166534',
  spotlightContentTitle: '#111827',

  // Collapsible category
  countTextHabits: '#78716c',
  countTextScience: '#059669',

  // Progress section
  progressSectionBg: '#ffffff',

  // Tip quick actions
  tipSheetTitle: '#1c1917',
  tipSheetSubtitle: '#78716c',
  tipSheetDivider: '#e7e5e4',
  tipSheetLabel: '#78716c',
  tipSheetValue: '#1c1917',

  // Template science modal
  scienceModalBadgeBg: '#FFF7ED',
  scienceModalBadgeBorder: '#FFEDD5',
  scienceModalHeroBg: '#F3F4F6',
  scienceModalHeroText: '#6B7280',
  scienceModalTitle: '#111827',
  scienceModalSkeleton: '#FFFFFF',
  scienceModalSkeletonBorder: '#e7e5e4',
  scienceModalSkeletonInner: '#FAFAF9',
  scienceModalAnimatedBg: '#FAFAFA',
  scienceModalAnimatedBorder: '#e7e5e4',

  // Form styles (templates)
  formPlaceholder: '#a8a29e',
  formInputBg: '#fff',
  formInputBorder: '#e7e5e4',
  formInputText: '#475467',
  formSubmitBg: '#111827',
  formSubmitBorder: '#111827',

  // Search styles
  searchBg: '#fff',
  searchBorder: '#e7e5e4',

  // Browse styles
  browseText: '#374151',

  // Mini template card
  miniCardSubtext: '#78716c',
  miniCardTitle: '#1c1917',
  miniCardImportText: '#fff',
  miniCardAccentBg: '#10b981',

  // Layout
  layoutBg: '#FAF8F5',
  layoutDivider: '#e5e7eb',

  // Custom color button border
  colorPickerBorder: '#a8a29e',

  // Suggestion chip border
  suggestionChipBorder: '#d6d3d1',

  // Create habit suggestion chip
  createChipBorder: '#e7e5e4',

  // Insight chip pulse border
  insightPulseBorder: '#fb923c',

  // Filter controls
  filterActiveText: '#fff',

  // Premium paywall
  paywallActiveBorder: '#10b981',

  // Premium badge
  premiumBadgeBlueBg: '#eff6ff',
  premiumBadgeBlueBorder: '#bfdbfe',
  premiumBadgeRedBg: '#fff5f5',
  premiumBadgeRedBorder: '#fecaca',
  premiumBadgeBlueText: '#3b82f6',
  premiumBadgeRedText: '#ff4500',

  // Habit card action
  habitCardActionText: '#FFFFFF',

  // Streak reminders
  streakReminderText: '#78716c',

  // Reward toast
  rewardToastBg: '#7c3aed',

  // Error text
  accessibleErrorText: '#B53030',

  // Binary heatmap
  heatmapToggleActive: '#ffffff',
  heatmapToggleInactive: '#f5f5f4',
  heatmapStatBg: '#f5f5f4',

  // Error fallback
  errorFallbackText: '#dc2626',

  // Modal backdrop
  modalBackdropBg: '#000',

  // Streak celebration
  streakCelebrationText: '#FFFFFF',

  // Header accent bg
  headerAccentBg: '#10b981',

  // Sort styles
  sortBg: '#ffffff',
  sortBorder: '#e7e5e4',

  // Skeleton styles
  skeletonCardBg: '#fff',

  // Customizer styles
  customizerBg: '#f3f4f6',
  customizerLabel: '#78716c',
  customizerTitle: '#1c1917',

  // Preview styles
  previewSubtext: '#78716c',
  previewDeleteBg: '#DC2626',
  previewDeleteConfirmBg: '#FEF2F2',
  previewDeleteConfirmBorder: '#FECACA',

  // Control styles
  controlBorder: '#e7e5e4',
  controlActiveBg: '#111827',
  controlActiveBorder: '#111827',
  controlActiveText: '#1c1917',

  // Fullsize template preview
  fullsizeLayoutBg: '#FAFAF9',
  fullsizeHeroSubtext: '#4B5563',
  fullsizeHeroTitle: '#1c1917',
  fullsizeFooterSubtext: '#6B7280',
  fullsizeFooterButtonBg: '#22c55e',
  fullsizeFooterButtonText: '#FFFFFF',
  fullsizeSuccessGlowBg: '#22c55e',

  // Info box (blue)
  infoBoxBg: '#EFF6FF',
  infoBoxBorder: '#BFDBFE',
  infoBoxText: '#2563EB',
} as const;

/**
 * Semantic Colors Interface
 *
 * Both `darkColors` and `lightColors` implement this interface,
 * ensuring structural consistency for theme switching.
 *
 * Components should only reference these semantic tokens, never raw hex values.
 */
export interface SemanticColors {
  /** App canvas background */
  background: string;

  /** Elevated surface color */
  surface: string;

  /** Card/container background */
  card: string;

  /** Card border color */
  cardBorder: string;

  /** Text colors by emphasis level */
  text: {
    /** Highest emphasis text */
    primary: string;
    /** Medium emphasis text */
    secondary: string;
    /** Low emphasis text */
    tertiary: string;
    /** Inverse text for colored backgrounds */
    inverse: string;
  };

  /** Border color for dividers and separators */
  border: string;

  /** Primary brand color scale */
  primary: {
    100: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
  };

  /** Grayscale palette */
  gray: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  // Extended tokens
  error: string;
  errorBg: string;
  errorBorder: string;
  success: string;
  successBg: string;
  successBorder: string;
  warning: string;
  warningBg: string;
  warningBorder: string;
  warningText: string;
  info: string;
  infoBg: string;
  infoBorder: string;
  overlay: string;
  modalBg: string;
  authBg: string;
  authSurface: string;
  authMuted: string;
  authHeading: string;
  emeraldSurface: string;
  emeraldBorder: string;
  amberSurface: string;
  amberBorder: string;
  amberText: string;
  purpleSurface: string;
  purpleBorder: string;
  purpleText: string;
  skeleton: string;
  skeletonShimmer: string;
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  buttonSecondaryBg: string;
  buttonSecondaryText: string;
  badgeMuted: string;
  badgeMutedText: string;
  streakMuted: string;
  scienceBg: string;
  scienceBorder: string;
  scienceText: string;
  scienceIconBg: string;
  tipBg: string;
  tipBorder: string;
  tipText: string;
  tipIconBg: string;
  syncPendingBg: string;
  syncPendingBorder: string;
  syncSuccessBg: string;
  syncSuccessBorder: string;
  syncSuccessText: string;
  syncActiveBg: string;
  syncActiveBorder: string;
  syncActiveText: string;
  syncConflictBg: string;
  syncConflictBorder: string;
  syncConflictText: string;
  syncOfflineBg: string;
  syncOfflineBorder: string;
  syncOfflineText: string;
  categoryBadgeBg: string;
  categoryBadgeText: string;
  socialProofBg: string;
  socialProofText: string;
  sortActiveBg: string;
  sortActiveText: string;
  youtubeBg: string;
  youtubeBorder: string;
  youtubeText: string;
  notificationBg: string;
  premiumBg: string;
  premiumText: string;
  premiumAccent: string;
  trialBg: string;
  trialText: string;
  trialDismiss: string;
  offlineBannerBg: string;
  offlineBannerText: string;
  offlineBannerMuted: string;
  offlineBannerAccent: string;
  offlineBannerDivider: string;
  offlineBannerStatBg: string;
  offlineBannerStatText: string;
  dayCompletedBg: string;
  dayCompletedBorder: string;
  dayMissedBg: string;
  dayMissedBorder: string;
  dayFutureBg: string;
  dayFutureBorder: string;
  dayPartialBg: string;
  dayPartialBorder: string;
  milestoneBg: string;
  milestoneBorder: string;
  milestoneTrackBg: string;
  milestoneText: string;
  milestoneSecondary: string;
  milestoneCelebrationBg: string;
  milestoneCelebrationBorder: string;
  milestoneCelebrationTitle: string;
  milestoneCelebrationSubtitle: string;
  milestoneCelebrationText: string;
  milestoneProgressFill: string;
  celebrationText: string;
  weeklyCardBg: string;
  weeklyCardBorder: string;
  weeklyHeaderText: string;
  weeklyHeaderAccentText: string;
  weeklyDayText: string;
  nextHabitBg: string;
  nextHabitBadgeBg: string;
  nextHabitBadgeText: string;
  nextHabitCompletedBg: string;
  nextHabitCompletedText: string;
  nextHabitCompletedTitle: string;
  nextHabitTitle: string;
  nextHabitHint: string;
  nextHabitProgress: string;
  nextHabitIndicatorBg: string;
  detailHeaderBg: string;
  medalCardBg: string;
  medalCardText: string;
  emptyMedalBg: string;
  emptyMedalText: string;
  templateCardBg: string;
  templateCardName: string;
  templateCardDesc: string;
  spotlightBadgeText: string;
  spotlightActionPrimaryText: string;
  spotlightActionSecondaryText: string;
  spotlightContent: string;
  spotlightContentAccent: string;
  spotlightContentTitle: string;
  countTextHabits: string;
  countTextScience: string;
  progressSectionBg: string;
  tipSheetTitle: string;
  tipSheetSubtitle: string;
  tipSheetDivider: string;
  tipSheetLabel: string;
  tipSheetValue: string;
  scienceModalBadgeBg: string;
  scienceModalBadgeBorder: string;
  scienceModalHeroBg: string;
  scienceModalHeroText: string;
  scienceModalTitle: string;
  scienceModalSkeleton: string;
  scienceModalSkeletonBorder: string;
  scienceModalSkeletonInner: string;
  scienceModalAnimatedBg: string;
  scienceModalAnimatedBorder: string;
  formPlaceholder: string;
  formInputBg: string;
  formInputBorder: string;
  formInputText: string;
  formSubmitBg: string;
  formSubmitBorder: string;
  searchBg: string;
  searchBorder: string;
  browseText: string;
  miniCardSubtext: string;
  miniCardTitle: string;
  miniCardImportText: string;
  miniCardAccentBg: string;
  layoutBg: string;
  layoutDivider: string;
  colorPickerBorder: string;
  suggestionChipBorder: string;
  createChipBorder: string;
  insightPulseBorder: string;
  filterActiveText: string;
  paywallActiveBorder: string;
  premiumBadgeBlueBg: string;
  premiumBadgeBlueBorder: string;
  premiumBadgeRedBg: string;
  premiumBadgeRedBorder: string;
  premiumBadgeBlueText: string;
  premiumBadgeRedText: string;
  habitCardActionText: string;
  streakReminderText: string;
  rewardToastBg: string;
  accessibleErrorText: string;
  heatmapToggleActive: string;
  heatmapToggleInactive: string;
  heatmapStatBg: string;
  errorFallbackText: string;
  modalBackdropBg: string;
  streakCelebrationText: string;
  headerAccentBg: string;
  sortBg: string;
  sortBorder: string;
  skeletonCardBg: string;
  customizerBg: string;
  customizerLabel: string;
  customizerTitle: string;
  previewSubtext: string;
  previewDeleteBg: string;
  previewDeleteConfirmBg: string;
  previewDeleteConfirmBorder: string;
  controlBorder: string;
  controlActiveBg: string;
  controlActiveBorder: string;
  controlActiveText: string;
  fullsizeLayoutBg: string;
  fullsizeHeroSubtext: string;
  fullsizeHeroTitle: string;
  fullsizeFooterSubtext: string;
  fullsizeFooterButtonBg: string;
  fullsizeFooterButtonText: string;
  fullsizeSuccessGlowBg: string;
  infoBoxBg: string;
  infoBoxBorder: string;
  infoBoxText: string;
}
