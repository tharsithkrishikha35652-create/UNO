import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import type { AcademicProfileData, SubjectData } from './types';
import { db } from './firebase';
import { GPA_COURSES, getAllGpaCourses } from './gpaCourses';
import { PRESET_COURSES, getAllPresetCourses } from './components/SubjectSelectionDialog';

export const FEEDBACK_CATEGORIES = ['General', 'Bug report', 'Suggestion', 'Other'] as const;
export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export interface FeedbackRecord {
  id: string;
  senderUid: string;
  senderEmail: string;
  message: string;
  category: FeedbackCategory;
  createdAt: Timestamp | null;
}

export const DAILY_FEEDBACK_LIMIT = 2;
const INDIA_TIME_ZONE = 'Asia/Kolkata';
const INDIA_UTC_OFFSET_MS = 330 * 60 * 1000;

export class FeedbackDailyLimitError extends Error {
  readonly code = 'feedback/daily-limit-exceeded';

  constructor() {
    super('Daily feedback limit reached');
    this.name = 'FeedbackDailyLimitError';
  }
}

export function getIndiaDayStart(now = new Date()): Timestamp {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: INDIA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((item) => item.type === type)?.value);
  return Timestamp.fromMillis(Date.UTC(part('year'), part('month') - 1, part('day')));
}

export function getNextIndiaMidnightMs(now = new Date()): number {
  return getIndiaDayStart(now).toMillis() + 24 * 60 * 60 * 1000 - INDIA_UTC_OFFSET_MS;
}

export async function loadTodayFeedbackCount(uid: string): Promise<number> {
  const firestore = requireFirestore();
  const counterSnapshot = await getDoc(doc(firestore, 'feedbackCounters', uid));
  if (!counterSnapshot.exists()) return 0;

  const counter = counterSnapshot.data();
  const today = getIndiaDayStart();
  return counter.uid === uid && counter.dayStart instanceof Timestamp && counter.dayStart.isEqual(today)
    ? Math.max(0, Math.min(DAILY_FEEDBACK_LIMIT, Number(counter.count) || 0))
    : 0;
}

export async function submitFeedback(
  sender: { uid: string; email: string },
  message: string,
  category: FeedbackCategory
): Promise<number> {
  const firestore = requireFirestore();
  const dayStart = getIndiaDayStart();
  const counterRef = doc(firestore, 'feedbackCounters', sender.uid);
  const feedbackRef = doc(collection(firestore, 'feedback'));

  return runTransaction(firestore, async (transaction) => {
    const counterSnapshot = await transaction.get(counterRef);
    const previous = counterSnapshot.data();
    const previousCount = counterSnapshot.exists() &&
      previous?.uid === sender.uid &&
      previous.dayStart instanceof Timestamp &&
      previous.dayStart.isEqual(dayStart)
      ? Number(previous.count) || 0
      : 0;

    if (previousCount >= DAILY_FEEDBACK_LIMIT) throw new FeedbackDailyLimitError();

    const nextCount = previousCount + 1;
    transaction.set(counterRef, {
      uid: sender.uid,
      dayStart,
      count: nextCount,
      lastFeedbackId: feedbackRef.id,
    });
    transaction.set(feedbackRef, {
      senderUid: sender.uid,
      senderEmail: sender.email,
      message: message.trim(),
      category,
      createdAt: serverTimestamp(),
      dayStart,
    });
    return nextCount;
  });
}

