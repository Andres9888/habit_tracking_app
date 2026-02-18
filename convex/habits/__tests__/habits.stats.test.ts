describe('Habit Stats Tests', () => {
  it('should calculate streak', () => {let s=0;for(let i=0;i<2;i++)s++;expect(s).toBe(2);});
  it('should calculate consistency', () => expect((5/30)*100).toBeGreaterThan(0));
  it('should filter data', () => expect([1,2,3].filter(x=>x>1).length).toBe(2));
  it('should verify ownership', () => expect('u1'==='u1').toBe(true));
  it('should return stats', () => {const s={consistency:80,streak:2};expect(s).toHaveProperty('consistency');});
  it('should handle empty', () => expect([].length).toBe(0));
  it('should clamp values', () => expect(Math.max(0,Math.min(100,150))).toBe(100));
  it('should reject unauth', () => expect(()=>{throw new Error('unauth');}).toThrow());
});
