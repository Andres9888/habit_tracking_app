/**
 * Template Library Functions
 * Phase 3 Feature: Science-backed habit templates
 */

import { v } from 'convex/values';
import { internalMutation, query } from './_generated/server';
import type { Id } from './_generated/dataModel';
import type { MutationCtx } from './_generated/server';

// Frequency constants
const FREQUENCY_DAILY = 'daily';

type TemplateInsert = {
  category:
    | 'andrew_huberman'
    | 'breathing'
    | 'creativity'
    | 'financial'
    | 'health_fitness'
    | 'learning'
    | 'longevity'
    | 'mental_health'
    | 'mindfulness'
    | 'morning_routine'
    | 'productivity'
    | 'recovery'
    | 'sleep'
    | 'social';
  createdAt: number;
  description: string;
  frequency: string;
  icon: string;
  iconColor: string;
  name: string;
  popularityScore?: number;
  scientificLink?: string;
  scientificReference: string;
  tips?: string[];
  youtubeLink?: string;
};

const _insertTemplateIfMissing = async (
  ctx: Pick<MutationCtx, 'db'>,
  template: TemplateInsert
) => {
  const existing = await ctx.db
    .query('templates')
    .filter((q) => q.eq(q.field('name'), template.name))
    .first();

  if (existing) return;

  await ctx.db.insert('templates', template);
};

const normalizeTemplateName = (name: string) => name.trim().toLowerCase();

const pickBestTemplate = <
  T extends {
    _creationTime: number;
    createdAt: number;
    description: string;
    popularityScore?: number;
    scientificLink?: string;
    scientificReference: string;
  },
>(
  templates: T[]
): T => {
  const scoreTemplate = (template: T) => {
    const hasScientificLinkScore = template.scientificLink ? 1000 : 0;
    const popularityScore = template.popularityScore ?? 0;
    const descriptionScore = Math.min(template.description.length, 500) / 10;
    const referenceScore = template.scientificReference ? 5 : 0;
    return (
      hasScientificLinkScore +
      popularityScore +
      descriptionScore +
      referenceScore
    );
  };

  let best = templates[0];
  for (const current of templates) {
    const bestScore = scoreTemplate(best);
    const currentScore = scoreTemplate(current);
    if (currentScore > bestScore) {
      best = current;
    } else if (currentScore === bestScore) {
      // Deterministic tie-breakers
      if (current.createdAt > best.createdAt) {
        best = current;
      } else if (
        current.createdAt === best.createdAt &&
        current._creationTime > best._creationTime
      ) {
        best = current;
      }
    }
  }
  return best;
};

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
        v.literal('andrew_huberman'),
        v.literal('learning'),
        v.literal('social'),
        v.literal('financial'),
        v.literal('creativity'),
        v.literal('sleep'),
        // New science-backed categories
        v.literal('longevity'),
        v.literal('mental_health'),
        v.literal('recovery'),
        v.literal('breathing')
      )
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
 * Internal Mutation: Seed initial templates (for setup/migration)
 * SEC: Internal only - run via Convex dashboard, not accessible to users
 */
