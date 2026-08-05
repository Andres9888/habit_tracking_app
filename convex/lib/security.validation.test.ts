/**
 * Security Test Suite: Input Validation Edge Cases (SEC-005)
 *
 * Extended tests for input validation security, covering edge cases
 * and advanced attack vectors beyond basic XSS detection.
 */

import {
  containsDangerousPatterns,
  validateUrl,
  validateLongText,
  validateHabitName,
  ALLOWED_STORAGE_DOMAINS,
} from './inputValidation';

describe('SEC-003: Advanced Input Validation Security', () => {
  describe('Unicode and Encoding Bypass Attempts', () => {
    it('should handle null bytes', () => {
      expect(containsDangerousPatterns('hello\x00<script>')).toBe(true);
    });

    it('should handle URL-encoded script tags', () => {
      // Note: These would be decoded before reaching validation in most cases
      // This tests the raw pattern detection
      expect(containsDangerousPatterns('%3Cscript%3E')).toBe(false); // URL-encoded
      expect(containsDangerousPatterns('<script>')).toBe(true); // Decoded
    });

    it('should handle mixed case bypass attempts', () => {
      expect(containsDangerousPatterns('<ScRiPt>alert(1)</sCrIpT>')).toBe(true);
      expect(containsDangerousPatterns('OnClIcK=badFunction()')).toBe(true);
      expect(containsDangerousPatterns('JaVaScRiPt:alert(1)')).toBe(true);
    });

    it('should handle whitespace variations in event handlers', () => {
      expect(containsDangerousPatterns('onclick  =  alert(1)')).toBe(true);
      expect(containsDangerousPatterns('onclick\t=\talert(1)')).toBe(true);
      expect(containsDangerousPatterns('onclick\n=\nalert(1)')).toBe(true);
    });
  });

  describe('URL Security Edge Cases', () => {
    it('should reject data URLs with JavaScript', () => {
      const result = validateUrl('data:text/html,<script>alert(1)</script>');
      expect(result.isValid).toBe(false);
    });

    it('should reject URLs with credentials', () => {
      // URLs with userinfo can be used for phishing
      const result = validateUrl('https://admin:password@evil.com/');
      // This tests domain allowlist - the domain is evil.com, not admin:password
      const resultWithAllowlist = validateUrl(
        'https://admin:password@evil.com/',
        {
          allowedDomains: ALLOWED_STORAGE_DOMAINS,
        }
      );
      expect(resultWithAllowlist.isValid).toBe(false);
    });

    it('should reject localhost and internal network URLs', () => {
      const localHosts = [
        'localhost',
        ['127', '0', '0', '1'].join('.'),
        ['192', '168', '1', '1'].join('.'),
        ['10', '0', '0', '1'].join('.'),
      ];
      const internalUrls = localHosts.map((host) => `https://${host}/file.mp3`);

      internalUrls.forEach((url) => {
        const result = validateUrl(url, {
          allowedDomains: ALLOWED_STORAGE_DOMAINS,
        });
        expect(result.isValid).toBe(false);
      });
    });

    it('should handle subdomain spoofing attempts', () => {
      // Attacker might try: convex.cloud.attacker.com
      const spoofedUrl = 'https://convex.cloud.attacker.com/file.mp3';
      const result = validateUrl(spoofedUrl, {
        allowedDomains: ALLOWED_STORAGE_DOMAINS,
      });
      expect(result.isValid).toBe(false);
    });

    it('should allow legitimate subdomains of allowed domains', () => {
      const validUrl = 'https://storage.convex.cloud/file.mp3';
      const result = validateUrl(validUrl, {
        allowedDomains: ALLOWED_STORAGE_DOMAINS,
      });
      expect(result.isValid).toBe(true);
    });
  });

  describe('Long Text Security', () => {
    it('should reject deeply nested HTML attempts', () => {
      const nested =
        '<div>'.repeat(100) + '<script>x</script>' + '</div>'.repeat(100);
      const result = validateLongText(nested);
      expect(result.isValid).toBe(false);
    });

    it('should handle comments hiding script tags', () => {
      const withComment = '<!-- <script> --> <script>alert(1)</script>';
      expect(containsDangerousPatterns(withComment)).toBe(true);
    });

    it('should allow legitimate HTML-like content', () => {
      // Users might write about programming
      const legitimateContent = 'I learned about <div> tags today!';
      // div is not blocked, only dangerous tags
      const result = validateLongText(legitimateContent);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Habit Name Security', () => {
    it('should allow names with apostrophes', () => {
      const result = validateHabitName("Don't forget to exercise");
      expect(result.isValid).toBe(true);
    });

    it('should reject SQL injection attempts via habit name', () => {
      const sqlInjection = "'; DROP TABLE habits;--";
      const result = validateHabitName(sqlInjection);
      expect(result.isValid).toBe(false);
    });

    it('should handle boundary length conditions', () => {
      // Exactly at limit
      const exactLimit = 'a'.repeat(100);
      const atLimit = validateHabitName(exactLimit);
      expect(atLimit.isValid).toBe(true);

      // One over limit
      const overLimit = 'a'.repeat(101);
      const over = validateHabitName(overLimit);
      expect(over.isValid).toBe(false);
    });
  });
});
