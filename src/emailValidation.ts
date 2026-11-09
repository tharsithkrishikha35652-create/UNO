/**
 * CalCredit Email Validation & Domain Verification
 *
 * Enforces strict email verification rules:
 * - Proper RFC-compliant syntax, character checks, and TLD validation.
 * - Prevents arbitrary dummy or numeric domains (e.g., 123@356.com).
 * - Restricts allowed accounts to major trusted email providers (Google, Microsoft,
 *   Yahoo, Apple, Zoho, Proton, AOL, etc.) and recognized academic / institutional
 *   domains (.edu, .ac.in, .edu.in, etc.).
 * - Explicitly blocks known disposable and throwaway email addresses.
 */

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  normalizedEmail?: string;
  domain?: string;
  isEducational?: boolean;
}

// Major trusted consumer email domains
const MAJOR_EMAIL_DOMAINS = new Set<string>([
  // Google
  'gmail.com',
  'googlemail.com',

  // Microsoft
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'passport.com',
  'outlook.in',
  'outlook.co.uk',
  'hotmail.co.uk',
  'hotmail.fr',
  'hotmail.es',
  'hotmail.de',
  'live.co.uk',
  'live.in',

  // Yahoo
  'yahoo.com',
  'yahoo.in',
  'yahoo.co.in',
  'yahoo.co.uk',
  'yahoo.ca',
  'yahoo.com.au',
  'yahoo.com.sg',
  'yahoo.fr',
  'yahoo.de',
  'yahoo.es',
  'yahoo.it',
  'ymail.com',
  'rocketmail.com',

  // Apple / iCloud
  'icloud.com',
  'me.com',
  'mac.com',

  // Zoho
  'zoho.com',
  'zohomail.in',
  'zoho.in',
  'zohomail.com',

  // Proton
  'proton.me',
  'protonmail.com',
  'pm.me',

  // AOL
  'aol.com',
  'aim.com',

  // Mail.com & GMX
  'mail.com',
  'email.com',
  'gmx.com',
  'gmx.net',
  'gmx.us',

  // Fastmail & Others
  'fastmail.com',
  'fastmail.fm',
  'yandex.com',
  'yandex.ru',
]);

// Known disposable and temporary email domains to reject explicitly
const DISPOSABLE_EMAIL_DOMAINS = new Set<string>([
  'mailinator.com',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.biz',
  'guerrillamail.org',
  'sharklasers.com',
  'throwawaymail.com',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'dispostable.com',
  'trashmail.com',
  'trashmail.net',
  'trashmail.me',
  'getnada.com',
  'fake.com',
  'fakemail.com',
  'fakemailgenerator.com',
  'mohmal.com',
  'crazymailing.com',
  'tempail.com',
]);

// Educational top-level or second-level domains
const EDUCATIONAL_TLD_SUFFIXES = [
  '.edu',
  '.ac.in',
  '.edu.in',
  '.ac.uk',
  '.edu.au',
  '.edu.sg',
  '.ac.nz',
  '.edu.my',
  '.edu.ph',
  '.edu.ca',
  '.ac.za',
];

/**
 * Checks whether a given domain is an educational / university domain (.edu, .ac.in, .edu.in, etc.)
 */
export function isEducationalDomain(domain: string): boolean {
  const lower = domain.toLowerCase();
  return EDUCATIONAL_TLD_SUFFIXES.some(
    (suffix) => lower === suffix.slice(1) || lower.endsWith(suffix)
  );
}

/**
 * Checks whether a domain is recognized as a major trusted email provider or an educational domain.
 */
export function isRecognizedEmailDomain(domain: string): boolean {
  const lower = domain.toLowerCase().trim();
  if (DISPOSABLE_EMAIL_DOMAINS.has(lower)) {
    return false;
  }
  if (MAJOR_EMAIL_DOMAINS.has(lower)) {
    return true;
  }
  if (isEducationalDomain(lower)) {
    return true;
  }
  return false;
}

