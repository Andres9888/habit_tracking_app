/**
 * Template Library Functions
 * Phase 3 Feature: Science-backed habit templates
 */

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Query: List all templates, optionally filtered by category
 */
export const list = query({
  args: {
    category: v.optional(
      v.union(
        v.literal('morning_routine'),
        v.literal('health_fitness'),
        v.literal('productivity'),
        v.literal('mindfulness'),
      ),
    ),
  },
  handler: async (ctx, args) => {
    if (args.category) {
      const category = args.category; // TypeScript refinement
      return await ctx.db
        .query('templates')
        .withIndex('by_category', (q) => q.eq('category', category))
        .order('desc')
        .collect();
    }

    return await ctx.db.query('templates').order('desc').collect();
  },
});

/**
 * Query: Get a single template by ID
 */
export const getById = query({
  args: { id: v.id('templates') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Mutation: Seed initial templates (for setup/migration)
 */
export const seedTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Morning Routine Templates
    await ctx.db.insert('templates', {
      name: '5-Minute Meditation',
      description: 'Start your day with mindful meditation. Research shows just 5 minutes daily can reduce stress and improve focus.',
      category: 'morning_routine',
      icon: '🧘',
      iconColor: '#10B981',
      frequency: 'daily',
      scientificReference: 'Goyal et al. (2014) - Meditation programs for psychological stress',
      scientificLink: 'https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/1809754',
      popularityScore: 95,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Morning Pages',
      description: 'Write 3 pages of stream-of-consciousness thoughts first thing. Clears mental clutter and boosts creativity.',
      category: 'morning_routine',
      icon: '✍️',
      iconColor: '#3B82F6',
      frequency: 'daily',
      scientificReference: 'Cameron (1992) - The Artist\'s Way creative recovery program',
      popularityScore: 88,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Hydration First',
      description: 'Drink a full glass of water immediately after waking. Rehydrates body and kickstarts metabolism.',
      category: 'morning_routine',
      icon: '💧',
      iconColor: '#60A5FA',
      frequency: 'daily',
      scientificReference: 'Popkin et al. (2010) - Water, hydration, and health',
      popularityScore: 92,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Sunrise Viewing',
      description: 'View sunlight within 30 minutes of waking. Regulates circadian rhythm and improves sleep quality.',
      category: 'morning_routine',
      icon: '🌅',
      iconColor: '#F59E0B',
      frequency: 'daily',
      scientificReference: 'Huberman (2021) - Light exposure and circadian biology',
      popularityScore: 85,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Delay Caffeine 90 Minutes',
      description:
        'Wait 90 minutes after waking before having caffeine. Supports adenosine clearance and sustained alertness.',
      category: 'morning_routine',
      icon: '☕',
      iconColor: '#B45309',
      frequency: 'daily',
      scientificReference: 'Huberman Lab (2023) - Caffeine timing for optimal alertness',
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      popularityScore: 82,
      createdAt: now,
    });

    // Health & Fitness Templates
    await ctx.db.insert('templates', {
      name: '7-Minute Workout',
      description: 'High-intensity circuit training backed by science. 12 exercises, 30 seconds each, maximum results in minimum time.',
      category: 'health_fitness',
      icon: '🏃',
      iconColor: '#EF4444',
      frequency: 'daily',
      scientificReference: 'Jordan et al. (2013) - High-intensity circuit training',
      scientificLink: 'https://journals.lww.com/acsm-healthfitness/fulltext/2013/05000/high_intensity_circuit_training_using_body_weight_.5.aspx',
      popularityScore: 98,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: '10,000 Steps',
      description: 'Walk 10,000 steps daily. Proven to reduce cardiovascular disease risk and improve mental health.',
      category: 'health_fitness',
      icon: '👟',
      iconColor: '#8B5CF6',
      frequency: 'daily',
      scientificReference: 'Lee et al. (2019) - Association of step volume and intensity',
      popularityScore: 94,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Strength Training',
      description: 'Resistance training 2-3x per week. Builds muscle, bone density, and metabolic health.',
      category: 'health_fitness',
      icon: '💪',
      iconColor: '#059669',
      frequency: 'weekly',
      scientificReference: 'Westcott (2012) - Resistance training health benefits',
      popularityScore: 91,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Stretching Routine',
      description: 'Daily stretching for flexibility and injury prevention. Just 10 minutes improves range of motion.',
      category: 'health_fitness',
      icon: '🤸',
      iconColor: '#EC4899',
      frequency: 'daily',
      scientificReference: 'Behm et al. (2016) - Acute effects of muscle stretching',
      popularityScore: 86,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'No Added Sugar',
      description: 'Eliminate added sugars from diet. Reduces inflammation, improves energy, and supports weight management.',
      category: 'health_fitness',
      icon: '🚫',
      iconColor: '#DC2626',
      frequency: 'daily',
      scientificReference: 'Yang et al. (2014) - Added sugar intake and cardiovascular disease',
      popularityScore: 89,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Zone 2 Cardio',
      description: 'Perform 45 minutes of steady Zone 2 cardio 3x weekly. Builds mitochondrial efficiency and endurance.',
      category: 'health_fitness',
      icon: '🚴',
      iconColor: '#2563EB',
      frequency: 'weekly',
      scientificReference: 'Huberman Lab (2022) - Zone 2 training for longevity',
      scientificLink: 'https://hubermanlab.com/zone-2-training-for-endurance-and-longevity/',
      popularityScore: 90,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Deliberate Cold Exposure',
      description: 'Accumulate 11 minutes of cold exposure per week to boost mood, metabolism, and stress resilience.',
      category: 'health_fitness',
      icon: '🧊',
      iconColor: '#38BDF8',
      frequency: 'weekly',
      scientificReference: 'Huberman Lab (2023) - Optimal deliberate cold exposure protocols',
      scientificLink: 'https://hubermanlab.com/optimal-deliberate-cold-exposure-protocols/',
      popularityScore: 88,
      createdAt: now,
    });

    // Productivity Templates
    await ctx.db.insert('templates', {
      name: 'Deep Work Session',
      description: '90-minute focused work block with no distractions. Maximize cognitive output and creative problem-solving.',
      category: 'productivity',
      icon: '🧠',
      iconColor: '#7C3AED',
      frequency: 'daily',
      scientificReference: 'Newport (2016) - Deep Work: Rules for focused success',
      popularityScore: 96,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Pomodoro Technique',
      description: 'Work in 25-minute focused intervals with 5-minute breaks. Maintains high focus and prevents burnout.',
      category: 'productivity',
      icon: '⏱️',
      iconColor: '#F97316',
      frequency: 'daily',
      scientificReference: 'Cirillo (2006) - The Pomodoro Technique',
      popularityScore: 93,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'MIT - Most Important Task',
      description: 'Identify and complete your single most important task before noon. Ensures progress on key priorities.',
      category: 'productivity',
      icon: '🎯',
      iconColor: '#0EA5E9',
      frequency: 'daily',
      scientificReference: 'Tracy (2007) - Eat That Frog! productivity principle',
      popularityScore: 90,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Inbox Zero',
      description: 'Process all emails to zero daily. Reduces mental load and prevents email overwhelm.',
      category: 'productivity',
      icon: '📧',
      iconColor: '#06B6D4',
      frequency: 'daily',
      scientificReference: 'Mann (2007) - Inbox Zero email management system',
      popularityScore: 84,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Evening Planning',
      description: 'Plan tomorrow\'s top 3 tasks before bed. Reduces morning decision fatigue and anxiety.',
      category: 'productivity',
      icon: '📝',
      iconColor: '#6366F1',
      frequency: 'daily',
      scientificReference: 'Baumeister (2011) - Decision fatigue research',
      popularityScore: 87,
      createdAt: now,
    });

    // Mindfulness Templates
    await ctx.db.insert('templates', {
      name: 'Gratitude Journaling',
      description: 'Write down 3 things you\'re grateful for. Increases happiness, optimism, and life satisfaction.',
      category: 'mindfulness',
      icon: '🙏',
      iconColor: '#F59E0B',
      frequency: 'daily',
      scientificReference: 'Emmons & McCullough (2003) - Counting blessings versus burdens',
      scientificLink: 'https://greatergood.berkeley.edu/pdfs/GratitudePDFs/6Emmons-BlessingsBurdens.pdf',
      popularityScore: 97,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Breathwork Practice',
      description: '5 minutes of controlled breathing. Activates parasympathetic nervous system, reduces stress instantly.',
      category: 'mindfulness',
      icon: '🌬️',
      iconColor: '#14B8A6',
      frequency: 'daily',
      scientificReference: 'Ma et al. (2017) - Breathing meditation for stress reduction',
      popularityScore: 91,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Evening Reflection',
      description: 'Reflect on your day: what went well, what to improve. Builds self-awareness and continuous growth.',
      category: 'mindfulness',
      icon: '🌙',
      iconColor: '#6366F1',
      frequency: 'daily',
      scientificReference: 'Kolb (1984) - Experiential learning and reflection',
      popularityScore: 88,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Digital Detox Hour',
      description: 'One hour completely screen-free before bed. Improves sleep quality and mental restoration.',
      category: 'mindfulness',
      icon: '📵',
      iconColor: '#10B981',
      frequency: 'daily',
      scientificReference: 'Exelmans & Van den Bulck (2016) - Bedtime mobile phone use',
      popularityScore: 85,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Walking in Nature',
      description: '20-minute nature walk. Reduces cortisol, lowers blood pressure, and enhances mood significantly.',
      category: 'mindfulness',
      icon: '🌲',
      iconColor: '#059669',
      frequency: 'daily',
      scientificReference: 'Hansen et al. (2017) - Shinrin-yoku (forest bathing) benefits',
      popularityScore: 93,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'NSDR Reset',
      description: 'Practice a 10-20 minute Non-Sleep Deep Rest session to restore focus and accelerate learning.',
      category: 'mindfulness',
      icon: '🛌',
      iconColor: '#7DD3FC',
      frequency: 'daily',
      scientificReference: 'Huberman Lab (2021) - Using NSDR to improve learning and sleep',
      scientificLink: 'https://hubermanlab.com/using-nsdr-to-improve-learning-skill-memory/',
      popularityScore: 89,
      createdAt: now,
    });

    await ctx.db.insert('templates', {
      name: 'Physiological Sigh Break',
      description: 'Take 1-3 physiological sighs when stressed. Rapidly lowers autonomic arousal and steadies mood.',
      category: 'mindfulness',
      icon: '😮‍💨',
      iconColor: '#34D399',
      frequency: 'daily',
      scientificReference: 'Huberman Lab (2023) - Physiological sigh for stress regulation',
      scientificLink: 'https://hubermanlab.com/science-supported-tools-to-reduce-stress/',
      popularityScore: 87,
      createdAt: now,
    });

    return { success: true, message: '24 templates seeded successfully' };
  },
});

