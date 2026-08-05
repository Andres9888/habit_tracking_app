import { validateEffortMinutes } from './validation';

describe('validateEffortMinutes', () => {
  it('accepts an unset estimate and the picker presets', () => {
    expect(() => validateEffortMinutes(undefined)).not.toThrow();
    expect(() => validateEffortMinutes(5)).not.toThrow();
    expect(() => validateEffortMinutes(15)).not.toThrow();
    expect(() => validateEffortMinutes(30)).not.toThrow();
  });

  it('accepts future custom estimates inside the supported range', () => {
    expect(() => validateEffortMinutes(1)).not.toThrow();
    expect(() => validateEffortMinutes(480)).not.toThrow();
  });

  it.each([0, -1, 1.5, 481, Number.NaN])(
    'rejects invalid effort estimate %s',
    (value) => {
      expect(() => validateEffortMinutes(value)).toThrow(
        'effortMinutes must be an integer between 1 and 480'
      );
    }
  );
});
