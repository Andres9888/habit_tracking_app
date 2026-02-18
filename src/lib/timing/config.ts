/**
 * Timing Constants Configuration
 * Centralized location for all application timeouts, delays, and durations
 */

/**
 * UI Animation Durations (in milliseconds)
 */
export const ANIMATION_DURATIONS = {
  // Quick animations
  QUICK: 150,
  
  // Standard animations
  STANDARD: 280,
  
  // Medium animations
  MEDIUM: 300,
  SLOW: 400,
  
  // Hero/feature animations
  HERO: 2000,
  
  // Celebration & complex animations
  CELEBRATION: 1500,
  CELEBRATION_EXTENDED: 1800,
  CELEBRATION_HEAVY: 2000,
  CELEBRATION_BURST: 2500,
  
  // Success screen animations
  SUCCESS_ENTER: 1500,
  SUCCESS_EXTENDED: 1800,
  SUCCESS_CHECKPOINT: 800,
  SUCCESS_CONFETTI: 2000,
  
  // Transition animations
  FADE_IN_QUICK: 200,
  FADE_OUT_QUICK: 150,
  FADE_IN_STANDARD: 300,
  FADE_OUT_STANDARD: 200,
  
  // Progress animations
  PROGRESS_BAR: 800,
  PROGRESS_FILL: 500,
  
  // Strength indicator
  STRENGTH_FILL: 800,
  STRENGTH_INDICATOR: 300,
  
  // Pulsing effects
  PULSE_STANDARD: 600,
  PULSE_GLOW: 700,
  PULSE_EXTENDED: 1000,
  PULSE_LONG: 1500,
  
  // Skeletal loading shimmer
  SHIMMER: 1500,
  
  // Form interactions
  FORM_INTERACTION: 200,
  
  // Border animations
  BORDER_ANIMATION: 3000,
  
  // Loading spinner
  SPINNER_ROTATE: 1000,
  
  // Tab transitions
  TAB_TRANSITION: 200,
  
  // Modal enter/exit
  MODAL_ENTER: 350,
  MODAL_EXIT: 150,
  MODAL_CONFIRM: 200,
  MODAL_DISMISS: 300,
  
  // Gesture feedback
  PRESS_FEEDBACK: 100,
  RELEASE_FEEDBACK: 100,
  
  // Confetti and particles
  CONFETTI_BURST: 2000,
  PARTICLE_FADE: 400,
  PARTICLE_EXTENDED: 2200,
  PARTICLE_LONG: 3000,
  
  // Waveform animation
  WAVEFORM_RESPONSE: 200,
  WAVEFORM_PULSE: 100,
  
  // Template preview
  TEMPLATE_PREVIEW_ENTER: 350,
  TEMPLATE_PREVIEW_CONFIRM: 400,
  TEMPLATE_PREVIEW_EXIT: 500,
  TEMPLATE_PREVIEW_SUCCESS_SCALE: 200,
  TEMPLATE_PREVIEW_SUCCESS_ROTATE: 300,
  TEMPLATE_PREVIEW_SUCCESS_EXIT: 500,
  
  // Lock animations
  LOCK_SCALE: 100,
  LOCK_PREMIUM: 2000,
  
  // Spotlight hero
  SPOTLIGHT_ENTRANCE: 400,
  SPOTLIGHT_ANIMATION: 2000,
  SPOTLIGHT_EXIT: 0,
} as const;

/**
 * Stagger Delays (in milliseconds)
 * Used for sequential animations in lists and grids
 */
export const STAGGER_DELAYS = {
  // Standard stagger increments
  BASE: 60,
  MEDIUM: 100,
  LARGE: 120,
  
  // Specific use cases
  AVATAR_STAGGER: 110,
  ITEM_STAGGER: 100,
  CHAIN_LINK: 120,
  CARD_STAGGER: 50,
  
  // Component-specific
  SECTION_LABEL: 80,
  SECTION_LABEL_ALTERNATE: 60,
} as const;

/**
 * Delay Constants (in milliseconds)
 * Fixed delays for specific UI interactions
 */
