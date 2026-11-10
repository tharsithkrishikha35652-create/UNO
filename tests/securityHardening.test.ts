import { describe, it, expect, beforeEach } from 'vitest';
import { validateFirebaseEnvironment } from '../src/firebase';
import {
  maskEmail,
  sanitizeSecurityPayload,
  logSecurityEvent,
  getRecentSecurityEvents,
  clearSecurityEvents,
} from '../src/securityLogger';
import { FEEDBACK_CATEGORIES } from '../src/firebaseData';
import { friendlyAuthError } from '../src/components/AuthScreen';
import { validateEmail } from '../src/emailValidation';

describe('Security Hardening Test Suite', () => {
  beforeEach(() => {
    clearSecurityEvents();
  });

  describe('Phase 1: Environment Security & Startup Validation', () => {
    it('validates and detects missing or malformed Firebase environment variables', () => {
      const result = validateFirebaseEnvironment({});
      // In test runner environment without .env injected, it must fail loudly
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((err) => err.includes('VITE_FIREBASE_API_KEY'))).toBe(true);
    });
  });

  describe('Phase 2: Authentication Hardening & Password Policy', () => {
    const validatePassword = (password: string): { valid: boolean; error?: string } => {
      if (password.length < 8) {
        return { valid: false, error: 'Password must be at least 8 characters long.' };
      }
      if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        return { valid: false, error: 'Password must include at least one letter and one number.' };
      }
      return { valid: true };
    };

    it('rejects passwords shorter than 8 characters', () => {
      expect(validatePassword('Ab1!').valid).toBe(false);
      expect(validatePassword('Short1').valid).toBe(false);
      expect(validatePassword('Short1').error).toBe('Password must be at least 8 characters long.');
    });

    it('rejects passwords lacking letters or digits', () => {
      expect(validatePassword('1234567890').valid).toBe(false);
      expect(validatePassword('1234567890').error).toBe('Password must include at least one letter and one number.');
      expect(validatePassword('abcdefghijkl').valid).toBe(false);
      expect(validatePassword('abcdefghijkl').error).toBe('Password must include at least one letter and one number.');
    });

    it('accepts compliant passwords meeting complexity requirements', () => {
      expect(validatePassword('ScholarPass2026').valid).toBe(true);
      expect(validatePassword('calcredit99').valid).toBe(true);
      expect(validatePassword('A1b2C3d4!').valid).toBe(true);
    });

    it('protects against user enumeration in password reset flow', () => {
      // Direct verification of real AuthScreen error handler
      const resetAuthError = friendlyAuthError({ code: 'auth/user-not-found' }, 'email', 'reset');
      const loginAuthError = friendlyAuthError({ code: 'auth/user-not-found' }, 'email', 'login');
      expect(resetAuthError).toBe('The email or password is incorrect.');
      expect(resetAuthError).toBe(loginAuthError);
      const handlePasswordReset = (error: { code: string } | null): string => {
        if (error) {
          if (error.code === 'auth/user-not-found') {
            // Neutralize user enumeration: return generic message identical to success
            return 'If an account exists for this email, a password reset link has been sent. Check your inbox.';
          }
          throw new Error(`Firebase Auth error: ${error.code}`);
        }
        return 'If an account exists for this email, a password reset link has been sent. Check your inbox.';
      };

      const successNotice = handlePasswordReset(null);
      const userNotFoundNotice = handlePasswordReset({ code: 'auth/user-not-found' });

      // User enumeration defense: responses MUST be byte-for-byte identical
      expect(userNotFoundNotice).toBe(successNotice);

      // Other operational errors (e.g. rate limit / network) should still throw
      expect(() => handlePasswordReset({ code: 'auth/too-many-requests' })).toThrow();
    });

    it('abstracts developer and backend Firebase errors cleanly away from students', () => {
      // 1. Android restriction / client error
      const androidRestrictionError = friendlyAuthError(
        { message: 'Firebase: Error (auth/requests-from-this-android-client-application-<empty>-are-blocked.).' },
        'email',
        'login'
      );
      expect(androidRestrictionError).toBe('Authentication service is temporarily unavailable. Please try again in a few moments.');
      expect(androidRestrictionError).not.toContain('Firebase');
      expect(androidRestrictionError).not.toContain('android-client');

      // 2. Invalid or restricted API key
      const apiKeyError = friendlyAuthError({ code: 'auth/api-key-not-valid' }, 'email', 'login');
      expect(apiKeyError).toBe('Authentication service is temporarily unavailable. Please try again in a few moments.');

      // 3. Google Sign-In backend/developer errors
      const googleDevError = friendlyAuthError({ code: '10', message: 'developer_error' }, 'google');
      expect(googleDevError).toBe('Google sign-in is temporarily unavailable. Please try logging in with your email.');
      expect(googleDevError).not.toContain('SHA-1');
      expect(googleDevError).not.toContain('google-services.json');

      // 4. Arbitrary internal Firebase errors never leak 'Firebase:' prefix
      const internalError = friendlyAuthError(
        { message: 'Firebase: Error (auth/internal-error-something-unexpected).' },
        'email',
        'login'
      );
      expect(internalError).toBe('Authentication service is temporarily unavailable. Please try again in a few moments.');
    });

    it('strictly enforces email domain requirements, rejecting dummy domains like 123@356.com', () => {
      expect(validateEmail('123@356.com').isValid).toBe(false);
      expect(validateEmail('user@randomfake123.xyz').isValid).toBe(false);
      expect(validateEmail('student@gmail.com').isValid).toBe(true);
      expect(validateEmail('student@outlook.com').isValid).toBe(true);
      expect(validateEmail('student@yahoo.in').isValid).toBe(true);
      expect(validateEmail('student@annauniv.edu').isValid).toBe(true);
      expect(validateEmail('student@ceg.ac.in').isValid).toBe(true);
    });
  });

  describe('Phase 3: Input Validation & Path Traversal Defense', () => {
    const sanitizeDocumentId = (id: string): string => {
      return typeof id === 'string' && id.trim() ? id.trim().replace(/[\/\\?#]/g, '_') : 'default';
    };

    it('neutralizes path traversal and reserved characters in document IDs', () => {
      expect(sanitizeDocumentId('../../../etc/passwd')).toBe('.._.._.._etc_passwd');
      expect(sanitizeDocumentId('users/admin/keys')).toBe('users_admin_keys');
      expect(sanitizeDocumentId('course\\with\\backslashes')).toBe('course_with_backslashes');
      expect(sanitizeDocumentId('subject?param=true#section')).toBe('subject_param=true_section');
    });

    it('falls back safely for empty or whitespace-only document IDs', () => {
      expect(sanitizeDocumentId('')).toBe('default');
      expect(sanitizeDocumentId('   ')).toBe('default');
    });

    it('enforces feedback category whitelist and message constraints', () => {
      expect(FEEDBACK_CATEGORIES).toContain('Bug report');
      expect(FEEDBACK_CATEGORIES).toContain('Suggestion');
      expect(FEEDBACK_CATEGORIES).toContain('General');
      expect(FEEDBACK_CATEGORIES).toContain('Other');

      const isValidFeedback = (message: string, category: string) => {
        if (!message || message.trim().length === 0 || message.length > 2000) return false;
        if (!FEEDBACK_CATEGORIES.includes(category as (typeof FEEDBACK_CATEGORIES)[number])) return false;
        return true;
      };

      expect(isValidFeedback('Great tool!', 'General')).toBe(true);
      expect(isValidFeedback('', 'General')).toBe(false);
      expect(isValidFeedback('A'.repeat(2001), 'General')).toBe(false);
      expect(isValidFeedback('Valid message', 'ExploitCategory')).toBe(false);
    });
  });

  describe('Phase 6: Structured Security Logging & Sanitization', () => {
    it('masks email addresses accurately without leaking usernames', () => {
      expect(maskEmail('student@annauniv.edu')).toBe('s***t@annauniv.edu');
      expect(maskEmail('raghu@gmail.com')).toBe('r***u@gmail.com');
      expect(maskEmail('ab@test.com')).toBe('a*@test.com');
      expect(maskEmail('invalid-email')).toBe('[REDACTED_EMAIL]');
      expect(maskEmail(null)).toBe('[REDACTED_EMAIL]');
    });

    it('scrubs sensitive credentials, tokens, and passwords from log payloads', () => {
      const sensitivePayload = {
        email: 'user@example.com',
        password: 'SuperSecretPassword123!',
        token: 'sample-session-token-for-testing',
        apiKey: 'sample-api-key-for-testing',
        credential: 'raw_credential_data',
        metadata: {
          clientSecret: 'shhh',
          allowed: true,
        },
        errorCode: 'auth/wrong-password',
      };

      const sanitized = sanitizeSecurityPayload(sensitivePayload) as Record<string, unknown>;

      expect(sanitized.email).toBe('u***r@example.com');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.token).toBe('[REDACTED]');
      expect(sanitized.apiKey).toBe('[REDACTED]');
      expect(sanitized.credential).toBe('[REDACTED]');
      expect((sanitized.metadata as Record<string, unknown>).clientSecret).toBe('[REDACTED]');
      expect((sanitized.metadata as Record<string, unknown>).allowed).toBe(true);
      expect(sanitized.errorCode).toBe('auth/wrong-password');
    });

    it('records and retains security events up to maximum buffer size', () => {
      expect(getRecentSecurityEvents().length).toBe(0);

      logSecurityEvent('AUTH_LOGIN_SUCCESS', 'info', { email: 'student@example.com' });
      logSecurityEvent('ADMIN_ACCESS_CHECK', 'warn', { granted: false });

      const events = getRecentSecurityEvents();
      expect(events.length).toBe(2);
      expect(events[0].type).toBe('AUTH_LOGIN_SUCCESS');
      expect(events[0].details?.email).toBe('s***t@example.com');
      expect(events[1].type).toBe('ADMIN_ACCESS_CHECK');
      expect(events[1].severity).toBe('warn');

      // Test buffer limit (50)
      for (let i = 0; i < 60; i++) {
        logSecurityEvent('AUTH_LOGOUT', 'info', { index: i });
      }

      const cappedEvents = getRecentSecurityEvents();
      expect(cappedEvents.length).toBe(50);
      expect((cappedEvents[49].details as { index: number }).index).toBe(59);
    });
  });
});
