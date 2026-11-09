import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  isEducationalDomain,
  isRecognizedEmailDomain,
} from '../src/emailValidation';

describe('Email Validation & Domain Verification Suite', () => {
  describe('Rejection of Arbitrary / Dummy / Numeric Domains', () => {
    it('rejects dummy numeric domains like 123@356.com', () => {
      const result = validateEmail('123@356.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/Numeric domain names|recognized provider/i);
    });

    it('rejects arbitrary unverified domains like student@randomfake123.xyz', () => {
      const result = validateEmail('student@randomfake123.xyz');
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/recognized provider/i);
    });

    it('rejects emails with no domain extension like user@something', () => {
      const result = validateEmail('user@something');
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/extension|valid domain/i);
    });

    it('rejects emails without @ or with multiple @ symbols', () => {
      expect(validateEmail('invalidemail.com').isValid).toBe(false);
      expect(validateEmail('user@@gmail.com').isValid).toBe(false);
      expect(validateEmail('user@name@gmail.com').isValid).toBe(false);
    });

    it('rejects disposable and temporary emails', () => {
      expect(validateEmail('user@mailinator.com').isValid).toBe(false);
      expect(validateEmail('test@10minutemail.com').isValid).toBe(false);
      expect(validateEmail('temp@yopmail.com').isValid).toBe(false);
    });

    it('rejects single character or invalid usernames', () => {
      expect(validateEmail('a@gmail.com').isValid).toBe(false);
      expect(validateEmail('.user@gmail.com').isValid).toBe(false);
      expect(validateEmail('user.@gmail.com').isValid).toBe(false);
      expect(validateEmail('user..name@gmail.com').isValid).toBe(false);
    });
  });

  describe('Acceptance of Major Email Providers', () => {
    it('accepts Google / Gmail addresses', () => {
      const res1 = validateEmail('student@gmail.com');
      expect(res1.isValid).toBe(true);
      expect(res1.normalizedEmail).toBe('student@gmail.com');

      const res2 = validateEmail('user@googlemail.com');
      expect(res2.isValid).toBe(true);
    });

    it('accepts Microsoft accounts (Outlook, Hotmail, Live, MSN)', () => {
      expect(validateEmail('user@outlook.com').isValid).toBe(true);
      expect(validateEmail('student@hotmail.com').isValid).toBe(true);
      expect(validateEmail('user@live.com').isValid).toBe(true);
      expect(validateEmail('user@msn.com').isValid).toBe(true);
      expect(validateEmail('user@outlook.in').isValid).toBe(true);
    });

    it('accepts Yahoo accounts (yahoo.com, yahoo.in, ymail, rocketmail)', () => {
      expect(validateEmail('user@yahoo.com').isValid).toBe(true);
      expect(validateEmail('student@yahoo.in').isValid).toBe(true);
      expect(validateEmail('user@yahoo.co.in').isValid).toBe(true);
      expect(validateEmail('user@ymail.com').isValid).toBe(true);
      expect(validateEmail('user@rocketmail.com').isValid).toBe(true);
    });

    it('accepts Apple / iCloud accounts', () => {
      expect(validateEmail('user@icloud.com').isValid).toBe(true);
      expect(validateEmail('user@me.com').isValid).toBe(true);
      expect(validateEmail('user@mac.com').isValid).toBe(true);
    });

    it('accepts Zoho and Proton accounts', () => {
      expect(validateEmail('user@zoho.com').isValid).toBe(true);
      expect(validateEmail('student@zohomail.in').isValid).toBe(true);
      expect(validateEmail('user@proton.me').isValid).toBe(true);
      expect(validateEmail('user@protonmail.com').isValid).toBe(true);
    });
  });

  describe('Acceptance of University / Educational Domains', () => {
    it('accepts Anna University and other .edu / .ac.in / .edu.in domains', () => {
      const annaUniv = validateEmail('student@annauniv.edu');
      expect(annaUniv.isValid).toBe(true);
      expect(annaUniv.isEducational).toBe(true);

      const ceg = validateEmail('scholar@ceg.ac.in');
      expect(ceg.isValid).toBe(true);
      expect(ceg.isEducational).toBe(true);

      const mit = validateEmail('scholar@mitindia.edu');
      expect(mit.isValid).toBe(true);
      expect(mit.isEducational).toBe(true);

      const srm = validateEmail('student@srmist.edu.in');
      expect(srm.isValid).toBe(true);
      expect(srm.isEducational).toBe(true);

      const vit = validateEmail('student@vit.edu.in');
      expect(vit.isValid).toBe(true);
      expect(vit.isEducational).toBe(true);
    });

    it('identifies educational domains correctly via helper', () => {
      expect(isEducationalDomain('annauniv.edu')).toBe(true);
      expect(isEducationalDomain('ceg.ac.in')).toBe(true);
      expect(isEducationalDomain('mit.edu')).toBe(true);
      expect(isEducationalDomain('gmail.com')).toBe(false);
      expect(isEducationalDomain('356.com')).toBe(false);
    });

    it('identifies recognized email domains correctly via helper', () => {
      expect(isRecognizedEmailDomain('gmail.com')).toBe(true);
      expect(isRecognizedEmailDomain('yahoo.in')).toBe(true);
      expect(isRecognizedEmailDomain('outlook.com')).toBe(true);
      expect(isRecognizedEmailDomain('annauniv.edu')).toBe(true);
      expect(isRecognizedEmailDomain('356.com')).toBe(false);
      expect(isRecognizedEmailDomain('mailinator.com')).toBe(false);
    });
  });

  describe('Edge Cases & Sanitization', () => {
    it('normalizes domain to lowercase and trims whitespace', () => {
      const result = validateEmail('  Student123@GMAIL.COM  ');
      expect(result.isValid).toBe(true);
      expect(result.normalizedEmail).toBe('Student123@gmail.com');
    });

    it('rejects empty or non-string inputs safely', () => {
      expect(validateEmail('').isValid).toBe(false);
      expect(validateEmail('   ').isValid).toBe(false);
      expect(validateEmail(null).isValid).toBe(false);
      expect(validateEmail(undefined).isValid).toBe(false);
    });
  });
});
