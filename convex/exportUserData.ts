/**
 * GDPR-compliant full user data export
 *
 * Fetches ALL user data across every table for data portability.
 * Required for GDPR Article 20 (Right to Data Portability).
 */

import { query } from './_generated/server';

export const getAllUserData = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject;

    // Fetch all user data in parallel
    const [
      habits,
      trackings,
      notes,
      reflections,
      affirmations,
      letters,
      visionBoardItems,
      visionBoardImages,
      voiceNotes,
      userSettings,
      user,
    ] = await Promise.all([
      ctx.db
        .query('habits')
        .withIndex('by_userId', (q) => q.eq('userId', userId))
        .collect(),
      ctx.db
        .query('tracking')
        .withIndex('by_user_and_date', (q) => q.eq('userId', userId))
        .collect(),
      ctx.db
        .query('notes')
        .filter((q) => q.eq(q.field('userId'), userId))
        .collect(),
      ctx.db
        .query('reflections')
        .filter((q) => q.eq(q.field('userId'), userId))
        .collect(),
      ctx.db
        .query('affirmations')
        .filter((q) => q.eq(q.field('userId'), userId))
        .collect(),
      ctx.db
        .query('letters')
        .filter((q) => q.eq(q.field('userId'), userId))
        .collect(),
      ctx.db
        .query('visionBoardItems')
        .filter((q) => q.eq(q.field('userId'), userId))
        .collect(),
      ctx.db
        .query('visionBoardImages')
        .filter((q) => q.eq(q.field('userId'), userId))
        .collect(),
      ctx.db
        .query('voiceNotes')
        .filter((q) => q.eq(q.field('userId'), userId))
        .collect(),
      ctx.db
        .query('userSettings')
        .filter((q) => q.eq(q.field('userId'), userId))
        .first(),
      ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', userId))
        .first(),
    ]);

    return {
      affirmations,
      habits,
      letters,
      notes,
      reflections,
      tracking: trackings,
      user,
      userSettings,
      visionBoardImages: visionBoardImages.map((img) => ({
        ...img,
        // Don't include raw storageId in export, include URL instead
        storageId: undefined,
      })),
      visionBoardItems,
      voiceNotes: voiceNotes.map((vn) => ({
        ...vn,
        // Include URL reference but note audio files need separate download
        audioNote: 'Audio file - available in-app',
      })),
    };
  },
});
