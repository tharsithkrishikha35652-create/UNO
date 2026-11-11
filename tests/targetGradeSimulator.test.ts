import { describe, expect, it } from 'vitest';
import { calculateNeededTheoryMark } from '../src/components/EndSemesterSection';

describe('target grade simulator theory requirement', () => {
  it('assumes 90% of the ESE lab contribution when no lab mark is entered', () => {
    expect(
      calculateNeededTheoryMark({
        neededTotalEse: 32,
        theoryWeight: 40,
        theoryMax: 100,
        labPoints: 0,
        labWeight: 10,
        hasEnteredLabMark: false,
      })
    ).toBe(58);
  });

  it('uses the entered lab contribution instead of the assumption', () => {
    expect(
      calculateNeededTheoryMark({
        neededTotalEse: 32,
        theoryWeight: 40,
        theoryMax: 100,
        labPoints: 4,
        labWeight: 10,
        hasEnteredLabMark: true,
      })
    ).toBe(70);
  });

  it('returns zero theory marks when the ESE target is already covered', () => {
    expect(
      calculateNeededTheoryMark({
        neededTotalEse: 8,
        theoryWeight: 40,
        theoryMax: 100,
        labPoints: 0,
        labWeight: 10,
        hasEnteredLabMark: false,
      })
    ).toBe(0);
  });
});