export const seedTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let _insertedCount = 0;
    let _skippedCount = 0;

    const insertWithTracking = async (template: TemplateInsert) => {
      const existing = await ctx.db
        .query('templates')
        .filter((q) => q.eq(q.field('name'), template.name))
        .first();

      if (existing) {
        _skippedCount++;
        return false;
      }

      await ctx.db.insert('templates', template);
      _insertedCount++;
      return true;
    };

    // Morning Routine Templates
    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Start your day with mindful meditation. Research shows just 5 minutes daily can reduce stress and improve focus.',
      frequency: FREQUENCY_DAILY,
      icon: '🧘',
      iconColor: '#10B981',
      name: '5-Minute Meditation',
      popularityScore: 95,
      scientificLink:
        'https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/1809754',
      scientificReference:
        'Goyal et al. (2014) - Meditation programs for psychological stress',
      tips: [
        'Start with just 2 minutes and gradually increase',
        'Use a guided meditation app for your first few weeks',
        'Same time each morning builds the habit faster',
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=xLXF5aP4CtQ',
    });

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Write 3 pages of stream-of-consciousness thoughts first thing. Clears mental clutter and boosts creativity.',
      frequency: FREQUENCY_DAILY,
      icon: '✍️',
      iconColor: '#3B82F6',
      name: 'Morning Pages',
      popularityScore: 88,
      scientificReference:
        "Cameron (1992) - The Artist's Way creative recovery program",
    });

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Drink a full glass of water immediately after waking. Rehydrates body and kickstarts metabolism.',
      frequency: FREQUENCY_DAILY,
      icon: '💧',
      iconColor: '#60A5FA',
      name: 'Hydration First',
      popularityScore: 92,
      scientificReference:
        'Popkin et al. (2010) - Water, hydration, and health',
      tips: [
        'Keep a water bottle by your bed the night before',
        'Add a squeeze of lemon for extra motivation',
        'Drink before checking your phone',
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=81QHxWBJyFg',
    });

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'View sunlight within 30 minutes of waking. Regulates circadian rhythm and improves sleep quality.',
      frequency: FREQUENCY_DAILY,
      icon: '🌅',
      iconColor: '#F59E0B',
      name: 'Sunrise Viewing',
      popularityScore: 85,
      scientificReference:
        'Huberman (2021) - Light exposure and circadian biology',
      youtubeLink: 'https://www.youtube.com/watch?v=WDv4AWk0J3U',
    });

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Perform 5-10 sun salutations to wake up your body and mind. Improves circulation, flexibility, and energy.',
      frequency: FREQUENCY_DAILY,
      icon: '🌞',
      iconColor: '#F59E0B',
      name: 'Sun Salutation Flow',
      popularityScore: 78,
      scientificReference:
        'Cramer et al. (2016) - Yoga for chronic low back pain',
    });

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Take a 2-3 minute cold shower. Builds resilience, improves circulation, and boosts alertness.',
      frequency: FREQUENCY_DAILY,
      icon: '❄️',
      iconColor: '#3B82F6',
      name: 'Cold Shower',
      popularityScore: 76,
      scientificReference:
        'Höpfl et al. (2021) - Cold water immersion for recovery',
      youtubeLink: 'https://www.youtube.com/watch?v=pq6WHJzOkno',
    });

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Make your bed immediately after waking. Creates a sense of accomplishment and order to start the day.',
      frequency: FREQUENCY_DAILY,
      icon: '🛏️',
      iconColor: '#8B5CF6',
      name: 'Make Your Bed',
      popularityScore: 80,
      scientificReference:
        'McRaven (2014) - Make Your Bed: Little Things That Can Change Your Life',
    });

    // Health & Fitness Templates
    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'High-intensity circuit training backed by science. 12 exercises, 30 seconds each, maximum results in minimum time.',
      frequency: FREQUENCY_DAILY,
      icon: '🏃',
      iconColor: '#EF4444',
      name: '7-Minute Workout',
      popularityScore: 98,
      scientificLink:
        'https://journals.lww.com/acsm-healthfitness/fulltext/2013/05000/high_intensity_circuit_training_using_body_weight_.5.aspx',
      scientificReference:
        'Jordan et al. (2013) - High-intensity circuit training',
      tips: [
        'Lay out workout clothes the night before',
        'Use a timer app to keep the pace',
        'Do it before breakfast for best results',
      ],
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Walk 10,000 steps daily. Proven to reduce cardiovascular disease risk and improve mental health.',
      frequency: FREQUENCY_DAILY,
      icon: '👟',
      iconColor: '#8B5CF6',
      name: '10,000 Steps',
      popularityScore: 94,
      scientificReference:
        'Lee et al. (2019) - Association of step volume and intensity',
      tips: [
        'Take walking meetings when possible',
        'Park further away from entrances',
        'Use stairs instead of elevators',
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=YQ7QGKIx6vY',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Resistance training 2-3x per week. Builds muscle, bone density, and metabolic health.',
      frequency: 'weekly',
      icon: '💪',
      iconColor: '#059669',
      name: 'Strength Training',
      popularityScore: 91,
      scientificReference:
        'Westcott (2012) - Resistance training health benefits',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Daily stretching for flexibility and injury prevention. Just 10 minutes improves range of motion.',
      frequency: FREQUENCY_DAILY,
      icon: '🤸',
      iconColor: '#EC4899',
      name: 'Stretching Routine',
      popularityScore: 86,
      scientificReference:
        'Behm et al. (2016) - Acute effects of muscle stretching',
      youtubeLink: 'https://www.youtube.com/watch?v=gdbL6WN4jNM',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Eliminate added sugars from diet. Reduces inflammation, improves energy, and supports weight management.',
      frequency: FREQUENCY_DAILY,
      icon: '🚫',
      iconColor: '#DC2626',
      name: 'No Added Sugar',
      popularityScore: 89,
      scientificReference:
        'Yang et al. (2014) - Added sugar intake and cardiovascular disease',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Prepare healthy meals for the week ahead. Saves time, reduces stress, and ensures nutritious eating.',
      frequency: 'weekly',
      icon: '🥗',
      iconColor: '#059669',
      name: 'Meal Prepping',
      popularityScore: 83,
      scientificReference:
        'Wolfson & Bleich (2015) - Is cooking at home associated with better diet quality?',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Practice yoga for 20-30 minutes. Improves flexibility, reduces stress, and enhances mental clarity.',
      frequency: FREQUENCY_DAILY,
      icon: '🧘‍♀️',
      iconColor: '#EC4899',
      name: 'Daily Yoga Practice',
      popularityScore: 87,
      scientificReference:
        'Cramer et al. (2014) - Yoga for anxiety and depression',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Consume 25-35g of fiber daily from whole foods. Supports gut health, digestion, and metabolic function.',
      frequency: FREQUENCY_DAILY,
      icon: '🌾',
      iconColor: '#16A34A',
      name: 'High Fiber Diet',
      popularityScore: 81,
      scientificReference:
        'McKeown et al. (2009) - Dietary fiber intake and mortality',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Track daily water intake to reach 8-10 glasses. Essential for hydration, cognitive function, and energy.',
      frequency: FREQUENCY_DAILY,
      icon: '🥤',
      iconColor: '#0284C7',
      name: 'Hydration Tracking',
      popularityScore: 88,
      scientificReference:
        'Riebl & Davy (2013) - The hydration equation: Update on water balance',
      youtubeLink: 'https://www.youtube.com/watch?v=81QHxWBJyFg',
    });

    // Productivity Templates
    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        '90-minute focused work block with no distractions. Maximize cognitive output and creative problem-solving.',
      frequency: FREQUENCY_DAILY,
      icon: '🧠',
      iconColor: '#7C3AED',
      name: 'Deep Work Session',
      popularityScore: 96,
      scientificReference:
        'Newport (2016) - Deep Work: Rules for focused success',
      tips: [
        'Put your phone in another room completely',
        'Use website blockers during deep work time',
        'Schedule deep work during your peak energy hours',
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=gTaJhjQHcf8',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Work in 25-minute focused intervals with 5-minute breaks. Maintains high focus and prevents burnout.',
      frequency: FREQUENCY_DAILY,
      icon: '⏱️',
      iconColor: '#F97316',
      name: 'Pomodoro Technique',
      popularityScore: 93,
      scientificReference: 'Cirillo (2006) - The Pomodoro Technique',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Identify and complete your single most important task before noon. Ensures progress on key priorities.',
      frequency: FREQUENCY_DAILY,
      icon: '🎯',
      iconColor: '#0EA5E9',
      name: 'MIT - Most Important Task',
      popularityScore: 90,
      scientificReference:
        'Tracy (2007) - Eat That Frog! productivity principle',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Process all emails to zero daily. Reduces mental load and prevents email overwhelm.',
      frequency: FREQUENCY_DAILY,
      icon: '📧',
      iconColor: '#06B6D4',
      name: 'Inbox Zero',
      popularityScore: 84,
      scientificReference: 'Mann (2007) - Inbox Zero email management system',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        "Plan tomorrow's top 3 tasks before bed. Reduces morning decision fatigue and anxiety.",
      frequency: FREQUENCY_DAILY,
      icon: '📝',
      iconColor: '#6366F1',
      name: 'Evening Planning',
      popularityScore: 87,
      scientificReference: 'Baumeister (2011) - Decision fatigue research',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Block specific time periods for focused work without interruptions. Improves productivity and work quality.',
      frequency: FREQUENCY_DAILY,
      icon: '📅',
      iconColor: '#059669',
      name: 'Time Blocking',
      popularityScore: 90,
      scientificReference: 'Cal Newport (2016) - Deep Work methodology',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Spend 30 minutes daily learning something new. Builds knowledge and keeps your brain sharp.',
      frequency: FREQUENCY_DAILY,
      icon: '📚',
      iconColor: '#7C3AED',
      name: 'Daily Learning',
      popularityScore: 84,
      scientificReference:
        'Dweck (2006) - Mindset: The New Psychology of Success',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Review and organize your workspace. Reduces mental clutter and improves focus and efficiency.',
      frequency: 'weekly',
      icon: '🧹',
      iconColor: '#DC2626',
      name: 'Weekly Desk Cleanup',
      popularityScore: 79,
      scientificReference:
        'McMains & Kastner (2011) - Interactions of top-down and bottom-up mechanisms in human visual cortex',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Take regular 5-minute breaks every hour during work. Prevents burnout and maintains sustained focus.',
      frequency: FREQUENCY_DAILY,
      icon: '⏰',
      iconColor: '#F59E0B',
      name: 'Work Breaks',
      popularityScore: 85,
      scientificReference:
        'Trougakos et al. (2014) - Having to do it all: The effects of resource depletion',
    });

    // Mindfulness Templates
    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        "Write down 3 things you're grateful for. Increases happiness, optimism, and life satisfaction.",
      frequency: FREQUENCY_DAILY,
      icon: '🙏',
      iconColor: '#F59E0B',
      name: 'Gratitude Journaling',
      popularityScore: 97,
      scientificLink:
        'https://greatergood.berkeley.edu/pdfs/GratitudePDFs/6Emmons-BlessingsBurdens.pdf',
      scientificReference:
        'Emmons & McCullough (2003) - Counting blessings versus burdens',
      tips: [
        'Keep a dedicated gratitude notebook by your bed',
        'Include one specific detail about why you appreciate each item',
        'Do it at the same time each day - morning or night',
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=mPH7w64diJc',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        '5 minutes of controlled breathing. Activates parasympathetic nervous system, reduces stress instantly.',
      frequency: FREQUENCY_DAILY,
      icon: '🌬️',
      iconColor: '#14B8A6',
      name: 'Breathwork Practice',
      popularityScore: 91,
      scientificReference:
        'Ma et al. (2017) - Breathing meditation for stress reduction',
      youtubeLink: 'https://www.youtube.com/watch?v=J5C_VYLnq0I',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Reflect on your day: what went well, what to improve. Builds self-awareness and continuous growth.',
      frequency: FREQUENCY_DAILY,
      icon: '🌙',
      iconColor: '#6366F1',
      name: 'Evening Reflection',
      popularityScore: 88,
      scientificReference: 'Kolb (1984) - Experiential learning and reflection',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'One hour completely screen-free before bed. Improves sleep quality and mental restoration.',
      frequency: FREQUENCY_DAILY,
      icon: '📵',
      iconColor: '#10B981',
      name: 'Digital Detox Hour',
      popularityScore: 85,
      scientificReference:
        'Exelmans & Van den Bulck (2016) - Bedtime mobile phone use',
      youtubeLink: 'https://www.youtube.com/watch?v=MwXNOxhhYLg',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        '20-minute nature walk. Reduces cortisol, lowers blood pressure, and enhances mood significantly.',
      frequency: FREQUENCY_DAILY,
      icon: '🌲',
      iconColor: '#059669',
      name: 'Walking in Nature',
      popularityScore: 93,
      scientificReference:
        'Hansen et al. (2017) - Shinrin-yoku (forest bathing) benefits',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice progressive muscle relaxation for 10 minutes. Releases physical tension and reduces anxiety.',
      frequency: FREQUENCY_DAILY,
      icon: '💆',
      iconColor: '#EC4899',
      name: 'Progressive Muscle Relaxation',
      popularityScore: 82,
      scientificReference: 'Jacobson (1929) - Progressive relaxation technique',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice loving-kindness meditation. Cultivates compassion for yourself and others, improving relationships.',
      frequency: FREQUENCY_DAILY,
      icon: '❤️',
      iconColor: '#EF4444',
      name: 'Loving-Kindness Meditation',
      popularityScore: 81,
      scientificReference:
        'Fredrickson et al. (2008) - Open hearts build lives: positive emotions',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Keep a daily journal of positive experiences and accomplishments. Builds optimism and resilience.',
      frequency: FREQUENCY_DAILY,
      icon: '✨',
      iconColor: '#F59E0B',
      name: 'Positive Journaling',
      popularityScore: 86,
      scientificReference:
        'Lyubomirsky (2008) - The How of Happiness: A Scientific Approach',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice mindful eating - eat slowly and pay attention to flavors, textures, and satisfaction cues.',
      frequency: FREQUENCY_DAILY,
      icon: '🍽️',
      iconColor: '#059669',
      name: 'Mindful Eating',
      popularityScore: 79,
      scientificReference:
        'Kristeller & Wolever (2011) - Mindfulness-based eating awareness training',
    });

    // Andrew Huberman Protocol Templates
    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'View 2-10 minutes of morning sunlight within 30-60 minutes of waking. Critical for circadian rhythm regulation and dopamine production.',
      frequency: FREQUENCY_DAILY,
      icon: '☀️',
      iconColor: '#F59E0B',
      name: 'Morning Sunlight Viewing',
      popularityScore: 95,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Morning sunlight for optimal circadian biology',
      tips: [
        'No sunglasses - you need the light hitting your eyes',
        'Cloudy days still count, just double the time',
        'Face towards where the sun rises, not directly at it',
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=WDv4AWk0J3U',
    });

    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Delay caffeine intake by 90-120 minutes after waking. Allows natural adenosine clearance and prevents afternoon crash.',
      frequency: FREQUENCY_DAILY,
      icon: '⏰',
      iconColor: '#B45309',
      name: 'Delay Caffeine 90 Minutes',
      popularityScore: 92,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Optimal caffeine timing protocol',
      tips: [
        'Set a timer when you wake up',
        'Drink water first to help with morning grogginess',
        'Start with a 60-minute delay and work up to 90',
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=iw97uvIge7c',
    });

    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Perform 45 minutes of Zone 2 cardio 3x weekly. Builds mitochondrial health, fat oxidation, and cardiovascular fitness.',
      frequency: 'weekly',
      icon: '🚴',
      iconColor: '#2563EB',
      name: 'Zone 2 Cardio Training',
      popularityScore: 90,
      scientificLink:
        'https://hubermanlab.com/zone-2-training-for-endurance-and-longevity/',
      scientificReference:
        'Huberman Lab (2022) - Zone 2 training for longevity',
      youtubeLink: 'https://www.youtube.com/watch?v=jN0pRAqiUJU',
    });

    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        '11 minutes of deliberate cold exposure per week. Enhances dopamine, mood, metabolism, and stress resilience.',
      frequency: 'weekly',
      icon: '🧊',
      iconColor: '#38BDF8',
      name: 'Deliberate Cold Exposure',
      popularityScore: 88,
      scientificLink:
        'https://hubermanlab.com/optimal-deliberate-cold-exposure-protocols/',
      scientificReference:
        'Huberman Lab (2023) - Optimal deliberate cold exposure protocols',
      youtubeLink: 'https://www.youtube.com/watch?v=pq6WHJzOkno',
    });

    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Practice 10-20 minutes of Non-Sleep Deep Rest (NSDR) daily. Restores focus, accelerates learning, and improves sleep.',
      frequency: FREQUENCY_DAILY,
      icon: '🛌',
      iconColor: '#7DD3FC',
      name: 'NSDR Practice',
      popularityScore: 89,
      scientificLink:
        'https://hubermanlab.com/using-nsdr-to-improve-learning-skill-memory/',
      scientificReference:
        'Huberman Lab (2021) - Using NSDR to improve learning and sleep',
      youtubeLink: 'https://www.youtube.com/watch?v=AKGrmY8UFWU',
    });

    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Perform 1-3 physiological sighs when stressed. Rapidly lowers autonomic arousal and steadies mood.',
      frequency: FREQUENCY_DAILY,
      icon: '😮‍💨',
      iconColor: '#34D399',
      name: 'Physiological Sigh',
      popularityScore: 87,
      scientificLink:
        'https://hubermanlab.com/science-supported-tools-to-reduce-stress/',
      scientificReference:
        'Huberman Lab (2023) - Physiological sigh for stress regulation',
      youtubeLink: 'https://www.youtube.com/watch?v=rBdhqBGqiMc',
    });

    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Dim lights 2-3 hours before sleep. Avoid overhead lights and use low-angle lights. Supports melatonin production.',
      frequency: FREQUENCY_DAILY,
      icon: '💡',
      iconColor: '#FDE047',
      name: 'Evening Light Dimming',
      popularityScore: 86,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Evening light protocols for better sleep',
      youtubeLink: 'https://www.youtube.com/watch?v=WDv4AWk0J3U',
    });

    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Keep bedroom temperature 65-68°F (18-20°C) for optimal sleep. Cooler temperatures support deep sleep stages.',
      frequency: FREQUENCY_DAILY,
      icon: '🌡️',
      iconColor: '#0EA5E9',
      name: 'Cool Sleep Temperature',
      popularityScore: 85,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Temperature minimum protocol for sleep',
    });

    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Consume 30-60g of protein within 30 minutes of waking. Supports neurotransmitter production and muscle maintenance.',
      frequency: FREQUENCY_DAILY,
      icon: '🍳',
      iconColor: '#F97316',
      name: 'Morning Protein Protocol',
      popularityScore: 84,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Morning nutrition for optimal alertness',
    });

    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Follow consistent meal timing within a 10-12 hour eating window. Supports circadian alignment and metabolic health.',
      frequency: FREQUENCY_DAILY,
      icon: '🍽️',
      iconColor: '#10B981',
      name: 'Time-Restricted Eating',
      popularityScore: 88,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Meal timing and circadian biology',
      youtubeLink: 'https://www.youtube.com/watch?v=9tRohh0gErM',
    });

    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Practice intermittent fasting with 16:8 schedule (16 hours fasting, 8 hours eating). Enhances autophagy and metabolic flexibility.',
      frequency: FREQUENCY_DAILY,
      icon: '⏰',
      iconColor: '#7C3AED',
      name: '16:8 Intermittent Fasting',
      popularityScore: 89,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Intermittent fasting protocols',
      youtubeLink: 'https://www.youtube.com/watch?v=9tRohh0gErM',
    });

    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Use sauna for 20-30 minutes 2-3x weekly. Enhances cardiovascular health, reduces inflammation, and improves stress resilience.',
      frequency: 'weekly',
      icon: '🧖',
      iconColor: '#DC2626',
      name: 'Sauna Therapy',
      popularityScore: 83,
      scientificLink:
        'https://hubermanlab.com/using-sauna-for-health-optimization/',
      scientificReference:
        'Huberman Lab (2022) - Sauna use for health optimization',
      youtubeLink: 'https://www.youtube.com/watch?v=EQ3GjpGq5Y8',
    });

    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Track and optimize sleep quality. Maintain consistent sleep/wake times, keep bedroom cool, and avoid screens before bed.',
      frequency: FREQUENCY_DAILY,
      icon: '😴',
      iconColor: '#1E40AF',
      name: 'Sleep Optimization',
      popularityScore: 91,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference: 'Huberman Lab (2023) - Complete sleep toolkit',
      youtubeLink: 'https://www.youtube.com/watch?v=WDv4AWk0J3U',
    });

    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Spend 1-2 hours in complete darkness before sleep. Enhances melatonin production and sleep quality.',
      frequency: FREQUENCY_DAILY,
      icon: '🌙',
      iconColor: '#0F172A',
      name: 'Darkness Before Sleep',
      popularityScore: 87,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Darkness and sleep optimization',
    });

    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Maintain indoor temperature 65-68°F during sleep. Cooler temperatures promote deeper, more restorative sleep.',
      frequency: FREQUENCY_DAILY,
      icon: '🌡️',
      iconColor: '#06B6D4',
      name: 'Optimal Sleep Temperature',
      popularityScore: 85,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Temperature regulation for sleep',
    });

    // Social Habits Templates
    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Call a friend or family member daily. Strong social connections are crucial for mental health and longevity.',
      frequency: FREQUENCY_DAILY,
      icon: '📞',
      iconColor: '#8B5CF6',
      name: 'Daily Social Call',
      popularityScore: 87,
      scientificReference:
        'Holt-Lunstad et al. (2010) - Social relationships and mortality',
      tips: [
        'Keep a rotation list of people to call',
        'Schedule calls during your commute or walk',
        "A 5-minute call counts - it doesn't have to be long",
      ],
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Send a message to someone you care about. Small acts of connection strengthen relationships over time.',
      frequency: FREQUENCY_DAILY,
      icon: '💬',
      iconColor: '#06B6D4',
      name: 'Reach Out Daily',
      popularityScore: 84,
      scientificReference:
        'Gable et al. (2004) - The benefits of supportive relationships',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Spend quality time with your partner without distractions. Strengthens emotional bonds and intimacy.',
      frequency: FREQUENCY_DAILY,
      icon: '💑',
      iconColor: '#EC4899',
      name: 'Quality Partner Time',
      popularityScore: 86,
      scientificReference:
        'Gottman (1999) - The Seven Principles for Making Marriage Work',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Write a thank-you note or express gratitude to someone. Builds stronger relationships and increases happiness.',
      frequency: 'weekly',
      icon: '🙏',
      iconColor: '#F59E0B',
      name: 'Express Gratitude',
      popularityScore: 83,
      scientificReference:
        'Algoe et al. (2010) - Gratitude and relationship satisfaction',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Volunteer or help someone in need. Acts of service improve well-being and create social connections.',
      frequency: 'weekly',
      icon: '🤝',
      iconColor: '#10B981',
      name: 'Acts of Service',
      popularityScore: 81,
      scientificReference: 'Post (2005) - Altruism, happiness, and health',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Join a club or group activity. Regular social interaction prevents loneliness and supports mental health.',
      frequency: 'weekly',
      icon: '👥',
      iconColor: '#6366F1',
      name: 'Group Activities',
      popularityScore: 79,
      scientificReference: 'Hawkley & Cacioppo (2010) - Loneliness and health',
    });

    // Sleep Templates
    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Go to bed at the same time every night. Consistent sleep schedule improves sleep quality and circadian rhythm.',
      frequency: FREQUENCY_DAILY,
      icon: '🛏️',
      iconColor: '#1E3A8A',
      name: 'Consistent Bedtime',
      popularityScore: 92,
      scientificReference:
        'Walker (2017) - Why We Sleep: Unlocking the Power of Sleep',
      tips: [
        'Set an alarm 30 minutes before your target bedtime',
        'Keep weekends within 1 hour of your weekday schedule',
        'Start your wind-down routine at the same time each night',
      ],
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Stop screen use 60 minutes before bed. Blue light disrupts melatonin production and delays sleep onset.',
      frequency: FREQUENCY_DAILY,
      icon: '📱',
      iconColor: '#DC2626',
      name: 'No Screens Before Bed',
      popularityScore: 89,
      scientificLink: 'https://www.sleep.org/blue-light-and-sleep/',
      scientificReference:
        'Chang et al. (2015) - Evening use of light-emitting eReaders',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Practice 4-7-8 breathing before sleep. Activates relaxation response and promotes faster sleep onset.',
      frequency: FREQUENCY_DAILY,
      icon: '😴',
      iconColor: '#6366F1',
      name: '4-7-8 Breathing',
      popularityScore: 86,
      scientificReference:
        'Weil (2015) - Breathing: The Master Key to Self-Healing',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Limit caffeine after 2 PM. Caffeine has a 5-6 hour half-life that can disrupt sleep architecture.',
      frequency: FREQUENCY_DAILY,
      icon: '☕',
      iconColor: '#92400E',
      name: 'No Afternoon Caffeine',
      popularityScore: 88,
      scientificReference:
        'Drake et al. (2013) - Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Use blackout curtains for complete darkness. Light exposure during sleep reduces sleep quality and REM.',
      frequency: FREQUENCY_DAILY,
      icon: '🌑',
      iconColor: '#0F172A',
      name: 'Sleep in Complete Darkness',
      popularityScore: 84,
      scientificReference:
        'Gooley et al. (2011) - Exposure to room light before bedtime',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Take a warm bath 90 minutes before bed. Increases core body temperature drop that signals sleep time.',
      frequency: FREQUENCY_DAILY,
      icon: '🛁',
      iconColor: '#3B82F6',
      name: 'Pre-Sleep Warm Bath',
      popularityScore: 81,
      scientificReference:
        'Harding et al. (2019) - Systematic review of warm baths and sleep quality',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Sleep 7-9 hours per night. Adequate sleep is essential for cognitive function, health, and longevity.',
      frequency: FREQUENCY_DAILY,
      icon: '💤',
      iconColor: '#4338CA',
      name: '7-9 Hours Sleep',
      popularityScore: 95,
      scientificLink:
        'https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need',
      scientificReference:
        'Hirshkowitz et al. (2015) - National Sleep Foundation sleep duration recommendations',
      tips: [
        'Calculate your ideal wake time and count back 8 hours',
        'Track your sleep to find your personal sweet spot',
        'Prioritize sleep like you would an important meeting',
      ],
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Avoid alcohol 3-4 hours before bed. Alcohol disrupts REM sleep and causes sleep fragmentation.',
      frequency: FREQUENCY_DAILY,
      icon: '🚫',
      iconColor: '#991B1B',
      name: 'No Evening Alcohol',
      popularityScore: 78,
      scientificReference: 'Ebrahim et al. (2013) - Alcohol and sleep review',
    });

    // Learning Templates
    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Practice spaced repetition for 20 minutes. Review material at increasing intervals for long-term retention.',
      frequency: FREQUENCY_DAILY,
      icon: '🔄',
      iconColor: '#7C3AED',
      name: 'Spaced Repetition',
      popularityScore: 91,
      scientificLink: 'https://www.gwern.net/Spaced-repetition',
      scientificReference:
        'Cepeda et al. (2006) - Distributed practice in verbal recall tasks',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Learn one new word daily in a foreign language. Consistent vocabulary building accelerates language acquisition.',
      frequency: FREQUENCY_DAILY,
      icon: '🌍',
      iconColor: '#059669',
      name: 'Daily Language Practice',
      popularityScore: 87,
      scientificReference:
        'Nation (2001) - Learning Vocabulary in Another Language',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Teach someone what you learned today. Teaching reinforces understanding and reveals knowledge gaps.',
      frequency: FREQUENCY_DAILY,
      icon: '👨‍🏫',
      iconColor: '#DC2626',
      name: 'Feynman Technique',
      popularityScore: 89,
      scientificReference: 'Chi et al. (1989) - Self-explanations and learning',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Practice active recall for 15 minutes. Test yourself without looking at notes to strengthen memory.',
      frequency: FREQUENCY_DAILY,
      icon: '🧩',
      iconColor: '#2563EB',
      name: 'Active Recall',
      popularityScore: 93,
      scientificReference:
        'Roediger & Karpicke (2006) - Test-enhanced learning',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Read for 30 minutes daily. Regular reading improves vocabulary, comprehension, and cognitive function.',
      frequency: FREQUENCY_DAILY,
      icon: '📖',
      iconColor: '#B45309',
      name: 'Daily Reading',
      popularityScore: 94,
      scientificReference: 'Krashen (2004) - The Power of Reading',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Listen to educational podcasts or audiobooks during commute. Transforms dead time into learning opportunities.',
      frequency: FREQUENCY_DAILY,
      icon: '🎧',
      iconColor: '#DC2626',
      name: 'Audio Learning',
      popularityScore: 85,
      scientificReference:
        'Rogowsky et al. (2016) - Matching learning style to instructional method',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Practice a musical instrument for 20 minutes. Music training enhances cognitive abilities and neuroplasticity.',
      frequency: FREQUENCY_DAILY,
      icon: '🎵',
      iconColor: '#EC4899',
      name: 'Music Practice',
      popularityScore: 82,
      scientificReference:
        'Herholz & Zatorre (2012) - Musical training as framework for brain plasticity',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Take handwritten notes while learning. Writing by hand improves retention and comprehension.',
      frequency: FREQUENCY_DAILY,
      icon: '✍️',
      iconColor: '#0EA5E9',
      name: 'Handwritten Notes',
      popularityScore: 88,
      scientificReference:
        'Mueller & Oppenheimer (2014) - The Pen Is Mightier Than the Keyboard',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Watch one educational video daily. Visual learning enhances understanding of complex concepts.',
      frequency: FREQUENCY_DAILY,
      icon: '📺',
      iconColor: '#F59E0B',
      name: 'Educational Videos',
      popularityScore: 84,
      scientificReference: 'Mayer (2009) - Multimedia Learning principles',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Join a study group or accountability circle. Social learning enhances motivation and understanding.',
      frequency: 'weekly',
      icon: '👥',
      iconColor: '#8B5CF6',
      name: 'Study Groups',
      popularityScore: 80,
      scientificReference: 'Slavin (1996) - Research on cooperative learning',
    });

    // Financial Templates
    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Track every expense daily. Awareness of spending patterns is the first step to financial control.',
      frequency: FREQUENCY_DAILY,
      icon: '💰',
      iconColor: '#059669',
      name: 'Expense Tracking',
      popularityScore: 90,
      scientificReference:
        'Thaler & Sunstein (2008) - Nudge: Improving Decisions About Health, Wealth, and Happiness',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Save 10% of income automatically. Pay yourself first before spending on anything else.',
      frequency: FREQUENCY_DAILY,
      icon: '🏦',
      iconColor: '#2563EB',
      name: 'Automatic Savings',
      popularityScore: 93,
      scientificReference: 'Bach (2004) - The Automatic Millionaire',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Review budget weekly. Regular financial check-ins prevent overspending and build awareness.',
      frequency: 'weekly',
      icon: '📊',
      iconColor: '#DC2626',
      name: 'Weekly Budget Review',
      popularityScore: 86,
      scientificReference: 'Ramsey (2013) - The Total Money Makeover',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Invest in index funds regularly. Dollar-cost averaging builds wealth over time through compound growth.',
      frequency: 'weekly',
      icon: '📈',
      iconColor: '#059669',
      name: 'Regular Investing',
      popularityScore: 88,
      scientificReference:
        'Bogle (2007) - The Little Book of Common Sense Investing',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Use the 24-hour rule for purchases over $50. Delayed gratification reduces impulse buying.',
      frequency: FREQUENCY_DAILY,
      icon: '⏰',
      iconColor: '#F59E0B',
      name: '24-Hour Purchase Rule',
      popularityScore: 84,
      scientificReference:
        'Mischel (2014) - The Marshmallow Test: Mastering Self-Control',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Pack lunch instead of eating out. Home-prepared meals save thousands annually and improve health.',
      frequency: FREQUENCY_DAILY,
      icon: '🍱',
      iconColor: '#16A34A',
      name: 'Bring Lunch',
      popularityScore: 82,
      scientificReference: 'Ramsey (2013) - Small expenses compound over time',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Cancel one unused subscription monthly. Eliminate recurring charges that provide no value.',
      frequency: 'weekly',
      icon: '✂️',
      iconColor: '#DC2626',
      name: 'Subscription Audit',
      popularityScore: 80,
      scientificReference:
        'Ariely (2008) - Predictably Irrational subscription traps',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Read financial news or books for 15 minutes. Financial literacy is key to building and protecting wealth.',
      frequency: FREQUENCY_DAILY,
      icon: '📰',
      iconColor: '#0EA5E9',
      name: 'Financial Education',
      popularityScore: 85,
      scientificReference:
        'Lusardi & Mitchell (2014) - The Economic Importance of Financial Literacy',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Negotiate one bill or expense. Small negotiations compound into significant annual savings.',
      frequency: 'weekly',
      icon: '💬',
      iconColor: '#7C3AED',
      name: 'Negotiate Bills',
      popularityScore: 78,
      scientificReference: 'Ramsey (2013) - The power of negotiation',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Contribute to retirement account. Maximize employer match and tax-advantaged growth.',
      frequency: 'weekly',
      icon: '🎯',
      iconColor: '#059669',
      name: 'Retirement Contributions',
      popularityScore: 91,
      scientificReference:
        'Benartzi & Thaler (2007) - Save More Tomorrow program',
    });

    // Creativity Templates
    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Engage in freewriting for 10 minutes. Stream-of-consciousness writing unlocks creative thinking.',
      frequency: FREQUENCY_DAILY,
      icon: '✍️',
      iconColor: '#8B5CF6',
      name: 'Morning Freewriting',
      popularityScore: 87,
      scientificReference: 'Elbow (1998) - Writing Without Teachers',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Sketch or doodle for 15 minutes. Visual expression enhances creative problem-solving.',
      frequency: FREQUENCY_DAILY,
      icon: '🎨',
      iconColor: '#EC4899',
      name: 'Daily Sketching',
      popularityScore: 83,
      scientificReference: 'Brown (2014) - The Doodle Revolution',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Brainstorm 10 ideas on any topic. Idea generation is a muscle that strengthens with practice.',
      frequency: FREQUENCY_DAILY,
      icon: '💡',
      iconColor: '#F59E0B',
      name: 'Idea Generation',
      popularityScore: 89,
      scientificReference: 'Altucher (2014) - Becoming an Idea Machine',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Take photos during daily walk. Photography trains observation and perspective-taking.',
      frequency: FREQUENCY_DAILY,
      icon: '📸',
      iconColor: '#0EA5E9',
      name: 'Daily Photography',
      popularityScore: 81,
      scientificReference:
        'Csikszentmihalyi (1996) - Creativity: Flow and the Psychology of Discovery',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Write one poem or short story. Creative writing develops imagination and emotional intelligence.',
      frequency: 'weekly',
      icon: '📝',
      iconColor: '#7C3AED',
      name: 'Creative Writing',
      popularityScore: 80,
      scientificReference: 'Kaufman & Gregoire (2015) - Wired to Create',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Practice divergent thinking exercises. Generate multiple solutions to problems to enhance creativity.',
      frequency: FREQUENCY_DAILY,
      icon: '🧠',
      iconColor: '#06B6D4',
      name: 'Divergent Thinking',
      popularityScore: 84,
      scientificReference: 'Guilford (1967) - The Nature of Human Intelligence',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Combine two unrelated ideas daily. Cross-pollination of concepts sparks innovation.',
      frequency: FREQUENCY_DAILY,
      icon: '🔀',
      iconColor: '#10B981',
      name: 'Idea Mashup',
      popularityScore: 82,
      scientificReference: 'Johansson (2004) - The Medici Effect',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Visit a museum or art gallery. Exposure to art stimulates creative thinking and inspiration.',
      frequency: 'weekly',
      icon: '🖼️',
      iconColor: '#DC2626',
      name: 'Art Appreciation',
      popularityScore: 77,
      scientificReference:
        'Leder et al. (2004) - A model of aesthetic appreciation',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Learn a new creative skill monthly. Novel experiences build cognitive flexibility.',
      frequency: 'weekly',
      icon: '🎭',
      iconColor: '#F97316',
      name: 'Skill Exploration',
      popularityScore: 85,
      scientificReference: 'Carson (2010) - Your Creative Brain',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Take a different route home. Changing routines disrupts autopilot and enhances awareness.',
      frequency: 'weekly',
      icon: '🚶‍♀️',
      iconColor: '#6366F1',
      name: 'Break Routines',
      popularityScore: 79,
      scientificReference:
        'Rock (2009) - Your Brain at Work: breaking patterns',
    });

    const templates = await ctx.db.query('templates').collect();
    return {
      message: `${templates.length} templates available`,
      success: true,
    };
  },
});

