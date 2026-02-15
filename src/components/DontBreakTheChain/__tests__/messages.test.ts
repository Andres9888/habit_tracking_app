import { getNudgeMessage, getNotificationNudge } from '../messages';

describe('DontBreakTheChain Messages', () => {
  describe('getNudgeMessage', () => {
    it('returns short-streak message for 3-6 days', () => {
      const msg = getNudgeMessage(3);
      expect(msg.title).toBeTruthy();
      expect(msg.emoji).toBeTruthy();
    });

    it('returns medium-streak message for 7-13 days', () => {
      const msg = getNudgeMessage(7);
      expect(msg.title).toBeTruthy();
    });

    it('returns strong-streak message for 14-29 days', () => {
      const msg = getNudgeMessage(14);
      expect(msg.title).toBeTruthy();
    });

    it('returns long-streak message for 30+ days', () => {
      const msg = getNudgeMessage(30);
      expect(msg.title).toBeTruthy();
    });

    it('alternates messages for consecutive streaks', () => {
      const msg3 = getNudgeMessage(3);
      const msg4 = getNudgeMessage(4);
      expect(msg3.title).not.toBe(msg4.title);
    });
  });

  describe('getNotificationNudge', () => {
    it('includes streak count', () => {
      expect(getNotificationNudge(10)).toContain('10');
    });

    it('includes habit name when provided', () => {
      expect(getNotificationNudge(10, 'Meditate')).toContain('Meditate');
    });

    it('uses fire emoji for 30+ streaks', () => {
      expect(getNotificationNudge(30)).toContain('🔥');
    });
  });
});
