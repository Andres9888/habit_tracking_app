/**
 * Template YouTube link update mutation
 */
import { mutation } from '../_generated/server';

/**
 * YouTube links mapping for templates
 */
const youtubeLinks: Record<string, string> = {
  '4-7-8 Breathing': 'https://www.youtube.com/watch?v=J5C_VYLnq0I',

  '4-7-8 Relaxing Breath': 'https://www.youtube.com/watch?v=J5C_VYLnq0I',

  '5-Minute Meditation': 'https://www.youtube.com/watch?v=xLXF5aP4CtQ',

  '7-9 Hours Sleep': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',

  '10,000 Steps': 'https://www.youtube.com/watch?v=YQ7QGKIx6vY',
  // Andrew Huberman Protocol Templates
  '16:8 Intermittent Fasting': 'https://www.youtube.com/watch?v=9tRohh0gErM',
  'Box Breathing': 'https://www.youtube.com/watch?v=J5C_VYLnq0I',
  'Box Breathing (4-4-4-4)': 'https://www.youtube.com/watch?v=J5C_VYLnq0I',
  'Breathwork Practice': 'https://www.youtube.com/watch?v=J5C_VYLnq0I',
  'Cold Shower': 'https://www.youtube.com/watch?v=pq6WHJzOkno',
  'Consistent Bedtime': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',
  'Consistent Wake Time': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',
  'Contrast Shower': 'https://www.youtube.com/watch?v=pq6WHJzOkno',
  'Deep Work Session': 'https://www.youtube.com/watch?v=gTaJhjQHcf8',
  'Delay Caffeine 90 Minutes': 'https://www.youtube.com/watch?v=iw97uvIge7c',
  'Deliberate Cold Exposure': 'https://www.youtube.com/watch?v=pq6WHJzOkno',
  'Digital Detox Hour': 'https://www.youtube.com/watch?v=MwXNOxhhYLg',
  'Evening Light Dimming': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',
  'Gratitude Journaling': 'https://www.youtube.com/watch?v=mPH7w64diJc',
  'Hydration First': 'https://www.youtube.com/watch?v=81QHxWBJyFg',
  'Hydration Tracking': 'https://www.youtube.com/watch?v=81QHxWBJyFg',
  'Morning Sunlight Viewing': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',
  'Nasal Breathing': 'https://www.youtube.com/watch?v=rBdhqBGqiMc',
  'No Screens Before Bed': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',
  'NSDR Practice': 'https://www.youtube.com/watch?v=AKGrmY8UFWU',
  'Physiological Sigh': 'https://www.youtube.com/watch?v=rBdhqBGqiMc',
  'Sauna Recovery': 'https://www.youtube.com/watch?v=EQ3GjpGq5Y8',
  'Sauna Therapy': 'https://www.youtube.com/watch?v=EQ3GjpGq5Y8',
  'Sleep Optimization': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',
  'Stretching Routine': 'https://www.youtube.com/watch?v=gdbL6WN4jNM',
  'Sunrise Viewing': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',
  'Time-Restricted Eating': 'https://www.youtube.com/watch?v=9tRohh0gErM',
  'Yoga Nidra/NSDR': 'https://www.youtube.com/watch?v=AKGrmY8UFWU',
  'Zone 2 Cardio Training': 'https://www.youtube.com/watch?v=jN0pRAqiUJU',
};

/**
 * Mutation: Update existing templates with YouTube links
 */
export const updateYoutubeLinks = mutation({
  args: {},
  handler: async (ctx) => {
    let updatedCount = 0;
    const updatedNames: string[] = [];

    for (const [templateName, youtubeLink] of Object.entries(youtubeLinks)) {
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
