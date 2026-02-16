/**
 * Input Sanitization Utilities Tests
 */

import {
  sanitizeInput,
  sanitizeHabitName,
  sanitizeAffirmationText,
  sanitizeLetterContent,
  sanitizeSearchQuery,
  validateInput,
} from '../inputSanitization';

describe('sanitizeInput', () => {
  it('should remove null bytes', () => {
    const input = 'Hello\x00World';
    const result = sanitizeInput(input);
    expect(result).toBe('HelloWorld');
  });

  it('should remove control characters except newlines', () => {
    const input = 'Hello\x01\x02\x03World\nNext line';
    const result = sanitizeInput(input, { allowNewlines: true });
    expect(result).toBe('HelloWorld\nNext line');
  });

  it('should remove zero-width characters', () => {
    const input = 'Hello\u200BWorld';
    const result = sanitizeInput(input);
    expect(result).toBe('HelloWorld');
  });

  it('should remove script tags', () => {
    const input = 'Hello<script>alert("xss")</script>World';
    const result = sanitizeInput(input);
    expect(result).toBe('HelloWorld');
  });

  it('should remove case-insensitive script tags', () => {
    const input = 'Hello<ScRiPt>alert("xss")</sCrIpT>World';
    const result = sanitizeInput(input);
    expect(result).toBe('HelloWorld');
  });

  it('should remove iframe tags', () => {
    const input = 'Hello<iframe src="evil.com"></iframe>World';
    const result = sanitizeInput(input);
    expect(result).toBe('HelloWorld');
  });

  it('should remove event handlers', () => {
    const input = 'Hello onclick="alert(1)" World';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello  World');
  });

  it('should remove javascript: protocol', () => {
    const input = 'javascript:alert(1)';
    const result = sanitizeInput(input);
    expect(result).toBe('alert(1)');
  });

  it('should remove all HTML tags', () => {
    const input = 'Hello<div>World</div><p>Test</p>';
    const result = sanitizeInput(input);
    expect(result).toBe('HelloWorldTest');
  });

  it('should trim whitespace when trim option is true', () => {
    const input = '  Hello World  ';
    const result = sanitizeInput(input, { trim: true });
    expect(result).toBe('Hello World');
  });

  it('should not trim whitespace when trim option is false', () => {
    const input = '  Hello World  ';
    const result = sanitizeInput(input, { trim: false });
    expect(result).toBe('  Hello World  ');
  });

  it('should enforce max length', () => {
    const input = 'Hello World This Is A Long String';
    const result = sanitizeInput(input, { maxLength: 10 });
    expect(result).toBe('Hello Worl');
  });

  it('should convert newlines to spaces when allowNewlines is false', () => {
    const input = 'Hello\nWorld\nTest';
    const result = sanitizeInput(input, { allowNewlines: false });
    expect(result).toBe('Hello World Test');
  });

  it('should limit consecutive newlines to 2', () => {
    const input = 'Hello\n\n\n\n\nWorld';
    const result = sanitizeInput(input, { allowNewlines: true });
    expect(result).toBe('Hello\n\nWorld');
  });

  it('should normalize line endings', () => {
    const input = 'Hello\r\nWorld\r\nTest';
    const result = sanitizeInput(input, { allowNewlines: true });
    expect(result).toBe('Hello\nWorld\nTest');
  });

  it('should collapse 3+ spaces to 2 spaces', () => {
    const input = 'Hello     World';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello  World');
  });

  it('should preserve emoji', () => {
    const input = 'Hello 😊 World 🎉';
    const result = sanitizeInput(input);
    expect(result).toBe('Hello 😊 World 🎉');
  });

  it('should preserve international characters', () => {
    const input = 'Héllo Wörld Tëst 日本語 中文';
    const result = sanitizeInput(input);
    expect(result).toBe('Héllo Wörld Tëst 日本語 中文');
  });

  it('should return empty string for non-string input', () => {
    const result = sanitizeInput(null as any);
    expect(result).toBe('');
  });
});

describe('validateInput', () => {
  it('should validate string with sufficient length', () => {
    expect(validateInput('Hello', 3)).toBe(true);
  });

  it('should reject string with insufficient length', () => {
    expect(validateInput('Hi', 3)).toBe(false);
  });

  it('should trim before checking length', () => {
    expect(validateInput('  Hi  ', 2)).toBe(true);
  });

  it('should reject non-string input', () => {
    expect(validateInput(null as any, 1)).toBe(false);
  });

  it('should use default minLength of 1', () => {
    expect(validateInput('a')).toBe(true);
    expect(validateInput('')).toBe(false);
  });
});

describe('sanitizeHabitName', () => {
  it('should enforce 50 character limit', () => {
    const input = 'A'.repeat(60);
    const result = sanitizeHabitName(input);
    expect(result.length).toBe(50);
  });

  it('should disallow newlines', () => {
    const input = 'Morning\nRoutine';
    const result = sanitizeHabitName(input);
    expect(result).toBe('Morning Routine');
  });

  it('should trim whitespace', () => {
    const input = '  Morning Routine  ';
    const result = sanitizeHabitName(input);
    expect(result).toBe('Morning Routine');
  });
});

describe('sanitizeAffirmationText', () => {
  it('should enforce 200 character limit', () => {
    const input = 'A'.repeat(250);
    const result = sanitizeAffirmationText(input);
    expect(result.length).toBe(200);
  });

  it('should allow newlines', () => {
    const input = 'Line 1\nLine 2';
    const result = sanitizeAffirmationText(input);
    expect(result).toBe('Line 1\nLine 2');
  });
});

describe('sanitizeLetterContent', () => {
  it('should enforce 5000 character limit', () => {
    const input = 'A'.repeat(5500);
    const result = sanitizeLetterContent(input);
    expect(result.length).toBe(5000);
  });

  it('should allow newlines', () => {
    const input = 'Dear Future Me,\n\nThis is my letter.';
    const result = sanitizeLetterContent(input);
    expect(result).toBe('Dear Future Me,\n\nThis is my letter.');
  });
});

describe('sanitizeSearchQuery', () => {
  it('should enforce 100 character limit', () => {
    const input = 'A'.repeat(150);
    const result = sanitizeSearchQuery(input);
    expect(result.length).toBe(100);
  });

  it('should disallow newlines', () => {
    const input = 'Search\nQuery';
    const result = sanitizeSearchQuery(input);
    expect(result).toBe('Search Query');
  });

  it('should trim whitespace', () => {
    const input = '  search term  ';
    const result = sanitizeSearchQuery(input);
    expect(result).toBe('search term');
  });
});

describe('XSS Prevention', () => {
  it('should prevent script injection in habit name', () => {
    const input = '<script>alert("xss")</script>Morning Run';
    const result = sanitizeHabitName(input);
    expect(result).toBe('Morning Run');
    expect(result).not.toContain('<script>');
  });

  it('should prevent event handler injection', () => {
    const input = 'Morning Run onerror="alert(1)"';
    const result = sanitizeHabitName(input);
    expect(result).not.toContain('onerror');
  });

  it('should prevent javascript: protocol in search', () => {
    const input = 'javascript:void(0)';
    const result = sanitizeSearchQuery(input);
    expect(result).not.toContain('javascript:');
  });
});