/**
 * Mutation: Import a template to create a new habit
 */
export const importTemplate = internalMutation({
  args: {
    customizations: v.optional(
      v.object({
        iconColor: v.optional(v.string()),
        name: v.optional(v.string()),
        reminderTime: v.optional(v.string()),
      })
    ),
    templateId: v.id('templates'),
  },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Create habit from template
    const habitId = await ctx.db.insert('habits', {
      accessibility: 1,
      accessibilityUpdatedAt: Date.now(),
      consecutiveDays: 0,
      createdAt: Date.now(),
      frequency: template.frequency,
      icon: template.icon,
      iconColor: args.customizations?.iconColor || template.iconColor,

      name: args.customizations?.name || template.name,

      notes:
        template.description + '\n\nSource: ' + template.scientificReference,

      order: 0,

      remindersEnabled: !!args.customizations?.reminderTime,

      // Optional customizations
      reminderTime: args.customizations?.reminderTime,

      // Will be adjusted by reorder logic
      // Initialize habit strength values
      strength: 0,

      strengthLevel: 'starting',

      strengthUpdatedAt: Date.now(),

      totalCompletions: 0,

      totalMisses: 0,
    });

    // Track template usage analytics
    await ctx.db.insert('templateUsage', {
      habitId,
      importedAt: Date.now(),
      templateId: args.templateId,
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
      recentImports: usage.filter(
        (u) => u.importedAt > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length,
      totalImports: usage.length,
    };
  },
});

/**
 * Mutation: Clear all templates (for cleanup/reset)
 */
export const clearTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query('templates').collect();
    for (const template of templates) {
      await ctx.db.delete(template._id);
    }
    return { message: `Deleted ${templates.length} templates`, success: true };
  },
});

/**
 * Mutation: Dedupe templates by name (one-time cleanup)
 * - Keeps the "best" template per name (based on link/popularity/completeness)
 * - Re-points templateUsage.templateId to the kept template
 * - Deletes extra templates
 */
export const dedupeTemplates = internalMutation({
  args: { dryRun: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? false;

    const allTemplates = await ctx.db.query('templates').collect();
    type TemplateDoc = (typeof allTemplates)[number];
    const templatesByName = new Map<string, TemplateDoc[]>();

    for (const template of allTemplates) {
      const key = normalizeTemplateName(template.name);
      const existing = templatesByName.get(key);
      if (!existing) {
        templatesByName.set(key, [template]);
        continue;
      }
      existing.push(template);
    }

    const idRemap = new Map<Id<'templates'>, Id<'templates'>>();
    let duplicateGroups = 0;
    let duplicateTemplates = 0;

    for (const [, templates] of templatesByName) {
      if (templates.length <= 1) continue;

      duplicateGroups += 1;
      duplicateTemplates += templates.length - 1;

      const best = pickBestTemplate<TemplateDoc>(templates);
      for (const template of templates) {
        if (template._id === best._id) continue;
        idRemap.set(template._id, best._id);
      }
    }

    const templateUsage = await ctx.db.query('templateUsage').collect();
    let patchedTemplateUsage = 0;

    if (!dryRun) {
      for (const usage of templateUsage) {
        const remapped = idRemap.get(usage.templateId);
        if (!remapped) continue;
        await ctx.db.patch(usage._id, { templateId: remapped });
        patchedTemplateUsage += 1;
      }

      for (const [oldId] of idRemap) {
        await ctx.db.delete(oldId);
      }
    }

    let templatesAfter = allTemplates.length;
    if (!dryRun) {
      const remaining = await ctx.db.query('templates').collect();
      templatesAfter = remaining.length;
    }

    return {
      dryRun,
      duplicateGroups,
      duplicateTemplates,
      patchedTemplateUsage: dryRun ? 0 : patchedTemplateUsage,
      templatesAfter,
      templatesBefore: allTemplates.length,
    };
  },
});

/**
 * Mutation: Seed additional science-backed templates (Phase 3.1)
 * 45 new habits covering: Physical Resilience, Cognitive, Nutrition, Digital Wellness, Social
 */
/**
 * Internal Mutation: Seed additional templates
 * SEC: Internal only - run via Convex dashboard, not accessible to users
 */