/**
 * Mutation: Import a template to create a new habit
 */
export const importTemplate = mutation({
  args: {
    templateId: v.id('templates'),
    customizations: v.optional(
      v.object({
        name: v.optional(v.string()),
        iconColor: v.optional(v.string()),
        reminderTime: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Create habit from template
    const habitId = await ctx.db.insert('habits', {
      name: args.customizations?.name || template.name,
      icon: template.icon,
      iconColor: args.customizations?.iconColor || template.iconColor,
      frequency: template.frequency,
      notes: template.description + '\n\nSource: ' + template.scientificReference,
      createdAt: Date.now(),
      order: 0, // Will be adjusted by reorder logic
      // Initialize habit strength values
      strength: 0,
      strengthLevel: 'starting',
      strengthUpdatedAt: Date.now(),
      accessibility: 1.0,
      accessibilityUpdatedAt: Date.now(),
      totalCompletions: 0,
      totalMisses: 0,
      consecutiveDays: 0,
      // Optional customizations
      reminderTime: args.customizations?.reminderTime,
      remindersEnabled: !!args.customizations?.reminderTime,
    });

    // Track template usage analytics
    await ctx.db.insert('templateUsage', {
      templateId: args.templateId,
      importedAt: Date.now(),
      habitId,
    });

    return { habitId, success: true };
  },
});

/**
 * Query: Get popular templates (sorted by popularity score)
 */
export const getPopular = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const templates = await ctx.db.query('templates').collect();

    // Sort by popularity score descending
    return templates
      .filter((t) => t.popularityScore !== undefined)
      .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
      .slice(0, limit);
  },
});

/**
 * Query: Get template usage statistics
 */
export const getUsageStats = query({
  args: { templateId: v.id('templates') },
  handler: async (ctx, args) => {
    const usage = await ctx.db
      .query('templateUsage')
      .withIndex('by_template', (q) => q.eq('templateId', args.templateId))
      .collect();

    return {
      totalImports: usage.length,
      recentImports: usage.filter((u) => u.importedAt > Date.now() - 7 * 24 * 60 * 60 * 1000).length,
    };
  },
});

/**
 * Mutation: Clear all templates (for cleanup/reset)
 */
export const clearTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query('templates').collect();
    for (const template of templates) {
      await ctx.db.delete(template._id);
    }
    return { success: true, message: `Deleted ${templates.length} templates` };
  },
});
