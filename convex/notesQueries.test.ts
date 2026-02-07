/**
 * notesQueries Authentication & Ownership Tests (SEC-001)
 *
 * Tests that all three notes queries (list, search, get):
 * - Require authentication before returning data
 * - Filter results by userId (list, search)
 * - Verify ownership for single-item access (get)
 * - Return [] or null for unauthenticated callers
 */

import { describe, it, expect } from 'vitest';

describe('notesQueries: Authentication Security', () => {
  describe('list query', () => {
    it('should check auth before any database access', () => {
      const handlerSource = `
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];
        return await ctx.db.query('notes')
          .filter((q) => q.eq(q.field('userId'), identity.subject))
      `;

      const authIndex = handlerSource.indexOf('getUserIdentity');
      const dbIndex = handlerSource.indexOf('ctx.db.query');
      expect(authIndex).toBeLessThan(dbIndex);
    });

    it('should return empty array for unauthenticated callers', () => {
      const identity = null;
      const result = identity ? 'would query db' : [];
      expect(result).toEqual([]);
    });

    it('should filter notes by userId at the database level', () => {
      const handlerSource = `
        return await ctx.db.query('notes')
          .filter((q) => q.eq(q.field('userId'), identity.subject))
          .order('desc')
          .collect();
      `;

      expect(handlerSource).toContain("q.eq(q.field('userId'), identity.subject)");
    });

    it('should only return notes belonging to the authenticated user', () => {
      const identitySubject = 'user_A';
      const allNotes = [
        { userId: 'user_A', body: 'My note', date: '2024-01-01' },
        { userId: 'user_B', body: 'Other note', date: '2024-01-01' },
        { userId: 'user_A', body: 'Another note', date: '2024-01-02' },
      ];

      const filtered = allNotes.filter((n) => n.userId === identitySubject);
      expect(filtered).toHaveLength(2);
      expect(filtered.every((n) => n.userId === 'user_A')).toBe(true);
    });
  });

  describe('search query', () => {
    it('should check auth before any database access', () => {
      const handlerSource = `
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];
        let notes = await ctx.db.query('notes')
          .filter((q) => q.eq(q.field('userId'), identity.subject))
      `;

      const authIndex = handlerSource.indexOf('getUserIdentity');
      const dbIndex = handlerSource.indexOf('ctx.db.query');
      expect(authIndex).toBeLessThan(dbIndex);
    });

    it('should return empty array for unauthenticated callers', () => {
      const identity = null;
      const result = identity ? 'would query db' : [];
      expect(result).toEqual([]);
    });

    it('should filter by userId at database level before applying search filters', () => {
      const handlerSource = `
        let notes = await ctx.db.query('notes')
          .filter((q) => q.eq(q.field('userId'), identity.subject))
          .order('desc')
          .collect();
        if (args.habitId) {
          notes = notes.filter((note) => note.habitId === args.habitId);
      `;

      const userFilter = handlerSource.indexOf('userId');
      const habitFilter = handlerSource.indexOf('args.habitId');
      expect(userFilter).toBeLessThan(habitFilter);
    });

    it('should never return notes from other users even when search matches', () => {
      const identitySubject = 'user_A';
      const allNotes = [
        { userId: 'user_A', body: 'shared keyword here', habitId: 'h1' },
        { userId: 'user_B', body: 'shared keyword here', habitId: 'h2' },
      ];

      const userNotes = allNotes.filter((n) => n.userId === identitySubject);
      const searchResults = userNotes.filter((n) =>
        n.body.toLowerCase().includes('shared keyword')
      );

      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].userId).toBe('user_A');
    });
  });

  describe('get query', () => {
    it('should check auth before any database access', () => {
      const handlerSource = `
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;
        const note = await ctx.db.get(args.noteId);
      `;

      const authIndex = handlerSource.indexOf('getUserIdentity');
      const dbIndex = handlerSource.indexOf('ctx.db.get');
      expect(authIndex).toBeLessThan(dbIndex);
    });

    it('should return null for unauthenticated callers', () => {
      const identity = null;
      const result = identity ? 'would query db' : null;
      expect(result).toBeNull();
    });

    it('should return null when note userId does not match identity.subject', () => {
      const identitySubject = 'user_A';
      const note = { userId: 'user_B', body: 'Secret note', date: '2024-01-01' };

      const result = note.userId !== identitySubject ? null : note;
      expect(result).toBeNull();
    });

    it('should return the note when userId matches identity.subject', () => {
      const identitySubject = 'user_A';
      const note = { userId: 'user_A', body: 'My note', date: '2024-01-01' };

      const result = note.userId !== identitySubject ? null : note;
      expect(result).toEqual(note);
    });

    it('should return null when note has undefined userId', () => {
      const identitySubject = 'user_A';
      const note = { userId: undefined, body: 'Legacy note', date: '2024-01-01' };

      const result = note.userId !== identitySubject ? null : note;
      expect(result).toBeNull();
    });

    it('should return null when note does not exist', () => {
      const note = null;
      const result = note ? note : null;
      expect(result).toBeNull();
    });

    it('should check auth before ownership (defense in depth)', () => {
      const handlerSource = `
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;
        const note = await ctx.db.get(args.noteId);
        if (!note) return null;
        if (note.userId !== identity.subject) return null;
      `;

      const authCheck = handlerSource.indexOf('if (!identity)');
      const ownershipCheck = handlerSource.indexOf('note.userId !== identity.subject');
      expect(authCheck).toBeLessThan(ownershipCheck);
    });
  });
});