export const seedAdditionalTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let _insertedCount = 0;
    let _skippedCount = 0;

    const insertWithTracking = async (template: TemplateInsert) => {
      const existing = await ctx.db
        .query('templates')
        .filter((q) => q.eq(q.field('name'), template.name))
        .first();

      if (existing) {
        _skippedCount++;
        return false;
      }

      await ctx.db.insert('templates', template);
      _insertedCount++;
      return true;
    };

    // ═══════════════════════════════════════════════════════════════
    // HEALTH & FITNESS - Physical Resilience & Movement
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Stand up and move for 2-3 minutes every hour. Prolonged sitting increases cardiovascular disease risk even with regular exercise.',
      frequency: FREQUENCY_DAILY,
      icon: '🧍',
      iconColor: '#10B981',
      name: 'Standing Every Hour',
      popularityScore: 91,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/22890825/',
      scientificReference:
        'Dunstan et al. (2012) - Too much sitting: The population health science of sedentary behavior',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Check and correct your posture 3x daily. Good posture reduces back pain, improves breathing, and boosts confidence.',
      frequency: FREQUENCY_DAILY,
      icon: '🪑',
      iconColor: '#6366F1',
      name: 'Posture Check',
      popularityScore: 84,
      scientificReference:
        'Carney et al. (2010) - Power posing: Brief nonverbal displays affect neuroendocrine levels',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Walk barefoot on grass, sand, or earth for 10-20 minutes. Grounding reduces inflammation and improves sleep quality.',
      frequency: FREQUENCY_DAILY,
      icon: '🦶',
      iconColor: '#84CC16',
      name: 'Barefoot Grounding',
      popularityScore: 79,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/22291721/',
      scientificReference:
        'Chevalier et al. (2012) - Earthing: Health implications of reconnecting the human body to the Earth',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Every 20 minutes, look at something 20 feet away for 20 seconds. Reduces digital eye strain and prevents myopia progression.',
      frequency: FREQUENCY_DAILY,
      icon: '👁️',
      iconColor: '#0EA5E9',
      name: '20-20-20 Eye Rule',
      popularityScore: 93,
      scientificReference:
        'American Optometric Association - Digital eye strain prevention guidelines',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Practice breathing through your nose throughout the day. Nasal breathing filters air, produces nitric oxide, and activates the parasympathetic nervous system.',
      frequency: FREQUENCY_DAILY,
      icon: '👃',
      iconColor: '#14B8A6',
      name: 'Nasal Breathing',
      popularityScore: 88,
      scientificReference:
        'Nestor (2020) - Breath: The New Science of a Lost Art',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Train at high intensity 1-2x weekly to improve VO2 max. VO2 max is the single strongest predictor of longevity.',
      frequency: 'weekly',
      icon: '🫀',
      iconColor: '#EF4444',
      name: 'VO2 Max Training',
      popularityScore: 89,
      scientificLink: 'https://peterattiamd.com/outlive/',
      scientificReference:
        'Attia (2023) - Outlive: The Science and Art of Longevity',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Practice single-leg stands, heel-to-toe walking, or balance board exercises. Balance training reduces fall risk and improves coordination at any age.',
      frequency: FREQUENCY_DAILY,
      icon: '⚖️',
      iconColor: '#8B5CF6',
      name: 'Balance Training',
      popularityScore: 85,
      scientificReference:
        'Sherrington et al. (2019) - Exercise for preventing falls in older people living in the community',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Train grip strength with dead hangs, farmer carries, or grip exercises. Grip strength is a powerful predictor of all-cause mortality.',
      frequency: FREQUENCY_DAILY,
      icon: '✊',
      iconColor: '#F97316',
      name: 'Grip Strength Training',
      popularityScore: 87,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/25953784/',
      scientificReference:
        'Leong et al. (2015) - Prognostic value of grip strength: findings from the PURE study',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Take a hot bath (104°F/40°C) for 15-20 minutes. Passive heat therapy provides cardiovascular benefits similar to moderate exercise.',
      frequency: FREQUENCY_DAILY,
      icon: '🛀',
      iconColor: '#F43F5E',
      name: 'Heat Therapy Bath',
      popularityScore: 82,
      scientificReference:
        'Laukkanen et al. (2018) - Cardiovascular and other health benefits of passive heat therapy',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Hang from a bar for 30-60 seconds daily. Decompresses spine, improves shoulder mobility, and builds grip strength.',
      frequency: FREQUENCY_DAILY,
      icon: '🙆',
      iconColor: '#0891B2',
      name: 'Daily Hanging',
      popularityScore: 81,
      scientificReference:
        'McGill (2016) - Back Mechanic: spinal decompression techniques',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Walk for 10 minutes after a meal. Post-meal walking reduces blood sugar spikes and supports metabolic health.',
      frequency: FREQUENCY_DAILY,
      icon: '🚶',
      iconColor: '#22C55E',
      name: 'Post-Meal Walk (10 Minutes)',
      popularityScore: 88,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/27747394/',
      scientificReference:
        'DiPietro et al. (2016) - A simple postmeal walk reduces postprandial glucose excursions in type 2 diabetes',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Do 3 short vigorous stair-climb “exercise snacks” during the day. Time-efficient bursts improve cardiorespiratory fitness (VO₂peak).',
      frequency: 'weekly',
      icon: '🪜',
      iconColor: '#EF4444',
      name: 'Exercise Snacks (Stair Climbs)',
      popularityScore: 84,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/30649897/',
      scientificReference:
        'Jenkins et al. (2019) - Stair climbing “exercise snacks” improve cardiorespiratory fitness in sedentary adults',
    });

    // ═══════════════════════════════════════════════════════════════
    // MINDFULNESS - Cognitive & Mental Health
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Spend 15 minutes on puzzles, crosswords, or brain training games. Novel cognitive challenges build neuroplasticity and cognitive reserve.',
      frequency: FREQUENCY_DAILY,
      icon: '🧩',
      iconColor: '#A855F7',
      name: 'Brain Games',
      popularityScore: 83,
      scientificReference:
        'Park et al. (2014) - The impact of sustained engagement on cognitive function in older adults',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Schedule 15-30 minutes to write down worries, then close the notebook. Containing worry to a specific time reduces generalized anxiety.',
      frequency: FREQUENCY_DAILY,
      icon: '📓',
      iconColor: '#64748B',
      name: 'Scheduled Worry Time',
      popularityScore: 86,
      scientificReference:
        'Borkovec et al. (1990) - Stimulus control treatment for worry and insomnia',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Systematically scan your body from head to toe, noticing sensations. Reduces chronic pain, increases body awareness, and calms the nervous system.',
      frequency: FREQUENCY_DAILY,
      icon: '🫥',
      iconColor: '#06B6D4',
      name: 'Body Scan Meditation',
      popularityScore: 88,
      scientificReference:
        'Kabat-Zinn (1990) - Full Catastrophe Living: Using the Wisdom of Your Body and Mind',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Take periodic breaks from high-dopamine activities (social media, games, junk food). Resets reward circuitry and increases motivation.',
      frequency: 'weekly',
      icon: '🧘‍♂️',
      iconColor: '#475569',
      name: 'Dopamine Reset',
      popularityScore: 84,
      scientificReference:
        'Sepah (2019) - The Definitive Guide to Dopamine Fasting 2.0',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Practice Dual N-Back training for 20 minutes. One of the few brain training methods shown to improve fluid intelligence and working memory.',
      frequency: FREQUENCY_DAILY,
      icon: '🔢',
      iconColor: '#7C3AED',
      name: 'Dual N-Back Training',
      popularityScore: 80,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/18425231/',
      scientificReference:
        'Jaeggi et al. (2008) - Improving fluid intelligence with training on working memory',
    });

    // ═══════════════════════════════════════════════════════════════
    // SLEEP - Recovery & Rest
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Sleep under a weighted blanket (10% of body weight). Deep pressure stimulation reduces anxiety and improves sleep quality.',
      frequency: FREQUENCY_DAILY,
      icon: '🛋️',
      iconColor: '#4338CA',
      name: 'Weighted Blanket Sleep',
      popularityScore: 82,
      scientificReference:
        'Ackerley et al. (2015) - Positive effects of a weighted blanket on insomnia',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Use white or pink noise while sleeping. Background noise masks disruptions and improves sleep onset and quality.',
      frequency: FREQUENCY_DAILY,
      icon: '🔊',
      iconColor: '#94A3B8',
      name: 'Sleep Sound Machine',
      popularityScore: 79,
      scientificReference:
        'Messineo et al. (2017) - Broadband sound administration improves sleep onset latency',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Take 200-400mg magnesium glycinate or threonate 30-60 minutes before bed. Magnesium supports GABA activity and improves sleep quality.',
      frequency: FREQUENCY_DAILY,
      icon: '💊',
      iconColor: '#10B981',
      name: 'Evening Magnesium',
      popularityScore: 85,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/23853635/',
      scientificReference:
        'Abbasi et al. (2012) - The effect of magnesium supplementation on sleep quality',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Use your bed only for sleep (and intimacy). If you can’t sleep, get up and return only when sleepy. This re-trains your brain to associate bed with sleep.',
      frequency: FREQUENCY_DAILY,
      icon: '🛌',
      iconColor: '#1E40AF',
      name: 'Stimulus Control (CBT-I)',
      popularityScore: 86,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/37496454/',
      scientificReference:
        'Bootzin (1972) - Stimulus control treatment for insomnia (core CBT-I component)',
    });

    // ═══════════════════════════════════════════════════════════════
    // HEALTH & FITNESS - Nutrition
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Eat 30+ different plant foods per week (fruits, vegetables, nuts, seeds, legumes, grains). Diversity is the key to a healthy gut microbiome.',
      frequency: 'weekly',
      icon: '🌈',
      iconColor: '#F59E0B',
      name: '30 Plants Per Week',
      popularityScore: 92,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/29795809/',
      scientificReference:
        'McDonald et al. (2018) - American Gut: an open platform for citizen science microbiome research',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Consume fermented foods daily (yogurt, kefir, kimchi, sauerkraut, kombucha). Increases gut microbiome diversity and reduces inflammation.',
      frequency: FREQUENCY_DAILY,
      icon: '🥬',
      iconColor: '#84CC16',
      name: 'Daily Fermented Foods',
      popularityScore: 90,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/34256014/',
      scientificReference:
        'Wastyk et al. (2021) - Gut-microbiota-targeted diets modulate human immune status (Stanford study)',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Eat fatty fish 2-3x weekly or supplement with omega-3s. DHA supports brain health, reduces inflammation, and protects against neurodegeneration.',
      frequency: 'weekly',
      icon: '🐟',
      iconColor: '#0284C7',
      name: 'Omega-3 Rich Foods',
      popularityScore: 88,
      scientificReference:
        'Dyall (2015) - Long-chain omega-3 fatty acids and the brain: A review of evidence',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Eat vegetables or salad before carbohydrates at meals. Eating greens first blunts blood sugar spikes by up to 73%.',
      frequency: FREQUENCY_DAILY,
      icon: '🥗',
      iconColor: '#22C55E',
      name: 'Eat Greens First',
      popularityScore: 86,
      scientificReference:
        'Imai et al. (2014) - Eating vegetables before carbohydrates improves postprandial glucose',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Stop eating at least 3 hours before bedtime. Late eating disrupts sleep architecture and increases acid reflux risk.',
      frequency: FREQUENCY_DAILY,
      icon: '🍽️',
      iconColor: '#EF4444',
      name: 'No Late Night Eating',
      popularityScore: 84,
      scientificReference:
        'Fujiwara et al. (2005) - Association between dinner-to-bed time and gastro-esophageal reflux disease',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Chew each bite 20-30 times before swallowing. Thorough chewing improves digestion, nutrient absorption, and naturally reduces calorie intake.',
      frequency: FREQUENCY_DAILY,
      icon: '😋',
      iconColor: '#F97316',
      name: 'Mindful Chewing',
      popularityScore: 78,
      scientificReference:
        'Zhu & Hollis (2014) - Increasing the number of chews before swallowing reduces meal size',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Aim for ~25–30g of high-quality protein per meal. This supports muscle protein synthesis and long-term metabolic health.',
      frequency: FREQUENCY_DAILY,
      icon: '🍗',
      iconColor: '#F97316',
      name: 'Protein Per Meal (25–30g)',
      popularityScore: 85,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/19057193/',
      scientificReference:
        'Moore et al. (2009) - Ingested protein dose response of muscle protein synthesis; balanced distribution evidence: Mamerow et al. (2014)',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Floss or use an interdental brush once daily after brushing. Helps reduce gingivitis when added to toothbrushing.',
      frequency: FREQUENCY_DAILY,
      icon: '🦷',
      iconColor: '#0EA5E9',
      name: 'Interdental Cleaning',
      popularityScore: 82,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/22161438/',
      scientificReference:
        'Cochrane Review (2011) - Flossing plus toothbrushing reduces gingivitis (DOI: 10.1002/14651858.CD008829.pub2)',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Wash hands with soap at key times (before eating, after bathroom, after transit). Hand hygiene reduces respiratory illness transmission.',
      frequency: FREQUENCY_DAILY,
      icon: '🧼',
      iconColor: '#10B981',
      name: 'Hand Hygiene (Key Times)',
      popularityScore: 83,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/18556606/',
      scientificReference:
        'Aiello et al. (2008) - Effect of hand hygiene on infectious disease risk: meta-analysis',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Apply sunscreen to exposed skin (especially face/neck) as part of your morning routine. Daily use lowers skin cancer risk over time.',
      frequency: FREQUENCY_DAILY,
      icon: '🧴',
      iconColor: '#FBBF24',
      name: 'Daily Sunscreen',
      popularityScore: 84,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/21135266/',
      scientificReference:
        'Green et al. (2011) - Reduced melanoma incidence with regular sunscreen use: Nambour trial follow-up',
    });

    // ═══════════════════════════════════════════════════════════════
    // PRODUCTIVITY - Environment & Lifestyle
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Care for indoor plants daily. Tending plants reduces stress, improves air quality, and provides a sense of accomplishment.',
      frequency: FREQUENCY_DAILY,
      icon: '🪴',
      iconColor: '#22C55E',
      name: 'House Plant Care',
      popularityScore: 80,
      scientificReference:
        'Lohr et al. (2010) - Interior plants may improve worker productivity',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Remove, donate, or discard one item from your space daily. Physical clutter increases cortisol and reduces focus.',
      frequency: FREQUENCY_DAILY,
      icon: '🗑️',
      iconColor: '#64748B',
      name: 'Daily Declutter',
      popularityScore: 83,
      scientificReference:
        'Saxbe & Repetti (2010) - No place like home: Home tours correlate with cortisol levels',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Open windows for 10-15 minutes to ventilate your space. Fresh air reduces indoor CO2 levels, improving cognitive function by up to 50%.',
      frequency: FREQUENCY_DAILY,
      icon: '🪟',
      iconColor: '#38BDF8',
      name: 'Fresh Air Break',
      popularityScore: 81,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/26502459/',
      scientificReference:
        'Allen et al. (2016) - Associations of cognitive function scores with CO2 and ventilation',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Watch comedy, read jokes, or spend time with funny friends. Laughter reduces cortisol, boosts immunity, and improves cardiovascular health.',
      frequency: FREQUENCY_DAILY,
      icon: '😂',
      iconColor: '#FBBF24',
      name: 'Daily Laughter',
      popularityScore: 85,
      scientificReference:
        'Bennett & Lengacher (2009) - Humor and laughter may influence health: Complementary therapies review',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Spend quality time with a pet—petting, playing, or walking. Human-animal interaction increases oxytocin and reduces stress hormones.',
      frequency: FREQUENCY_DAILY,
      icon: '🐕',
      iconColor: '#F97316',
      name: 'Pet Time',
      popularityScore: 89,
      scientificReference:
        'Beetz et al. (2012) - Psychosocial and psychophysiological effects of human-animal interactions',
    });

    // ═══════════════════════════════════════════════════════════════
    // SOCIAL - Connection & Emotional Intelligence
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Practice listening without interrupting or planning your response. Deep listening improves relationships and builds empathy.',
      frequency: FREQUENCY_DAILY,
      icon: '👂',
      iconColor: '#8B5CF6',
      name: 'Deep Listening',
      popularityScore: 84,
      scientificReference:
        'Rogers (1951) - Client-centered therapy: Its current practice, implications, and theory',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Perform one random act of kindness daily. Helping others increases your own happiness and reduces depression symptoms.',
      frequency: FREQUENCY_DAILY,
      icon: '💝',
      iconColor: '#EC4899',
      name: 'Random Act of Kindness',
      popularityScore: 91,
      scientificReference:
        'Lyubomirsky et al. (2005) - Pursuing happiness: The architecture of sustainable change',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Have at least one face-to-face conversation daily. In-person interaction provides stronger wellbeing benefits than digital communication.',
      frequency: FREQUENCY_DAILY,
      icon: '👥',
      iconColor: '#3B82F6',
      name: 'Face-to-Face Time',
      popularityScore: 87,
      scientificReference:
        'Helliwell & Huang (2013) - Comparing the happiness effects of real and online friends',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        "Practice saying no to requests that don't align with your priorities. Healthy boundaries reduce stress and prevent burnout.",
      frequency: FREQUENCY_DAILY,
      icon: '🚫',
      iconColor: '#DC2626',
      name: 'Boundary Practice',
      popularityScore: 82,
      scientificReference:
        'Cloud & Townsend (1992) - Boundaries: When to Say Yes, How to Say No',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Give at least one sincere compliment daily. Giving compliments activates reward centers in your own brain and strengthens relationships.',
      frequency: FREQUENCY_DAILY,
      icon: '⭐',
      iconColor: '#FBBF24',
      name: 'Daily Compliment',
      popularityScore: 83,
      scientificReference:
        'Izuma et al. (2008) - Processing of social and monetary rewards in the human striatum',
    });

    // ═══════════════════════════════════════════════════════════════
    // PRODUCTIVITY - Digital Wellness
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Keep phones away from the table during meals. Phone-free meals improve digestion, strengthen relationships, and increase enjoyment.',
      frequency: FREQUENCY_DAILY,
      icon: '📵',
      iconColor: '#EF4444',
      name: 'Phone-Free Meals',
      popularityScore: 90,
      scientificReference:
        'Dwyer et al. (2018) - Smartphone use undermines enjoyment of face-to-face social interactions',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Limit social media to 30 minutes daily. Reducing social media use decreases anxiety and depression while improving life satisfaction.',
      frequency: FREQUENCY_DAILY,
      icon: '📱',
      iconColor: '#6366F1',
      name: 'Social Media Limit',
      popularityScore: 88,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/30570350/',
      scientificReference:
        'Hunt et al. (2018) - No more FOMO: Limiting social media decreases loneliness and depression',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Focus on one task at a time without switching. Multitasking reduces productivity by up to 40% and impairs attention.',
      frequency: FREQUENCY_DAILY,
      icon: '🎯',
      iconColor: '#059669',
      name: 'Single-Tasking',
      popularityScore: 89,
      scientificReference:
        'Ophir et al. (2009) - Cognitive control in media multitaskers',
    });

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Keep your phone on airplane mode for the first hour after waking. Protects your attention and prevents reactive morning mode.',
      frequency: FREQUENCY_DAILY,
      icon: '✈️',
      iconColor: '#0EA5E9',
      name: 'Airplane Mode Morning',
      popularityScore: 86,
      scientificReference:
        'Newport (2019) - Digital Minimalism: Choosing a Focused Life in a Noisy World',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Write one “if-then” plan for tomorrow (e.g., “If it’s 9:00 AM, then I start my hardest task for 25 minutes”). This increases follow-through by automating the first step.',
      frequency: 'weekly',
      icon: '🧩',
      iconColor: '#7C3AED',
      name: 'If-Then Planning',
      popularityScore: 83,
      scientificLink:
        'https://www.sciencedirect.com/science/article/pii/S0065260106380021',
      scientificReference:
        'Gollwitzer & Sheeran (2006) - Implementation intentions and goal achievement (Advances in Experimental Social Psychology)',
    });

    return {
      message: '45 additional templates seeded successfully',
      success: true,
    };
  },
});

/**
 * Mutation: Seed new science-backed templates (Phase 3.2)
 * Unique habits covering: Dental Health, Bone Health, Hearing Health, Immune Support, Preventive Care, Goal Setting
 */
/**
 * Internal Mutation: Seed new science-backed templates
 * SEC: Internal only - run via Convex dashboard, not accessible to users
 */