export const DELAYS = {
  // Micro delays
  MINIMAL: 50,
  SHORT: 100,
  MEDIUM: 200,
  LONG: 300,
  EXTRA_LONG: 400,
  VERY_LONG: 500,
  
  // Focus/input interactions
  INPUT_FOCUS: 100,
  
  // Transition delays
  MODAL_ENTRANCE_BASE: 200,
  MODAL_ENTRANCE_OFFSET: 60,
  
  // Auth screen
  AUTH_LOGO: 50,
  AUTH_HEADER: 110,
  AUTH_CONTENT: 170,
  
  // Loading states
  SKELETON_BASE: 100,
  SKELETON_OFFSET: 50,
  
  // Toast/notification
  TOAST_DISMISS_CLOSE: 250,
  TOAST_DISMISS_DELAY: 300,
  
  // Confetti burst
  CONFETTI_PARTICLE_FADE_START: 1500,
  CONFETTI_PARTICLE_FADE_DURATION: 500,
  
  // Template browser
  TEMPLATE_BROWSER_OPEN: 160,
  
  // Vision board image
  VISION_BOARD_CLOSE: 300,
  
  // Settings modal
  SETTINGS_MODAL_CLOSE: 300,
  
  // Habit detail
  HABIT_DETAIL_STRENGTH_SECTION: 240,
  HABIT_DETAIL_HISTORY_SECTION: 360,
  
  // Habit edit
  HABIT_EDIT_CUSTOMIZE: 220,
  HABIT_EDIT_DANGER: 340,
  
  // Analytics refresh
  ANALYTICS_REFRESH: 1000,
  
  // Verification cooldown timer
  VERIFICATION_TIMER: 1000,
  
  // Failure viz
  FAILURE_VIZ_BASE: 200,
  FAILURE_VIZ_STAGGER: 100,
  
  // Undo actions
  UNDO_TOAST_DURATION: 5000,
  
  // Preview skeleton
  PREVIEW_SKELETON_HIDE: 400,
} as const;

/**
 * Timeout Constants (in milliseconds)
 * For async operations, API calls, and process management
 */
export const TIMEOUTS = {
  // API and network
  API_REQUEST: 30_000, // 30 seconds
  API_TIMEOUT_LONG: 30_000,
  
  // Debounce/throttle
  DEBOUNCE_STANDARD: 300,
  
  // Circuit breaker
  CIRCUIT_BREAKER_RESET: 30_000, // 30 seconds
  
  // Async operations
  REQUEST_IDLE_CALLBACK: 2000,
  
  // Purchases
  PURCHASES_INIT: 500,
  
  // Floating XP visibility
  FLOATING_XP_DURATION: 1000,
  
  // Confetti clear
  CONFETTI_CLEAR: 700,
  CONFETTI_CLEAR_EXTENDED: 1000,
  
  // Toggle operations
  QUICK_COMPLETE_TOGGLE: 300,
  QUICK_COMPLETE_CONFETTI: 700,
  
  // Offline queue processing
  OFFLINE_QUEUE_PROCESS: 1000,
  
  // Test timeouts
  E2E_WAIT: 500,
  E2E_WAIT_EXTENDED: 10000,
} as const;

/**
 * Spring Timing (react-native-reanimated)
 */
export const SPRING_CONFIGS = {
  STANDARD: {
    damping: 10,
    mass: 1,
    overshootClamping: false,
    restDisplacementThreshold: 0.001,
    restSpeedThreshold: 0.001,
    stiffness: 100,
  },
} as const;

/**
 * Voice Note Durations (in milliseconds)
 */
export const VOICE_NOTE_DURATIONS = {
  MAX_DURATION: 120_000, // 2 minutes in milliseconds
} as const;

/**
 * Confetti Configuration Durations
 */
export const CONFETTI_DURATIONS = {
  HERO: 3000,
  STANDARD: 2000,
  EXTENDED: 2200,
  BURST: 2500,
  PARTICLES: 2000,
  SCIENCE_MODAL: 1500,
  SCIENCE_MODAL_EXTENDED: 2000,
} as const;

/**
 * Random Delay Ranges (in milliseconds)
 */
export const RANDOM_DELAYS = {
  CONFETTI_PARTICLE: 300, // 0-300ms random
  PARTICLE_BURST: 400, // 0-400ms random
  CONFETTI_SUCCESS: 400, // 0-400ms random
} as const;
