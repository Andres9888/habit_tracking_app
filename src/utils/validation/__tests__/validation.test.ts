/**
 * Tests for validation utilities
 */

import {
  validateEmail,
  validatePassword,
  validateHabitName,
  validateLongText,
  validateShortText,
} from '../index';

describe('Email Validation', () => {
  it('should validate correct email addresses', () => {
    expect(validateEmail('test@example.com').isValid).toBe(true);
    expect(validateEmail('user.name+tag@example.co.uk').isValid).toBe(true);
    expect(validateEmail('test123@test-domain.com').isValid).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(validateEmail('not-an-email').isValid).toBe(false);
    expect(validateEmail('@example.com').isValid).toBe(false);
    expect(validateEmail('test@').isValid).toBe(false);
    expect(validateEmail('test @example.com').isValid).toBe(false);
  });

  it('should require email', () => {
    expect(validateEmail('').isValid).toBe(false);
    expect(validateEmail(undefined).isValid).toBe(false);
  });

  it('should sanitize email (trim and lowercase)', () => {
    const result = validateEmail('  Test@Example.COM  ');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('test@example.com');
  });

  it('should reject dangerous patterns', () => {
    expect(validateEmail('test<script>@example.com').isValid).toBe(false);
  });
});

describe('Password Validation', () => {
  it('should validate strong passwords', () => {
    expect(validatePassword('Test1234!').isValid).toBe(true);
    expect(validatePassword('MyP@ssw0rd').isValid).toBe(true);
    expect(validatePassword('Complex123!').isValid).toBe(true);
  });

  it('should reject passwords that are too short', () => {
    expect(validatePassword('Test1!').isValid).toBe(false);
    expect(validatePassword('short').isValid).toBe(false);
  });

  it('should reject weak passwords (when requireStrong is true)', () => {
    expect(validatePassword('alllowercase').isValid).toBe(false);
    expect(validatePassword('ALLUPPERCASE').isValid).toBe(false);
    expect(validatePassword('12345678').isValid).toBe(false);
  });

  it('should accept weak passwords when requireStrong is false', () => {
    expect(
      validatePassword('alllowercase', { requireStrong: false }).isValid
    ).toBe(true);
    expect(validatePassword('12345678', { requireStrong: false }).isValid).toBe(
      true
    );
  });

  it('should require password', () => {
    expect(validatePassword('').isValid).toBe(false);
    expect(validatePassword(undefined).isValid).toBe(false);
  });
});

describe('Habit Name Validation', () => {
  it('should validate correct habit names', () => {
    expect(validateHabitName('Morning Run').isValid).toBe(true);
    expect(validateHabitName('Read 📚').isValid).toBe(true);
    expect(validateHabitName('Drink water').isValid).toBe(true);
  });

  it('should reject empty habit names', () => {
    expect(validateHabitName('').isValid).toBe(false);
    expect(validateHabitName('  ').isValid).toBe(false);
    expect(validateHabitName(undefined).isValid).toBe(false);
  });

  it('should accept single-character habit names', () => {
    expect(validateHabitName('a').isValid).toBe(true);
  });

  it('should reject habit names that are too long', () => {
    const longName = 'a'.repeat(101);
    expect(validateHabitName(longName).isValid).toBe(false);
  });

  it('should sanitize habit names (trim)', () => {
    const result = validateHabitName('  Morning Run  ');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('Morning Run');
  });

  it('should reject dangerous patterns', () => {
    expect(validateHabitName('<script>alert("xss")</script>').isValid).toBe(
      false
    );
    expect(validateHabitName('onclick=alert(1)').isValid).toBe(false);
  });
});

describe('Long Text Validation', () => {
  it('should validate correct long text', () => {
    expect(validateLongText('This is a note.').isValid).toBe(true);
    expect(validateLongText('').isValid).toBe(true); // Empty is valid for optional fields
    expect(validateLongText(undefined).isValid).toBe(true);
  });

  it('should reject text that is too long', () => {
    const longText = 'a'.repeat(5001);
    expect(validateLongText(longText).isValid).toBe(false);
  });

  it('should respect custom max length', () => {
    const text = 'a'.repeat(101);
    expect(validateLongText(text, 100).isValid).toBe(false);
    expect(validateLongText(text, 200).isValid).toBe(true);
  });

  it('should sanitize text (trim)', () => {
    const result = validateLongText('  Some notes  ');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('Some notes');
  });
});

describe('Short Text Validation', () => {
  it('should validate correct short text', () => {
    expect(validateShortText('Label').isValid).toBe(true);
    expect(validateShortText('').isValid).toBe(true);
    expect(validateShortText(undefined).isValid).toBe(true);
  });

  it('should reject text that is too long', () => {
    const longText = 'a'.repeat(501);
    expect(validateShortText(longText).isValid).toBe(false);
  });
});
