import { markAppStarted } from './session';

// This module is intentionally imported before App from the native entrypoint,
// so the timer includes application module evaluation and initial rendering.
markAppStarted();
