/**
 * Centralized logging utility with conditional debug output
 *
 * Debug logs are disabled in production builds automatically.
 * Use these instead of console.log for cleaner code and production safety.
 */

const isDevelopment = __DEV__;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  /** Namespace/module name for the log */
  module?: string;
  /** Additional context data */
  data?: Record<string, unknown>;
}

/**
 * Creates a namespaced logger for a specific module
 */
export function createLogger(moduleName: string) {
  return {
    debug: (message: string, data?: Record<string, unknown>) => {
      logger.debug(message, { module: moduleName, data });
    },
    info: (message: string, data?: Record<string, unknown>) => {
      logger.info(message, { module: moduleName, data });
    },
    warn: (message: string, data?: Record<string, unknown>) => {
      logger.warn(message, { module: moduleName, data });
    },
    error: (message: string, error?: unknown, data?: Record<string, unknown>) => {
      logger.error(message, error, { module: moduleName, data });
    },
  };
}

/**
 * Main logger object with methods for each log level
 */
export const logger = {
  /**
   * Debug-level logging - only shown in development
   */
  debug: (message: string, options?: LoggerOptions) => {
    if (!isDevelopment) return;

    const prefix = options?.module ? `[${options.module}]` : '';
    if (options?.data) {
      console.log(`${prefix} ${message}`, options.data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  },

  /**
   * Info-level logging - only shown in development
   */
  info: (message: string, options?: LoggerOptions) => {
    if (!isDevelopment) return;

    const prefix = options?.module ? `[${options.module}]` : '';
    if (options?.data) {
      console.info(`${prefix} ${message}`, options.data);
    } else {
      console.info(`${prefix} ${message}`);
    }
  },

  /**
   * Warning-level logging - shown in all environments
   */
  warn: (message: string, options?: LoggerOptions) => {
    const prefix = options?.module ? `[${options.module}]` : '';
    if (options?.data) {
      console.warn(`${prefix} ${message}`, options.data);
    } else {
      console.warn(`${prefix} ${message}`);
    }
  },

  /**
   * Error-level logging - shown in all environments
   * Includes error object for stack trace when available
   */
  error: (message: string, error?: unknown, options?: LoggerOptions) => {
    const prefix = options?.module ? `[${options.module}]` : '';
    if (error) {
      console.error(`${prefix} ${message}`, error, options?.data ?? '');
    } else if (options?.data) {
      console.error(`${prefix} ${message}`, options.data);
    } else {
      console.error(`${prefix} ${message}`);
    }
  },
};

export default logger;