/**
 * Validates an email address against syntax, security, and major provider / educational domain rules.
 */
export function validateEmail(rawEmail: unknown): EmailValidationResult {
  if (typeof rawEmail !== 'string') {
    return {
      isValid: false,
      error: 'Please enter a valid email address.',
    };
  }

  const trimmed = rawEmail.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Email address cannot be empty.',
    };
  }

  if (trimmed.length > 254) {
    return {
      isValid: false,
      error: 'Email address is too long (maximum 254 characters).',
    };
  }

  // Check for exactly one '@' symbol
  const atParts = trimmed.split('@');
  if (atParts.length !== 2) {
    return {
      isValid: false,
      error: 'Please enter a valid email address with a single "@" symbol.',
    };
  }

  const [localPart, domainPart] = atParts;
  const normalizedDomain = domainPart.toLowerCase().trim();

  // Validate local part (username)
  if (!localPart || localPart.length < 2) {
    return {
      isValid: false,
      error: 'The email username before "@" must be at least 2 characters long.',
    };
  }

  if (localPart.length > 64) {
    return {
      isValid: false,
      error: 'The email username before "@" cannot exceed 64 characters.',
    };
  }

  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return {
      isValid: false,
      error: 'The email username cannot start or end with a period.',
    };
  }

  if (localPart.includes('..')) {
    return {
      isValid: false,
      error: 'The email username cannot contain consecutive periods.',
    };
  }

  // Standard RFC-5322 characters for local part
  const localPartRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
  if (!localPartRegex.test(localPart)) {
    return {
      isValid: false,
      error: 'The email username contains invalid characters.',
    };
  }

  // Validate domain part
  if (!normalizedDomain || normalizedDomain.length < 3) {
    return {
      isValid: false,
      error: 'Please enter a valid domain after "@" (e.g. gmail.com).',
    };
  }

  if (!normalizedDomain.includes('.')) {
    return {
      isValid: false,
      error: 'The email domain must contain an extension (e.g. .com, .edu, .ac.in).',
    };
  }

  if (normalizedDomain.startsWith('.') || normalizedDomain.endsWith('.') || normalizedDomain.startsWith('-') || normalizedDomain.endsWith('-')) {
    return {
      isValid: false,
      error: 'The email domain format is invalid.',
    };
  }

  // Ensure domain labels do not contain illegal characters or purely numeric TLD
  const domainLabels = normalizedDomain.split('.');
  const tld = domainLabels[domainLabels.length - 1];

  // TLD must be alphabetic and at least 2 characters long
  if (!/^[a-zA-Z]{2,}$/.test(tld)) {
    return {
      isValid: false,
      error: 'The email domain extension must be valid (e.g. .com, .in, .edu).',
    };
  }

  // Reject purely numeric domain names like 356.com
  const secondLevelDomain = domainLabels[domainLabels.length - 2];
  if (/^\d+$/.test(secondLevelDomain)) {
    return {
      isValid: false,
      error: 'Numeric domain names (such as ' + normalizedDomain + ') are not accepted. Use a recognized provider.',
    };
  }

  // Check disposable email list
  if (DISPOSABLE_EMAIL_DOMAINS.has(normalizedDomain)) {
    return {
      isValid: false,
      error: 'Disposable and temporary email addresses are not permitted.',
    };
  }

  // Enforce major platform & educational domain whitelist
  if (!isRecognizedEmailDomain(normalizedDomain)) {
    return {
      isValid: false,
      error: 'Email must be from a recognized provider (Gmail, Outlook, Yahoo, iCloud, Zoho, etc.) or your university email (.edu, .ac.in).',
    };
  }

  const isEdu = isEducationalDomain(normalizedDomain);
  const normalizedEmail = `${localPart}@${normalizedDomain}`;

  return {
    isValid: true,
    normalizedEmail,
    domain: normalizedDomain,
    isEducational: isEdu,
  };
}
