import { resolveMetadataValue } from '../templateMetadata';

describe('resolveMetadataValue', () => {
  const labels = { daily: 'Daily', health_fitness: 'Health & Fitness' };

  it('uses the mapped label for valid metadata', () => {
    expect(resolveMetadataValue(labels, 'health_fitness', 'General')).toBe(
      'Health & Fitness'
    );
  });

  it('uses the fallback when metadata and its lookup are unavailable', () => {
    expect(resolveMetadataValue(undefined, undefined, 'General')).toBe(
      'General'
    );
  });

  it('preserves an unknown non-empty metadata value', () => {
    expect(resolveMetadataValue(labels, 'new_category', 'General')).toBe(
      'new_category'
    );
  });
});
