import { getClerkErrorMessage } from '../getClerkErrorMessage';

describe('getClerkErrorMessage', () => {
  it('returns first Clerk error message when available', () => {
    const error = { errors: [{ message: 'Email already exists' }] };

    expect(getClerkErrorMessage(error, 'Fallback')).toBe(
      'Email already exists'
    );
  });

  it('falls back to Error.message when Clerk payload is missing', () => {
    const error = new Error('Network down');

    expect(getClerkErrorMessage(error, 'Fallback')).toBe('Network down');
  });

  it('returns fallback when no message can be extracted', () => {
    expect(getClerkErrorMessage({ errors: [{}] }, 'Fallback')).toBe('Fallback');
    expect(getClerkErrorMessage(null, 'Fallback')).toBe('Fallback');
  });
});
