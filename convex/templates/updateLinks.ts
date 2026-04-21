/**
 * Template YouTube link update mutation
 */
import { internalMutation } from '../_generated/server';

import { youtubeLinksData } from './youtubeLinks.data';

/**
 * Mutation: Update existing templates with YouTube links.
 * Loads all templates once, then matches by name to avoid read limits.
 */
export const updateYoutubeLinks = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allTemplates = await ctx.db.query('templates').collect();
    const templatesByName = new Map(
      allTemplates.map((t) => [t.name, t])
    );

    let updatedCount = 0;
    const updatedNames: string[] = [];

    for (const [templateName, youtubeLink] of Object.entries(
      youtubeLinksData
    )) {
      const template = templatesByName.get(templateName);
      if (template && template.youtubeLink !== youtubeLink) {
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