export async function loadFeedbackInbox(): Promise<FeedbackRecord[]> {
  const firestore = requireFirestore();
  const feedbackQuery = query(collection(firestore, 'feedback'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(feedbackQuery);
  return snapshot.docs.map((feedbackDoc) => {
    const data = feedbackDoc.data();
    return {
      id: feedbackDoc.id,
      senderUid: data.senderUid as string,
      senderEmail: data.senderEmail as string,
      message: data.message as string,
      category: data.category as FeedbackCategory,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt : null,
    };
  });
}

export interface GpaHistoryEntry {
  id: string;
  gpa: number;
  totalCredits: number;
  weightedGradePoints: number;
  createdAtMs: number;
  courses: Array<{
    code: string;
    name: string;
    credits: number;
    mark: number;
    grade: string;
    gradePoint: number;
  }>;
  semester?: number;
  inputSignature?: string;
  estimate?: {
    enabled: boolean;
    percentage: number;
    appliedToCourses: number;
  };
}

export interface UserWorkspaceData {
  subjects: SubjectData[];
  profile: AcademicProfileData | null;
  persistedSubjectSnapshots: Map<string, string>;
  calculatedSignatures: Record<string, string>;
  gpaHistory: GpaHistoryEntry[];
  migrationResolved: boolean;
  preferences: {
    currentSubjectId: string;
    activeTab: 'calculator' | 'grades' | 'gpa' | 'cgpa';
    includeEstimates: boolean;
    estimatePercentage: number;
    selectedSemester: number | null;
  };
}

function requireFirestore() {
  if (!db) throw new Error('Firebase is not configured. Check the Vite environment variables.');
  return db;
}

function userDocument(uid: string, collectionName: string, id: string) {
  return doc(requireFirestore(), 'users', uid, collectionName, id);
}

export async function loadUserWorkspace(uid: string): Promise<UserWorkspaceData> {
  const firestore = requireFirestore();
  const [subjectSnapshot, gradeSnapshot, historySnapshot, preferencesSnapshot, migrationSnapshot, profileSnapshot] =
    await Promise.all([
      getDocs(collection(firestore, 'users', uid, 'subjects')),
      getDocs(collection(firestore, 'users', uid, 'gradeRecords')),
      getDocs(collection(firestore, 'users', uid, 'gpaHistory')),
      getDoc(doc(firestore, 'users', uid, 'settings', 'preferences')),
      getDoc(doc(firestore, 'users', uid, 'settings', 'legacyMigration')),
      getDoc(doc(firestore, 'users', uid, 'settings', 'profile')),
    ]);

  const subjects = subjectSnapshot.docs
    .map((snapshot) => {
      const data = snapshot.data();
      const { credits: _credits, updatedAt: _updatedAt, ...subjectData } = data;
      return { ...subjectData, id: snapshot.id, sortIndex: data.sortIndex as number | undefined } as SubjectData & { sortIndex?: number };
    })
    .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0))
    .map(({ sortIndex: _sortIndex, ...subject }) => subject as SubjectData);
  const persistedSubjectSnapshots = new Map(
    subjects.map((subject) => [subject.id, JSON.stringify(subject)])
  );
  const calculatedSignatures = Object.fromEntries(
    gradeSnapshot.docs
      .map((snapshot) => [snapshot.id, snapshot.data().inputSignature as string | undefined])
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  );
  const gpaHistory = historySnapshot.docs
    .map((snapshot) => ({ ...snapshot.data(), id: snapshot.id } as GpaHistoryEntry))
    .sort((a, b) => b.createdAtMs - a.createdAtMs);
  const profileData = profileSnapshot.data();
  const profile = profileData &&
    ['studentName', 'rollNumber', 'department'].every((field) =>
      typeof profileData[field] === 'string' && profileData[field].trim()
    )
    ? {
        studentName: (profileData.studentName as string).trim(),
        rollNumber: (profileData.rollNumber as string).trim(),
        department: (profileData.department as string).trim().toUpperCase() === 'VLSI' ? 'VLSI' : (profileData.department as string).trim().toUpperCase() === 'ECE' ? 'ECE' : 'CSE',
      }
    : null;

  return {
    subjects,
    profile,
    persistedSubjectSnapshots,
    calculatedSignatures,
    gpaHistory,
    migrationResolved: migrationSnapshot.exists() && migrationSnapshot.data().resolved === true,
    preferences: {
      currentSubjectId: typeof preferencesSnapshot.data()?.currentSubjectId === 'string'
        ? preferencesSnapshot.data()!.currentSubjectId as string
        : '',
      activeTab: ['calculator', 'grades', 'gpa', 'cgpa'].includes(preferencesSnapshot.data()?.activeTab)
        ? preferencesSnapshot.data()!.activeTab as 'calculator' | 'grades' | 'gpa' | 'cgpa'
        : 'calculator',
      includeEstimates: preferencesSnapshot.data()?.includeEstimates === true,
      estimatePercentage: typeof preferencesSnapshot.data()?.estimatePercentage === 'number'
        ? Math.max(0, Math.min(100, preferencesSnapshot.data()!.estimatePercentage as number))
        : 80,
      selectedSemester: Number.isInteger(preferencesSnapshot.data()?.selectedSemester) &&
        Number(preferencesSnapshot.data()?.selectedSemester) >= 1 &&
        Number(preferencesSnapshot.data()?.selectedSemester) <= 8
        ? Number(preferencesSnapshot.data()?.selectedSemester)
        : null,
    },
  };
}

export async function saveUserAcademicProfile(
  uid: string,
  profile: AcademicProfileData,
  preferences: {
    currentSubjectId: string;
    activeTab: 'calculator' | 'grades' | 'gpa' | 'cgpa';
    includeEstimates: boolean;
    estimatePercentage: number;
    selectedSemester: number;
  }
) {
  const firestore = requireFirestore();
  const batch = writeBatch(firestore);
  batch.set(
    doc(firestore, 'users', uid, 'settings', 'profile'),
    { ...profile, updatedAt: serverTimestamp() },
    { merge: true }
  );
  batch.set(
    doc(firestore, 'users', uid, 'settings', 'preferences'),
    { ...preferences, updatedAt: serverTimestamp() },
    { merge: true }
  );
  await batch.commit();
}

