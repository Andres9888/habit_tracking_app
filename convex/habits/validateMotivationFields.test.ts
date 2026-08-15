import { MAX_SHORT_TEXT_LENGTH } from '../lib/inputValidation';
import { validateMotivationFields } from './validateMotivationFields';

describe('validateMotivationFields', () => {
  it('trims written fields and skips omitted ones', () => {
    expect(
      validateMotivationFields({
        identity: '  I start moving first.  ',
        why: ' Energy, not pressure. ',
      })
    ).toEqual({
      identity: 'I start moving first.',
      why: 'Energy, not pressure.',
    });
  });

  it('keeps empty strings so Edit can clear a field', () => {
    expect(validateMotivationFields({ why: '   ', woopWish: '' })).toEqual({
      why: '',
      woopWish: '',
    });
  });

  it('rejects a WOOP field that is too long', () => {
    expect(() =>
      validateMotivationFields({
        woopObstacle: 'x'.repeat(MAX_SHORT_TEXT_LENGTH + 1),
      })
    ).toThrow(/Obstacle cannot exceed/);
  });
});
