import { resolveCompletedStatus } from './toggleState';

describe('resolveCompletedStatus', () => {
  it('flips an existing completion when no desired state is sent', () => {
    expect(resolveCompletedStatus(true)).toEqual({ next: false, noop: false });
    expect(resolveCompletedStatus(false)).toEqual({ next: true, noop: false });
    expect(resolveCompletedStatus(undefined)).toEqual({
      next: true,
      noop: false,
    });
  });

  it('is a no-op when the server already matches the desired state', () => {
    expect(resolveCompletedStatus(true, true)).toEqual({
      next: true,
      noop: true,
    });
    expect(resolveCompletedStatus(false, false)).toEqual({
      next: false,
      noop: true,
    });
    expect(resolveCompletedStatus(undefined, false)).toEqual({
      next: false,
      noop: true,
    });
  });

  it('sets the desired state when it differs from the server', () => {
    expect(resolveCompletedStatus(false, true)).toEqual({
      next: true,
      noop: false,
    });
    expect(resolveCompletedStatus(true, false)).toEqual({
      next: false,
      noop: false,
    });
    expect(resolveCompletedStatus(undefined, true)).toEqual({
      next: true,
      noop: false,
    });
  });
});
