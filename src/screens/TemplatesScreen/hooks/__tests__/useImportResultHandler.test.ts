/**
 * Import result routing: every result shape must surface feedback — a result
 * that is neither an add nor a duplicate must show an error, never silence.
 */

import { renderHook } from '@testing-library/react-native';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { useImportResultHandler } from '../useImportResultHandler';

const tid = 't1' as Id<'templates'>;
const hid = 'h1' as Id<'habits'>;

function setup() {
  const o = {
    setImportedTemplateIds: jest.fn(),
    showAlreadyImported: jest.fn(),
    showError: jest.fn(),
    showSuccess: jest.fn(),
  };
  const { result } = renderHook(() => useImportResultHandler(o));
  return { handle: result.current, o };
}

describe('useImportResultHandler', () => {
  it('returns "added" and shows success on fresh import', () => {
    const { handle, o } = setup();
    expect(handle({ success: true, habitId: hid }, tid)).toBe('added');
    expect(o.showSuccess).toHaveBeenCalledWith(hid);
    expect(o.setImportedTemplateIds).toHaveBeenCalled();
  });

  it('returns "exists" for alreadyExists', () => {
    const { handle, o } = setup();
    expect(handle({ alreadyExists: true, habitId: hid }, tid)).toBe('exists');
    expect(o.showAlreadyImported).toHaveBeenCalledWith(hid);
    expect(o.showError).not.toHaveBeenCalled();
  });

  it('returns "failed" AND shows an error on {success:false}', () => {
    const { handle, o } = setup();
    expect(handle({ success: false }, tid)).toBe('failed');
    expect(o.showError).toHaveBeenCalled();
    expect(o.setImportedTemplateIds).not.toHaveBeenCalled();
  });

  it('returns "failed" and shows an error on an empty result', () => {
    const { handle, o } = setup();
    expect(handle({}, tid)).toBe('failed');
    expect(o.showError).toHaveBeenCalled();
  });
});
