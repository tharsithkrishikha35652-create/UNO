import { describe, expect, it } from 'vitest';
import { stripUndefined } from '../src/firestoreSerialization';

describe('Firestore write serialization', () => {
  it('omits undefined object properties at every nesting level', () => {
    expect(stripUndefined({
      name: 'Course',
      electiveSlot: undefined,
      marks: { ese: 90, optional: undefined },
    })).toEqual({
      name: 'Course',
      marks: { ese: 90 },
    });
  });

  it('preserves array positions and converts undefined array entries to null', () => {
    expect(stripUndefined({ scores: [10, undefined, 20] })).toEqual({
      scores: [10, null, 20],
    });
  });

  it('preserves configured course mark maxima for Firestore persistence', () => {
    expect(stripUndefined({
      markMaxima: {
        act1: 20,
        eseTheory: 150,
        'project.reviewI': 200,
      },
    })).toEqual({
      markMaxima: {
        act1: 20,
        eseTheory: 150,
        'project.reviewI': 200,
      },
    });
  });

  it('preserves non-plain Firestore sentinel and timestamp objects', () => {
    const sentinel = new (class ServerTimestamp {})();
    expect(stripUndefined({ createdAt: sentinel }).createdAt).toBe(sentinel);
  });
});