export async function syncUserSubjects(
  uid: string,
  subjects: SubjectData[],
  previousSnapshots: Map<string, string>
): Promise<Map<string, string>> {
  const firestore = requireFirestore();
  const nextSnapshots = new Map(subjects.map((subject) => [subject.id, JSON.stringify(subject)]));
  const batch = writeBatch(firestore);
  let operationCount = 0;

  subjects.forEach((subject, sortIndex) => {
    const serialized = nextSnapshots.get(subject.id)!;
    if (previousSnapshots.get(subject.id) === serialized) return;
    batch.set(
      doc(firestore, 'users', uid, 'subjects', subject.id),
      { ...subject, credits: subjectCredits(subject), sortIndex, updatedAt: serverTimestamp() },
      { merge: false }
    );
    operationCount += 1;
  });

  previousSnapshots.forEach((_snapshot, id) => {
    if (nextSnapshots.has(id)) return;
    batch.delete(doc(firestore, 'users', uid, 'subjects', id));
    batch.delete(doc(firestore, 'users', uid, 'gradeRecords', id));
    operationCount += 1;
  });

  if (operationCount > 0) await batch.commit();
  return nextSnapshots;
}

export async function saveUserPreferences(
  uid: string,
  preferences: {
    currentSubjectId: string;
    activeTab: string;
    includeEstimates: boolean;
    estimatePercentage: number;
    selectedSemester: number | null;
  }
) {
  await setDoc(
    userDocument(uid, 'settings', 'preferences'),
    { ...preferences, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function saveCalculatedGrade(
  uid: string,
  subject: SubjectData,
  record: {
    inputSignature: string;
    credits: number;
    total: number;
    grade: string;
    gradeLabel: string;
    gradePoint: number;
    courseType: string;
    estimate?: { enabled: boolean; percentage: number };
  }
) {
  await setDoc(
    userDocument(uid, 'gradeRecords', subject.id),
    {
      ...record,
      subjectId: subject.id,
      subjectName: subject.name,
      subjectCode: subject.code,
      inputs: subject,
      calculatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function saveGpaHistory(uid: string, entry: GpaHistoryEntry) {
  const { id, ...record } = entry;
  await setDoc(
    userDocument(uid, 'gpaHistory', id),
    { ...record, createdAt: serverTimestamp() },
    { merge: false }
  );
}

export async function resolveLegacyMigration(uid: string, status: 'imported' | 'skipped') {
  await setDoc(userDocument(uid, 'settings', 'legacyMigration'), {
    resolved: true,
    status,
    resolvedAt: serverTimestamp(),
  });
}

function safeDocumentId(value: unknown): string {
  if (typeof value === 'string' && value.trim()) {
    return value.trim().replace(/[\/\\?#]/g, '_');
  }
  return `import_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function importLegacySubjects(
  uid: string,
  legacySubjects: SubjectData[],
  existingSubjects: SubjectData[]
): Promise<SubjectData[]> {
  const firestore = requireFirestore();
  const usedIds = new Set(existingSubjects.map((subject) => subject.id));
  const importedSubjects = legacySubjects.map((legacySubject) => {
    const sourceId = safeDocumentId(legacySubject.id);
    let id = `${sourceId}_import_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    while (usedIds.has(id)) {
      id = `${sourceId}_import_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    }
    usedIds.add(id);
    return { ...legacySubject, id };
  });
  const batch = writeBatch(firestore);

  importedSubjects.forEach((subject, sortIndex) => {
    batch.set(doc(firestore, 'users', uid, 'subjects', subject.id), {
      ...subject,
      credits: subjectCredits(subject),
      sortIndex: existingSubjects.length + sortIndex,
      updatedAt: serverTimestamp(),
    });
  });
  batch.set(userDocument(uid, 'settings', 'legacyMigration'), {
    resolved: true,
    status: 'imported',
    importedCount: importedSubjects.length,
    resolvedAt: serverTimestamp(),
  });
  await batch.commit();
  return importedSubjects;
}

export async function skipLegacyMigration(uid: string) {
  await resolveLegacyMigration(uid, 'skipped');
}

function subjectCredits(subject: SubjectData): number {
  const allGpa = getAllGpaCourses();
  const allPresets = getAllPresetCourses();
  const course = allGpa.find(
    (item) => (Boolean(item.code) && item.code === subject.code) || item.name.toLowerCase() === subject.name.trim().toLowerCase()
  );
  if (course?.electiveSlot) return course.credits;
  const electivePreset = allPresets.find((preset) =>
    preset.group === 'elective' &&
    ((Boolean(preset.code) && preset.code === subject.code) || preset.name.trim().toLowerCase() === subject.name.trim().toLowerCase())
  );
  if (electivePreset) return 3;
  return course?.credits ?? 0;
}
