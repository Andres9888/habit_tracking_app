/**
 * Input Validation Tests (SEC-003)
 *
 * Tests for all input validation utilities.
 */
import {
  validateHabitName,
  validateLongText,
  validateShortText,
  validateUrl,
  validateTimeFormat,
  validateColor,
  validateEmoji,
  validateIdentifier,
  containsDangerousPatterns,
  requireValid,
  ALLOWED_STORAGE_DOMAINS,
  MAX_HABIT_NAME_LENGTH,
  MAX_LONG_TEXT_LENGTH,
  MAX_URL_LENGTH,
} from './inputValidation';

describe('containsDangerousPatterns', () => {
  it('should detect script tags', () => {
    expect(containsDangerousPatterns('<script>alert(1)</script>')).toBe(true);
    expect(containsDangerousPatterns('<SCRIPT src="evil.js">')).toBe(true);
    expect(containsDangerousPatterns('hello <script>')).toBe(true);
  });

  it('should detect event handlers', () => {
    expect(containsDangerousPatterns('onclick=alert(1)')).toBe(true);
    expect(containsDangerousPatterns('onerror = malicious()')).toBe(true);
    expect(containsDangerousPatterns('onload="bad()"')).toBe(true);
  });

  it('should detect javascript protocol', () => {
    expect(containsDangerousPatterns('javascript:alert(1)')).toBe(true);
    expect(containsDangerousPatterns('JAVASCRIPT:void(0)')).toBe(true);
    expect(containsDangerousPatterns('vbscript:msgbox')).toBe(true);
  });

  it('should detect data URLs with HTML', () => {
    expect(containsDangerousPatterns('data:text/html,<script>alert(1)</script>')).toBe(true);
  });

  it('should detect iframe injection', () => {
    expect(containsDangerousPatterns('<iframe src="evil.com">')).toBe(true);
    expect(containsDangerousPatterns('<IFRAME>')).toBe(true);
  });

  it('should detect SQL injection patterns', () => {
    expect(containsDangerousPatterns("'; DROP TABLE users;--")).toBe(true);
    expect(containsDangerousPatterns("UNION SELECT * FROM passwords")).toBe(true);
    expect(containsDangerousPatterns("' OR '1'='1")).toBe(true);
  });

  it('should allow normal text', () => {
    expect(containsDangerousPatterns('Hello, world!')).toBe(false);
    expect(containsDangerousPatterns('My habit is to exercise daily')).toBe(false);
    expect(containsDangerousPatterns('I want to drink 8 glasses of water')).toBe(false);
    expect(containsDangerousPatterns('Note: remember to call mom')).toBe(false);
  });

  it('should allow emoji', () => {
    expect(containsDangerousPatterns('Exercise daily 💪')).toBe(false);
    expect(containsDangerousPatterns('🎯 Hit my goals')).toBe(false);
  });
});

describe('validateHabitName', () => {
  it('should accept valid habit names', () => {
    expect(validateHabitName('Exercise')).toEqual({ isValid: true, sanitized: 'Exercise' });
    expect(validateHabitName('Drink Water')).toEqual({ isValid: true, sanitized: 'Drink Water' });
    expect(validateHabitName('🏃 Run daily')).toEqual({ isValid: true, sanitized: '🏃 Run daily' });
  });

  it('should trim whitespace', () => {
    const result = validateHabitName('  Exercise  ');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('Exercise');
  });

  it('should reject empty names', () => {
    expect(validateHabitName('')).toEqual({ isValid: false, error: 'Habit name cannot be empty' });
    expect(validateHabitName('   ')).toEqual({ isValid: false, error: 'Habit name cannot be empty' });
  });

  it('should reject names exceeding max length', () => {
    const longName = 'a'.repeat(MAX_HABIT_NAME_LENGTH + 1);
    const result = validateHabitName(longName);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('cannot exceed');
  });

  it('should reject names with dangerous patterns', () => {
    const result = validateHabitName('<script>alert(1)</script>');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('invalid characters');
  });

  it('should handle undefined', () => {
    expect(validateHabitName(undefined)).toEqual({ isValid: true });
  });
});

describe('validateLongText', () => {
  it('should accept valid text', () => {
    expect(validateLongText('This is a note')).toEqual({ isValid: true, sanitized: 'This is a note' });
  });

  it('should reject text exceeding max length', () => {
    const longText = 'a'.repeat(MAX_LONG_TEXT_LENGTH + 1);
    const result = validateLongText(longText);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('cannot exceed');
  });

  it('should use custom field name in error', () => {
    const longText = 'a'.repeat(1001);
    const result = validateLongText(longText, 1000, 'Note body');
    expect(result.error).toContain('Note body');
  });

  it('should reject dangerous patterns', () => {
    const result = validateLongText('<script>alert(1)</script>');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('invalid content');
  });
});

describe('validateUrl', () => {
  it('should accept valid HTTPS URLs', () => {
    const result = validateUrl('https://example.com/file.mp3');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('https://example.com/file.mp3');
  });

  it('should reject HTTP URLs by default', () => {
    const result = validateUrl('http://example.com/file.mp3');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('must use HTTPS');
  });

  it('should allow HTTP when requireHttps is false', () => {
    const result = validateUrl('http://example.com/file.mp3', { requireHttps: false });
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid URLs', () => {
    const result = validateUrl('not-a-url');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('not a valid URL');
  });

  it('should enforce domain allowlist', () => {
    const result = validateUrl('https://evil.com/file.mp3', {
      allowedDomains: ALLOWED_STORAGE_DOMAINS,
    });
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('domain is not allowed');
  });

  it('should accept allowed domains', () => {
    const result = validateUrl('https://example.convex.cloud/file.mp3', {
      allowedDomains: ALLOWED_STORAGE_DOMAINS,
    });
    expect(result.isValid).toBe(true);
  });

  it('should reject URLs exceeding max length', () => {
    const longUrl = 'https://example.com/' + 'a'.repeat(MAX_URL_LENGTH);
    const result = validateUrl(longUrl);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('cannot exceed');
  });

  it('should reject javascript protocol', () => {
    const result = validateUrl('javascript:alert(1)');
    expect(result.isValid).toBe(false);
  });

  it('should reject empty URLs', () => {
    const result = validateUrl('');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('cannot be empty');
  });
});