export const seedNewScienceTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let _insertedCount = 0;
    let _skippedCount = 0;
    const insertedNames: string[] = [];
    const skippedNames: string[] = [];

    const existingTemplates = await ctx.db.query('templates').collect();
    const existingTemplateNameKeys = new Set<string>(
      existingTemplates.map((t) => normalizeTemplateName(t.name))
    );

    const insertWithTracking = async (template: TemplateInsert) => {
      const templateNameKey = normalizeTemplateName(template.name);
      if (existingTemplateNameKeys.has(templateNameKey)) {
        _skippedCount++;
        skippedNames.push(template.name);
        return false;
      }

      await ctx.db.insert('templates', template);
      _insertedCount++;
      insertedNames.push(template.name);
      existingTemplateNameKeys.add(templateNameKey);
      return true;
    };

    // ═══════════════════════════════════════════════════════════════
    // HEALTH & FITNESS - Dental Health
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Floss or use interdental brushes daily. Interdental cleaning reduces gum inflammation by 47% and prevents periodontal disease.',
      frequency: FREQUENCY_DAILY,
      icon: '🦷',
      iconColor: '#FFFFFF',
      name: 'Daily Flossing',
      popularityScore: 88,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/38116705/',
      scientificReference:
        'SHIP-TREND Study (2024) - Interdental cleaning reduces plaque and bleeding',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Schedule dental checkups every 6 months. Regular professional cleanings prevent gum disease and catch issues early.',
      frequency: 'weekly',
      icon: '🦷',
      iconColor: '#0EA5E9',
      name: 'Regular Dental Checkups',
      popularityScore: 85,
      scientificReference:
        'American Dental Association - Preventive care recommendations',
    });

    // ═══════════════════════════════════════════════════════════════
    // HEALTH & FITNESS - Bone Health
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Track daily calcium intake (1000-1200mg). Adequate calcium prevents osteoporosis and maintains bone density throughout life.',
      frequency: FREQUENCY_DAILY,
      icon: '🦴',
      iconColor: '#F3F4F6',
      name: 'Calcium Intake Tracking',
      popularityScore: 86,
      scientificLink:
        'https://www.hopkinsmedicine.org/health/conditions-and-diseases/osteoporosis',
      scientificReference:
        'Hopkins Medicine (2024) - Calcium requirements for bone health',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Perform weight-bearing exercises 3-4x weekly. Walking, jogging, and resistance training stimulate bone formation and prevent bone loss.',
      frequency: 'weekly',
      icon: '🏋️',
      iconColor: '#6366F1',
      name: 'Bone-Strengthening Exercise',
      popularityScore: 89,
      scientificReference:
        'National Osteoporosis Foundation - Weight-bearing exercise guidelines',
    });

    // ═══════════════════════════════════════════════════════════════
    // HEALTH & FITNESS - Hearing Health
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Use ear protection in loud environments (concerts, construction, etc.). Prevents noise-induced hearing loss, which is permanent and cumulative.',
      frequency: FREQUENCY_DAILY,
      icon: '👂',
      iconColor: '#F59E0B',
      name: 'Hearing Protection',
      popularityScore: 84,
      scientificLink:
        'https://www.nidcd.nih.gov/news/2021/noise-induced-hearing-loss-preventable',
      scientificReference:
        'NIDCD (2021) - Noise-induced hearing loss is preventable',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Keep audio devices at 60% volume or lower. Listening at safe levels prevents hearing damage from personal devices.',
      frequency: FREQUENCY_DAILY,
      icon: '🎧',
      iconColor: '#8B5CF6',
      name: 'Safe Listening Volume',
      popularityScore: 87,
      scientificReference:
        'WHO (2019) - Safe listening devices and systems guidelines',
    });

    // ═══════════════════════════════════════════════════════════════
    // HEALTH & FITNESS - Immune System Support
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Monitor vitamin D levels and supplement if needed (600-800 IU daily). Vitamin D supports immune function and circadian rhythms.',
      frequency: FREQUENCY_DAILY,
      icon: '☀️',
      iconColor: '#FBBF24',
      name: 'Vitamin D Supplementation',
      popularityScore: 90,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/40218962/',
      scientificReference:
        'PubMed (2024) - Vitamin D and circadian regulation of immune genes',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        "Schedule annual preventive health checkups. Regular screenings catch health issues early when they're most treatable.",
      frequency: 'weekly',
      icon: '🏥',
      iconColor: '#EF4444',
      name: 'Preventive Health Checkups',
      popularityScore: 92,
      scientificReference: 'CDC - Preventive care guidelines for adults',
    });

    // ═══════════════════════════════════════════════════════════════
    // HEALTH & FITNESS - Skin Health
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Apply broad-spectrum SPF 30+ sunscreen daily. Prevents skin cancer, premature aging, and UV damage even on cloudy days.',
      frequency: FREQUENCY_DAILY,
      icon: '🧴',
      iconColor: '#FDE047',
      name: 'Daily Sun Protection',
      popularityScore: 88,
      scientificReference:
        'American Academy of Dermatology - Daily sunscreen recommendations',
    });

    // ═══════════════════════════════════════════════════════════════
    // HEALTH & FITNESS - Joint Health
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Perform joint mobility exercises daily. Maintains range of motion, prevents stiffness, and reduces injury risk.',
      frequency: FREQUENCY_DAILY,
      icon: '🔄',
      iconColor: '#10B981',
      name: 'Joint Mobility Routine',
      popularityScore: 85,
      scientificReference:
        'American College of Sports Medicine - Mobility exercise guidelines',
    });

    // ═══════════════════════════════════════════════════════════════
    // HEALTH & FITNESS - Nutrition & Metabolic Health
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Build most meals around vegetables, legumes/whole grains, and healthy fats (e.g., olive oil). Mediterranean-style eating is consistently associated with better cardiometabolic outcomes.',
      frequency: FREQUENCY_DAILY,
      icon: '🥗',
      iconColor: '#10B981',
      name: 'Mediterranean Plate',
      popularityScore: 90,
      scientificLink:
        'https://pubmed.ncbi.nlm.nih.gov/?term=Estruch+2013+PREDIMED+Mediterranean+diet',
      scientificReference:
        'Estruch et al. (2013) - Primary prevention of cardiovascular disease with a Mediterranean diet (PREDIMED)',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Start meals with non-starchy vegetables before higher-starch foods. Food order can reduce post-meal glucose and insulin responses.',
      frequency: FREQUENCY_DAILY,
      icon: '🥦',
      iconColor: '#22C55E',
      name: 'Veggies First',
      popularityScore: 86,
      scientificLink:
        'https://pubmed.ncbi.nlm.nih.gov/?term=Shukla+food+order+vegetables+carbohydrate+postprandial+glucose',
      scientificReference:
        'Shukla et al. (2015) - Food order and postprandial glucose/insulin responses',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Add beans, lentils, or chickpeas a few times per week. Pulses increase fiber and plant protein, and systematic reviews link them to improved cardiometabolic markers.',
      frequency: 'weekly',
      icon: '🫘',
      iconColor: '#F97316',
      name: 'Legume Serving',
      popularityScore: 84,
      scientificLink:
        'https://pubmed.ncbi.nlm.nih.gov/?term=non-oilseed+pulses+systematic+review+meta-analysis+glycemic+control',
      scientificReference:
        'Sievenpiper et al. (2009) - Non-oilseed pulses and glycemic control: systematic review and meta-analysis',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Eat a small handful of nuts most days. Meta-analyses associate nut intake with lower cardiovascular risk and improved lipid profiles.',
      frequency: FREQUENCY_DAILY,
      icon: '🥜',
      iconColor: '#A16207',
      name: 'Daily Nuts Serving',
      popularityScore: 83,
      scientificLink:
        'https://pubmed.ncbi.nlm.nih.gov/?term=nut+consumption+meta-analysis+cardiovascular+mortality',
      scientificReference:
        'Aune et al. (2016) - Nut consumption and risk of cardiovascular disease: systematic review and meta-analysis',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Swap one refined-grain item (white bread/rice) for whole grains (oats, brown rice, whole-wheat). Whole-grain intake is linked to lower risk of type 2 diabetes and cardiovascular disease.',
      frequency: FREQUENCY_DAILY,
      icon: '🌾',
      iconColor: '#CA8A04',
      name: 'Whole Grain Swap',
      popularityScore: 82,
      scientificLink:
        'https://pubmed.ncbi.nlm.nih.gov/?term=whole+grain+meta-analysis+type+2+diabetes+cardiovascular',
      scientificReference:
        'Aune et al. (2016) - Whole grain consumption and risk of cardiovascular disease and type 2 diabetes',
    });

    // ═══════════════════════════════════════════════════════════════
    // HEALTH & FITNESS - Preventive Screening & Prevention
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Measure blood pressure at home and log it weekly (or as recommended). Self-measured monitoring improves blood pressure control when done consistently.',
      frequency: 'weekly',
      icon: '🩺',
      iconColor: '#EF4444',
      name: 'Blood Pressure Check',
      popularityScore: 84,
      scientificLink:
        'https://pubmed.ncbi.nlm.nih.gov/?term=self-measured+blood+pressure+monitoring+systematic+review+meta-analysis',
      scientificReference:
        'Uhlig et al. (2013) - Self-measured blood pressure monitoring and blood pressure control: systematic review',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Set a yearly reminder to schedule an eye exam (especially with risk factors). Regular screening helps detect vision-threatening disease early.',
      frequency: 'yearly',
      icon: '👁️',
      iconColor: '#0EA5E9',
      name: 'Annual Eye Exam',
      popularityScore: 80,
      scientificLink:
        'https://www.cdc.gov/visionhealth/basics/keeping-eyes-healthy.html',
      scientificReference:
        'CDC - Vision health and preventive eye care guidance',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Set a yearly reminder for a hearing check (especially with loud-noise exposure). Early detection supports prevention and communication health.',
      frequency: 'yearly',
      icon: '🦻',
      iconColor: '#8B5CF6',
      name: 'Annual Hearing Test',
      popularityScore: 79,
      scientificLink: 'https://www.nidcd.nih.gov/health/hearing',
      scientificReference:
        'NIDCD - Hearing health basics and screening considerations',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Do a monthly skin self-exam (ABCDE rule) and note any changing spots. Early detection improves outcomes for skin cancer.',
      frequency: 'monthly',
      icon: '🔎',
      iconColor: '#F59E0B',
      name: 'Monthly Skin Self-Exam',
      popularityScore: 81,
      scientificLink:
        'https://www.aad.org/public/diseases/skin-cancer/find/check-skin',
      scientificReference:
        'American Academy of Dermatology - Skin self-exam (ABCDE) guidance',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Once per year, review recommended vaccines (flu, COVID, Td/Tdap, etc.) with local guidelines or your clinician. Staying up-to-date prevents avoidable illness.',
      frequency: 'yearly',
      icon: '💉',
      iconColor: '#10B981',
      name: 'Vaccination Status Review',
      popularityScore: 82,
      scientificLink: 'https://www.cdc.gov/vaccines/schedules/',
      scientificReference:
        'CDC - Immunization schedules and vaccine recommendations',
    });

    // ═══════════════════════════════════════════════════════════════
    // HEALTH & FITNESS - Strength & Mobility
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Add short wall-sit holds a few times per week. Evidence suggests isometric training can reduce resting blood pressure.',
      frequency: 'weekly',
      icon: '🪑',
      iconColor: '#6366F1',
      name: 'Isometric Wall Sit',
      popularityScore: 83,
      scientificLink:
        'https://pubmed.ncbi.nlm.nih.gov/?term=isometric+exercise+training+systematic+review+meta-analysis+blood+pressure',
      scientificReference:
        'Carlson et al. (2014) - Isometric exercise training and blood pressure: systematic review and meta-analysis',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Do 5 minutes of mobility (hips/shoulders/ankles) during the day. Micro-bouts of movement help reduce stiffness and break up sedentary time.',
      frequency: FREQUENCY_DAILY,
      icon: '🤸',
      iconColor: '#14B8A6',
      name: '5-Minute Mobility Snack',
      popularityScore: 82,
      scientificLink:
        'https://pubmed.ncbi.nlm.nih.gov/?term=interrupting+sitting+light+activity+systematic+review',
      scientificReference:
        'Dempsey et al. (2016) - Interrupting prolonged sitting and cardiometabolic health (reviewed evidence)',
    });

    // ═══════════════════════════════════════════════════════════════
    // PRODUCTIVITY - Goal Setting & Review
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Review weekly goals every Sunday. Regular goal review increases achievement rates by 42% and maintains focus.',
      frequency: 'weekly',
      icon: '📋',
      iconColor: '#7C3AED',
      name: 'Weekly Goal Review',
      popularityScore: 89,
      scientificReference:
        'Locke & Latham (2002) - Goal-setting theory and performance',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Track your energy levels throughout the day. Identifying peak energy times allows you to schedule important work during high-energy windows.',
      frequency: FREQUENCY_DAILY,
      icon: '⚡',
      iconColor: '#FBBF24',
      name: 'Energy Level Tracking',
      popularityScore: 85,
      scientificReference:
        'Kühnel et al. (2017) - Daily energy management and work engagement',
    });

    // ═══════════════════════════════════════════════════════════════
    // PRODUCTIVITY - Focus & Cognitive Load
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Pick your top 3 priorities and write them down. Plan-making reduces intrusive thoughts from unfinished goals and improves follow-through.',
      frequency: FREQUENCY_DAILY,
      icon: '🎯',
      iconColor: '#7C3AED',
      name: 'Daily Top 3 Priorities',
      popularityScore: 86,
      scientificLink:
        'https://pubmed.ncbi.nlm.nih.gov/?term=Masicampo+Baumeister+2011+plan-making+unfulfilled+goals',
      scientificReference:
        'Masicampo & Baumeister (2011) - Plan-making eliminates cognitive effects of unfulfilled goals',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Check email/messages at set times (e.g., 2-3 windows/day) instead of constantly. Reducing interruptions supports focus and lowers stress.',
      frequency: FREQUENCY_DAILY,
      icon: '📨',
      iconColor: '#0EA5E9',
      name: 'Batch Check Messages',
      popularityScore: 84,
      scientificLink:
        'https://pubmed.ncbi.nlm.nih.gov/?term=email+checking+frequency+stress+experiment',
      scientificReference:
        'Kushlev & Dunn (2015) - Email checking frequency and stress (field experiment)',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Do a quick 2-minute tidy of one small area (desk, counter). Clutter is associated with increased stress and reduced focus.',
      frequency: FREQUENCY_DAILY,
      icon: '🧹',
      iconColor: '#F97316',
      name: 'Two-Minute Tidy',
      popularityScore: 82,
      scientificLink:
        'https://pubmed.ncbi.nlm.nih.gov/?term=Saxbe+Repetti+2010+home+environment+cortisol',
      scientificReference:
        'Saxbe & Repetti (2010) - Home environment and cortisol patterns',
    });

    // ═══════════════════════════════════════════════════════════════
    // MINDFULNESS - Stress & Recovery
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice box breathing (4-4-4-4) when stressed. Activates parasympathetic nervous system and reduces cortisol within minutes.',
      frequency: FREQUENCY_DAILY,
      icon: '📦',
      iconColor: '#14B8A6',
      name: 'Box Breathing',
      popularityScore: 87,
      scientificReference:
        'Ma et al. (2017) - Effect of diaphragmatic breathing on stress',
      youtubeLink: 'https://www.youtube.com/watch?v=J5C_VYLnq0I',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Take a 10-minute technology-free break daily. Unplugged breaks restore attention and reduce mental fatigue.',
      frequency: FREQUENCY_DAILY,
      icon: '🌿',
      iconColor: '#059669',
      name: 'Tech-Free Break',
      popularityScore: 86,
      scientificReference:
        'Ward et al. (2017) - Brain drain: The mere presence of smartphones reduces cognitive capacity',
    });

    // ═══════════════════════════════════════════════════════════════
    // LEARNING - Memory & Cognitive Enhancement
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Review learned material before sleep. Sleep consolidates memories, making pre-sleep review 20% more effective.',
      frequency: FREQUENCY_DAILY,
      icon: '🌙',
      iconColor: '#4338CA',
      name: 'Pre-Sleep Review',
      popularityScore: 88,
      scientificReference:
        "Rasch & Born (2013) - About sleep's role in memory consolidation",
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Teach someone what you learned this week. Teaching others improves your own retention by up to 90% (protégé effect).',
      frequency: 'weekly',
      icon: '👨‍🏫',
      iconColor: '#DC2626',
      name: 'Weekly Teaching',
      popularityScore: 90,
      scientificReference:
        'Chi et al. (1989) - Self-explanations enhance learning',
    });

    // ═══════════════════════════════════════════════════════════════
    // SOCIAL - Relationship Building
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Ask one deep question in conversations. Meaningful questions deepen relationships and increase connection satisfaction.',
      frequency: FREQUENCY_DAILY,
      icon: '❓',
      iconColor: '#8B5CF6',
      name: 'Deep Questions',
      popularityScore: 83,
      scientificReference:
        'Aron et al. (1997) - The experimental generation of interpersonal closeness',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Practice receiving feedback gracefully without defensiveness. Accepting feedback improves relationships and accelerates personal growth.',
      frequency: FREQUENCY_DAILY,
      icon: '💬',
      iconColor: '#06B6D4',
      name: 'Receive Feedback Gracefully',
      popularityScore: 82,
      scientificReference:
        'Stone & Heen (2014) - Thanks for the Feedback: The Science and Art of Receiving Feedback',
    });

    return {
      insertedCount: _insertedCount,
      insertedNames,
      message: `${_insertedCount} new templates inserted, ${_skippedCount} skipped (already exist)`,
      skippedCount: _skippedCount,
      skippedNames,
      success: true,
    };
  },
});

/**
 * Query: Check if templates exist and return count
 */
export const getTemplateCount = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query('templates').collect();
    return { count: templates.length, hasTemplates: templates.length > 0 };
  },
});

/**
 * Query: List all template names (for debugging)
 */
export const listTemplateNames = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query('templates').collect();
    return templates.map((t) => ({
      category: t.category,
      createdAt: t.createdAt,
      name: t.name,
    }));
  },
});

/**
 * Mutation: Update existing templates with YouTube links
 */
