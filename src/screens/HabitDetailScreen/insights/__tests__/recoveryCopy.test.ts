import { recoveryBodyCopy, recoveryHeadlineCopy } from '../recoveryCopy';

describe('recoveryHeadlineCopy', () => {
  it('falls back when no run was actually broken', () => {
    expect(recoveryHeadlineCopy('Yesterday', 0)).toBe(
      'Yesterday got away. Today doesn’t have to.'
    );
  });

  it('uses the singular headline for a one-day run', () => {
    expect(recoveryHeadlineCopy('Yesterday', 1)).toBe(
      'Yesterday got away. One day didn’t.'
    );
  });

  it('spells the broken run count for longer runs', () => {
    expect(recoveryHeadlineCopy('Yesterday', 8)).toBe(
      'Yesterday got away. Eight days didn’t.'
    );
  });
});

describe('recoveryBodyCopy', () => {
  it('keeps the broken run as the record when it matched the best streak', () => {
    expect(recoveryBodyCopy(8, 8)).toBe(
      'Strength dipped, not to zero, and that 8-day run is still your record. The only rule that matters today: '
    );
  });

  it('falls back to the best streak when it still stands above the broken run', () => {
    expect(recoveryBodyCopy(0, 12)).toBe(
      'Strength dipped, not to zero, and your 12-day record still stands. The only rule that matters today: '
    );
  });

  it('uses the neutral body when no streak record exists yet', () => {
    expect(recoveryBodyCopy(0, 0)).toBe(
      'Strength dipped, not to zero. The only rule that matters today: '
    );
  });
});
