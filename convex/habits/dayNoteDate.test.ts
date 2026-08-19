import { assertNoteDateAllowed } from './dayNoteDate';

describe('assertNoteDateAllowed', () => {
  it('rejects a future date in the given timezone', () => {
    expect(() =>
      assertNoteDateAllowed('2099-01-01', 'America/Los_Angeles')
    ).toThrow('Cannot add notes for future dates');
  });

  it('allows today in the given timezone', () => {
    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Los_Angeles',
    }).format(new Date());
    expect(() =>
      assertNoteDateAllowed(today, 'America/Los_Angeles')
    ).not.toThrow();
  });
});