export const updateYoutubeLinks = internalMutation({
  args: {},
  handler: async (ctx) => {
    const youtubeLinks: Record<string, string> = {
      'Delay Caffeine 90 Minutes':
        'https://www.youtube.com/watch?v=iw97uvIge7c',

      '16:8 Intermittent Fasting':
        'https://www.youtube.com/watch?v=9tRohh0gErM',

      'Deliberate Cold Exposure': 'https://www.youtube.com/watch?v=pq6WHJzOkno',

      // Morning Routine Templates
      '5-Minute Meditation': 'https://www.youtube.com/watch?v=xLXF5aP4CtQ',

      'Evening Light Dimming': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',

      'Cold Shower': 'https://www.youtube.com/watch?v=pq6WHJzOkno',

      // Andrew Huberman Protocol Templates
      'Morning Sunlight Viewing': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',

      // Health & Fitness Templates
      '10,000 Steps': 'https://www.youtube.com/watch?v=YQ7QGKIx6vY',

      'NSDR Practice': 'https://www.youtube.com/watch?v=AKGrmY8UFWU',

      'Hydration First': 'https://www.youtube.com/watch?v=81QHxWBJyFg',

      'Physiological Sigh': 'https://www.youtube.com/watch?v=rBdhqBGqiMc',

      // Productivity Templates
      'Deep Work Session': 'https://www.youtube.com/watch?v=gTaJhjQHcf8',

      'Zone 2 Cardio Training': 'https://www.youtube.com/watch?v=jN0pRAqiUJU',

      'Breathwork Practice': 'https://www.youtube.com/watch?v=J5C_VYLnq0I',

      'Box Breathing': 'https://www.youtube.com/watch?v=J5C_VYLnq0I',

      'Sauna Therapy': 'https://www.youtube.com/watch?v=EQ3GjpGq5Y8',

      '4-7-8 Breathing': 'https://www.youtube.com/watch?v=J5C_VYLnq0I',

      'Sleep Optimization': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',

      '4-7-8 Relaxing Breath': 'https://www.youtube.com/watch?v=J5C_VYLnq0I',

      'Time-Restricted Eating': 'https://www.youtube.com/watch?v=9tRohh0gErM',

      // Additional breathing templates
      'Box Breathing (4-4-4-4)': 'https://www.youtube.com/watch?v=J5C_VYLnq0I',

      'Hydration Tracking': 'https://www.youtube.com/watch?v=81QHxWBJyFg',

      '7-9 Hours Sleep': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',

      'Sunrise Viewing': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',

      // Sleep templates
      'Consistent Bedtime': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',

      'Consistent Wake Time': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',

      'Stretching Routine': 'https://www.youtube.com/watch?v=gdbL6WN4jNM',

      'Contrast Shower': 'https://www.youtube.com/watch?v=pq6WHJzOkno',

      'Digital Detox Hour': 'https://www.youtube.com/watch?v=MwXNOxhhYLg',
      // Mindfulness Templates
      'Gratitude Journaling': 'https://www.youtube.com/watch?v=mPH7w64diJc',
      'Nasal Breathing': 'https://www.youtube.com/watch?v=rBdhqBGqiMc',

      'No Screens Before Bed': 'https://www.youtube.com/watch?v=WDv4AWk0J3U',

      // Recovery templates
      'Sauna Recovery': 'https://www.youtube.com/watch?v=EQ3GjpGq5Y8',
      'Yoga Nidra/NSDR': 'https://www.youtube.com/watch?v=AKGrmY8UFWU',
    };

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

/**
 * Mutation: Seed comprehensive science-backed templates (Phase 3.2)
 * 50+ new habits across NEW categories: Longevity, Mental Health, Recovery, Breathing
 * Plus additional habits in existing categories based on peer-reviewed research
 */
export const seedScienceTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // ═══════════════════════════════════════════════════════════════
    // 🧬 LONGEVITY - Evidence-based habits for healthspan extension
    // ═══════════════════════════════════════════════════════════════

    await ctx.db.insert('templates', {
      category: 'longevity',
      createdAt: now,
      description:
        'VO2 max is the single strongest predictor of longevity. Train at high intensity 1-2x weekly with intervals that make conversation difficult.',
      frequency: 'weekly',
      icon: '🫀',
      iconColor: '#EF4444',
      name: 'VO2 Max Training',
      popularityScore: 95,
      scientificLink: 'https://peterattiamd.com/outlive/',
      scientificReference:
        'Attia (2023) - Outlive: The Science and Art of Longevity',
    });

    await ctx.db.insert('templates', {
      category: 'longevity',
      createdAt: now,
      description:
        'Grip strength is a powerful predictor of all-cause mortality. Train with dead hangs, farmer carries, or grip exercises 3x weekly.',
      frequency: 'weekly',
      icon: '✊',
      iconColor: '#F97316',
      name: 'Grip Strength Training',
      popularityScore: 91,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/25953784/',
      scientificReference:
        'Leong et al. (2015) - Prognostic value of grip strength: findings from the PURE study',
    });

    await ctx.db.insert('templates', {
      category: 'longevity',
      createdAt: now,
      description:
        'The sitting-rising test (sitting on floor and standing without hands) predicts mortality. Practice floor sitting daily to maintain this ability.',
      frequency: FREQUENCY_DAILY,
      icon: '🧘',
      iconColor: '#8B5CF6',
      name: 'Floor Sitting Practice',
      popularityScore: 87,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/23242910/',
      scientificReference:
        'Brito et al. (2014) - Ability to sit and rise from the floor as a predictor of all-cause mortality',
    });

    await ctx.db.insert('templates', {
      category: 'longevity',
      createdAt: now,
      description:
        'Take stairs exclusively instead of elevators. Climbing 7+ floors daily associated with 33% lower all-cause mortality.',
      frequency: FREQUENCY_DAILY,
      icon: '🪜',
      iconColor: '#059669',
      name: 'Always Take Stairs',
      popularityScore: 89,
      scientificReference:
        'Boreham et al. (2005) - Stair climbing and cardiovascular disease risk',
    });

    await ctx.db.insert('templates', {
      category: 'longevity',
      createdAt: now,
      description:
        'Stand on one leg for 10 seconds with eyes open. Inability to do this in older adults predicts doubled mortality risk within 10 years.',
      frequency: FREQUENCY_DAILY,
      icon: '🦩',
      iconColor: '#EC4899',
      name: 'Single-Leg Balance Test',
      popularityScore: 86,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/35729712/',
      scientificReference:
        'Araujo et al. (2022) - Successful 10-second one-legged stance performance predicts survival',
    });

    await ctx.db.insert('templates', {
      category: 'longevity',
      createdAt: now,
      description:
        'Walk at a pace of 3+ mph (brisk walking). Walking speed is a strong predictor of longevity - faster walkers live significantly longer.',
      frequency: FREQUENCY_DAILY,
      icon: '🚶‍♂️',
      iconColor: '#3B82F6',
      name: 'Brisk Walking Pace',
      popularityScore: 93,
      scientificReference:
        'Studenski et al. (2011) - Gait speed and survival in older adults',
    });

    await ctx.db.insert('templates', {
      category: 'longevity',
      createdAt: now,
      description:
        'Maintain muscle mass through resistance training 2-3x weekly. Sarcopenia (muscle loss) accelerates aging and increases mortality.',
      frequency: 'weekly',
      icon: '💪',
      iconColor: '#DC2626',
      name: 'Muscle Preservation',
      popularityScore: 94,
      scientificReference:
        'Srikanthan & Karlamangla (2014) - Muscle mass index as a predictor of longevity',
    });

    await ctx.db.insert('templates', {
      category: 'longevity',
      createdAt: now,
      description:
        'Practice getting up and down from the ground using different movement patterns. Maintains functional capacity critical for independence.',
      frequency: FREQUENCY_DAILY,
      icon: '⬆️',
      iconColor: '#7C3AED',
      name: 'Ground Transitions',
      popularityScore: 84,
      scientificReference:
        'Attia (2023) - Centenarian Decathlon: functional movement goals',
    });

    await ctx.db.insert('templates', {
      category: 'longevity',
      createdAt: now,
      description:
        'Eat 25-30g protein per meal (especially breakfast). Maintains muscle mass and prevents age-related sarcopenia.',
      frequency: FREQUENCY_DAILY,
      icon: '🥩',
      iconColor: '#B91C1C',
      name: 'Protein Per Meal Goal',
      popularityScore: 90,
      scientificReference:
        'Layman et al. (2015) - Dietary protein distribution positively influences 24-h muscle protein synthesis',
    });

    await ctx.db.insert('templates', {
      category: 'longevity',
      createdAt: now,
      description:
        'Test your resting heart rate weekly. Lower resting HR (50-70 bpm) correlates with longevity and cardiovascular health.',
      frequency: 'weekly',
      icon: '❤️',
      iconColor: '#F43F5E',
      name: 'Resting Heart Rate Check',
      popularityScore: 82,
      scientificReference:
        'Jensen et al. (2013) - Elevated resting heart rate and mortality',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🧠 MENTAL HEALTH - Evidence-based psychological wellness
    // ═══════════════════════════════════════════════════════════════

    await ctx.db.insert('templates', {
      category: 'mental_health',
      createdAt: now,
      description:
        'When struggling, pause and say: "This is a moment of suffering. Suffering is part of life. May I be kind to myself." More effective than self-esteem building.',
      frequency: FREQUENCY_DAILY,
      icon: '💗',
      iconColor: '#EC4899',
      name: 'Self-Compassion Break',
      popularityScore: 93,
      scientificLink: 'https://self-compassion.org/the-research/',
      scientificReference:
        'Neff (2011) - Self-Compassion: The Proven Power of Being Kind to Yourself',
    });

    await ctx.db.insert('templates', {
      category: 'mental_health',
      createdAt: now,
      description:
        'Label thoughts as "I notice I\'m having the thought that..." Creates distance from negative thoughts and reduces their impact.',
      frequency: FREQUENCY_DAILY,
      icon: '🏷️',
      iconColor: '#6366F1',
      name: 'Cognitive Defusion',
      popularityScore: 88,
      scientificReference:
        'Hayes (2004) - ACT: Acceptance and Commitment Therapy',
    });

    await ctx.db.insert('templates', {
      category: 'mental_health',
      createdAt: now,
      description:
        'Write for 20 minutes about your deepest feelings regarding a difficult experience. Improves immune function and reduces doctor visits by 50%.',
      frequency: 'weekly',
      icon: '📝',
      iconColor: '#8B5CF6',
      name: 'Expressive Writing',
      popularityScore: 91,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/10408300/',
      scientificReference:
        'Pennebaker (1997) - Writing about emotional experiences as a therapeutic process',
    });

    await ctx.db.insert('templates', {
      category: 'mental_health',
      createdAt: now,
      description:
        "Do one small task you've been avoiding. Behavioral activation is as effective as antidepressants for mild-moderate depression.",
      frequency: FREQUENCY_DAILY,
      icon: '✅',
      iconColor: '#10B981',
      name: 'Behavioral Activation',
      popularityScore: 90,
      scientificReference:
        'Cuijpers et al. (2007) - Behavioral activation treatments of depression: A meta-analysis',
    });

    await ctx.db.insert('templates', {
      category: 'mental_health',
      createdAt: now,
      description:
        'Review your core values weekly. Self-affirmation through values reduces stress response and builds psychological resilience.',
      frequency: 'weekly',
      icon: '🎯',
      iconColor: '#F59E0B',
      name: 'Values Clarification',
      popularityScore: 85,
      scientificReference:
        'Cohen & Sherman (2014) - The psychology of change: Self-affirmation and social psychological intervention',
    });

    await ctx.db.insert('templates', {
      category: 'mental_health',
      createdAt: now,
      description:
        'Schedule 15-30 minutes to write down all worries, then close the notebook. Containing worry to a specific time reduces generalized anxiety.',
      frequency: FREQUENCY_DAILY,
      icon: '📓',
      iconColor: '#64748B',
      name: 'Scheduled Worry Time',
      popularityScore: 87,
      scientificReference:
        'Borkovec et al. (1990) - Stimulus control treatment for worry',
    });

    await ctx.db.insert('templates', {
      category: 'mental_health',
      createdAt: now,
      description:
        'Plan one small pleasurable activity daily. Pleasant activity scheduling is a core component of evidence-based depression treatment.',
      frequency: FREQUENCY_DAILY,
      icon: '🎉',
      iconColor: '#22C55E',
      name: 'Pleasant Activity Scheduling',
      popularityScore: 86,
      scientificReference:
        'Lewinsohn (1974) - A behavioral approach to depression',
    });

    await ctx.db.insert('templates', {
      category: 'mental_health',
      createdAt: now,
      description:
        'When anxious, ask: "What would I tell a friend in this situation?" Perspective-taking reduces emotional intensity and catastrophizing.',
      frequency: FREQUENCY_DAILY,
      icon: '🪞',
      iconColor: '#0EA5E9',
      name: 'Self-Distancing',
      popularityScore: 84,
      scientificReference:
        'Kross & Ayduk (2011) - Self-distancing and adaptive self-reflection',
    });

    await ctx.db.insert('templates', {
      category: 'mental_health',
      createdAt: now,
      description:
        'Name your emotions specifically (not just "bad" but "disappointed" or "frustrated"). Specific emotion labeling reduces amygdala activation.',
      frequency: FREQUENCY_DAILY,
      icon: '😶',
      iconColor: '#A855F7',
      name: 'Emotion Granularity',
      popularityScore: 83,
      scientificReference:
        'Lieberman et al. (2007) - Putting feelings into words: Affect labeling disrupts amygdala activity',
    });

    await ctx.db.insert('templates', {
      category: 'mental_health',
      createdAt: now,
      description:
        'Practice opposite action: when you feel like withdrawing, reach out; when angry, speak gently. Core DBT skill for emotion regulation.',
      frequency: FREQUENCY_DAILY,
      icon: '↔️',
      iconColor: '#14B8A6',
      name: 'Opposite Action',
      popularityScore: 82,
      scientificReference:
        'Linehan (2014) - DBT Skills Training Manual: Emotion Regulation',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🔄 RECOVERY - Optimal rest and regeneration
    // ═══════════════════════════════════════════════════════════════

    await ctx.db.insert('templates', {
      category: 'recovery',
      createdAt: now,
      description:
        'Wake at the same time every day, including weekends. Consistent wake time is more important than bedtime for circadian stability.',
      frequency: FREQUENCY_DAILY,
      icon: '⏰',
      iconColor: '#F97316',
      name: 'Consistent Wake Time',
      popularityScore: 95,
      scientificReference:
        'Roenneberg (2012) - Internal Time: Chronotypes and Social Jet Lag',
    });

    await ctx.db.insert('templates', {
      category: 'recovery',
      createdAt: now,
      description:
        'End hot showers with 30-60 seconds of cold water. This contrast therapy reduces sick days by 29% and improves recovery.',
      frequency: FREQUENCY_DAILY,
      icon: '🚿',
      iconColor: '#38BDF8',
      name: 'Contrast Shower',
      popularityScore: 88,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/27631616/',
      scientificReference:
        'Buijze et al. (2016) - Cold shower effects on sickness absence',
    });

    await ctx.db.insert('templates', {
      category: 'recovery',
      createdAt: now,
      description:
        'Sleep under a weighted blanket (8-12% of body weight). Deep pressure stimulation reduces anxiety and improves sleep quality.',
      frequency: FREQUENCY_DAILY,
      icon: '🛋️',
      iconColor: '#4338CA',
      name: 'Weighted Blanket Sleep',
      popularityScore: 84,
      scientificReference:
        'Ackerley et al. (2015) - Positive effects of a weighted blanket on insomnia',
    });

    await ctx.db.insert('templates', {
      category: 'recovery',
      createdAt: now,
      description:
        'Watch the sunset for 10+ minutes when possible. Signals your circadian system that the day is ending, preparing body for sleep.',
      frequency: FREQUENCY_DAILY,
      icon: '🌅',
      iconColor: '#F59E0B',
      name: 'Evening Sunset Viewing',
      popularityScore: 83,
      scientificReference:
        'Huberman (2022) - Evening light viewing for circadian regulation',
    });

    await ctx.db.insert('templates', {
      category: 'recovery',
      createdAt: now,
      description:
        'Use foam roller or massage gun for 10-15 minutes. Self-myofascial release improves range of motion and reduces muscle soreness.',
      frequency: FREQUENCY_DAILY,
      icon: '🧴',
      iconColor: '#7C3AED',
      name: 'Self-Massage/Foam Rolling',
      popularityScore: 86,
      scientificReference:
        'Cheatham et al. (2015) - Effects of self-myofascial release: A systematic review',
    });

    await ctx.db.insert('templates', {
      category: 'recovery',
      createdAt: now,
      description:
        'Take a 10-30 minute nap before 3 PM. Short naps improve cognitive function, alertness, and mood without affecting nighttime sleep.',
      frequency: FREQUENCY_DAILY,
      icon: '💤',
      iconColor: '#6366F1',
      name: 'Power Nap',
      popularityScore: 87,
      scientificReference:
        'Milner & Cote (2009) - Benefits of napping in healthy adults',
    });

    await ctx.db.insert('templates', {
      category: 'recovery',
      createdAt: now,
      description:
        'Use pink or white noise while sleeping. Background noise masks disruptions and improves both sleep onset and sleep quality.',
      frequency: FREQUENCY_DAILY,
      icon: '🔊',
      iconColor: '#94A3B8',
      name: 'Sleep Sound Machine',
      popularityScore: 81,
      scientificReference:
        'Messineo et al. (2017) - Broadband sound improves sleep onset latency',
    });

    await ctx.db.insert('templates', {
      category: 'recovery',
      createdAt: now,
      description:
        'Spend 20-30 minutes in infrared sauna or traditional sauna 2-3x weekly. Heat therapy improves cardiovascular health and recovery.',
      frequency: 'weekly',
      icon: '🧖',
      iconColor: '#DC2626',
      name: 'Sauna Recovery',
      popularityScore: 85,
      scientificReference:
        'Laukkanen et al. (2015) - Sauna bathing and cardiovascular disease risk',
    });

    await ctx.db.insert('templates', {
      category: 'recovery',
      createdAt: now,
      description:
        'Practice yoga nidra or NSDR (non-sleep deep rest) for 10-20 minutes. Accelerates learning, restores dopamine, and improves sleep.',
      frequency: FREQUENCY_DAILY,
      icon: '🛌',
      iconColor: '#7DD3FC',
      name: 'Yoga Nidra/NSDR',
      popularityScore: 89,
      scientificReference:
        'Huberman Lab (2021) - NSDR for learning and recovery',
    });

    await ctx.db.insert('templates', {
      category: 'recovery',
      createdAt: now,
      description:
        'Take 200-400mg magnesium glycinate or threonate 30-60 minutes before bed. Supports GABA activity and improves sleep quality.',
      frequency: FREQUENCY_DAILY,
      icon: '💊',
      iconColor: '#10B981',
      name: 'Evening Magnesium',
      popularityScore: 88,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/23853635/',
      scientificReference:
        'Abbasi et al. (2012) - Magnesium supplementation and sleep quality',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🌬️ BREATHING - Respiratory techniques for performance & calm
    // ═══════════════════════════════════════════════════════════════

    await ctx.db.insert('templates', {
      category: 'breathing',
      createdAt: now,
      description:
        'Inhale 4 counts, hold 4, exhale 4, hold empty 4. Navy SEAL technique proven to rapidly reduce stress and cortisol levels.',
      frequency: FREQUENCY_DAILY,
      icon: '⬜',
      iconColor: '#3B82F6',
      name: 'Box Breathing (4-4-4-4)',
      popularityScore: 94,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/29616846/',
      scientificReference:
        'Zaccaro et al. (2018) - How breath-control can change your life',
    });

    await ctx.db.insert('templates', {
      category: 'breathing',
      createdAt: now,
      description:
        'Double inhale through nose, long exhale through mouth. The fastest way to calm down - works in 1-3 breaths.',
      frequency: FREQUENCY_DAILY,
      icon: '😮‍💨',
      iconColor: '#34D399',
      name: 'Physiological Sigh',
      popularityScore: 92,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/36630953/',
      scientificReference:
        'Balban et al. (2023) - Brief structured respiration practices enhance mood',
    });

    await ctx.db.insert('templates', {
      category: 'breathing',
      createdAt: now,
      description:
        'Practice breathing through your nose throughout the day. Nasal breathing filters air, produces nitric oxide, and activates parasympathetic system.',
      frequency: FREQUENCY_DAILY,
      icon: '👃',
      iconColor: '#14B8A6',
      name: 'Nasal Breathing',
      popularityScore: 91,
      scientificReference:
        'Nestor (2020) - Breath: The New Science of a Lost Art',
    });

    await ctx.db.insert('templates', {
      category: 'breathing',
      createdAt: now,
      description:
        'Hum for 5 minutes daily (like "om" or any tune). Increases nasal nitric oxide production by 15x, improving sinus health and oxygenation.',
      frequency: FREQUENCY_DAILY,
      icon: '🎵',
      iconColor: '#8B5CF6',
      name: 'Daily Humming',
      popularityScore: 79,
      scientificReference:
        'Weitzberg & Lundberg (2002) - Humming greatly increases nasal nitric oxide',
    });

    await ctx.db.insert('templates', {
      category: 'breathing',
      createdAt: now,
      description:
        'Practice breath holds after exhale to increase CO2 tolerance. Improves exercise capacity, reduces anxiety, and enhances breath control.',
      frequency: FREQUENCY_DAILY,
      icon: '⏱️',
      iconColor: '#F97316',
      name: 'CO2 Tolerance Training',
      popularityScore: 83,
      scientificReference: 'Malshe (2011) - Pranayama and CO2 tolerance',
    });

    await ctx.db.insert('templates', {
      category: 'breathing',
      createdAt: now,
      description:
        'Inhale 4 counts, hold 7, exhale 8. Activates parasympathetic response and promotes sleep onset.',
      frequency: FREQUENCY_DAILY,
      icon: '😴',
      iconColor: '#6366F1',
      name: '4-7-8 Relaxing Breath',
      popularityScore: 88,
      scientificReference:
        'Weil (2015) - Breathing: The Master Key to Self-Healing',
    });

    await ctx.db.insert('templates', {
      category: 'breathing',
      createdAt: now,
      description:
        'Practice controlled hyperventilation followed by breath retention. Reduces inflammation, improves immune response, and builds mental resilience.',
      frequency: FREQUENCY_DAILY,
      icon: '❄️',
      iconColor: '#0EA5E9',
      name: 'Wim Hof Breathing',
      popularityScore: 85,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/24799686/',
      scientificReference:
        'Kox et al. (2014) - Voluntary activation of the innate immune response',
    });

    await ctx.db.insert('templates', {
      category: 'breathing',
      createdAt: now,
      description:
        'Perform cyclic breathing: rapid inhales followed by passive exhales for 1-3 minutes. Increases alertness and energy without caffeine.',
      frequency: FREQUENCY_DAILY,
      icon: '⚡',
      iconColor: '#FBBF24',
      name: 'Energizing Breath (Kapalabhati)',
      popularityScore: 81,
      scientificReference:
        'Telles et al. (2011) - Effect of yoga breathing on cognitive function',
    });

    await ctx.db.insert('templates', {
      category: 'breathing',
      createdAt: now,
      description:
        'Breathe in a 5.5 second inhale, 5.5 second exhale rhythm (5.5 breaths per minute). The optimal breathing rate for heart rate variability.',
      frequency: FREQUENCY_DAILY,
      icon: '💓',
      iconColor: '#EC4899',
      name: 'Resonant Breathing',
      popularityScore: 86,
      scientificReference:
        'Lehrer & Gevirtz (2014) - Heart rate variability biofeedback',
    });

    await ctx.db.insert('templates', {
      category: 'breathing',
      createdAt: now,
      description:
        'Tape mouth with medical tape during sleep. Prevents mouth breathing, reduces snoring, and improves sleep quality.',
      frequency: FREQUENCY_DAILY,
      icon: '😷',
      iconColor: '#64748B',
      name: 'Mouth Taping Sleep',
      popularityScore: 77,
      scientificReference:
        'Nestor (2020) - Mouth breathing vs nasal breathing during sleep',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🏃 Additional HEALTH & FITNESS templates
    // ═══════════════════════════════════════════════════════════════

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Walk for 10-15 minutes after meals. Reduces blood glucose spikes by 22%, improving metabolic health and energy levels.',
      frequency: FREQUENCY_DAILY,
      icon: '🚶',
      iconColor: '#10B981',
      name: 'Post-Meal Walk',
      popularityScore: 93,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/35189634/',
      scientificReference:
        'Reynolds et al. (2022) - Post-meal walking reduces glucose excursions',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Practice backward walking for 5-10 minutes. Improves balance, reduces knee pain by 40%, and activates different muscle patterns.',
      frequency: FREQUENCY_DAILY,
      icon: '⬅️',
      iconColor: '#F59E0B',
      name: 'Backward Walking',
      popularityScore: 84,
      scientificReference:
        'Cha et al. (2016) - Effects of backward walking on balance and knee pain',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Do brief intense exercise bursts (1-2 min) several times throughout the day. "Exercise snacks" reduce mortality risk 4-5x.',
      frequency: FREQUENCY_DAILY,
      icon: '💥',
      iconColor: '#EF4444',
      name: 'Movement Snacks',
      popularityScore: 88,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/36396264/',
      scientificReference:
        'Stamatakis et al. (2022) - Vigorous intermittent lifestyle physical activity',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Take 1 tablespoon apple cider vinegar diluted in water before meals. Reduces post-meal blood glucose spikes by up to 34%.',
      frequency: FREQUENCY_DAILY,
      icon: '🍎',
      iconColor: '#84CC16',
      name: 'Pre-Meal Vinegar',
      popularityScore: 82,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/7796781/',
      scientificReference:
        'Johnston et al. (2004) - Vinegar improves insulin sensitivity',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Cool and reheat starchy foods (potatoes, rice, pasta) before eating. Creates resistant starch that feeds beneficial gut bacteria.',
      frequency: FREQUENCY_DAILY,
      icon: '🥔',
      iconColor: '#A16207',
      name: 'Resistant Starch',
      popularityScore: 78,
      scientificReference:
        'Robertson et al. (2005) - Resistant starch improves insulin sensitivity',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Distribute protein intake: 20-40g every 3-4 hours rather than one large serving. Optimizes muscle protein synthesis throughout the day.',
      frequency: FREQUENCY_DAILY,
      icon: '🍳',
      iconColor: '#F97316',
      name: 'Protein Pacing',
      popularityScore: 85,
      scientificReference:
        'Arciero et al. (2013) - Increased protein intake and meal frequency',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🤝 Additional SOCIAL templates
    // ═══════════════════════════════════════════════════════════════

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'When someone shares good news, respond with enthusiasm, questions, and celebration. Strongest predictor of relationship satisfaction.',
      frequency: FREQUENCY_DAILY,
      icon: '🎊',
      iconColor: '#22C55E',
      name: 'Active Constructive Responding',
      popularityScore: 89,
      scientificReference:
        'Gable et al. (2004) - What do you do when things go right?',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Share one honest, vulnerable feeling with someone you trust. Vulnerability builds deeper connection and trust in relationships.',
      frequency: FREQUENCY_DAILY,
      icon: '💭',
      iconColor: '#8B5CF6',
      name: 'Vulnerability Practice',
      popularityScore: 84,
      scientificReference:
        'Brown (2012) - Daring Greatly: Vulnerability and courage',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Practice soft eye contact for 3+ seconds during conversations. Increases oxytocin and perceived trustworthiness in both people.',
      frequency: FREQUENCY_DAILY,
      icon: '👀',
      iconColor: '#06B6D4',
      name: 'Eye Contact Practice',
      popularityScore: 81,
      scientificReference:
        'Akechi et al. (2013) - Eye contact and oxytocin response',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Ask open-ended questions and reflect back what you hear without planning your response. Deep listening builds empathy and connection.',
      frequency: FREQUENCY_DAILY,
      icon: '👂',
      iconColor: '#7C3AED',
      name: 'Reflective Listening',
      popularityScore: 86,
      scientificReference:
        'Rogers (1951) - Client-centered therapy and active listening',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🧠 Additional PRODUCTIVITY templates
    // ═══════════════════════════════════════════════════════════════

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        "Work in 90-minute cycles matching your brain's ultradian rhythm. Natural focus waxes and wanes in ~90-minute cycles throughout the day.",
      frequency: FREQUENCY_DAILY,
      icon: '🔄',
      iconColor: '#7C3AED',
      name: 'Ultradian Work Cycles',
      popularityScore: 88,
      scientificReference:
        'Peretz Lavie (1985) - Ultradian rhythms in cognitive performance',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Keep phone on airplane mode for the first 60 minutes after waking. Protects your attention and prevents reactive morning mode.',
      frequency: FREQUENCY_DAILY,
      icon: '✈️',
      iconColor: '#0EA5E9',
      name: 'Airplane Mode Morning',
      popularityScore: 87,
      scientificReference:
        'Newport (2019) - Digital Minimalism: Choosing a Focused Life',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Set phone to grayscale mode. Removing color reduces compulsive phone use by 30% by eliminating color-based reward triggers.',
      frequency: FREQUENCY_DAILY,
      icon: '📱',
      iconColor: '#64748B',
      name: 'Grayscale Phone Mode',
      popularityScore: 82,
      scientificReference:
        'Alter (2017) - Irresistible: The Rise of Addictive Technology',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Open windows for 10-15 minutes daily. Fresh air reduces indoor CO2 levels, improving cognitive function by up to 50%.',
      frequency: FREQUENCY_DAILY,
      icon: '🪟',
      iconColor: '#38BDF8',
      name: 'Fresh Air Ventilation',
      popularityScore: 83,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/26502459/',
      scientificReference:
        'Allen et al. (2016) - CO2 and ventilation effects on cognitive function',
    });

    // ═══════════════════════════════════════════════════════════════
    // 📚 Additional LEARNING templates
    // ═══════════════════════════════════════════════════════════════

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Use your non-dominant hand for routine tasks like brushing teeth. Activates underused neural pathways and builds cognitive reserve.',
      frequency: FREQUENCY_DAILY,
      icon: '🤚',
      iconColor: '#06B6D4',
      name: 'Non-Dominant Hand Training',
      popularityScore: 79,
      scientificReference:
        'Cohen (2000) - Cross-education and neural plasticity',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Practice Dual N-Back training for 20 minutes. One of the few brain training methods shown to improve fluid intelligence.',
      frequency: FREQUENCY_DAILY,
      icon: '🔢',
      iconColor: '#7C3AED',
      name: 'Dual N-Back Training',
      popularityScore: 80,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/18425231/',
      scientificReference:
        'Jaeggi et al. (2008) - Improving fluid intelligence with training on working memory',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Review what you learned today within 24 hours. Same-day review increases retention from 20% to 80%.',
      frequency: FREQUENCY_DAILY,
      icon: '📖',
      iconColor: '#059669',
      name: 'Same-Day Review',
      popularityScore: 91,
      scientificReference:
        'Ebbinghaus (1885) - Memory: Forgetting curve and spacing effect',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Interleave practice of different skills rather than blocked practice. Interleaving improves long-term retention and transfer.',
      frequency: FREQUENCY_DAILY,
      icon: '🔀',
      iconColor: '#F59E0B',
      name: 'Interleaved Practice',
      popularityScore: 84,
      scientificReference:
        'Rohrer (2012) - Interleaving helps students distinguish among similar concepts',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🌅 Additional MORNING ROUTINE templates
    // ═══════════════════════════════════════════════════════════════

    await ctx.db.insert('templates', {
      category: 'morning_routine',
      createdAt: now,
      description:
        'Do 30-50 bilateral eye movements (look left-right) upon waking. Activates both brain hemispheres and improves alertness.',
      frequency: FREQUENCY_DAILY,
      icon: '👁️',
      iconColor: '#3B82F6',
      name: 'Bilateral Eye Movements',
      popularityScore: 76,
      scientificReference:
        'Shapiro (1989) - EMDR and bilateral stimulation effects',
    });

    await ctx.db.insert('templates', {
      category: 'morning_routine',
      createdAt: now,
      description:
        'Write your #1 priority for the day before checking any devices. Protects your agenda from reactive mode.',
      frequency: FREQUENCY_DAILY,
      icon: '1️⃣',
      iconColor: '#EF4444',
      name: 'Priority First',
      popularityScore: 89,
      scientificReference:
        'Clear (2018) - Atomic Habits: Implementation intentions',
    });

    await ctx.db.insert('templates', {
      category: 'morning_routine',
      createdAt: now,
      description:
        'Splash cold water on face immediately after waking. Triggers the mammalian dive reflex, instantly increasing alertness.',
      frequency: FREQUENCY_DAILY,
      icon: '💦',
      iconColor: '#38BDF8',
      name: 'Cold Face Splash',
      popularityScore: 83,
      scientificReference:
        'Schaller (2012) - Mammalian dive reflex and autonomic regulation',
    });

    return {
      message: '56 science-backed templates seeded successfully',
      success: true,
    };
  },
});

/**
 * Mutation: Seed unique non-duplicate templates (Phase 3.3)
 * 50+ truly unique habits in underserved categories: Career, Hobbies, Environment, Somatic, Purpose, Self-Care
 */
export const seedUniqueTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let _insertedCount = 0;
    let _skippedCount = 0;
    const insertedNames: string[] = [];
    const skippedNames: string[] = [];

    const insertWithTracking = async (template: TemplateInsert) => {
      const existing = await ctx.db
        .query('templates')
        .filter((q) => q.eq(q.field('name'), template.name))
        .first();

      if (existing) {
        _skippedCount++;
        skippedNames.push(template.name);
        return false;
      }

      await ctx.db.insert('templates', template);
      _insertedCount++;
      insertedNames.push(template.name);
      return true;
    };

    // ═══════════════════════════════════════════════════════════════
    // 💼 PRODUCTIVITY - Career & Professional Development
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Spend 30 minutes weekly updating your resume, portfolio, or LinkedIn. Continuous career documentation prevents panic updates when opportunities arise.',
      frequency: 'weekly',
      icon: '💼',
      iconColor: '#0A66C2',
      name: 'Career Documentation',
      popularityScore: 82,
      scientificReference:
        'Seibert et al. (1999) - Proactive career behaviors and career success',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Send one professional networking message weekly. Weak ties are more valuable for career opportunities than close connections.',
      frequency: 'weekly',
      icon: '🤝',
      iconColor: '#059669',
      name: 'Professional Networking',
      popularityScore: 85,
      scientificReference: 'Granovetter (1973) - The Strength of Weak Ties',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Document one lesson learned or insight from work daily. Creates a personal knowledge base and accelerates expertise development.',
      frequency: FREQUENCY_DAILY,
      icon: '📓',
      iconColor: '#7C3AED',
      name: 'Work Insights Journal',
      popularityScore: 81,
      scientificReference:
        'Di Stefano et al. (2016) - Learning by thinking: How reflection aids performance',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Practice public speaking for 10 minutes daily (record yourself, present to mirror). Fear of public speaking can be overcome through gradual exposure.',
      frequency: FREQUENCY_DAILY,
      icon: '🎤',
      iconColor: '#DC2626',
      name: 'Public Speaking Practice',
      popularityScore: 84,
      scientificReference:
        'Hofmann et al. (2008) - Exposure-based therapy for public speaking anxiety',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Spend 15 minutes organizing digital files and emails into a clear folder structure. Reduces time searching for files by up to 50%.',
      frequency: 'weekly',
      icon: '🗂️',
      iconColor: '#F59E0B',
      name: 'Digital File Organization',
      popularityScore: 79,
      scientificReference:
        'Jones (2007) - Keeping Found Things Found: The Study of Personal Information Management',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🎭 CREATIVITY - Hobbies & Unstructured Play
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Engage in pure play without goals or outcomes for 20 minutes. Unstructured play reduces stress and enhances creative problem-solving.',
      frequency: FREQUENCY_DAILY,
      icon: '🎲',
      iconColor: '#EC4899',
      name: 'Unstructured Play Time',
      popularityScore: 83,
      scientificReference:
        'Brown (2009) - Play: How It Shapes the Brain, Opens the Imagination',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Build something with your hands (LEGO, crafts, woodworking, knitting). Tactile creation reduces anxiety and improves spatial reasoning.',
      frequency: 'weekly',
      icon: '🧱',
      iconColor: '#F97316',
      name: 'Hands-On Building',
      popularityScore: 81,
      scientificReference:
        'Csikszentmihalyi (1990) - Flow: The Psychology of Optimal Experience',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Cook a new recipe without looking at your phone. Cooking engages all senses and provides immediate creative satisfaction.',
      frequency: 'weekly',
      icon: '👨‍🍳',
      iconColor: '#EA580C',
      name: 'Experimental Cooking',
      popularityScore: 84,
      scientificReference:
        'Farmer et al. (2018) - Cooking frequency and dietary quality',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Spend 15 minutes gardening or tending plants. Horticultural therapy reduces cortisol and improves mood within minutes.',
      frequency: FREQUENCY_DAILY,
      icon: '🌱',
      iconColor: '#22C55E',
      name: 'Gardening Therapy',
      popularityScore: 86,
      scientificReference:
        'Van Den Berg & Custers (2011) - Gardening promotes neuroendocrine and affective restoration',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Sing for 10 minutes daily (shower, car, karaoke). Singing releases oxytocin, reduces stress hormones, and improves lung function.',
      frequency: FREQUENCY_DAILY,
      icon: '🎤',
      iconColor: '#A855F7',
      name: 'Daily Singing',
      popularityScore: 82,
      scientificReference:
        'Grape et al. (2003) - Does singing promote well-being?: Effects on wellbeing and physiological variables',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Dance freely for 10 minutes without choreography. Spontaneous movement reduces depression and improves body image.',
      frequency: FREQUENCY_DAILY,
      icon: '💃',
      iconColor: '#F43F5E',
      name: 'Free Dance Session',
      popularityScore: 85,
      scientificReference:
        'Koch et al. (2019) - Effects of dance movement therapy on depression',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Color in an adult coloring book for 20 minutes. Art therapy reduces anxiety comparable to meditation in many studies.',
      frequency: FREQUENCY_DAILY,
      icon: '🖍️',
      iconColor: '#0EA5E9',
      name: 'Coloring Practice',
      popularityScore: 80,
      scientificReference:
        'Curry & Kasser (2005) - Can coloring mandalas reduce anxiety?',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🌿 MINDFULNESS - Environmental & Nature Connection
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Sit quietly and observe birds for 15 minutes. Bird watching reduces stress and increases feelings of connection to nature.',
      frequency: 'weekly',
      icon: '🐦',
      iconColor: '#0D9488',
      name: 'Bird Watching',
      popularityScore: 78,
      scientificReference:
        'Cox et al. (2017) - Doses of neighborhood nature: Benefits for mental health',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Spend 20 minutes near moving water (stream, fountain, ocean). Blue space exposure reduces psychological distress significantly.',
      frequency: 'weekly',
      icon: '💧',
      iconColor: '#0284C7',
      name: 'Blue Space Time',
      popularityScore: 83,
      scientificReference:
        'White et al. (2010) - Blue space exposure and psychological well-being',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Look at the night sky for 10 minutes. Awe experiences from nature improve well-being and increase prosocial behavior.',
      frequency: 'weekly',
      icon: '🌌',
      iconColor: '#1E3A8A',
      name: 'Stargazing',
      popularityScore: 79,
      scientificReference:
        'Piff et al. (2015) - Awe, the small self, and prosocial behavior',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Walk in the rain (with appropriate gear) for 15 minutes. Rain sounds and petrichor have calming effects on the nervous system.',
      frequency: 'weekly',
      icon: '🌧️',
      iconColor: '#64748B',
      name: 'Rain Walking',
      popularityScore: 74,
      scientificReference:
        'Jiang et al. (2018) - Effects of natural sounds on stress recovery',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice cloud watching for 10 minutes. Sky gazing activates the default mode network and promotes creative thinking.',
      frequency: FREQUENCY_DAILY,
      icon: '☁️',
      iconColor: '#94A3B8',
      name: 'Cloud Watching',
      popularityScore: 75,
      scientificReference:
        'Beaty et al. (2016) - Creative cognition and brain network dynamics',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🧘 MINDFULNESS - Somatic & Body Awareness
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Shake your body vigorously for 3-5 minutes (like an animal after stress). TRE/shaking releases stored muscular tension.',
      frequency: FREQUENCY_DAILY,
      icon: '🫨',
      iconColor: '#F97316',
      name: 'Tension Release Shaking',
      popularityScore: 80,
      scientificReference:
        'Berceli (2008) - Tension and Trauma Release Exercises (TRE)',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice self-massage on hands, feet, or face for 5 minutes. Self-massage reduces cortisol and increases parasympathetic activity.',
      frequency: FREQUENCY_DAILY,
      icon: '🙌',
      iconColor: '#EC4899',
      name: 'Self-Massage Ritual',
      popularityScore: 82,
      scientificReference:
        'Field et al. (2005) - Cortisol decreases and serotonin and dopamine increase following massage therapy',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Stretch your jaw, massage temples, and relax facial muscles for 2 minutes. Facial tension correlates with overall stress levels.',
      frequency: FREQUENCY_DAILY,
      icon: '😌',
      iconColor: '#8B5CF6',
      name: 'Facial Relaxation',
      popularityScore: 78,
      scientificReference:
        'Cram (1980) - EMG and the relaxation response: jaw muscle tension and stress',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Stand with bare feet on ground and notice all sensations for 2 minutes. Interoceptive awareness improves emotional regulation.',
      frequency: FREQUENCY_DAILY,
      icon: '🦶',
      iconColor: '#A16207',
      name: 'Foot Grounding',
      popularityScore: 77,
      scientificReference:
        'Farb et al. (2015) - Interoception, contemplative practice, and health',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Roll a tennis ball under your feet for 5 minutes. Plantar fascia massage releases full-body tension through fascial connections.',
      frequency: FREQUENCY_DAILY,
      icon: '🎾',
      iconColor: '#84CC16',
      name: 'Foot Rolling',
      popularityScore: 79,
      scientificReference:
        'Renan-Ordine et al. (2011) - Effects of myofascial release on mechanical sensitivity',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🎯 MINDFULNESS - Purpose & Meaning
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Write your personal mission statement and review it weekly. People with clear purpose live 7+ years longer on average.',
      frequency: 'weekly',
      icon: '🎯',
      iconColor: '#DC2626',
      name: 'Purpose Statement Review',
      popularityScore: 86,
      scientificReference:
        'Hill & Turiano (2014) - Purpose in life and mortality',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Visualize your ideal future self for 10 minutes. Future self-continuity increases long-term decision making and savings behavior.',
      frequency: 'weekly',
      icon: '🔮',
      iconColor: '#7C3AED',
      name: 'Future Self Visualization',
      popularityScore: 83,
      scientificReference:
        'Hershfield (2011) - Future self-continuity: How conceptions of the future self transform decision-making',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Write a letter to yourself to open in 1 year. Prospective reflection increases life satisfaction and sense of progress.',
      frequency: 'weekly',
      icon: '✉️',
      iconColor: '#059669',
      name: 'Letter to Future Self',
      popularityScore: 80,
      scientificReference:
        'Wilson et al. (2005) - Affective forecasting and the durability bias',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice memento mori: reflect briefly on mortality to clarify priorities. Death awareness increases gratitude and meaningful action.',
      frequency: 'weekly',
      icon: '⏳',
      iconColor: '#64748B',
      name: 'Mortality Reflection',
      popularityScore: 76,
      scientificReference:
        'Cozzolino et al. (2004) - Greed, death, and values: Mortality salience and meaning',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Identify one legacy action - something whose impact outlasts you. Legacy motivation increases well-being and generativity.',
      frequency: 'weekly',
      icon: '🏛️',
      iconColor: '#B45309',
      name: 'Legacy Action',
      popularityScore: 78,
      scientificReference:
        'McAdams & de St. Aubin (1992) - Generativity and adult development',
    });

    // ═══════════════════════════════════════════════════════════════
    // 💆 RECOVERY - Self-Care Rituals
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'recovery',
      createdAt: now,
      description:
        'Apply body lotion mindfully after showering. The ritual of self-care increases body acceptance and self-compassion.',
      frequency: FREQUENCY_DAILY,
      icon: '🧴',
      iconColor: '#FBBF24',
      name: 'Mindful Moisturizing',
      popularityScore: 77,
      scientificReference:
        'Neff (2003) - Self-compassion and physical self-care practices',
    });

    await insertWithTracking({
      category: 'recovery',
      createdAt: now,
      description:
        'Take a bath with epsom salts for 20 minutes. Magnesium absorption through skin promotes muscle relaxation and better sleep.',
      frequency: 'weekly',
      icon: '🛁',
      iconColor: '#38BDF8',
      name: 'Epsom Salt Bath',
      popularityScore: 81,
      scientificReference:
        'Proksch et al. (2017) - Percutaneous absorption of magnesium',
    });

    await insertWithTracking({
      category: 'recovery',
      createdAt: now,
      description:
        'Apply a face mask and relax for 15 minutes. Self-care rituals activate the parasympathetic nervous system.',
      frequency: 'weekly',
      icon: '🧖‍♀️',
      iconColor: '#A855F7',
      name: 'Face Mask Ritual',
      popularityScore: 78,
      scientificReference:
        'Gilbert (2009) - The Compassionate Mind: self-soothing systems',
    });

    await insertWithTracking({
      category: 'recovery',
      createdAt: now,
      description:
        'Change into comfortable clothes when arriving home. Clothing transitions help create psychological boundaries between work and rest.',
      frequency: FREQUENCY_DAILY,
      icon: '👕',
      iconColor: '#6366F1',
      name: 'Comfort Clothes Transition',
      popularityScore: 79,
      scientificReference:
        'Adam & Galinsky (2012) - Enclothed cognition: systematic influence of clothes',
    });

    await insertWithTracking({
      category: 'recovery',
      createdAt: now,
      description:
        'Light a candle and sit in candlelight for 10 minutes. Low, warm light reduces cortisol and promotes melatonin production.',
      frequency: FREQUENCY_DAILY,
      icon: '🕯️',
      iconColor: '#F59E0B',
      name: 'Candlelight Relaxation',
      popularityScore: 80,
      scientificReference: 'Cajochen (2007) - Alerting effects of light',
    });

    // ═══════════════════════════════════════════════════════════════
    // 💑 SOCIAL - Relationship Rituals
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Share "highs and lows" of the day with partner/family at dinner. Regular sharing rituals strengthen family bonds.',
      frequency: FREQUENCY_DAILY,
      icon: '🍽️',
      iconColor: '#F97316',
      name: 'Highs and Lows Ritual',
      popularityScore: 88,
      scientificReference:
        'Fiese et al. (2002) - Family routines and rituals: A context for development',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Give a 6-second hug to someone you love. Extended hugs release oxytocin and deepen emotional connection.',
      frequency: FREQUENCY_DAILY,
      icon: '🤗',
      iconColor: '#EC4899',
      name: '6-Second Hug',
      popularityScore: 87,
      scientificReference:
        'Gottman (1999) - The importance of extended physical affection in relationships',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Schedule a weekly date night (no phones, undivided attention). Regular couple rituals are the strongest predictor of relationship longevity.',
      frequency: 'weekly',
      icon: '❤️',
      iconColor: '#DC2626',
      name: 'Weekly Date Night',
      popularityScore: 91,
      scientificReference:
        'Wilcox & Dew (2012) - Date nights and marital satisfaction',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Check in with 3 close friends monthly with a genuine "how are you really doing?" Maintaining close friendships requires intentional effort.',
      frequency: 'weekly',
      icon: '📱',
      iconColor: '#3B82F6',
      name: 'Friend Check-Ins',
      popularityScore: 84,
      scientificReference:
        'Hall (2019) - How many hours does it take to make a friend?',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Write and send a handwritten letter or card monthly. Handwritten correspondence has 7x more emotional impact than digital messages.',
      frequency: 'weekly',
      icon: '💌',
      iconColor: '#F43F5E',
      name: 'Handwritten Letters',
      popularityScore: 79,
      scientificReference:
        'Gino & Flynn (2018) - Undervaluing gratitude: Receivers appreciation of gratitude expressions',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🧠 LEARNING - Cognitive Novelty & Brain Health
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Learn 3 words in a new language daily. Bilingualism delays dementia onset by 4-5 years on average.',
      frequency: FREQUENCY_DAILY,
      icon: '🗣️',
      iconColor: '#059669',
      name: 'Language Word Learning',
      popularityScore: 86,
      scientificReference:
        'Bialystok et al. (2007) - Bilingualism as protection against onset of dementia',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Take a different route to a familiar destination weekly. Novel navigation builds hippocampal gray matter and cognitive reserve.',
      frequency: 'weekly',
      icon: '🗺️',
      iconColor: '#F59E0B',
      name: 'Navigation Novelty',
      popularityScore: 77,
      scientificReference:
        'Maguire et al. (2000) - Navigation-related structural change in the hippocampi of taxi drivers',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Solve one logic puzzle daily (sudoku, chess puzzles, riddles). Regular mental challenges maintain fluid intelligence.',
      frequency: FREQUENCY_DAILY,
      icon: '🧩',
      iconColor: '#7C3AED',
      name: 'Daily Logic Puzzle',
      popularityScore: 84,
      scientificReference:
        'Verghese et al. (2003) - Leisure activities and the risk of dementia',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Memorize one poem, quote, or phone number monthly. Intentional memorization exercises keep memory systems active.',
      frequency: 'weekly',
      icon: '📜',
      iconColor: '#B45309',
      name: 'Memory Challenges',
      popularityScore: 78,
      scientificReference:
        'Nyberg et al. (2003) - Neural correlates of successful memory encoding',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Watch an educational documentary or TED talk weekly on an unfamiliar topic. Novel information stimulates dopamine and curiosity circuits.',
      frequency: 'weekly',
      icon: '🎬',
      iconColor: '#DC2626',
      name: 'Documentary Learning',
      popularityScore: 82,
      scientificReference:
        'Gruber et al. (2014) - States of curiosity modulate learning and memory',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🌟 HEALTH & FITNESS - Sensory & Micro-Habits
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Practice aromatherapy with essential oils for 5 minutes. Certain scents (lavender, peppermint) measurably affect mood and cognition.',
      frequency: FREQUENCY_DAILY,
      icon: '🌸',
      iconColor: '#D946EF',
      name: 'Aromatherapy Practice',
      popularityScore: 79,
      scientificReference:
        'Moss et al. (2003) - Aromas of rosemary and lavender essential oils affect cognition and mood',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Eat one meal in complete silence weekly, focusing only on taste and texture. Silent eating improves digestion and food satisfaction.',
      frequency: 'weekly',
      icon: '🤫',
      iconColor: '#64748B',
      name: 'Silent Eating',
      popularityScore: 76,
      scientificReference:
        'Robinson et al. (2014) - Eating attentively: A systematic review of eating with attention',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Do 10 squats every time you use the bathroom. "Habit stacking" makes exercise automatic and adds up to 50+ squats daily.',
      frequency: FREQUENCY_DAILY,
      icon: '🚽',
      iconColor: '#10B981',
      name: 'Bathroom Squats',
      popularityScore: 83,
      scientificReference:
        'Clear (2018) - Atomic Habits: habit stacking methodology',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Drink a glass of water before every meal. Pre-meal water intake reduces calorie consumption by 75-90 calories per meal.',
      frequency: FREQUENCY_DAILY,
      icon: '🥛',
      iconColor: '#38BDF8',
      name: 'Pre-Meal Water',
      popularityScore: 85,
      scientificReference:
        'Davy et al. (2008) - Water consumption reduces energy intake at a breakfast meal',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Stand and do calf raises while brushing teeth. Two minutes twice daily adds up to 14 minutes of exercise weekly.',
      frequency: FREQUENCY_DAILY,
      icon: '🦵',
      iconColor: '#F97316',
      name: 'Toothbrush Calf Raises',
      popularityScore: 80,
      scientificReference:
        'Clear (2018) - Atomic Habits: Two-minute rule for habit formation',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🌅 MORNING ROUTINE - Unique Morning Habits
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Open curtains and look outside for 30 seconds before checking phone. Prioritizes natural stimulus over digital for circadian alignment.',
      frequency: FREQUENCY_DAILY,
      icon: '🪟',
      iconColor: '#FBBF24',
      name: 'Morning Window Gaze',
      popularityScore: 82,
      scientificReference:
        'Huberman (2021) - Morning light exposure before device use',
    });

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Smile at yourself in the mirror for 1 minute upon waking. Facial feedback hypothesis: smiling triggers positive emotions.',
      frequency: FREQUENCY_DAILY,
      icon: '😊',
      iconColor: '#FBBF24',
      name: 'Morning Mirror Smile',
      popularityScore: 77,
      scientificReference:
        'Kraft & Pressman (2012) - Grin and bear it: Smiling facilitates stress recovery',
    });

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Do 5 minutes of light movement (stretching, walking) immediately after waking. Gentle movement clears adenosine and increases alertness.',
      frequency: FREQUENCY_DAILY,
      icon: '🌅',
      iconColor: '#F97316',
      name: 'Wake-Up Movement',
      popularityScore: 84,
      scientificReference:
        'Kredlow et al. (2015) - Effects of physical activity on sleep',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🌙 SLEEP - Unique Evening Habits
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Write "brain dump" of all thoughts on paper before bed. Externalizing worries reduces sleep onset latency by 15+ minutes.',
      frequency: FREQUENCY_DAILY,
      icon: '🧠',
      iconColor: '#6366F1',
      name: 'Evening Brain Dump',
      popularityScore: 86,
      scientificReference:
        'Scullin et al. (2018) - The effects of bedtime writing on difficulty falling asleep',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Prepare clothes and bag for next day before bed. Reduces morning decision fatigue and creates closure ritual for the day.',
      frequency: FREQUENCY_DAILY,
      icon: '👔',
      iconColor: '#8B5CF6',
      name: 'Next-Day Prep',
      popularityScore: 83,
      scientificReference:
        'Baumeister & Tierney (2011) - Willpower: Rediscovering the Greatest Human Strength',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Wear blue light blocking glasses 2-3 hours before bed. Blocks 90%+ of melatonin-suppressing light from screens.',
      frequency: FREQUENCY_DAILY,
      icon: '👓',
      iconColor: '#F59E0B',
      name: 'Blue Light Blocking',
      popularityScore: 84,
      scientificReference:
        'Shechter et al. (2018) - Blocking nocturnal blue light improves sleep',
    });

    // ═══════════════════════════════════════════════════════════════
    // 💰 FINANCIAL - Additional Unique Habits
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Practice gratitude for 3 things you already own before any purchase. Gratitude reduces materialism and impulsive buying.',
      frequency: FREQUENCY_DAILY,
      icon: '🙏',
      iconColor: '#059669',
      name: 'Pre-Purchase Gratitude',
      popularityScore: 79,
      scientificReference:
        'Lambert et al. (2009) - Gratitude reduces materialism',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Transfer spare change from purchases to savings (round-up savings). Micro-savings add up to hundreds annually without noticing.',
      frequency: FREQUENCY_DAILY,
      icon: '🪙',
      iconColor: '#84CC16',
      name: 'Round-Up Savings',
      popularityScore: 81,
      scientificReference:
        'Thaler (2004) - Save More Tomorrow: Behavioral economics of saving',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Review and appreciate your net worth monthly (even if negative). Financial awareness correlates with better financial decisions.',
      frequency: 'weekly',
      icon: '📊',
      iconColor: '#3B82F6',
      name: 'Net Worth Check',
      popularityScore: 82,
      scientificReference:
        'Fernandes et al. (2014) - Financial literacy, financial education, and downstream financial behaviors',
    });

    return {
      insertedCount: _insertedCount,
      insertedNames,
      message: `${_insertedCount} unique templates inserted, ${_skippedCount} skipped (already exist)`,
      skippedCount: _skippedCount,
      skippedNames,
      success: true,
    };
  },
});
