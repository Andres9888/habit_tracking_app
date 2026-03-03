import { getTemporalGreeting } from '../getTemporalGreeting';

describe('getTemporalGreeting', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns morning greeting before 12pm', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(8);
    expect(getTemporalGreeting()).toBe(
      'Good morning — build your AM routine',
    );
  });

  it('returns afternoon greeting between 12pm and 5pm', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(14);
    expect(getTemporalGreeting()).toBe(
      'Good afternoon — find your focus habits',
    );
  });

  it('returns evening greeting after 5pm', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(20);
    expect(getTemporalGreeting()).toBe(
      'Good evening — set up tomorrow for success',
    );
  });

  it('returns morning at exactly midnight (hour 0)', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(0);
    expect(getTemporalGreeting()).toContain('morning');
  });

  it('returns afternoon at exactly noon (hour 12)', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(12);
    expect(getTemporalGreeting()).toContain('afternoon');
  });

  it('returns evening at exactly 5pm (hour 17)', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(17);
    expect(getTemporalGreeting()).toContain('evening');
  });
});
