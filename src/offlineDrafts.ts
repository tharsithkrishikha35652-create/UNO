import type { AcademicProfileData, SubjectData } from './types';
import type { GpaHistoryEntry, UserWorkspaceData } from './firebaseData';

const DRAFT_VERSION = 1;
const DRAFT_KEY_PREFIX = 'calcredit_offline_draft_v1_';

export interface PendingGradeRecord {
  inputSignature: string;
  credits: number;
  total: number;
  grade: string;
  gradeLabel: string;
  gradePoint: number;
  courseType: string;
  estimate?: { enabled: boolean; percentage: number };
}

export interface OfflineWorkspaceDraft {
  version: 1;
  uid: string;
  updatedAt: number;
  subjects: SubjectData[];
  pendingSubjectIds: string[];
  deletedSubjectIds: string[];
  calculatedSignatures: Record<string, string>;
  pendingGrades: Record<string, PendingGradeRecord>;
  profile: AcademicProfileData | null;
  preferences: UserWorkspaceData['preferences'];
  gpaHistory: GpaHistoryEntry[];
}

export function offlineDraftKey(uid: string): string {
  return `${DRAFT_KEY_PREFIX}${encodeURIComponent(uid)}`;
}

export function readOfflineDraft(uid: string): OfflineWorkspaceDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(offlineDraftKey(uid));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const draft = parsed as Partial<OfflineWorkspaceDraft>;
    if (
      draft.version !== DRAFT_VERSION ||
      draft.uid !== uid ||
      !Array.isArray(draft.subjects) ||
      !Array.isArray(draft.pendingSubjectIds) ||
      !Array.isArray(draft.deletedSubjectIds) ||
      !draft.calculatedSignatures ||
      typeof draft.calculatedSignatures !== 'object' ||
      !draft.pendingGrades ||
      typeof draft.pendingGrades !== 'object'
    ) return null;
    return draft as OfflineWorkspaceDraft;
  } catch {
    return null;
  }
}

export function writeOfflineDraft(draft: OfflineWorkspaceDraft): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(offlineDraftKey(draft.uid), JSON.stringify(draft));
    return true;
  } catch (error) {
    console.warn('Unable to keep offline workspace data on this device:', error);
    return false;
  }
}

export function createOfflineDraft(
  uid: string,
  values: Partial<Omit<OfflineWorkspaceDraft, 'version' | 'uid' | 'updatedAt'>> = {}
): OfflineWorkspaceDraft {
  return {
    version: DRAFT_VERSION,
    uid,
    updatedAt: Date.now(),
    subjects: values.subjects ?? [],
    pendingSubjectIds: values.pendingSubjectIds ?? [],
    deletedSubjectIds: values.deletedSubjectIds ?? [],
    calculatedSignatures: values.calculatedSignatures ?? {},
    pendingGrades: values.pendingGrades ?? {},
    profile: values.profile ?? null,
    preferences: values.preferences ?? {
      currentSubjectId: '',
      activeTab: 'calculator',
      includeEstimates: false,
      estimatePercentage: 80,
      selectedSemester: null,
    },
    gpaHistory: values.gpaHistory ?? [],
  };
}

export function mergePendingSubjects(
  cloudSubjects: SubjectData[],
  draft: OfflineWorkspaceDraft
): SubjectData[] {
  const subjects = new Map(cloudSubjects.map((subject) => [subject.id, subject]));
  const localSubjects = new Map(draft.subjects.map((subject) => [subject.id, subject]));

  for (const id of draft.deletedSubjectIds) subjects.delete(id);
  for (const id of draft.pendingSubjectIds) {
    const localSubject = localSubjects.get(id);
    if (localSubject) subjects.set(id, localSubject);
  }

  return [...subjects.values()];
}

export function fallbackWorkspaceFromDraft(draft: OfflineWorkspaceDraft): UserWorkspaceData {
  const subjects = draft.subjects;
  return {
    subjects,
    profile: draft.profile,
    persistedSubjectSnapshots: new Map(subjects.map((subject) => [subject.id, JSON.stringify(subject)])),
    calculatedSignatures: draft.calculatedSignatures,
    gpaHistory: draft.gpaHistory,
    migrationResolved: true,
    preferences: draft.preferences,
  };
}

export function getPendingSubjectChanges(
  subjects: SubjectData[],
  previousSnapshots: Map<string, string>,
  existingPendingIds: string[],
  existingDeletedIds: string[]
): { pendingSubjectIds: string[]; deletedSubjectIds: string[] } {
  const currentIds = new Set(subjects.map((subject) => subject.id));
  const pending = new Set(existingPendingIds);
  const deleted = new Set(existingDeletedIds);

  for (const subject of subjects) {
    if (previousSnapshots.get(subject.id) !== JSON.stringify(subject)) pending.add(subject.id);
    else pending.delete(subject.id);
    deleted.delete(subject.id);
  }
  for (const id of previousSnapshots.keys()) {
    if (!currentIds.has(id)) deleted.add(id);
  }

  return {
    pendingSubjectIds: [...pending].filter((id) => currentIds.has(id)),
    deletedSubjectIds: [...deleted],
  };
}

export function removeSyncedPendingSubjects(
  draft: OfflineWorkspaceDraft,
  syncedSubjects: SubjectData[],
  deletedIds: string[]
): OfflineWorkspaceDraft {
  const syncedById = new Map(syncedSubjects.map((subject) => [subject.id, JSON.stringify(subject)]));
  const currentById = new Map(draft.subjects.map((subject) => [subject.id, JSON.stringify(subject)]));
  return {
    ...draft,
    updatedAt: Date.now(),
    pendingSubjectIds: draft.pendingSubjectIds.filter((id) =>
      currentById.get(id) !== syncedById.get(id)
    ),
    deletedSubjectIds: draft.deletedSubjectIds.filter((id) => !deletedIds.includes(id)),
  };
}