describe('validateTimeFormat', () => {
  it('should accept valid times', () => {
    expect(validateTimeFormat('08:30')).toEqual({ isValid: true, sanitized: '08:30' });
    expect(validateTimeFormat('00:00')).toEqual({ isValid: true, sanitized: '00:00' });
    expect(validateTimeFormat('23:59')).toEqual({ isValid: true, sanitized: '23:59' });
  });

  it('should accept AM/PM times and normalize to HH:MM', () => {
    expect(validateTimeFormat('8:30 AM')).toEqual({
      isValid: true,
      sanitized: '08:30',
    });
    expect(validateTimeFormat('12:00 AM')).toEqual({
      isValid: true,
      sanitized: '00:00',
    });
    expect(validateTimeFormat('1:45 PM')).toEqual({
      isValid: true,
      sanitized: '13:45',
    });
  });

  it('should reject invalid times', () => {
    expect(validateTimeFormat('24:00')).toEqual({ isValid: false, error: expect.stringContaining('HH:MM') });
    expect(validateTimeFormat('8:30')).toEqual({ isValid: true, sanitized: '08:30' });
    expect(validateTimeFormat('08:60')).toEqual({ isValid: false, error: expect.stringContaining('HH:MM') });
    expect(validateTimeFormat('morning')).toEqual({ isValid: false, error: expect.stringContaining('HH:MM') });
  });

  it('should handle undefined', () => {
    expect(validateTimeFormat(undefined)).toEqual({ isValid: true });
  });
});

describe('validateColor', () => {
  it('should accept hex colors', () => {
    expect(validateColor('#fff')).toEqual({ isValid: true, sanitized: '#fff' });
    expect(validateColor('#ffffff')).toEqual({ isValid: true, sanitized: '#ffffff' });
    expect(validateColor('#FF5733')).toEqual({ isValid: true, sanitized: '#ff5733' });
    expect(validateColor('#ff5733ff')).toEqual({ isValid: true, sanitized: '#ff5733ff' });
  });

  it('should accept named colors', () => {
    expect(validateColor('red')).toEqual({ isValid: true, sanitized: 'red' });
    expect(validateColor('Blue')).toEqual({ isValid: true, sanitized: 'blue' });
    expect(validateColor('PURPLE')).toEqual({ isValid: true, sanitized: 'purple' });
  });

  it('should accept app-specific colors', () => {
    expect(validateColor('primary')).toEqual({ isValid: true, sanitized: 'primary' });
    expect(validateColor('accent')).toEqual({ isValid: true, sanitized: 'accent' });
  });

  it('should reject invalid colors', () => {
    expect(validateColor('#gg0000')).toEqual({ isValid: false, error: expect.stringContaining('invalid') });
    expect(validateColor('rainbow')).toEqual({ isValid: false, error: expect.stringContaining('invalid') });
  });
});

describe('validateEmoji', () => {
  it('should accept single emoji', () => {
    expect(validateEmoji('🏃')).toEqual({ isValid: true, sanitized: '🏃' });
    expect(validateEmoji('💪')).toEqual({ isValid: true, sanitized: '💪' });
  });

  it('should accept emoji with modifiers', () => {
    expect(validateEmoji('👋🏻')).toEqual({ isValid: true, sanitized: '👋🏻' });
    expect(validateEmoji('👩‍💻')).toEqual({ isValid: true, sanitized: '👩‍💻' });
  });

  it('should reject dangerous patterns in emoji field', () => {
    const result = validateEmoji('<script>');
    expect(result.isValid).toBe(false);
  });

  it('should reject overly long input', () => {
    const result = validateEmoji('a'.repeat(25));
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('too long');
  });
});

describe('validateIdentifier', () => {
  it('should accept valid identifiers', () => {
    expect(validateIdentifier('default-sound')).toEqual({ isValid: true, sanitized: 'default-sound' });
    expect(validateIdentifier('notification_1')).toEqual({ isValid: true, sanitized: 'notification_1' });
    expect(validateIdentifier('app:sound:chime')).toEqual({ isValid: true, sanitized: 'app:sound:chime' });
  });

  it('should reject identifiers with special characters', () => {
    expect(validateIdentifier('sound<script>')).toEqual({ isValid: false, error: expect.stringContaining('invalid') });
    expect(validateIdentifier('sound name')).toEqual({ isValid: false, error: expect.stringContaining('invalid') });
  });
});

describe('requireValid', () => {
  it('should return sanitized value on success', () => {
    const result = { isValid: true, sanitized: 'trimmed' } as const;
    expect(requireValid(result, 'original')).toBe('trimmed');
  });

  it('should return original if no sanitized value', () => {
    const result = { isValid: true } as const;
    expect(requireValid(result, 'original')).toBe('original');
  });

  it('should throw on validation failure', () => {
    const result = { isValid: false, error: 'Test error' } as const;
    expect(() => requireValid(result, 'value')).toThrow('Test error');
  });
});
