import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import type { SubjectData } from './types';
import { db } from './firebase';
import { GPA_COURSES } from './gpaCourses';

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
  estimate?: {
    enabled: boolean;
    percentage: number;
    appliedToCourses: number;
  };
}

export interface UserWorkspaceData {
  subjects: SubjectData[];
  persistedSubjectSnapshots: Map<string, string>;
  calculatedSignatures: Record<string, string>;
  gpaHistory: GpaHistoryEntry[];
  migrationResolved: boolean;
  preferences: {
    currentSubjectId: string;
    activeTab: 'calculator' | 'grades' | 'gpa';
    includeEstimates: boolean;
    estimatePercentage: number;
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
  if (uid === 'guest_student') {
    const localSaved = typeof window !== 'undefined' ? localStorage.getItem('calcredit_guest_workspace') : null;
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        const subjects: SubjectData[] = parsed.subjects || [];
        return {
          subjects,
          persistedSubjectSnapshots: new Map(subjects.map((s) => [s.id, JSON.stringify(s)])),
          calculatedSignatures: parsed.calculatedSignatures || {},
          gpaHistory: parsed.gpaHistory || [],
          migrationResolved: true,
          preferences: parsed.preferences || {
            currentSubjectId: subjects[0]?.id || '',
            activeTab: 'calculator',
            includeEstimates: false,
            estimatePercentage: 80,
          },
        };
      } catch {}
    }
    return {
      subjects: [],
      persistedSubjectSnapshots: new Map(),
      calculatedSignatures: {},
      gpaHistory: [],
      migrationResolved: true,
      preferences: {
        currentSubjectId: '',
        activeTab: 'calculator',
        includeEstimates: false,
        estimatePercentage: 80,
      },
    };
  }

  const firestore = requireFirestore();
  const [subjectSnapshot, gradeSnapshot, historySnapshot, preferencesSnapshot, migrationSnapshot] =
    await Promise.all([
      getDocs(collection(firestore, 'users', uid, 'subjects')),
      getDocs(collection(firestore, 'users', uid, 'gradeRecords')),
      getDocs(collection(firestore, 'users', uid, 'gpaHistory')),
      getDoc(doc(firestore, 'users', uid, 'settings', 'preferences')),
      getDoc(doc(firestore, 'users', uid, 'settings', 'legacyMigration')),
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

  return {
    subjects,
    persistedSubjectSnapshots,
    calculatedSignatures,
    gpaHistory,
    migrationResolved: migrationSnapshot.exists() && migrationSnapshot.data().resolved === true,
    preferences: {
      currentSubjectId: typeof preferencesSnapshot.data()?.currentSubjectId === 'string'
        ? preferencesSnapshot.data()!.currentSubjectId as string
        : '',
      activeTab: ['calculator', 'grades', 'gpa'].includes(preferencesSnapshot.data()?.activeTab)
        ? preferencesSnapshot.data()!.activeTab as 'calculator' | 'grades' | 'gpa'
        : 'calculator',
      includeEstimates: preferencesSnapshot.data()?.includeEstimates === true,
      estimatePercentage: typeof preferencesSnapshot.data()?.estimatePercentage === 'number'
        ? Math.max(0, Math.min(100, preferencesSnapshot.data()!.estimatePercentage as number))
        : 80,
    },
  };
}

function saveGuestWorkspace(updater: (data: Record<string, unknown>) => void) {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem('calcredit_guest_workspace');
  let current: Record<string, unknown> = {};
  if (raw) {
    try { current = JSON.parse(raw); } catch {}
  }
  updater(current);
  localStorage.setItem('calcredit_guest_workspace', JSON.stringify(current));
}

export async function syncUserSubjects(
  uid: string,
  subjects: SubjectData[],
  previousSnapshots: Map<string, string>
): Promise<Map<string, string>> {
  const nextSnapshots = new Map(subjects.map((subject) => [subject.id, JSON.stringify(subject)]));

  if (uid === 'guest_student') {
    saveGuestWorkspace((data) => {
      data.subjects = subjects;
    });
    return nextSnapshots;
  }

  const firestore = requireFirestore();
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
  }
) {
  if (uid === 'guest_student') {
    saveGuestWorkspace((data) => {
      data.preferences = preferences;
    });
    return;
  }

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
  if (uid === 'guest_student') {
    saveGuestWorkspace((data) => {
      const sigs = (data.calculatedSignatures as Record<string, string>) || {};
      sigs[subject.id] = record.inputSignature;
      data.calculatedSignatures = sigs;
    });
    return;
  }

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
  if (uid === 'guest_student') {
    saveGuestWorkspace((data) => {
      const history = (data.gpaHistory as GpaHistoryEntry[]) || [];
      data.gpaHistory = [entry, ...history];
    });
    return;
  }

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
  const course = GPA_COURSES.find(
    (item) => item.code === subject.code || item.name.toLowerCase() === subject.name.trim().toLowerCase()
  );
  return course?.credits ?? 0;
}
