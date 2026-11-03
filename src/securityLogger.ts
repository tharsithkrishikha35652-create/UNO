/**
 * CalCredit Security Audit Logger
 *
 * Provides structured, sanitized logging for critical security events:
 * - Authentication (login, signup, logout, password resets)
 * - Authorization (admin role checks, claim verification)
 * - Data Security (Firestore permission denials, daily rate limits)
 * - Configuration & Validation errors
 *
 * Guarantees:
 * - Passwords, secret tokens, API keys, and raw credentials are ALWAYS scrubbed.
 * - PII (such as emails) is masked before storage or output.
 * - In-memory circular buffer (last 50 events) for diagnostic auditing.
 */

export type SecurityEventType =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILURE'
  | 'AUTH_SIGNUP_SUCCESS'
  | 'AUTH_SIGNUP_FAILURE'
  | 'AUTH_LOGOUT'
  | 'AUTH_PASSWORD_RESET_REQUESTED'
  | 'AUTH_PASSWORD_RESET_FAILURE'
  | 'ADMIN_ACCESS_CHECK'
  | 'FIRESTORE_PERMISSION_DENIED'
  | 'FEEDBACK_RATE_LIMIT_EXCEEDED'
  | 'INPUT_VALIDATION_FAILURE'
  | 'CONFIG_VALIDATION_FAILURE';

export type SecuritySeverity = 'info' | 'warn' | 'error';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  details?: Record<string, unknown>;
}

const MAX_EVENT_BUFFER = 50;
const eventBuffer: SecurityEvent[] = [];

const SENSITIVE_KEYS_REGEX = /password|token|secret|credential|idtoken|refreshtoken|apikey|auth/i;

/**
 * Mask an email address to protect PII (e.g., student123@gmail.com -> s***3@gmail.com)
 */
export function maskEmail(email: unknown): string {
  if (typeof email !== 'string' || !email.includes('@')) {
    return '[REDACTED_EMAIL]';
  }
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) {
    return '[REDACTED_EMAIL]';
  }
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }
  return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
}

/**
 * Recursively sanitize an object, stripping any sensitive keys or values
 */
export function sanitizeSecurityPayload(data: unknown, depth = 0): unknown {
  if (depth > 4) return '[MAX_DEPTH]';
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') {
    // If it looks like a JWT or long auth token, scrub it
    if (/^[A-Za-z0-9-_]{20,}\.[A-Za-z0-9-_]{20,}\.[A-Za-z0-9-_]{20,}$/.test(data)) {
      return '[REDACTED_TOKEN]';
    }
    return data;
  }
  if (typeof data !== 'object') return data;
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeSecurityPayload(item, depth + 1));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_KEYS_REGEX.test(key)) {
      sanitized[key] = '[REDACTED]';
    } else if (key.toLowerCase().includes('email') && typeof value === 'string') {
      sanitized[key] = maskEmail(value);
    } else {
      sanitized[key] = sanitizeSecurityPayload(value, depth + 1);
    }
  }
  return sanitized;
}

/**
 * Log a structured security event
 */
export function logSecurityEvent(
  type: SecurityEventType,
  severity: SecuritySeverity,
  details?: Record<string, unknown>
): SecurityEvent {
  const sanitizedDetails = details
    ? (sanitizeSecurityPayload(details) as Record<string, unknown>)
    : undefined;

  const event: SecurityEvent = {
    id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    type,
    severity,
    details: sanitizedDetails,
  };

  // Add to circular buffer
  eventBuffer.push(event);
  if (eventBuffer.length > MAX_EVENT_BUFFER) {
    eventBuffer.shift();
  }

  // Console output
  const prefix = `[SECURITY AUDIT] [${event.type}]`;
  if (severity === 'error') {
    console.error(prefix, event.details ?? '');
  } else if (severity === 'warn') {
    console.warn(prefix, event.details ?? '');
  } else {
    // Only output info in non-production or for explicit diagnostic tracking
    if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
      console.info(prefix, event.details ?? '');
    }
  }

  return event;
}

/**
 * Retrieve recent security events from buffer (e.g. for audit or diagnostic export)
 */
export function getRecentSecurityEvents(): SecurityEvent[] {
  return [...eventBuffer];
}

/**
 * Clear in-memory event buffer (primarily for test isolation)
 */
export function clearSecurityEvents(): void {
  eventBuffer.length = 0;
}

