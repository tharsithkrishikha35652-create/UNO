import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  collection,
  getDocs,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

const PROJECT_ID = 'project-uno-rules-test';

// Matches the rules' definition: (request.time + 330 minutes).date()
// which truncates to UTC 00:00:00 on the calendar date in Asia/Kolkata
function getIndiaDayStart(date = new Date()): Timestamp {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((item) => item.type === type)?.value);
  return Timestamp.fromMillis(Date.UTC(part('year'), part('month') - 1, part('day')));
}

describe('Firestore Security Rules', () => {
  let testEnv: RulesTestEnvironment;

  beforeAll(async () => {
    const rulesPath = resolve(__dirname, '../firestore.rules');
    const rules = readFileSync(rulesPath, 'utf8');

    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules,
        host: '127.0.0.1',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  describe('User Data Privacy & Schema Hardening (/users/{userId}/*)', () => {
    it('denies guest (unauthenticated) access to /users/* data', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'users/alice/profile/info'), { name: 'Alice' });
      });

      const unauthedDb = testEnv.unauthenticatedContext().firestore();
      await assertFails(getDoc(doc(unauthedDb, 'users/alice/profile/info')));
      await assertFails(setDoc(doc(unauthedDb, 'users/alice/profile/info'), { name: 'Hacker' }));
    });

    it('denies a user from reading or writing other users data', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, 'users/alice/settings/config'), { theme: 'dark' });
      });

      const bobDb = testEnv.authenticatedContext('bob', { email: 'bob@example.com' }).firestore();

      await assertFails(getDoc(doc(bobDb, 'users/alice/settings/config')));
      await assertFails(setDoc(doc(bobDb, 'users/alice/settings/config'), { theme: 'light' }));
    });

    it('allows an authenticated user to read, write, and delete their own data', async () => {
      const aliceDb = testEnv.authenticatedContext('alice', { email: 'alice@example.com' }).firestore();
      const targetDoc = doc(aliceDb, 'users/alice/settings/config');

      await assertSucceeds(setDoc(targetDoc, { theme: 'dark' }));
      const snapshot = await assertSucceeds(getDoc(targetDoc));
      expect(snapshot.data()).toEqual({ theme: 'dark' });

      // Verifies delete is allowed for legitimate operations
      await assertSucceeds(deleteDoc(targetDoc));
    });

    it('denies writes with excessive map keys to prevent schema abuse (> 50 keys)', async () => {
      const aliceDb = testEnv.authenticatedContext('alice', { email: 'alice@example.com' }).firestore();
      const oversizedPayload: Record<string, string> = {};
      for (let i = 0; i < 55; i++) {
        oversizedPayload[`field_${i}`] = `value_${i}`;
      }

      await assertFails(
        setDoc(doc(aliceDb, 'users/alice/settings/bloat'), oversizedPayload)
      );
    });
  });

  describe('Feedback Reading & Admin Privileges', () => {
    const aliceUid = 'alice-123';
    const bobUid = 'bob-456';
    const feedbackDocId = 'feedback-alice-1';

    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, `feedback/${feedbackDocId}`), {
          senderUid: aliceUid,
          senderEmail: 'alice@example.com',
          message: 'Great app!',
          category: 'General',
          createdAt: Timestamp.now(),
          dayStart: getIndiaDayStart(),
        });
      });
    });

    it('allows a user to read their own feedback', async () => {
      const aliceDb = testEnv.authenticatedContext(aliceUid, { email: 'alice@example.com' }).firestore();
      await assertSucceeds(getDoc(doc(aliceDb, `feedback/${feedbackDocId}`)));
    });

    it('denies a user from reading other users feedback', async () => {
      const bobDb = testEnv.authenticatedContext(bobUid, { email: 'bob@example.com' }).firestore();
      await assertFails(getDoc(doc(bobDb, `feedback/${feedbackDocId}`)));
    });

    it('denies a non-admin from listing all feedback', async () => {
      const bobDb = testEnv.authenticatedContext(bobUid, { email: 'bob@example.com' }).firestore();
      await assertFails(getDocs(collection(bobDb, 'feedback')));
    });

    it('allows admin with custom claims (admin: true, email_verified: true) to read all feedback', async () => {
      const customClaimAdminDb = testEnv
        .authenticatedContext('moderator-1', {
          email: 'moderator@university.edu',
          email_verified: true,
          admin: true,
        })
        .firestore();

      await assertSucceeds(getDoc(doc(customClaimAdminDb, `feedback/${feedbackDocId}`)));
      const snap = await assertSucceeds(getDocs(collection(customClaimAdminDb, 'feedback')));
      expect(snap.size).toBe(1);
    });

    it('allows primary admin (projectunocc@gmail.com with verified Google provider) to read all feedback', async () => {
      const adminDb = testEnv
        .authenticatedContext('admin-user', {
          email: 'projectunocc@gmail.com',
          email_verified: true,
          firebase: {
            sign_in_provider: 'google.com',
          },
        })
        .firestore();

      await assertSucceeds(getDoc(doc(adminDb, `feedback/${feedbackDocId}`)));
      const snap = await assertSucceeds(getDocs(collection(adminDb, 'feedback')));
      expect(snap.size).toBe(1);
    });

    it('denies feedback admin access if email is not verified or unprivileged', async () => {
      const unverifiedAdminDb = testEnv
        .authenticatedContext('unverified-admin', {
          email: 'moderator@university.edu',
          email_verified: false,
          admin: true,
        })
        .firestore();
      await assertFails(getDoc(doc(unverifiedAdminDb, `feedback/${feedbackDocId}`)));

      const regularUserDb = testEnv
        .authenticatedContext('regular-user', {
          email: 'user@university.edu',
          email_verified: true,
        })
        .firestore();
      await assertFails(getDoc(doc(regularUserDb, `feedback/${feedbackDocId}`)));
    });
  });

  describe('Feedback Lifecycle, Deletion & Immutability', () => {
    const aliceUid = 'alice-123';
    const bobUid = 'bob-456';
    const feedbackDocId = 'feedback-alice-del';

    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, `feedback/${feedbackDocId}`), {
          senderUid: aliceUid,
          senderEmail: 'alice@example.com',
          message: 'Feedback to test deletion and updates',
          category: 'General',
          createdAt: Timestamp.now(),
          dayStart: getIndiaDayStart(),
        });
      });
    });

    it('allows a user to delete their own feedback (Right to Erasure)', async () => {
      const aliceDb = testEnv.authenticatedContext(aliceUid, { email: 'alice@example.com' }).firestore();
      await assertSucceeds(deleteDoc(doc(aliceDb, `feedback/${feedbackDocId}`)));
    });

    it('denies another user from deleting someone elses feedback', async () => {
      const bobDb = testEnv.authenticatedContext(bobUid, { email: 'bob@example.com' }).firestore();
      await assertFails(deleteDoc(doc(bobDb, `feedback/${feedbackDocId}`)));
    });

    it('allows admin to delete feedback for moderation', async () => {
      const adminDb = testEnv
        .authenticatedContext('admin-user', {
          email: 'projectunocc@gmail.com',
          email_verified: true,
          firebase: { sign_in_provider: 'google.com' },
        })
        .firestore();
      await assertSucceeds(deleteDoc(doc(adminDb, `feedback/${feedbackDocId}`)));
    });

    it('denies all updates to existing feedback documents to preserve audit trail', async () => {
      const aliceDb = testEnv.authenticatedContext(aliceUid, { email: 'alice@example.com' }).firestore();
      await assertFails(
        updateDoc(doc(aliceDb, `feedback/${feedbackDocId}`), { message: 'Tampered message' })
      );
    });

    it('denies deleting feedbackCounters to prevent resetting rate limits', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setDoc(doc(adminDb, `feedbackCounters/${aliceUid}`), {
          uid: aliceUid,
          dayStart: getIndiaDayStart(),
          count: 2,
          lastFeedbackId: feedbackDocId,
        });
      });

      const aliceDb = testEnv.authenticatedContext(aliceUid, { email: 'alice@example.com' }).firestore();
      await assertFails(deleteDoc(doc(aliceDb, `feedbackCounters/${aliceUid}`)));
    });
  });

  describe('Feedback Submission, Rate Limiting & Integrity Checks', () => {
    const aliceUid = 'alice-123';
    const aliceEmail = 'alice@example.com';

    it('denies feedback creation without the matching counter update', async () => {
      const aliceDb = testEnv.authenticatedContext(aliceUid, { email: aliceEmail }).firestore();
      const fbRef = doc(collection(aliceDb, 'feedback'));

      await assertFails(
        setDoc(fbRef, {
          senderUid: aliceUid,
          senderEmail: aliceEmail,
          message: 'Feedback without counter',
          category: 'Suggestion',
          createdAt: serverTimestamp(),
          dayStart: getIndiaDayStart(),
        })
      );
    });

    it('denies feedback when counter lastFeedbackId does not match the feedback document', async () => {
      const aliceDb = testEnv.authenticatedContext(aliceUid, { email: aliceEmail }).firestore();
      const fbRef = doc(collection(aliceDb, 'feedback'));
      const counterRef = doc(aliceDb, `feedbackCounters/${aliceUid}`);

      const batch = writeBatch(aliceDb);
      batch.set(counterRef, {
        uid: aliceUid,
        dayStart: getIndiaDayStart(),
        count: 1,
        lastFeedbackId: 'different-id',
      });
      batch.set(fbRef, {
        senderUid: aliceUid,
        senderEmail: aliceEmail,
        message: 'Feedback with mismatched counter',
        category: 'Bug report',
        createdAt: serverTimestamp(),
        dayStart: getIndiaDayStart(),
      });

      await assertFails(batch.commit());
    });

    it('denies feedback with spoofed senderUid', async () => {
      const aliceDb = testEnv.authenticatedContext(aliceUid, { email: aliceEmail }).firestore();
      const fbRef = doc(collection(aliceDb, 'feedback'));
      const counterRef = doc(aliceDb, `feedbackCounters/${aliceUid}`);

      const batch = writeBatch(aliceDb);
      batch.set(counterRef, {
        uid: aliceUid,
        dayStart: getIndiaDayStart(),
        count: 1,
        lastFeedbackId: fbRef.id,
      });
      batch.set(fbRef, {
        senderUid: 'spoofed-uid-bob',
        senderEmail: aliceEmail,
        message: 'Spoofed senderUid',
        category: 'General',
        createdAt: serverTimestamp(),
        dayStart: getIndiaDayStart(),
      });

      await assertFails(batch.commit());
    });

    it('denies feedback with spoofed senderEmail', async () => {
      const aliceDb = testEnv.authenticatedContext(aliceUid, { email: aliceEmail }).firestore();
      const fbRef = doc(collection(aliceDb, 'feedback'));
      const counterRef = doc(aliceDb, `feedbackCounters/${aliceUid}`);

      const batch = writeBatch(aliceDb);
      batch.set(counterRef, {
        uid: aliceUid,
        dayStart: getIndiaDayStart(),
        count: 1,
        lastFeedbackId: fbRef.id,
      });
      batch.set(fbRef, {
        senderUid: aliceUid,
        senderEmail: 'victim@company.com',
        message: 'Spoofed senderEmail',
        category: 'General',
        createdAt: serverTimestamp(),
        dayStart: getIndiaDayStart(),
      });

      await assertFails(batch.commit());
    });

    it('allows a user to send 2 feedbacks per day, and denies the 3rd feedback', async () => {
      const aliceDb = testEnv.authenticatedContext(aliceUid, { email: aliceEmail }).firestore();
      const dayStart = getIndiaDayStart();
      const counterRef = doc(aliceDb, `feedbackCounters/${aliceUid}`);

      // 1st Feedback submission
      const fb1Ref = doc(collection(aliceDb, 'feedback'));
      const batch1 = writeBatch(aliceDb);
      batch1.set(counterRef, {
        uid: aliceUid,
        dayStart,
        count: 1,
        lastFeedbackId: fb1Ref.id,
      });
      batch1.set(fb1Ref, {
        senderUid: aliceUid,
        senderEmail: aliceEmail,
        message: 'First feedback of the day',
        category: 'General',
        createdAt: serverTimestamp(),
        dayStart,
      });
      await assertSucceeds(batch1.commit());

      // 2nd Feedback submission
      const fb2Ref = doc(collection(aliceDb, 'feedback'));
      const batch2 = writeBatch(aliceDb);
      batch2.set(counterRef, {
        uid: aliceUid,
        dayStart,
        count: 2,
        lastFeedbackId: fb2Ref.id,
      });
      batch2.set(fb2Ref, {
        senderUid: aliceUid,
        senderEmail: aliceEmail,
        message: 'Second feedback of the day',
        category: 'Bug report',
        createdAt: serverTimestamp(),
        dayStart,
      });
      await assertSucceeds(batch2.commit());

      // 3rd Feedback submission - MUST BE DENIED
      const fb3Ref = doc(collection(aliceDb, 'feedback'));
      const batch3 = writeBatch(aliceDb);
      batch3.set(counterRef, {
        uid: aliceUid,
        dayStart,
        count: 3,
        lastFeedbackId: fb3Ref.id,
      });
      batch3.set(fb3Ref, {
        senderUid: aliceUid,
        senderEmail: aliceEmail,
        message: 'Third feedback of the day (should fail)',
        category: 'Other',
        createdAt: serverTimestamp(),
        dayStart,
      });
      await assertFails(batch3.commit());
    });
  });
});
