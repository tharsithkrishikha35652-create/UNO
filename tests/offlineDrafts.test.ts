import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_SUBJECT } from '../src/calculatorUtils';
import {
  createOfflineDraft,
  fallbackWorkspaceFromDraft,
  getPendingSubjectChanges,
  mergePendingSubjects,
  offlineDraftKey,
  readOfflineDraft,
  removeSyncedPendingSubjects,
  writeOfflineDraft,
} from '../src/offlineDrafts';
import type { SubjectData } from '../src/types';

function subject(id: string, test1: number | string): SubjectData {
  return { ...DEFAULT_SUBJECT, id, name: `Course ${id}`, test1 };
}

const localStore = new Map<string, string>();

beforeEach(() => {
  localStore.clear();
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => localStore.get(key) ?? null,
      setItem: (key: string, value: string) => localStore.set(key, value),
      removeItem: (key: string) => localStore.delete(key),
    },
  });
});

afterEach(() => vi.unstubAllGlobals());

describe('offline workspace drafts', () => {
  it('stores drafts under account-specific keys and reads them after reload', () => {
    const draft = createOfflineDraft('student-a', { subjects: [subject('one', 42)] });
    expect(writeOfflineDraft(draft)).toBe(true);
    expect(readOfflineDraft('student-a')?.subjects[0].test1).toBe(42);
    expect(readOfflineDraft('student-b')).toBeNull();
    expect(offlineDraftKey('student-a')).not.toBe(offlineDraftKey('student-b'));
  });

  it('retains the calculated grade signature and pending cloud record across reloads', () => {
    const markedSubject = subject('a', 88);
    const signature = JSON.stringify(markedSubject);
    const grade = {
      inputSignature: signature,
      credits: 3,
      total: 88,
      grade: 'A+',
      gradeLabel: 'Excellent',
      gradePoint: 9,
      courseType: 'Theory Only',
      estimate: { enabled: false, percentage: 80 },
    };
    const draft = createOfflineDraft('student-a', {
      subjects: [markedSubject],
      calculatedSignatures: { a: signature },
      pendingSubjectIds: ['a'],
      pendingGrades: { a: grade },
    });

    writeOfflineDraft(draft);
    const restored = readOfflineDraft('student-a');
    expect(restored?.calculatedSignatures.a).toBe(signature);
    expect(restored?.pendingGrades.a).toEqual(grade);
    expect(restored?.pendingSubjectIds).toContain('a');
  });

  it('layers pending local edits over cloud data without replacing untouched courses', () => {
    const cloudA = subject('a', 20);
    const cloudB = subject('b', 30);
    const localA = subject('a', 95);
    const localC = subject('c', 55);
    const draft = createOfflineDraft('student-a', {
      subjects: [localA, cloudB, localC],
      pendingSubjectIds: ['a', 'c'],
      deletedSubjectIds: ['b'],
    });

    expect(mergePendingSubjects([cloudA, cloudB], draft)).toEqual([localA, localC]);
  });

  it('tracks changed and deleted courses and retains pending changes until confirmed', () => {
    const original = subject('a', 20);
    const edited = subject('a', 80);
    const baseline = new Map([[original.id, JSON.stringify(original)]]);
    const changes = getPendingSubjectChanges([edited], baseline, [], []);
    expect(changes).toEqual({ pendingSubjectIds: ['a'], deletedSubjectIds: [] });

    const draft = createOfflineDraft('student-a', {
      subjects: [edited],
      pendingSubjectIds: ['a'],
    });
    expect(removeSyncedPendingSubjects(draft, [original], []).pendingSubjectIds).toEqual(['a']);
    expect(removeSyncedPendingSubjects(draft, [edited], []).pendingSubjectIds).toEqual([]);
  });

  it('builds a usable fallback workspace from a cached draft', () => {
    const draft = createOfflineDraft('student-a', {
      subjects: [subject('a', 70)],
      calculatedSignatures: { a: 'signature' },
      preferences: {
        currentSubjectId: 'a',
        activeTab: 'calculator',
        includeEstimates: false,
        estimatePercentage: 80,
        selectedSemester: 1,
      },
    });
    const workspace = fallbackWorkspaceFromDraft(draft);
    expect(workspace.subjects).toEqual(draft.subjects);
    expect(workspace.calculatedSignatures.a).toBe('signature');
    expect(workspace.preferences.currentSubjectId).toBe('a');
  });
});
