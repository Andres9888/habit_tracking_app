/**
 * Template YouTube link update mutation
 */
import { internalMutation } from '../_generated/server';

import { youtubeLinksData } from './youtubeLinks.data';

/**
 * Mutation: Update existing templates with YouTube links
 */
export const updateYoutubeLinks = internalMutation({
  args: {},
  handler: async (ctx) => {
    let updatedCount = 0;
    const updatedNames: string[] = [];

    for (const [templateName, youtubeLink] of Object.entries(
      youtubeLinksData
    )) {
      const template = await ctx.db
        .query('templates')
        .filter((q) => q.eq(q.field('name'), templateName))
        .first();

      if (template && !template.youtubeLink) {
        await ctx.db.patch(template._id, { youtubeLink });
        updatedCount++;
        updatedNames.push(templateName);
      }
    }

    return {
      message: `Updated ${updatedCount} templates with YouTube links`,
      success: true,
      updatedCount,
      updatedNames,
    };
  },
});
