/**
 * Template Library Functions
 * Phase 3 Feature: Science-backed habit templates
 */

import { v } from 'convex/values';
import { internalMutation, internalQuery, query } from './_generated/server';
import type { MutationCtx } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { PRUNED_TEMPLATE_NAMES } from './templates/curatedRemovals';
import { SCIENCE_ENRICHMENT } from './templates/scienceEnrichment.data';

// Frequency constants
const FREQUENCY_DAILY = 'daily';

type TemplateInsert = {
  benefits?: string[];
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
    | 'social'
    | 'subtraction'
    | 'environmental_design';
  createdAt: number;
  description: string;
  estimatedMinutes?: number;
  frequency: string;
  growthType?: 'simple' | 'average' | 'complex';
  icon: string;
  iconColor: string;
  name: string;
  popularityScore?: number;
  scientificLink?: string;
  scientificReference: string;
  startSmallVersion?: string;
  tips?: string[];
  youtubeLink?: string;
  // Science drill-down (all optional)
  tagline?: string;
  lead?: string;
  evidence?: string;
  cadenceLabel?: string;
  benefitDetails?: {
    icon: string;
    title: string;
    description: string;
  }[];
  timeline?: {
    when: string;
    title: string;
    description: string;
    peak?: boolean;
  }[];
  howToStart?: string[];
  sources?: {
    authors: string;
    title: string;
    journal: string;
    year: string;
    link?: string;
  }[];
};

const _insertTemplateIfMissing = async (
  ctx: MutationCtx,
  template: TemplateInsert
) => {
  if (PRUNED_TEMPLATE_NAMES.has(normalizeTemplateName(template.name))) return;

  const existing = await ctx.db
    .query('templates')
    .filter((q) => q.eq(q.field('name'), template.name))
    .first();

  if (existing) return;

  // Fresh installs pick up authored science drill-down content here; existing
  // installs get it via templates/patchScienceEnrichment. Inline fields on the
  // template win, so a hand-tuned seed entry is never overwritten.
  const authored = SCIENCE_ENRICHMENT[template.name];
  await ctx.db.insert('templates', authored ? { ...authored, ...template } : template);
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
        v.literal('breathing'),
        v.literal('environmental_design'),
        v.literal('subtraction')
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
      if (PRUNED_TEMPLATE_NAMES.has(normalizeTemplateName(template.name))) {
        _skippedCount++;
        return false;
      }

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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🧘',
      iconColor: '#10B981',
      growthType: 'average',
      name: '5-Minute Meditation',
      startSmallVersion: 'Take one slow, mindful breath.',
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
      tagline: 'A short morning sit to start the day clear and calm.',
      lead: 'Five quiet minutes after you wake nudges your nervous system out of reactivity and into focus — the same attention training that makes the rest of the day feel less scattered and more deliberate.',
      evidence:
        'A 2014 JAMA Internal Medicine review of 47 trials found mindfulness meditation produces small-to-moderate reductions in anxiety, depression, and stress.',
      cadenceLabel: 'Daily · 5 min · after waking',
      benefitDetails: [
        {
          icon: 'wave',
          title: 'Calmer mind',
          description: 'Consistent practice lowers everyday stress and anxiety.',
        },
        {
          icon: 'target',
          title: 'Sharper focus',
          description: 'Gains in attention and working memory through the day.',
        },
        {
          icon: 'leaf',
          title: 'Steadier mood',
          description: 'Less reactivity and better emotional regulation.',
        },
        {
          icon: 'moon',
          title: 'Better sleep',
          description: 'Lower baseline arousal makes winding down easier at night.',
        },
      ],
      timeline: [
        {
          when: 'First sit',
          title: 'Body settles',
          description:
            'Breathing slows and the relaxation response begins within minutes.',
        },
        {
          when: '~2 weeks',
          title: 'Easier to focus',
          description: 'Returning to the breath starts to feel more natural.',
        },
        {
          when: '~6 weeks',
          title: 'Less reactive',
          description: 'A noticeable dip in day-to-day stress and rumination.',
        },
        {
          when: '~66 days',
          title: 'Runs on autopilot',
          description: 'The median time for a daily behavior to feel automatic.',
          peak: true,
        },
      ],
      howToStart: [
        'Sit somewhere quiet right after you wake.',
        'Five minutes, eyes closed — just follow your breath.',
        'Same time each morning. Consistency beats length.',
      ],
      sources: [
        {
          authors: 'Goyal M, et al.',
          title:
            'Meditation programs for psychological stress and well-being',
          journal: 'JAMA Internal Medicine',
          year: '2014',
          link: 'https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/1809754',
        },
        {
          authors: 'Tang YY, Hölzel BK, Posner MI',
          title: 'The neuroscience of mindfulness meditation',
          journal: 'Nature Reviews Neuroscience',
          year: '2015',
          link: 'https://pubmed.ncbi.nlm.nih.gov/25783612/',
        },
        {
          authors: 'Lally P, et al.',
          title: 'How are habits formed: modelling habit formation',
          journal: 'European Journal of Social Psychology',
          year: '2010',
          link: 'https://pubmed.ncbi.nlm.nih.gov/20397865/',
        },
      ],
    });

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Write 3 pages of stream-of-consciousness thoughts first thing. Clears mental clutter and boosts creativity.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '✍️',
      iconColor: '#3B82F6',
      growthType: 'average',
      name: 'Morning Pages',
      startSmallVersion: 'Write a single sentence on the page.',
      popularityScore: 88,
      scientificReference:
        "Cameron (1992) - The Artist's Way creative recovery program",
    });

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Drink a full glass of water immediately after waking. Rehydrates body and kickstarts metabolism.',
      estimatedMinutes: 1,
      frequency: FREQUENCY_DAILY,
      icon: '💧',
      iconColor: '#60A5FA',
      growthType: 'simple',
      name: 'Hydration First',
      startSmallVersion: 'Take one sip of water before anything else.',
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
      estimatedMinutes: 30,
      frequency: FREQUENCY_DAILY,
      icon: '🌅',
      iconColor: '#F59E0B',
      growthType: 'simple',
      name: 'Sunrise Viewing',
      startSmallVersion: 'Step outside and face the sun for 30 seconds.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🌞',
      iconColor: '#F59E0B',
      growthType: 'average',
      name: 'Sun Salutation Flow',
      startSmallVersion: 'Do one sun salutation.',
      popularityScore: 78,
      scientificReference:
        'Cramer et al. (2016) - Yoga for chronic low back pain',
    });

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Take a 2-3 minute cold shower. Builds resilience, improves circulation, and boosts alertness.',
      estimatedMinutes: 2,
      frequency: FREQUENCY_DAILY,
      icon: '❄️',
      iconColor: '#3B82F6',
      growthType: 'complex',
      name: 'Cold Shower',
      startSmallVersion: 'End your shower with 10 seconds of cold water.',
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
      estimatedMinutes: 2,
      frequency: FREQUENCY_DAILY,
      icon: '🛏️',
      iconColor: '#8B5CF6',
      growthType: 'simple',
      name: 'Make Your Bed',
      startSmallVersion: 'Pull up the comforter and smooth it once.',
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
      estimatedMinutes: 7,
      frequency: FREQUENCY_DAILY,
      icon: '🏃',
      iconColor: '#EF4444',
      growthType: 'complex',
      name: '7-Minute Workout',
      startSmallVersion: 'Do two push-ups (or two squats).',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '👟',
      iconColor: '#8B5CF6',
      growthType: 'complex',
      name: '10,000 Steps',
      startSmallVersion: 'Walk to the end of the block and back.',
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
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '💪',
      iconColor: '#059669',
      growthType: 'complex',
      name: 'Strength Training',
      startSmallVersion: 'Do 5 push-ups against the wall.',
      popularityScore: 91,
      scientificReference:
        'Westcott (2012) - Resistance training health benefits',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Daily stretching for flexibility and injury prevention. Just 10 minutes improves range of motion.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '🤸',
      iconColor: '#EC4899',
      growthType: 'average',
      name: 'Stretching Routine',
      startSmallVersion: 'Reach for your toes once.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🚫',
      iconColor: '#DC2626',
      growthType: 'complex',
      name: 'No Added Sugar',
      startSmallVersion: 'Skip the sugar in your next drink.',
      popularityScore: 89,
      scientificReference:
        'Yang et al. (2014) - Added sugar intake and cardiovascular disease',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Prepare healthy meals for the week ahead. Saves time, reduces stress, and ensures nutritious eating.',
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '🥗',
      iconColor: '#059669',
      growthType: 'complex',
      name: 'Meal Prepping',
      startSmallVersion: 'Wash one piece of produce.',
      popularityScore: 83,
      scientificReference:
        'Wolfson & Bleich (2015) - Is cooking at home associated with better diet quality?',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Practice yoga for 20-30 minutes. Improves flexibility, reduces stress, and enhances mental clarity.',
      estimatedMinutes: 20,
      frequency: FREQUENCY_DAILY,
      icon: '🧘‍♀️',
      iconColor: '#EC4899',
      growthType: 'average',
      name: 'Daily Yoga Practice',
      startSmallVersion: 'Hold downward dog for one breath.',
      popularityScore: 87,
      scientificReference:
        'Cramer et al. (2014) - Yoga for anxiety and depression',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Consume 25-35g of fiber daily from whole foods. Supports gut health, digestion, and metabolic function.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🌾',
      iconColor: '#16A34A',
      growthType: 'average',
      name: 'High Fiber Diet',
      startSmallVersion: 'Add one piece of fruit to your next meal.',
      popularityScore: 81,
      scientificReference:
        'McKeown et al. (2009) - Dietary fiber intake and mortality',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Track daily water intake to reach 8-10 glasses. Essential for hydration, cognitive function, and energy.',
      estimatedMinutes: 1,
      frequency: FREQUENCY_DAILY,
      icon: '🥤',
      iconColor: '#0284C7',
      growthType: 'average',
      name: 'Hydration Tracking',
      startSmallVersion: 'Log one glass of water.',
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
      estimatedMinutes: 90,
      frequency: FREQUENCY_DAILY,
      icon: '🧠',
      iconColor: '#7C3AED',
      growthType: 'complex',
      name: 'Deep Work Session',
      startSmallVersion: 'Open the doc and write one sentence.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '⏱️',
      iconColor: '#F97316',
      growthType: 'average',
      name: 'Pomodoro Technique',
      startSmallVersion: 'Set a 5-minute timer and start.',
      popularityScore: 93,
      scientificReference: 'Cirillo (2006) - The Pomodoro Technique',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Identify and complete your single most important task before noon. Ensures progress on key priorities.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🎯',
      iconColor: '#0EA5E9',
      growthType: 'simple',
      name: 'MIT - Most Important Task',
      startSmallVersion: 'Write down today\'s one most important task.',
      popularityScore: 90,
      scientificReference:
        'Tracy (2007) - Eat That Frog! productivity principle',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Process all emails to zero daily. Reduces mental load and prevents email overwhelm.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '📧',
      iconColor: '#06B6D4',
      growthType: 'average',
      name: 'Inbox Zero',
      startSmallVersion: 'Archive or delete one email.',
      popularityScore: 84,
      scientificReference: 'Mann (2007) - Inbox Zero email management system',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        "Plan tomorrow's top 3 tasks before bed. Reduces morning decision fatigue and anxiety.",
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '📝',
      iconColor: '#6366F1',
      growthType: 'simple',
      name: 'Evening Planning',
      startSmallVersion: 'Write tomorrow\'s first task on a sticky note.',
      popularityScore: 87,
      scientificReference: 'Baumeister (2011) - Decision fatigue research',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Block specific time periods for focused work without interruptions. Improves productivity and work quality.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '📅',
      iconColor: '#059669',
      growthType: 'average',
      name: 'Time Blocking',
      startSmallVersion: 'Block 15 minutes on your calendar for one task.',
      popularityScore: 90,
      scientificReference: 'Cal Newport (2016) - Deep Work methodology',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Spend 30 minutes daily learning something new. Builds knowledge and keeps your brain sharp.',
      estimatedMinutes: 30,
      frequency: FREQUENCY_DAILY,
      icon: '📚',
      iconColor: '#7C3AED',
      growthType: 'average',
      name: 'Daily Learning',
      startSmallVersion: 'Read one paragraph of something new.',
      popularityScore: 84,
      scientificReference:
        'Dweck (2006) - Mindset: The New Psychology of Success',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Review and organize your workspace. Reduces mental clutter and improves focus and efficiency.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '🧹',
      iconColor: '#DC2626',
      growthType: 'average',
      name: 'Weekly Desk Cleanup',
      startSmallVersion: 'Throw away one piece of trash from your desk.',
      popularityScore: 79,
      scientificReference:
        'McMains & Kastner (2011) - Interactions of top-down and bottom-up mechanisms in human visual cortex',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Take regular 5-minute breaks every hour during work. Prevents burnout and maintains sustained focus.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '⏰',
      iconColor: '#F59E0B',
      growthType: 'simple',
      name: 'Work Breaks',
      startSmallVersion: 'Stand up and stretch for 30 seconds.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🙏',
      iconColor: '#F59E0B',
      growthType: 'simple',
      name: 'Gratitude Journaling',
      startSmallVersion: 'Name one thing you\'re grateful for.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🌬️',
      iconColor: '#14B8A6',
      growthType: 'average',
      name: 'Breathwork Practice',
      startSmallVersion: 'Take one slow, deep breath.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🌙',
      iconColor: '#6366F1',
      growthType: 'simple',
      name: 'Evening Reflection',
      startSmallVersion: 'Name one thing that went well today.',
      popularityScore: 88,
      scientificReference: 'Kolb (1984) - Experiential learning and reflection',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'One hour completely screen-free before bed. Improves sleep quality and mental restoration.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '📵',
      iconColor: '#10B981',
      growthType: 'complex',
      name: 'Digital Detox Hour',
      startSmallVersion: 'Put your phone in another room for 60 seconds.',
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
      estimatedMinutes: 20,
      frequency: FREQUENCY_DAILY,
      icon: '🌲',
      iconColor: '#059669',
      growthType: 'average',
      name: 'Walking in Nature',
      startSmallVersion: 'Step outside for one full minute.',
      popularityScore: 93,
      scientificReference:
        'Hansen et al. (2017) - Shinrin-yoku (forest bathing) benefits',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice progressive muscle relaxation for 10 minutes. Releases physical tension and reduces anxiety.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '💆',
      iconColor: '#EC4899',
      growthType: 'average',
      name: 'Progressive Muscle Relaxation',
      startSmallVersion: 'Clench and release your fists once.',
      popularityScore: 82,
      scientificReference: 'Jacobson (1929) - Progressive relaxation technique',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice loving-kindness meditation. Cultivates compassion for yourself and others, improving relationships.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '❤️',
      iconColor: '#EF4444',
      growthType: 'average',
      name: 'Loving-Kindness Meditation',
      startSmallVersion: 'Silently wish one person well.',
      popularityScore: 81,
      scientificReference:
        'Fredrickson et al. (2008) - Open hearts build lives: positive emotions',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Keep a daily journal of positive experiences and accomplishments. Builds optimism and resilience.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '✨',
      iconColor: '#F59E0B',
      growthType: 'simple',
      name: 'Positive Journaling',
      startSmallVersion: 'Write one good thing from today.',
      popularityScore: 86,
      scientificReference:
        'Lyubomirsky (2008) - The How of Happiness: A Scientific Approach',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice mindful eating - eat slowly and pay attention to flavors, textures, and satisfaction cues.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🍽️',
      iconColor: '#059669',
      growthType: 'average',
      name: 'Mindful Eating',
      startSmallVersion: 'Take one bite slowly and notice the taste.',
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
      estimatedMinutes: 2,
      frequency: FREQUENCY_DAILY,
      icon: '☀️',
      iconColor: '#F59E0B',
      growthType: 'simple',
      name: 'Morning Sunlight Viewing',
      startSmallVersion: 'Step outside and face the sun for 30 seconds.',
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
      estimatedMinutes: 90,
      frequency: FREQUENCY_DAILY,
      icon: '⏰',
      iconColor: '#B45309',
      growthType: 'average',
      name: 'Delay Caffeine 90 Minutes',
      startSmallVersion: 'Drink one glass of water before your coffee.',
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
      estimatedMinutes: 45,
      frequency: 'weekly',
      icon: '🚴',
      iconColor: '#2563EB',
      growthType: 'complex',
      name: 'Zone 2 Cardio Training',
      startSmallVersion: 'Walk briskly for 5 minutes.',
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
      estimatedMinutes: 11,
      frequency: 'weekly',
      icon: '🧊',
      iconColor: '#38BDF8',
      growthType: 'complex',
      name: 'Deliberate Cold Exposure',
      startSmallVersion: 'End your shower with 10 seconds of cold.',
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
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '🛌',
      iconColor: '#7DD3FC',
      growthType: 'average',
      name: 'NSDR Practice',
      startSmallVersion: 'Lie down and breathe slowly for 60 seconds.',
      popularityScore: 89,
      scientificLink:
        'https://hubermanlab.com/using-nsdr-to-improve-learning-skill-memory/',
      scientificReference:
        'Huberman Lab (2021) - Using NSDR to improve learning and sleep',
      youtubeLink: 'https://www.youtube.com/watch?v=KHIbgSN2qAU',
    });

    await insertWithTracking({
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Perform 1-3 physiological sighs when stressed. Rapidly lowers autonomic arousal and steadies mood.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '😮‍💨',
      iconColor: '#34D399',
      growthType: 'simple',
      name: 'Physiological Sigh',
      startSmallVersion: 'Do one double-inhale, long-exhale sigh.',
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
      estimatedMinutes: 180,
      frequency: FREQUENCY_DAILY,
      icon: '💡',
      iconColor: '#FDE047',
      growthType: 'simple',
      name: 'Evening Light Dimming',
      startSmallVersion: 'Turn off one overhead light.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🌡️',
      iconColor: '#0EA5E9',
      growthType: 'simple',
      name: 'Cool Sleep Temperature',
      startSmallVersion: 'Crack the window before bed.',
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
      estimatedMinutes: 30,
      frequency: FREQUENCY_DAILY,
      icon: '🍳',
      iconColor: '#F97316',
      growthType: 'average',
      name: 'Morning Protein Protocol',
      startSmallVersion: 'Eat one boiled egg.',
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
      estimatedMinutes: 720,
      frequency: FREQUENCY_DAILY,
      icon: '🍽️',
      iconColor: '#10B981',
      growthType: 'complex',
      name: 'Time-Restricted Eating',
      startSmallVersion: 'Note your first and last bite times today.',
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
      estimatedMinutes: 960,
      frequency: FREQUENCY_DAILY,
      icon: '⏰',
      iconColor: '#7C3AED',
      growthType: 'complex',
      name: '16:8 Intermittent Fasting',
      startSmallVersion: 'Push breakfast back by 30 minutes.',
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
      estimatedMinutes: 20,
      frequency: 'weekly',
      icon: '🧖',
      iconColor: '#DC2626',
      growthType: 'complex',
      name: 'Sauna Therapy',
      startSmallVersion: 'Sit in a steamy bathroom for 2 minutes.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '😴',
      iconColor: '#1E40AF',
      growthType: 'average',
      name: 'Sleep Optimization',
      startSmallVersion: 'Set tonight\'s bedtime alarm.',
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
      estimatedMinutes: 120,
      frequency: FREQUENCY_DAILY,
      icon: '🌙',
      iconColor: '#0F172A',
      growthType: 'simple',
      name: 'Darkness Before Sleep',
      startSmallVersion: 'Close the curtains 60 minutes before bed.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🌡️',
      iconColor: '#06B6D4',
      growthType: 'simple',
      name: 'Optimal Sleep Temperature',
      startSmallVersion: 'Lower the thermostat one degree.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '📞',
      iconColor: '#8B5CF6',
      growthType: 'average',
      name: 'Daily Social Call',
      startSmallVersion: 'Send one "thinking of you" text.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '💬',
      iconColor: '#06B6D4',
      growthType: 'simple',
      name: 'Reach Out Daily',
      startSmallVersion: 'Send one "thinking of you" text to a friend.',
      popularityScore: 84,
      scientificReference:
        'Gable et al. (2004) - The benefits of supportive relationships',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Spend quality time with your partner without distractions. Strengthens emotional bonds and intimacy.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '💑',
      iconColor: '#EC4899',
      growthType: 'average',
      name: 'Quality Partner Time',
      startSmallVersion: 'Ask your partner, "how was your day?" with phone down.',
      popularityScore: 86,
      scientificReference:
        'Gottman (1999) - The Seven Principles for Making Marriage Work',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Write a thank-you note or express gratitude to someone. Builds stronger relationships and increases happiness.',
      estimatedMinutes: 3,
      frequency: 'weekly',
      icon: '🙏',
      iconColor: '#F59E0B',
      growthType: 'simple',
      name: 'Express Gratitude',
      startSmallVersion: 'Tell one person "thank you" out loud.',
      popularityScore: 83,
      scientificReference:
        'Algoe et al. (2010) - Gratitude and relationship satisfaction',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Volunteer or help someone in need. Acts of service improve well-being and create social connections.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '🤝',
      iconColor: '#10B981',
      growthType: 'average',
      name: 'Acts of Service',
      startSmallVersion: 'Hold the door for someone today.',
      popularityScore: 81,
      scientificReference: 'Post (2005) - Altruism, happiness, and health',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Join a club or group activity. Regular social interaction prevents loneliness and supports mental health.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '👥',
      iconColor: '#6366F1',
      growthType: 'complex',
      name: 'Group Activities',
      startSmallVersion: 'Reply yes to one invitation.',
      popularityScore: 79,
      scientificReference: 'Hawkley & Cacioppo (2010) - Loneliness and health',
    });

    // Sleep Templates
    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Go to bed at the same time every night. Consistent sleep schedule improves sleep quality and circadian rhythm.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🛏️',
      iconColor: '#1E3A8A',
      growthType: 'average',
      name: 'Consistent Bedtime',
      startSmallVersion: 'Set tonight\'s bedtime alarm.',
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
      estimatedMinutes: 60,
      frequency: FREQUENCY_DAILY,
      icon: '📱',
      iconColor: '#DC2626',
      growthType: 'average',
      name: 'No Screens Before Bed',
      startSmallVersion: 'Put your phone in another room 5 minutes before bed.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '😴',
      iconColor: '#6366F1',
      growthType: 'simple',
      name: '4-7-8 Breathing',
      startSmallVersion: 'Do one round of 4-7-8 breathing.',
      popularityScore: 86,
      scientificReference:
        'Weil (2015) - Breathing: The Master Key to Self-Healing',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Limit caffeine after 2 PM. Caffeine has a 5-6 hour half-life that can disrupt sleep architecture.',
      estimatedMinutes: 360,
      frequency: FREQUENCY_DAILY,
      icon: '☕',
      iconColor: '#92400E',
      growthType: 'average',
      name: 'No Afternoon Caffeine',
      startSmallVersion: 'Skip your next afternoon coffee.',
      popularityScore: 88,
      scientificReference:
        'Drake et al. (2013) - Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Use blackout curtains for complete darkness. Light exposure during sleep reduces sleep quality and REM.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🌑',
      iconColor: '#0F172A',
      growthType: 'simple',
      name: 'Sleep in Complete Darkness',
      startSmallVersion: 'Pull the curtains fully closed tonight.',
      popularityScore: 84,
      scientificReference:
        'Gooley et al. (2011) - Exposure to room light before bedtime',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Take a warm bath 90 minutes before bed. Increases core body temperature drop that signals sleep time.',
      estimatedMinutes: 90,
      frequency: FREQUENCY_DAILY,
      icon: '🛁',
      iconColor: '#3B82F6',
      growthType: 'average',
      name: 'Pre-Sleep Warm Bath',
      startSmallVersion: 'Run hot water over your hands and face.',
      popularityScore: 81,
      scientificReference:
        'Harding et al. (2019) - Systematic review of warm baths and sleep quality',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Sleep 7-9 hours per night. Adequate sleep is essential for cognitive function, health, and longevity.',
      estimatedMinutes: 540,
      frequency: FREQUENCY_DAILY,
      icon: '💤',
      iconColor: '#4338CA',
      growthType: 'average',
      name: '7-9 Hours Sleep',
      startSmallVersion: 'Set tonight\'s bedtime alarm.',
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
      estimatedMinutes: 240,
      frequency: FREQUENCY_DAILY,
      icon: '🚫',
      iconColor: '#991B1B',
      growthType: 'average',
      name: 'No Evening Alcohol',
      startSmallVersion: 'Pour yourself sparkling water tonight.',
      popularityScore: 78,
      scientificReference: 'Ebrahim et al. (2013) - Alcohol and sleep review',
    });

    // Learning Templates
    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Practice spaced repetition for 20 minutes. Review material at increasing intervals for long-term retention.',
      estimatedMinutes: 20,
      frequency: FREQUENCY_DAILY,
      icon: '🔄',
      iconColor: '#7C3AED',
      growthType: 'average',
      name: 'Spaced Repetition',
      startSmallVersion: 'Review one flashcard.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🌍',
      iconColor: '#059669',
      growthType: 'average',
      name: 'Daily Language Practice',
      startSmallVersion: 'Look up one new word.',
      popularityScore: 87,
      scientificReference:
        'Nation (2001) - Learning Vocabulary in Another Language',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Teach someone what you learned today. Teaching reinforces understanding and reveals knowledge gaps.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '👨‍🏫',
      iconColor: '#DC2626',
      growthType: 'average',
      name: 'Feynman Technique',
      startSmallVersion: 'Explain one idea out loud to yourself.',
      popularityScore: 89,
      scientificReference: 'Chi et al. (1989) - Self-explanations and learning',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Practice active recall for 15 minutes. Test yourself without looking at notes to strengthen memory.',
      estimatedMinutes: 15,
      frequency: FREQUENCY_DAILY,
      icon: '🧩',
      iconColor: '#2563EB',
      growthType: 'average',
      name: 'Active Recall',
      startSmallVersion: 'Close the book and recall one fact.',
      popularityScore: 93,
      scientificReference:
        'Roediger & Karpicke (2006) - Test-enhanced learning',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Read for 30 minutes daily. Regular reading improves vocabulary, comprehension, and cognitive function.',
      estimatedMinutes: 30,
      frequency: FREQUENCY_DAILY,
      icon: '📖',
      iconColor: '#B45309',
      growthType: 'average',
      name: 'Daily Reading',
      startSmallVersion: 'Read one page.',
      popularityScore: 94,
      scientificReference: 'Krashen (2004) - The Power of Reading',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Listen to educational podcasts or audiobooks during commute. Transforms dead time into learning opportunities.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🎧',
      iconColor: '#DC2626',
      growthType: 'simple',
      name: 'Audio Learning',
      startSmallVersion: 'Listen to a podcast for 60 seconds.',
      popularityScore: 85,
      scientificReference:
        'Rogowsky et al. (2016) - Matching learning style to instructional method',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Practice a musical instrument for 20 minutes. Music training enhances cognitive abilities and neuroplasticity.',
      estimatedMinutes: 20,
      frequency: FREQUENCY_DAILY,
      icon: '🎵',
      iconColor: '#EC4899',
      growthType: 'complex',
      name: 'Music Practice',
      startSmallVersion: 'Play one scale.',
      popularityScore: 82,
      scientificReference:
        'Herholz & Zatorre (2012) - Musical training as framework for brain plasticity',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Take handwritten notes while learning. Writing by hand improves retention and comprehension.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '✍️',
      iconColor: '#0EA5E9',
      growthType: 'simple',
      name: 'Handwritten Notes',
      startSmallVersion: 'Write one sentence by hand.',
      popularityScore: 88,
      scientificReference:
        'Mueller & Oppenheimer (2014) - The Pen Is Mightier Than the Keyboard',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Watch one educational video daily. Visual learning enhances understanding of complex concepts.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '📺',
      iconColor: '#F59E0B',
      growthType: 'simple',
      name: 'Educational Videos',
      startSmallVersion: 'Watch a 60-second educational clip.',
      popularityScore: 84,
      scientificReference: 'Mayer (2009) - Multimedia Learning principles',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Join a study group or accountability circle. Social learning enhances motivation and understanding.',
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '👥',
      iconColor: '#8B5CF6',
      growthType: 'complex',
      name: 'Study Groups',
      startSmallVersion: 'Send one "want to study?" message.',
      popularityScore: 80,
      scientificReference: 'Slavin (1996) - Research on cooperative learning',
    });

    // Financial Templates
    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Track every expense daily. Awareness of spending patterns is the first step to financial control.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '💰',
      iconColor: '#059669',
      growthType: 'average',
      name: 'Expense Tracking',
      startSmallVersion: 'Log one expense from today.',
      popularityScore: 90,
      scientificReference:
        'Thaler & Sunstein (2008) - Nudge: Improving Decisions About Health, Wealth, and Happiness',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Save 10% of income automatically. Pay yourself first before spending on anything else.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🏦',
      iconColor: '#2563EB',
      growthType: 'simple',
      name: 'Automatic Savings',
      startSmallVersion: 'Move $1 to savings.',
      popularityScore: 93,
      scientificReference: 'Bach (2004) - The Automatic Millionaire',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Review budget weekly. Regular financial check-ins prevent overspending and build awareness.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '📊',
      iconColor: '#DC2626',
      growthType: 'average',
      name: 'Weekly Budget Review',
      startSmallVersion: 'Open your bank app and look once.',
      popularityScore: 86,
      scientificReference: 'Ramsey (2013) - The Total Money Makeover',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Invest in index funds regularly. Dollar-cost averaging builds wealth over time through compound growth.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '📈',
      iconColor: '#059669',
      growthType: 'average',
      name: 'Regular Investing',
      startSmallVersion: 'Invest $1 today.',
      popularityScore: 88,
      scientificReference:
        'Bogle (2007) - The Little Book of Common Sense Investing',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Use the 24-hour rule for purchases over $50. Delayed gratification reduces impulse buying.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '⏰',
      iconColor: '#F59E0B',
      growthType: 'average',
      name: '24-Hour Purchase Rule',
      startSmallVersion: 'Wait 60 seconds before clicking buy.',
      popularityScore: 84,
      scientificReference:
        'Mischel (2014) - The Marshmallow Test: Mastering Self-Control',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Pack lunch instead of eating out. Home-prepared meals save thousands annually and improve health.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🍱',
      iconColor: '#16A34A',
      growthType: 'average',
      name: 'Bring Lunch',
      startSmallVersion: 'Make one item for tomorrow\'s lunch.',
      popularityScore: 82,
      scientificReference: 'Ramsey (2013) - Small expenses compound over time',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Cancel one unused subscription monthly. Eliminate recurring charges that provide no value.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '✂️',
      iconColor: '#DC2626',
      growthType: 'simple',
      name: 'Subscription Audit',
      startSmallVersion: 'Open one subscription and check the price.',
      popularityScore: 80,
      scientificReference:
        'Ariely (2008) - Predictably Irrational subscription traps',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Read financial news or books for 15 minutes. Financial literacy is key to building and protecting wealth.',
      estimatedMinutes: 15,
      frequency: FREQUENCY_DAILY,
      icon: '📰',
      iconColor: '#0EA5E9',
      growthType: 'average',
      name: 'Financial Education',
      startSmallVersion: 'Read one paragraph about money.',
      popularityScore: 85,
      scientificReference:
        'Lusardi & Mitchell (2014) - The Economic Importance of Financial Literacy',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Negotiate one bill or expense. Small negotiations compound into significant annual savings.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '💬',
      iconColor: '#7C3AED',
      growthType: 'complex',
      name: 'Negotiate Bills',
      startSmallVersion: 'Open one bill and find the customer service number.',
      popularityScore: 78,
      scientificReference: 'Ramsey (2013) - The power of negotiation',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Contribute to retirement account. Maximize employer match and tax-advantaged growth.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '🎯',
      iconColor: '#059669',
      growthType: 'simple',
      name: 'Retirement Contributions',
      startSmallVersion: 'Move $1 to your retirement account.',
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
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '✍️',
      iconColor: '#8B5CF6',
      growthType: 'average',
      name: 'Morning Freewriting',
      startSmallVersion: 'Write one sentence as fast as you can.',
      popularityScore: 87,
      scientificReference: 'Elbow (1998) - Writing Without Teachers',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Sketch or doodle for 15 minutes. Visual expression enhances creative problem-solving.',
      estimatedMinutes: 15,
      frequency: FREQUENCY_DAILY,
      icon: '🎨',
      iconColor: '#EC4899',
      growthType: 'average',
      name: 'Daily Sketching',
      startSmallVersion: 'Doodle for 30 seconds.',
      popularityScore: 83,
      scientificReference: 'Brown (2014) - The Doodle Revolution',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Brainstorm 10 ideas on any topic. Idea generation is a muscle that strengthens with practice.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '💡',
      iconColor: '#F59E0B',
      growthType: 'average',
      name: 'Idea Generation',
      startSmallVersion: 'Write down one idea.',
      popularityScore: 89,
      scientificReference: 'Altucher (2014) - Becoming an Idea Machine',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Take photos during daily walk. Photography trains observation and perspective-taking.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '📸',
      iconColor: '#0EA5E9',
      growthType: 'simple',
      name: 'Daily Photography',
      startSmallVersion: 'Take one photo of something around you.',
      popularityScore: 81,
      scientificReference:
        'Csikszentmihalyi (1996) - Creativity: Flow and the Psychology of Discovery',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Write one poem or short story. Creative writing develops imagination and emotional intelligence.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '📝',
      iconColor: '#7C3AED',
      growthType: 'complex',
      name: 'Creative Writing',
      startSmallVersion: 'Write one sentence of fiction.',
      popularityScore: 80,
      scientificReference: 'Kaufman & Gregoire (2015) - Wired to Create',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Practice divergent thinking exercises. Generate multiple solutions to problems to enhance creativity.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🧠',
      iconColor: '#06B6D4',
      growthType: 'average',
      name: 'Divergent Thinking',
      startSmallVersion: 'List two different uses for one object.',
      popularityScore: 84,
      scientificReference: 'Guilford (1967) - The Nature of Human Intelligence',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Combine two unrelated ideas daily. Cross-pollination of concepts sparks innovation.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🔀',
      iconColor: '#10B981',
      growthType: 'simple',
      name: 'Idea Mashup',
      startSmallVersion: 'Combine two random words into a phrase.',
      popularityScore: 82,
      scientificReference: 'Johansson (2004) - The Medici Effect',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Visit a museum or art gallery. Exposure to art stimulates creative thinking and inspiration.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '🖼️',
      iconColor: '#DC2626',
      growthType: 'simple',
      name: 'Art Appreciation',
      startSmallVersion: 'Open one art image and look for 30 seconds.',
      popularityScore: 77,
      scientificReference:
        'Leder et al. (2004) - A model of aesthetic appreciation',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Learn a new creative skill monthly. Novel experiences build cognitive flexibility.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '🎭',
      iconColor: '#F97316',
      growthType: 'complex',
      name: 'Skill Exploration',
      startSmallVersion: 'Watch a 60-second tutorial on a new skill.',
      popularityScore: 85,
      scientificReference: 'Carson (2010) - Your Creative Brain',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Take a different route home. Changing routines disrupts autopilot and enhances awareness.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '🚶‍♀️',
      iconColor: '#6366F1',
      growthType: 'simple',
      name: 'Break Routines',
      startSmallVersion: 'Take one different turn on your next walk.',
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
export const getUsageStats = internalQuery({
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
      if (PRUNED_TEMPLATE_NAMES.has(normalizeTemplateName(template.name))) {
        _skippedCount++;
        return false;
      }

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
      estimatedMinutes: 2,
      frequency: FREQUENCY_DAILY,
      icon: '🧍',
      iconColor: '#10B981',
      growthType: 'simple',
      name: 'Standing Every Hour',
      startSmallVersion: 'Stand up and stretch for 10 seconds.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🪑',
      iconColor: '#6366F1',
      growthType: 'simple',
      name: 'Posture Check',
      startSmallVersion: 'Roll your shoulders back once.',
      popularityScore: 84,
      scientificReference:
        'Carney et al. (2010) - Power posing: Brief nonverbal displays affect neuroendocrine levels',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Walk barefoot on grass, sand, or earth for 10-20 minutes. Grounding reduces inflammation and improves sleep quality.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '🦶',
      iconColor: '#84CC16',
      growthType: 'average',
      name: 'Barefoot Grounding',
      startSmallVersion: 'Stand barefoot on grass for 30 seconds.',
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
      estimatedMinutes: 1,
      frequency: FREQUENCY_DAILY,
      icon: '👁️',
      iconColor: '#0EA5E9',
      growthType: 'simple',
      name: '20-20-20 Eye Rule',
      startSmallVersion: 'Look out the window for 20 seconds.',
      popularityScore: 93,
      scientificReference:
        'American Optometric Association - Digital eye strain prevention guidelines',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Practice breathing through your nose throughout the day. Nasal breathing filters air, produces nitric oxide, and activates the parasympathetic nervous system.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '👃',
      iconColor: '#14B8A6',
      growthType: 'average',
      name: 'Nasal Breathing',
      startSmallVersion: 'Take three breaths through your nose.',
      popularityScore: 88,
      scientificReference:
        'Nestor (2020) - Breath: The New Science of a Lost Art',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Train at high intensity 1-2x weekly to improve VO2 max. VO2 max is the single strongest predictor of longevity.',
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '🫀',
      iconColor: '#EF4444',
      growthType: 'complex',
      name: 'VO2 Max Training',
      startSmallVersion: 'Sprint up one flight of stairs.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '⚖️',
      iconColor: '#8B5CF6',
      growthType: 'average',
      name: 'Balance Training',
      startSmallVersion: 'Stand on one foot for 10 seconds.',
      popularityScore: 85,
      scientificReference:
        'Sherrington et al. (2019) - Exercise for preventing falls in older people living in the community',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Train grip strength with dead hangs, farmer carries, or grip exercises. Grip strength is a powerful predictor of all-cause mortality.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '✊',
      iconColor: '#F97316',
      growthType: 'average',
      name: 'Grip Strength Training',
      startSmallVersion: 'Hang from a bar for 5 seconds.',
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
      estimatedMinutes: 15,
      frequency: FREQUENCY_DAILY,
      icon: '🛀',
      iconColor: '#F43F5E',
      growthType: 'average',
      name: 'Heat Therapy Bath',
      startSmallVersion: 'Run a hot bath and dip your feet in.',
      popularityScore: 82,
      scientificReference:
        'Laukkanen et al. (2018) - Cardiovascular and other health benefits of passive heat therapy',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Hang from a bar for 30-60 seconds daily. Decompresses spine, improves shoulder mobility, and builds grip strength.',
      estimatedMinutes: 1,
      frequency: FREQUENCY_DAILY,
      icon: '🙆',
      iconColor: '#0891B2',
      growthType: 'simple',
      name: 'Daily Hanging',
      startSmallVersion: 'Hang from a doorframe for 5 seconds.',
      popularityScore: 81,
      scientificReference:
        'McGill (2016) - Back Mechanic: spinal decompression techniques',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Walk for 10 minutes after a meal. Post-meal walking reduces blood sugar spikes and supports metabolic health.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '🚶',
      iconColor: '#22C55E',
      growthType: 'average',
      name: 'Post-Meal Walk (10 Minutes)',
      startSmallVersion: 'Walk to the end of your hallway after eating.',
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
      estimatedMinutes: 30,
      frequency: 'weekly',
      icon: '🪜',
      iconColor: '#EF4444',
      growthType: 'average',
      name: 'Exercise Snacks (Stair Climbs)',
      startSmallVersion: 'Climb one flight of stairs.',
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
      estimatedMinutes: 15,
      frequency: FREQUENCY_DAILY,
      icon: '🧩',
      iconColor: '#A855F7',
      growthType: 'average',
      name: 'Brain Games',
      startSmallVersion: 'Solve one easy puzzle on your phone.',
      popularityScore: 83,
      scientificReference:
        'Park et al. (2014) - The impact of sustained engagement on cognitive function in older adults',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Schedule 15-30 minutes to write down worries, then close the notebook. Containing worry to a specific time reduces generalized anxiety.',
      estimatedMinutes: 15,
      frequency: FREQUENCY_DAILY,
      icon: '📓',
      iconColor: '#64748B',
      growthType: 'average',
      name: 'Scheduled Worry Time',
      startSmallVersion: 'Write one worry on paper.',
      popularityScore: 86,
      scientificReference:
        'Borkovec et al. (1990) - Stimulus control treatment for worry and insomnia',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Systematically scan your body from head to toe, noticing sensations. Reduces chronic pain, increases body awareness, and calms the nervous system.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '🫥',
      iconColor: '#06B6D4',
      growthType: 'average',
      name: 'Body Scan Meditation',
      startSmallVersion: 'Notice the feeling in your feet for 10 seconds.',
      popularityScore: 88,
      scientificReference:
        'Kabat-Zinn (1990) - Full Catastrophe Living: Using the Wisdom of Your Body and Mind',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Do the 13-minute guided breath-anchoring meditation from Dr. Wendy Suzuki’s NYU lab. Eight weeks of daily practice improved attention, working memory, mood, and emotional regulation in non-experienced meditators.',
      estimatedMinutes: 13,
      frequency: FREQUENCY_DAILY,
      icon: '🧠',
      iconColor: '#6366F1',
      growthType: 'average',
      name: '13-Minute Focus Meditation',
      startSmallVersion: 'Take three slow breaths with eyes closed.',
      popularityScore: 90,
      scientificLink:
        'https://www.sciencedirect.com/science/article/abs/pii/S016643281830322X',
      scientificReference:
        'Basso et al. (2019) - Brief, daily meditation enhances attention, memory, mood, and emotional regulation in non-experienced meditators (Wendy Suzuki lab, NYU)',
      tips: [
        'Follow the guided audio — don’t try to freestyle it',
        'Commit to 8 weeks daily; the study’s benefits appeared at that cadence',
        'Same time each day (morning works best for focus benefits)',
      ],
      youtubeLink: 'https://www.youtube.com/watch?v=4GtpuD13nZk',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Take periodic breaks from high-dopamine activities (social media, games, junk food). Resets reward circuitry and increases motivation.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '🧘‍♂️',
      iconColor: '#475569',
      growthType: 'complex',
      name: 'Dopamine Reset',
      startSmallVersion: 'Stay off your phone for 60 seconds.',
      popularityScore: 84,
      scientificReference:
        'Sepah (2019) - The Definitive Guide to Dopamine Fasting 2.0',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Practice Dual N-Back training for 20 minutes. One of the few brain training methods shown to improve fluid intelligence and working memory.',
      estimatedMinutes: 20,
      frequency: FREQUENCY_DAILY,
      icon: '🔢',
      iconColor: '#7C3AED',
      growthType: 'complex',
      name: 'Dual N-Back Training',
      startSmallVersion: 'Do one round of N-back.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🛋️',
      iconColor: '#4338CA',
      growthType: 'simple',
      name: 'Weighted Blanket Sleep',
      startSmallVersion: 'Drape a heavy blanket over your legs for 60 seconds.',
      popularityScore: 82,
      scientificReference:
        'Ackerley et al. (2015) - Positive effects of a weighted blanket on insomnia',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Use white or pink noise while sleeping. Background noise masks disruptions and improves sleep onset and quality.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🔊',
      iconColor: '#94A3B8',
      growthType: 'simple',
      name: 'Sleep Sound Machine',
      startSmallVersion: 'Play 30 seconds of pink noise.',
      popularityScore: 79,
      scientificReference:
        'Messineo et al. (2017) - Broadband sound administration improves sleep onset latency',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Take 200-400mg magnesium glycinate or threonate 30-60 minutes before bed. Magnesium supports GABA activity and improves sleep quality.',
      estimatedMinutes: 30,
      frequency: FREQUENCY_DAILY,
      icon: '💊',
      iconColor: '#10B981',
      growthType: 'simple',
      name: 'Evening Magnesium',
      startSmallVersion: 'Take your magnesium pill.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🛌',
      iconColor: '#1E40AF',
      growthType: 'complex',
      name: 'Stimulus Control (CBT-I)',
      startSmallVersion: 'Sit on the bed only when you\'re sleepy tonight.',
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
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '🌈',
      iconColor: '#F59E0B',
      growthType: 'complex',
      name: '30 Plants Per Week',
      startSmallVersion: 'Add one new vegetable to today\'s plate.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🥬',
      iconColor: '#84CC16',
      growthType: 'average',
      name: 'Daily Fermented Foods',
      startSmallVersion: 'Take one bite of yogurt or kimchi.',
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
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '🐟',
      iconColor: '#0284C7',
      growthType: 'average',
      name: 'Omega-3 Rich Foods',
      startSmallVersion: 'Eat a few walnuts.',
      popularityScore: 88,
      scientificReference:
        'Dyall (2015) - Long-chain omega-3 fatty acids and the brain: A review of evidence',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Eat vegetables or salad before carbohydrates at meals. Eating greens first blunts blood sugar spikes by up to 73%.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🥗',
      iconColor: '#22C55E',
      growthType: 'simple',
      name: 'Eat Greens First',
      startSmallVersion: 'Take one bite of vegetables before anything else.',
      popularityScore: 86,
      scientificReference:
        'Imai et al. (2014) - Eating vegetables before carbohydrates improves postprandial glucose',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Stop eating at least 3 hours before bedtime. Late eating disrupts sleep architecture and increases acid reflux risk.',
      estimatedMinutes: 180,
      frequency: FREQUENCY_DAILY,
      icon: '🍽️',
      iconColor: '#EF4444',
      growthType: 'average',
      name: 'No Late Night Eating',
      startSmallVersion: 'Set a kitchen-closed timer.',
      popularityScore: 84,
      scientificReference:
        'Fujiwara et al. (2005) - Association between dinner-to-bed time and gastro-esophageal reflux disease',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Chew each bite 20-30 times before swallowing. Thorough chewing improves digestion, nutrient absorption, and naturally reduces calorie intake.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '😋',
      iconColor: '#F97316',
      growthType: 'average',
      name: 'Mindful Chewing',
      startSmallVersion: 'Chew your first bite 20 times.',
      popularityScore: 78,
      scientificReference:
        'Zhu & Hollis (2014) - Increasing the number of chews before swallowing reduces meal size',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Aim for ~25–30g of high-quality protein per meal. This supports muscle protein synthesis and long-term metabolic health.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🍗',
      iconColor: '#F97316',
      growthType: 'average',
      name: 'Protein Per Meal (25–30g)',
      startSmallVersion: 'Add one egg to your next meal.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🦷',
      iconColor: '#0EA5E9',
      growthType: 'simple',
      name: 'Interdental Cleaning',
      startSmallVersion: 'Floss between two teeth.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🧼',
      iconColor: '#10B981',
      growthType: 'simple',
      name: 'Hand Hygiene (Key Times)',
      startSmallVersion: 'Wash your hands once before your next meal.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🧴',
      iconColor: '#FBBF24',
      growthType: 'simple',
      name: 'Daily Sunscreen',
      startSmallVersion: 'Dot sunscreen on your nose.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🪴',
      iconColor: '#22C55E',
      growthType: 'simple',
      name: 'House Plant Care',
      startSmallVersion: 'Touch your plant\'s soil with one finger.',
      popularityScore: 80,
      scientificReference:
        'Lohr et al. (2010) - Interior plants may improve worker productivity',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Remove, donate, or discard one item from your space daily. Physical clutter increases cortisol and reduces focus.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🗑️',
      iconColor: '#64748B',
      growthType: 'simple',
      name: 'Daily Declutter',
      startSmallVersion: 'Toss one item you don\'t use.',
      popularityScore: 83,
      scientificReference:
        'Saxbe & Repetti (2010) - No place like home: Home tours correlate with cortisol levels',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Open windows for 10-15 minutes to ventilate your space. Fresh air reduces indoor CO2 levels, improving cognitive function by up to 50%.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '🪟',
      iconColor: '#38BDF8',
      growthType: 'simple',
      name: 'Fresh Air Break',
      startSmallVersion: 'Open a window for 60 seconds.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '😂',
      iconColor: '#FBBF24',
      growthType: 'simple',
      name: 'Daily Laughter',
      startSmallVersion: 'Watch one short comedy clip.',
      popularityScore: 85,
      scientificReference:
        'Bennett & Lengacher (2009) - Humor and laughter may influence health: Complementary therapies review',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Spend quality time with a pet—petting, playing, or walking. Human-animal interaction increases oxytocin and reduces stress hormones.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🐕',
      iconColor: '#F97316',
      growthType: 'simple',
      name: 'Pet Time',
      startSmallVersion: 'Pet your animal for 30 seconds.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '👂',
      iconColor: '#8B5CF6',
      growthType: 'average',
      name: 'Deep Listening',
      startSmallVersion: 'Listen to someone for 60 seconds without speaking.',
      popularityScore: 84,
      scientificReference:
        'Rogers (1951) - Client-centered therapy: Its current practice, implications, and theory',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Perform one random act of kindness daily. Helping others increases your own happiness and reduces depression symptoms.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '💝',
      iconColor: '#EC4899',
      growthType: 'simple',
      name: 'Random Act of Kindness',
      startSmallVersion: 'Smile at one stranger today.',
      popularityScore: 91,
      scientificReference:
        'Lyubomirsky et al. (2005) - Pursuing happiness: The architecture of sustainable change',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Have at least one face-to-face conversation daily. In-person interaction provides stronger wellbeing benefits than digital communication.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '👥',
      iconColor: '#3B82F6',
      growthType: 'simple',
      name: 'Face-to-Face Time',
      startSmallVersion: 'Say hi to one person in person today.',
      popularityScore: 87,
      scientificReference:
        'Helliwell & Huang (2013) - Comparing the happiness effects of real and online friends',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        "Practice saying no to requests that don't align with your priorities. Healthy boundaries reduce stress and prevent burnout.",
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🚫',
      iconColor: '#DC2626',
      growthType: 'complex',
      name: 'Boundary Practice',
      startSmallVersion: 'Say "let me get back to you" to one ask.',
      popularityScore: 82,
      scientificReference:
        'Cloud & Townsend (1992) - Boundaries: When to Say Yes, How to Say No',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Give at least one sincere compliment daily. Giving compliments activates reward centers in your own brain and strengthens relationships.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '⭐',
      iconColor: '#FBBF24',
      growthType: 'simple',
      name: 'Daily Compliment',
      startSmallVersion: 'Tell one person what you appreciate about them.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '📵',
      iconColor: '#EF4444',
      growthType: 'average',
      name: 'Phone-Free Meals',
      startSmallVersion: 'Put your phone face-down for one bite.',
      popularityScore: 90,
      scientificReference:
        'Dwyer et al. (2018) - Smartphone use undermines enjoyment of face-to-face social interactions',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Limit social media to 30 minutes daily. Reducing social media use decreases anxiety and depression while improving life satisfaction.',
      estimatedMinutes: 30,
      frequency: FREQUENCY_DAILY,
      icon: '📱',
      iconColor: '#6366F1',
      growthType: 'complex',
      name: 'Social Media Limit',
      startSmallVersion: 'Close the app after 60 seconds.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🎯',
      iconColor: '#059669',
      growthType: 'complex',
      name: 'Single-Tasking',
      startSmallVersion: 'Close every tab except the one you need.',
      popularityScore: 89,
      scientificReference:
        'Ophir et al. (2009) - Cognitive control in media multitaskers',
    });

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Keep your phone on airplane mode for the first hour after waking. Protects your attention and prevents reactive morning mode.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '✈️',
      iconColor: '#0EA5E9',
      growthType: 'average',
      name: 'Airplane Mode Morning',
      startSmallVersion: 'Toggle airplane mode on for 5 minutes after waking.',
      popularityScore: 86,
      scientificReference:
        'Newport (2019) - Digital Minimalism: Choosing a Focused Life in a Noisy World',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Write one “if-then” plan for tomorrow (e.g., “If it’s 9:00 AM, then I start my hardest task for 25 minutes”). This increases follow-through by automating the first step.',
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '🧩',
      iconColor: '#7C3AED',
      growthType: 'simple',
      name: 'If-Then Planning',
      startSmallVersion: 'Write one if-then sentence on a sticky note.',
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
      if (PRUNED_TEMPLATE_NAMES.has(templateNameKey)) {
        _skippedCount++;
        skippedNames.push(template.name);
        return false;
      }
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
      estimatedMinutes: 2,
      frequency: FREQUENCY_DAILY,
      icon: '🦷',
      iconColor: '#FFFFFF',
      growthType: 'simple',
      name: 'Daily Flossing',
      startSmallVersion: 'Floss between two teeth.',
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
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '🦷',
      iconColor: '#0EA5E9',
      growthType: 'simple',
      name: 'Regular Dental Checkups',
      startSmallVersion: 'Open the calendar and pick a dentist date.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🦴',
      iconColor: '#F3F4F6',
      growthType: 'average',
      name: 'Calcium Intake Tracking',
      startSmallVersion: 'Note one calcium-rich food you ate.',
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
      estimatedMinutes: 30,
      frequency: 'weekly',
      icon: '🏋️',
      iconColor: '#6366F1',
      growthType: 'complex',
      name: 'Bone-Strengthening Exercise',
      startSmallVersion: 'Do 5 bodyweight squats.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '👂',
      iconColor: '#F59E0B',
      growthType: 'simple',
      name: 'Hearing Protection',
      startSmallVersion: 'Tuck earplugs into your bag.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🎧',
      iconColor: '#8B5CF6',
      growthType: 'simple',
      name: 'Safe Listening Volume',
      startSmallVersion: 'Lower your headphone volume two notches.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '☀️',
      iconColor: '#FBBF24',
      growthType: 'simple',
      name: 'Vitamin D Supplementation',
      startSmallVersion: 'Take your vitamin D pill.',
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
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '🏥',
      iconColor: '#EF4444',
      growthType: 'simple',
      name: 'Preventive Health Checkups',
      startSmallVersion: 'Open the calendar and pick a checkup date.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🧴',
      iconColor: '#FDE047',
      growthType: 'simple',
      name: 'Daily Sun Protection',
      startSmallVersion: 'Dot SPF on your nose and forehead.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🔄',
      iconColor: '#10B981',
      growthType: 'average',
      name: 'Joint Mobility Routine',
      startSmallVersion: 'Do five wrist and ankle circles.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🥗',
      iconColor: '#10B981',
      growthType: 'complex',
      name: 'Mediterranean Plate',
      startSmallVersion: 'Drizzle olive oil over your next meal.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🥦',
      iconColor: '#22C55E',
      growthType: 'simple',
      name: 'Veggies First',
      startSmallVersion: 'Take one bite of vegetables before anything else.',
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
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '🫘',
      iconColor: '#F97316',
      growthType: 'average',
      name: 'Legume Serving',
      startSmallVersion: 'Add a spoonful of beans to your next meal.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🥜',
      iconColor: '#A16207',
      growthType: 'simple',
      name: 'Daily Nuts Serving',
      startSmallVersion: 'Eat 5 almonds.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🌾',
      iconColor: '#CA8A04',
      growthType: 'simple',
      name: 'Whole Grain Swap',
      startSmallVersion: 'Swap one slice of bread for whole-wheat.',
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
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '🩺',
      iconColor: '#EF4444',
      growthType: 'simple',
      name: 'Blood Pressure Check',
      startSmallVersion: 'Strap on the cuff and take one reading.',
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
      estimatedMinutes: 25,
      frequency: 'yearly',
      icon: '👁️',
      iconColor: '#0EA5E9',
      growthType: 'simple',
      name: 'Annual Eye Exam',
      startSmallVersion: 'Open the calendar and pick an eye-exam date.',
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
      estimatedMinutes: 25,
      frequency: 'yearly',
      icon: '🦻',
      iconColor: '#8B5CF6',
      growthType: 'simple',
      name: 'Annual Hearing Test',
      startSmallVersion: 'Open the calendar and pick a hearing-test date.',
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
      estimatedMinutes: 25,
      frequency: 'monthly',
      icon: '🔎',
      iconColor: '#F59E0B',
      growthType: 'simple',
      name: 'Monthly Skin Self-Exam',
      startSmallVersion: 'Check one mole in the mirror.',
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
      estimatedMinutes: 25,
      frequency: 'yearly',
      icon: '💉',
      iconColor: '#10B981',
      growthType: 'simple',
      name: 'Vaccination Status Review',
      startSmallVersion: 'Open your vaccine record and read it.',
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
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '🪑',
      iconColor: '#6366F1',
      growthType: 'average',
      name: 'Isometric Wall Sit',
      startSmallVersion: 'Hold a wall sit for 10 seconds.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🤸',
      iconColor: '#14B8A6',
      growthType: 'average',
      name: '5-Minute Mobility Snack',
      startSmallVersion: 'Roll your shoulders and ankles for 30 seconds.',
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
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '📋',
      iconColor: '#7C3AED',
      growthType: 'average',
      name: 'Weekly Goal Review',
      startSmallVersion: 'Read last week\'s goals out loud.',
      popularityScore: 89,
      scientificReference:
        'Locke & Latham (2002) - Goal-setting theory and performance',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Track your energy levels throughout the day. Identifying peak energy times allows you to schedule important work during high-energy windows.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '⚡',
      iconColor: '#FBBF24',
      growthType: 'simple',
      name: 'Energy Level Tracking',
      startSmallVersion: 'Rate your energy 1-10 right now.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🎯',
      iconColor: '#7C3AED',
      growthType: 'simple',
      name: 'Daily Top 3 Priorities',
      startSmallVersion: 'Write today\'s one most important task.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '📨',
      iconColor: '#0EA5E9',
      growthType: 'average',
      name: 'Batch Check Messages',
      startSmallVersion: 'Close your inbox for the next 5 minutes.',
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
      estimatedMinutes: 2,
      frequency: FREQUENCY_DAILY,
      icon: '🧹',
      iconColor: '#F97316',
      growthType: 'simple',
      name: 'Two-Minute Tidy',
      startSmallVersion: 'Put one thing back where it belongs.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '📦',
      iconColor: '#14B8A6',
      growthType: 'simple',
      name: 'Box Breathing',
      startSmallVersion: 'Do one round of 4-4-4-4 breathing.',
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
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '🌿',
      iconColor: '#059669',
      growthType: 'average',
      name: 'Tech-Free Break',
      startSmallVersion: 'Look out the window for 30 seconds, no phone.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🌙',
      iconColor: '#4338CA',
      growthType: 'simple',
      name: 'Pre-Sleep Review',
      startSmallVersion: 'Re-read one paragraph from today.',
      popularityScore: 88,
      scientificReference:
        "Rasch & Born (2013) - About sleep's role in memory consolidation",
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Teach someone what you learned this week. Teaching others improves your own retention by up to 90% (protégé effect).',
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '👨‍🏫',
      iconColor: '#DC2626',
      growthType: 'average',
      name: 'Weekly Teaching',
      startSmallVersion: 'Explain one idea to someone in one sentence.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '❓',
      iconColor: '#8B5CF6',
      growthType: 'simple',
      name: 'Deep Questions',
      startSmallVersion: 'Ask one person, "what\'s been on your mind?"',
      popularityScore: 83,
      scientificReference:
        'Aron et al. (1997) - The experimental generation of interpersonal closeness',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Practice receiving feedback gracefully without defensiveness. Accepting feedback improves relationships and accelerates personal growth.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '💬',
      iconColor: '#06B6D4',
      growthType: 'complex',
      name: 'Receive Feedback Gracefully',
      startSmallVersion: 'Say "thank you" the next time someone gives you feedback.',
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

      'NSDR Practice': 'https://www.youtube.com/watch?v=KHIbgSN2qAU',

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
      'Yoga Nidra/NSDR': 'https://www.youtube.com/watch?v=KHIbgSN2qAU',
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

    await _insertTemplateIfMissing(ctx, {
      category: 'longevity',
      createdAt: now,
      description:
        'VO2 max is the single strongest predictor of longevity. Train at high intensity 1-2x weekly with intervals that make conversation difficult.',
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '🫀',
      iconColor: '#EF4444',
      growthType: 'complex',
      name: 'VO2 Max Training',
      popularityScore: 95,
      scientificLink: 'https://peterattiamd.com/outlive/',
      scientificReference:
        'Attia (2023) - Outlive: The Science and Art of Longevity',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'longevity',
      createdAt: now,
      description:
        'Grip strength is a powerful predictor of all-cause mortality. Train with dead hangs, farmer carries, or grip exercises 3x weekly.',
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '✊',
      iconColor: '#F97316',
      growthType: 'average',
      name: 'Grip Strength Training',
      popularityScore: 91,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/25953784/',
      scientificReference:
        'Leong et al. (2015) - Prognostic value of grip strength: findings from the PURE study',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'longevity',
      createdAt: now,
      description:
        'The sitting-rising test (sitting on floor and standing without hands) predicts mortality. Practice floor sitting daily to maintain this ability.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🧘',
      iconColor: '#8B5CF6',
      growthType: 'simple',
      name: 'Floor Sitting Practice',
      popularityScore: 87,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/23242910/',
      scientificReference:
        'Brito et al. (2014) - Ability to sit and rise from the floor as a predictor of all-cause mortality',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'longevity',
      createdAt: now,
      description:
        'Take stairs exclusively instead of elevators. Climbing 7+ floors daily associated with 33% lower all-cause mortality.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🪜',
      iconColor: '#059669',
      growthType: 'simple',
      name: 'Always Take Stairs',
      popularityScore: 89,
      scientificReference:
        'Boreham et al. (2005) - Stair climbing and cardiovascular disease risk',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'longevity',
      createdAt: now,
      description:
        'Stand on one leg for 10 seconds with eyes open. Inability to do this in older adults predicts doubled mortality risk within 10 years.',
      estimatedMinutes: 1,
      frequency: FREQUENCY_DAILY,
      icon: '🦩',
      iconColor: '#EC4899',
      growthType: 'simple',
      name: 'Single-Leg Balance Test',
      popularityScore: 86,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/35729712/',
      scientificReference:
        'Araujo et al. (2022) - Successful 10-second one-legged stance performance predicts survival',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'longevity',
      createdAt: now,
      description:
        'Walk at a pace of 3+ mph (brisk walking). Walking speed is a strong predictor of longevity - faster walkers live significantly longer.',
      estimatedMinutes: 30,
      frequency: FREQUENCY_DAILY,
      icon: '🚶‍♂️',
      iconColor: '#3B82F6',
      growthType: 'average',
      name: 'Brisk Walking Pace',
      popularityScore: 93,
      scientificReference:
        'Studenski et al. (2011) - Gait speed and survival in older adults',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'longevity',
      createdAt: now,
      description:
        'Maintain muscle mass through resistance training 2-3x weekly. Sarcopenia (muscle loss) accelerates aging and increases mortality.',
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '💪',
      iconColor: '#DC2626',
      growthType: 'complex',
      name: 'Muscle Preservation',
      popularityScore: 94,
      scientificReference:
        'Srikanthan & Karlamangla (2014) - Muscle mass index as a predictor of longevity',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'longevity',
      createdAt: now,
      description:
        'Practice getting up and down from the ground using different movement patterns. Maintains functional capacity critical for independence.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '⬆️',
      iconColor: '#7C3AED',
      growthType: 'average',
      name: 'Ground Transitions',
      popularityScore: 84,
      scientificReference:
        'Attia (2023) - Centenarian Decathlon: functional movement goals',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'longevity',
      createdAt: now,
      description:
        'Eat 25-30g protein per meal (especially breakfast). Maintains muscle mass and prevents age-related sarcopenia.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🥩',
      iconColor: '#B91C1C',
      growthType: 'average',
      name: 'Protein Per Meal Goal',
      popularityScore: 90,
      scientificReference:
        'Layman et al. (2015) - Dietary protein distribution positively influences 24-h muscle protein synthesis',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'longevity',
      createdAt: now,
      description:
        'Test your resting heart rate weekly. Lower resting HR (50-70 bpm) correlates with longevity and cardiovascular health.',
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '❤️',
      iconColor: '#F43F5E',
      growthType: 'simple',
      name: 'Resting Heart Rate Check',
      popularityScore: 82,
      scientificReference:
        'Jensen et al. (2013) - Elevated resting heart rate and mortality',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🧠 MENTAL HEALTH - Evidence-based psychological wellness
    // ═══════════════════════════════════════════════════════════════

    await _insertTemplateIfMissing(ctx, {
      category: 'mental_health',
      createdAt: now,
      description:
        'When struggling, pause and say: "This is a moment of suffering. Suffering is part of life. May I be kind to myself." More effective than self-esteem building.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '💗',
      iconColor: '#EC4899',
      growthType: 'simple',
      name: 'Self-Compassion Break',
      popularityScore: 93,
      scientificLink: 'https://self-compassion.org/the-research/',
      scientificReference:
        'Neff (2011) - Self-Compassion: The Proven Power of Being Kind to Yourself',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'mental_health',
      createdAt: now,
      description:
        'Label thoughts as "I notice I\'m having the thought that..." Creates distance from negative thoughts and reduces their impact.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🏷️',
      iconColor: '#6366F1',
      growthType: 'average',
      name: 'Cognitive Defusion',
      popularityScore: 88,
      scientificReference:
        'Hayes (2004) - ACT: Acceptance and Commitment Therapy',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'mental_health',
      createdAt: now,
      description:
        'Write for 20 minutes about your deepest feelings regarding a difficult experience. Improves immune function and reduces doctor visits by 50%.',
      estimatedMinutes: 20,
      frequency: 'weekly',
      icon: '📝',
      iconColor: '#8B5CF6',
      growthType: 'average',
      name: 'Expressive Writing',
      popularityScore: 91,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/10408300/',
      scientificReference:
        'Pennebaker (1997) - Writing about emotional experiences as a therapeutic process',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'mental_health',
      createdAt: now,
      description:
        "Do one small task you've been avoiding. Behavioral activation is as effective as antidepressants for mild-moderate depression.",
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '✅',
      iconColor: '#10B981',
      growthType: 'average',
      name: 'Behavioral Activation',
      popularityScore: 90,
      scientificReference:
        'Cuijpers et al. (2007) - Behavioral activation treatments of depression: A meta-analysis',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'mental_health',
      createdAt: now,
      description:
        'Review your core values weekly. Self-affirmation through values reduces stress response and builds psychological resilience.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '🎯',
      iconColor: '#F59E0B',
      growthType: 'simple',
      name: 'Values Clarification',
      popularityScore: 85,
      scientificReference:
        'Cohen & Sherman (2014) - The psychology of change: Self-affirmation and social psychological intervention',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'mental_health',
      createdAt: now,
      description:
        'Schedule 15-30 minutes to write down all worries, then close the notebook. Containing worry to a specific time reduces generalized anxiety.',
      estimatedMinutes: 15,
      frequency: FREQUENCY_DAILY,
      icon: '📓',
      iconColor: '#64748B',
      growthType: 'average',
      name: 'Scheduled Worry Time',
      popularityScore: 87,
      scientificReference:
        'Borkovec et al. (1990) - Stimulus control treatment for worry',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'mental_health',
      createdAt: now,
      description:
        'Plan one small pleasurable activity daily. Pleasant activity scheduling is a core component of evidence-based depression treatment.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🎉',
      iconColor: '#22C55E',
      growthType: 'simple',
      name: 'Pleasant Activity Scheduling',
      popularityScore: 86,
      scientificReference:
        'Lewinsohn (1974) - A behavioral approach to depression',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'mental_health',
      createdAt: now,
      description:
        'When anxious, ask: "What would I tell a friend in this situation?" Perspective-taking reduces emotional intensity and catastrophizing.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🪞',
      iconColor: '#0EA5E9',
      growthType: 'average',
      name: 'Self-Distancing',
      popularityScore: 84,
      scientificReference:
        'Kross & Ayduk (2011) - Self-distancing and adaptive self-reflection',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'mental_health',
      createdAt: now,
      description:
        'Name your emotions specifically (not just "bad" but "disappointed" or "frustrated"). Specific emotion labeling reduces amygdala activation.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '😶',
      iconColor: '#A855F7',
      growthType: 'average',
      name: 'Emotion Granularity',
      popularityScore: 83,
      scientificReference:
        'Lieberman et al. (2007) - Putting feelings into words: Affect labeling disrupts amygdala activity',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'mental_health',
      createdAt: now,
      description:
        'Practice opposite action: when you feel like withdrawing, reach out; when angry, speak gently. Core DBT skill for emotion regulation.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '↔️',
      iconColor: '#14B8A6',
      growthType: 'complex',
      name: 'Opposite Action',
      popularityScore: 82,
      scientificReference:
        'Linehan (2014) - DBT Skills Training Manual: Emotion Regulation',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🔄 RECOVERY - Optimal rest and regeneration
    // ═══════════════════════════════════════════════════════════════

    await _insertTemplateIfMissing(ctx, {
      category: 'recovery',
      createdAt: now,
      description:
        'Wake at the same time every day, including weekends. Consistent wake time is more important than bedtime for circadian stability.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '⏰',
      iconColor: '#F97316',
      growthType: 'average',
      name: 'Consistent Wake Time',
      popularityScore: 95,
      scientificReference:
        'Roenneberg (2012) - Internal Time: Chronotypes and Social Jet Lag',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'recovery',
      createdAt: now,
      description:
        'End hot showers with 30-60 seconds of cold water. This contrast therapy reduces sick days by 29% and improves recovery.',
      estimatedMinutes: 1,
      frequency: FREQUENCY_DAILY,
      icon: '🚿',
      iconColor: '#38BDF8',
      growthType: 'average',
      name: 'Contrast Shower',
      popularityScore: 88,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/27631616/',
      scientificReference:
        'Buijze et al. (2016) - Cold shower effects on sickness absence',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'recovery',
      createdAt: now,
      description:
        'Sleep under a weighted blanket (8-12% of body weight). Deep pressure stimulation reduces anxiety and improves sleep quality.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🛋️',
      iconColor: '#4338CA',
      growthType: 'simple',
      name: 'Weighted Blanket Sleep',
      popularityScore: 84,
      scientificReference:
        'Ackerley et al. (2015) - Positive effects of a weighted blanket on insomnia',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'recovery',
      createdAt: now,
      description:
        'Watch the sunset for 10+ minutes when possible. Signals your circadian system that the day is ending, preparing body for sleep.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🌅',
      iconColor: '#F59E0B',
      growthType: 'simple',
      name: 'Evening Sunset Viewing',
      popularityScore: 83,
      scientificReference:
        'Huberman (2022) - Evening light viewing for circadian regulation',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'recovery',
      createdAt: now,
      description:
        'Use foam roller or massage gun for 10-15 minutes. Self-myofascial release improves range of motion and reduces muscle soreness.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '🧴',
      iconColor: '#7C3AED',
      growthType: 'average',
      name: 'Self-Massage/Foam Rolling',
      popularityScore: 86,
      scientificReference:
        'Cheatham et al. (2015) - Effects of self-myofascial release: A systematic review',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'recovery',
      createdAt: now,
      description:
        'Take a 10-30 minute nap before 3 PM. Short naps improve cognitive function, alertness, and mood without affecting nighttime sleep.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '💤',
      iconColor: '#6366F1',
      growthType: 'simple',
      name: 'Power Nap',
      popularityScore: 87,
      scientificReference:
        'Milner & Cote (2009) - Benefits of napping in healthy adults',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'recovery',
      createdAt: now,
      description:
        'Use pink or white noise while sleeping. Background noise masks disruptions and improves both sleep onset and sleep quality.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🔊',
      iconColor: '#94A3B8',
      growthType: 'simple',
      name: 'Sleep Sound Machine',
      popularityScore: 81,
      scientificReference:
        'Messineo et al. (2017) - Broadband sound improves sleep onset latency',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'recovery',
      createdAt: now,
      description:
        'Spend 20-30 minutes in infrared sauna or traditional sauna 2-3x weekly. Heat therapy improves cardiovascular health and recovery.',
      estimatedMinutes: 20,
      frequency: 'weekly',
      icon: '🧖',
      iconColor: '#DC2626',
      growthType: 'complex',
      name: 'Sauna Recovery',
      popularityScore: 85,
      scientificReference:
        'Laukkanen et al. (2015) - Sauna bathing and cardiovascular disease risk',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'recovery',
      createdAt: now,
      description:
        'Spend 10-20 minutes in front of a red/near-infrared light panel (660nm + 850nm). Photobiomodulation supports skin health, muscle recovery, and mitochondrial energy production.',
      frequency: FREQUENCY_DAILY,
      icon: '🔴',
      iconColor: '#DC2626',
      growthType: 'simple',
      name: 'Red Light Therapy',
      startSmallVersion: 'Stand in front of the panel for 60 seconds.',
      popularityScore: 75,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/28748217/',
      scientificReference:
        'Hamblin (2017) - Mechanisms and applications of the anti-inflammatory effects of photobiomodulation',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'recovery',
      createdAt: now,
      description:
        'Practice yoga nidra or NSDR (non-sleep deep rest) for 10-20 minutes. Accelerates learning, restores dopamine, and improves sleep.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '🛌',
      iconColor: '#7DD3FC',
      growthType: 'average',
      name: 'Yoga Nidra/NSDR',
      popularityScore: 89,
      scientificReference:
        'Huberman Lab (2021) - NSDR for learning and recovery',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'recovery',
      createdAt: now,
      description:
        'Take 200-400mg magnesium glycinate or threonate 30-60 minutes before bed. Supports GABA activity and improves sleep quality.',
      estimatedMinutes: 30,
      frequency: FREQUENCY_DAILY,
      icon: '💊',
      iconColor: '#10B981',
      growthType: 'simple',
      name: 'Evening Magnesium',
      popularityScore: 88,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/23853635/',
      scientificReference:
        'Abbasi et al. (2012) - Magnesium supplementation and sleep quality',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🌬️ BREATHING - Respiratory techniques for performance & calm
    // ═══════════════════════════════════════════════════════════════

    await _insertTemplateIfMissing(ctx, {
      category: 'breathing',
      createdAt: now,
      description:
        'Inhale 4 counts, hold 4, exhale 4, hold empty 4. Navy SEAL technique proven to rapidly reduce stress and cortisol levels.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '⬜',
      iconColor: '#3B82F6',
      growthType: 'simple',
      name: 'Box Breathing (4-4-4-4)',
      popularityScore: 94,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/29616846/',
      scientificReference:
        'Zaccaro et al. (2018) - How breath-control can change your life',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'breathing',
      createdAt: now,
      description:
        'Double inhale through nose, long exhale through mouth. The fastest way to calm down - works in 1-3 breaths.',
      estimatedMinutes: 2,
      frequency: FREQUENCY_DAILY,
      icon: '😮‍💨',
      iconColor: '#34D399',
      growthType: 'simple',
      name: 'Physiological Sigh',
      popularityScore: 92,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/36630953/',
      scientificReference:
        'Balban et al. (2023) - Brief structured respiration practices enhance mood',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'breathing',
      createdAt: now,
      description:
        'Practice breathing through your nose throughout the day. Nasal breathing filters air, produces nitric oxide, and activates parasympathetic system.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '👃',
      iconColor: '#14B8A6',
      growthType: 'average',
      name: 'Nasal Breathing',
      popularityScore: 91,
      scientificReference:
        'Nestor (2020) - Breath: The New Science of a Lost Art',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'breathing',
      createdAt: now,
      description:
        'Hum for 5 minutes daily (like "om" or any tune). Increases nasal nitric oxide production by 15x, improving sinus health and oxygenation.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🎵',
      iconColor: '#8B5CF6',
      growthType: 'simple',
      name: 'Daily Humming',
      popularityScore: 79,
      scientificReference:
        'Weitzberg & Lundberg (2002) - Humming greatly increases nasal nitric oxide',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'breathing',
      createdAt: now,
      description:
        'Practice breath holds after exhale to increase CO2 tolerance. Improves exercise capacity, reduces anxiety, and enhances breath control.',
      estimatedMinutes: 2,
      frequency: FREQUENCY_DAILY,
      icon: '⏱️',
      iconColor: '#F97316',
      growthType: 'average',
      name: 'CO2 Tolerance Training',
      popularityScore: 83,
      scientificReference: 'Malshe (2011) - Pranayama and CO2 tolerance',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'breathing',
      createdAt: now,
      description:
        'Inhale 4 counts, hold 7, exhale 8. Activates parasympathetic response and promotes sleep onset.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '😴',
      iconColor: '#6366F1',
      growthType: 'simple',
      name: '4-7-8 Relaxing Breath',
      popularityScore: 88,
      scientificReference:
        'Weil (2015) - Breathing: The Master Key to Self-Healing',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'breathing',
      createdAt: now,
      description:
        'Practice controlled hyperventilation followed by breath retention. Reduces inflammation, improves immune response, and builds mental resilience.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '❄️',
      iconColor: '#0EA5E9',
      growthType: 'average',
      name: 'Wim Hof Breathing',
      popularityScore: 85,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/24799686/',
      scientificReference:
        'Kox et al. (2014) - Voluntary activation of the innate immune response',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'breathing',
      createdAt: now,
      description:
        'Perform cyclic breathing: rapid inhales followed by passive exhales for 1-3 minutes. Increases alertness and energy without caffeine.',
      estimatedMinutes: 1,
      frequency: FREQUENCY_DAILY,
      icon: '⚡',
      iconColor: '#FBBF24',
      growthType: 'average',
      name: 'Energizing Breath (Kapalabhati)',
      popularityScore: 81,
      scientificReference:
        'Telles et al. (2011) - Effect of yoga breathing on cognitive function',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'breathing',
      createdAt: now,
      description:
        'Breathe in a 5.5 second inhale, 5.5 second exhale rhythm (5.5 breaths per minute). The optimal breathing rate for heart rate variability.',
      estimatedMinutes: 1,
      frequency: FREQUENCY_DAILY,
      icon: '💓',
      iconColor: '#EC4899',
      growthType: 'average',
      name: 'Resonant Breathing',
      popularityScore: 86,
      scientificReference:
        'Lehrer & Gevirtz (2014) - Heart rate variability biofeedback',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'breathing',
      createdAt: now,
      description:
        'Tape mouth with medical tape during sleep. Prevents mouth breathing, reduces snoring, and improves sleep quality.',
      estimatedMinutes: 2,
      frequency: FREQUENCY_DAILY,
      icon: '😷',
      iconColor: '#64748B',
      growthType: 'simple',
      name: 'Mouth Taping Sleep',
      popularityScore: 77,
      scientificReference:
        'Nestor (2020) - Mouth breathing vs nasal breathing during sleep',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🏃 Additional HEALTH & FITNESS templates
    // ═══════════════════════════════════════════════════════════════

    await _insertTemplateIfMissing(ctx, {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Walk for 10-15 minutes after meals. Reduces blood glucose spikes by 22%, improving metabolic health and energy levels.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '🚶',
      iconColor: '#10B981',
      growthType: 'average',
      name: 'Post-Meal Walk',
      popularityScore: 93,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/35189634/',
      scientificReference:
        'Reynolds et al. (2022) - Post-meal walking reduces glucose excursions',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Practice backward walking for 5-10 minutes. Improves balance, reduces knee pain by 40%, and activates different muscle patterns.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '⬅️',
      iconColor: '#F59E0B',
      growthType: 'simple',
      name: 'Backward Walking',
      popularityScore: 84,
      scientificReference:
        'Cha et al. (2016) - Effects of backward walking on balance and knee pain',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Do brief intense exercise bursts (1-2 min) several times throughout the day. "Exercise snacks" reduce mortality risk 4-5x.',
      estimatedMinutes: 1,
      frequency: FREQUENCY_DAILY,
      icon: '💥',
      iconColor: '#EF4444',
      growthType: 'average',
      name: 'Movement Snacks',
      popularityScore: 88,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/36396264/',
      scientificReference:
        'Stamatakis et al. (2022) - Vigorous intermittent lifestyle physical activity',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Take 1 tablespoon apple cider vinegar diluted in water before meals. Reduces post-meal blood glucose spikes by up to 34%.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🍎',
      iconColor: '#84CC16',
      growthType: 'simple',
      name: 'Pre-Meal Vinegar',
      popularityScore: 82,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/7796781/',
      scientificReference:
        'Johnston et al. (2004) - Vinegar improves insulin sensitivity',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Cool and reheat starchy foods (potatoes, rice, pasta) before eating. Creates resistant starch that feeds beneficial gut bacteria.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🥔',
      iconColor: '#A16207',
      growthType: 'simple',
      name: 'Resistant Starch',
      popularityScore: 78,
      scientificReference:
        'Robertson et al. (2005) - Resistant starch improves insulin sensitivity',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Distribute protein intake: 20-40g every 3-4 hours rather than one large serving. Optimizes muscle protein synthesis throughout the day.',
      estimatedMinutes: 240,
      frequency: FREQUENCY_DAILY,
      icon: '🍳',
      iconColor: '#F97316',
      growthType: 'average',
      name: 'Protein Pacing',
      popularityScore: 85,
      scientificReference:
        'Arciero et al. (2013) - Increased protein intake and meal frequency',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🤝 Additional SOCIAL templates
    // ═══════════════════════════════════════════════════════════════

    await _insertTemplateIfMissing(ctx, {
      category: 'social',
      createdAt: now,
      description:
        'When someone shares good news, respond with enthusiasm, questions, and celebration. Strongest predictor of relationship satisfaction.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🎊',
      iconColor: '#22C55E',
      growthType: 'average',
      name: 'Active Constructive Responding',
      popularityScore: 89,
      scientificReference:
        'Gable et al. (2004) - What do you do when things go right?',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'social',
      createdAt: now,
      description:
        'Share one honest, vulnerable feeling with someone you trust. Vulnerability builds deeper connection and trust in relationships.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '💭',
      iconColor: '#8B5CF6',
      growthType: 'complex',
      name: 'Vulnerability Practice',
      popularityScore: 84,
      scientificReference:
        'Brown (2012) - Daring Greatly: Vulnerability and courage',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'social',
      createdAt: now,
      description:
        'Practice soft eye contact for 3+ seconds during conversations. Increases oxytocin and perceived trustworthiness in both people.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '👀',
      iconColor: '#06B6D4',
      growthType: 'simple',
      name: 'Eye Contact Practice',
      popularityScore: 81,
      scientificReference:
        'Akechi et al. (2013) - Eye contact and oxytocin response',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'social',
      createdAt: now,
      description:
        'Ask open-ended questions and reflect back what you hear without planning your response. Deep listening builds empathy and connection.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '👂',
      iconColor: '#7C3AED',
      growthType: 'average',
      name: 'Reflective Listening',
      popularityScore: 86,
      scientificReference:
        'Rogers (1951) - Client-centered therapy and active listening',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🧠 Additional PRODUCTIVITY templates
    // ═══════════════════════════════════════════════════════════════

    await _insertTemplateIfMissing(ctx, {
      category: 'productivity',
      createdAt: now,
      description:
        "Work in 90-minute cycles matching your brain's ultradian rhythm. Natural focus waxes and wanes in ~90-minute cycles throughout the day.",
      estimatedMinutes: 90,
      frequency: FREQUENCY_DAILY,
      icon: '🔄',
      iconColor: '#7C3AED',
      growthType: 'average',
      name: 'Ultradian Work Cycles',
      popularityScore: 88,
      scientificReference:
        'Peretz Lavie (1985) - Ultradian rhythms in cognitive performance',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'productivity',
      createdAt: now,
      description:
        'Keep phone on airplane mode for the first 60 minutes after waking. Protects your attention and prevents reactive morning mode.',
      estimatedMinutes: 60,
      frequency: FREQUENCY_DAILY,
      icon: '✈️',
      iconColor: '#0EA5E9',
      growthType: 'average',
      name: 'Airplane Mode Morning',
      popularityScore: 87,
      scientificReference:
        'Newport (2019) - Digital Minimalism: Choosing a Focused Life',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'productivity',
      createdAt: now,
      description:
        'Set phone to grayscale mode. Removing color reduces compulsive phone use by 30% by eliminating color-based reward triggers.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '📱',
      iconColor: '#64748B',
      growthType: 'simple',
      name: 'Grayscale Phone Mode',
      popularityScore: 82,
      scientificReference:
        'Alter (2017) - Irresistible: The Rise of Addictive Technology',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'productivity',
      createdAt: now,
      description:
        'Open windows for 10-15 minutes daily. Fresh air reduces indoor CO2 levels, improving cognitive function by up to 50%.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '🪟',
      iconColor: '#38BDF8',
      growthType: 'simple',
      name: 'Fresh Air Ventilation',
      popularityScore: 83,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/26502459/',
      scientificReference:
        'Allen et al. (2016) - CO2 and ventilation effects on cognitive function',
    });

    // ═══════════════════════════════════════════════════════════════
    // 📚 Additional LEARNING templates
    // ═══════════════════════════════════════════════════════════════

    await _insertTemplateIfMissing(ctx, {
      category: 'learning',
      createdAt: now,
      description:
        'Use your non-dominant hand for routine tasks like brushing teeth. Activates underused neural pathways and builds cognitive reserve.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🤚',
      iconColor: '#06B6D4',
      growthType: 'simple',
      name: 'Non-Dominant Hand Training',
      popularityScore: 79,
      scientificReference:
        'Cohen (2000) - Cross-education and neural plasticity',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'learning',
      createdAt: now,
      description:
        'Practice Dual N-Back training for 20 minutes. One of the few brain training methods shown to improve fluid intelligence.',
      estimatedMinutes: 20,
      frequency: FREQUENCY_DAILY,
      icon: '🔢',
      iconColor: '#7C3AED',
      growthType: 'complex',
      name: 'Dual N-Back Training',
      popularityScore: 80,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/18425231/',
      scientificReference:
        'Jaeggi et al. (2008) - Improving fluid intelligence with training on working memory',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'learning',
      createdAt: now,
      description:
        'Review what you learned today within 24 hours. Same-day review increases retention from 20% to 80%.',
      estimatedMinutes: 1440,
      frequency: FREQUENCY_DAILY,
      icon: '📖',
      iconColor: '#059669',
      growthType: 'simple',
      name: 'Same-Day Review',
      popularityScore: 91,
      scientificReference:
        'Ebbinghaus (1885) - Memory: Forgetting curve and spacing effect',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'learning',
      createdAt: now,
      description:
        'Interleave practice of different skills rather than blocked practice. Interleaving improves long-term retention and transfer.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🔀',
      iconColor: '#F59E0B',
      growthType: 'average',
      name: 'Interleaved Practice',
      popularityScore: 84,
      scientificReference:
        'Rohrer (2012) - Interleaving helps students distinguish among similar concepts',
    });

    // ═══════════════════════════════════════════════════════════════
    // 🌅 Additional MORNING ROUTINE templates
    // ═══════════════════════════════════════════════════════════════

    await _insertTemplateIfMissing(ctx, {
      category: 'morning_routine',
      createdAt: now,
      description:
        'Do 30-50 bilateral eye movements (look left-right) upon waking. Activates both brain hemispheres and improves alertness.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '👁️',
      iconColor: '#3B82F6',
      growthType: 'simple',
      name: 'Bilateral Eye Movements',
      popularityScore: 76,
      scientificReference:
        'Shapiro (1989) - EMDR and bilateral stimulation effects',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'morning_routine',
      createdAt: now,
      description:
        'Write your #1 priority for the day before checking any devices. Protects your agenda from reactive mode.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '1️⃣',
      iconColor: '#EF4444',
      growthType: 'simple',
      name: 'Priority First',
      popularityScore: 89,
      scientificReference:
        'Clear (2018) - Atomic Habits: Implementation intentions',
    });

    await _insertTemplateIfMissing(ctx, {
      category: 'morning_routine',
      createdAt: now,
      description:
        'Splash cold water on face immediately after waking. Triggers the mammalian dive reflex, instantly increasing alertness.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '💦',
      iconColor: '#38BDF8',
      growthType: 'simple',
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
      if (PRUNED_TEMPLATE_NAMES.has(normalizeTemplateName(template.name))) {
        _skippedCount++;
        skippedNames.push(template.name);
        return false;
      }

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
      estimatedMinutes: 30,
      frequency: 'weekly',
      icon: '💼',
      iconColor: '#0A66C2',
      growthType: 'average',
      name: 'Career Documentation',
      startSmallVersion: 'Add one bullet to your resume.',
      popularityScore: 82,
      scientificReference:
        'Seibert et al. (1999) - Proactive career behaviors and career success',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Send one professional networking message weekly. Weak ties are more valuable for career opportunities than close connections.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '🤝',
      iconColor: '#059669',
      growthType: 'average',
      name: 'Professional Networking',
      startSmallVersion: 'Send one "thinking of you" message.',
      popularityScore: 85,
      scientificReference: 'Granovetter (1973) - The Strength of Weak Ties',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Document one lesson learned or insight from work daily. Creates a personal knowledge base and accelerates expertise development.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '📓',
      iconColor: '#7C3AED',
      growthType: 'simple',
      name: 'Work Insights Journal',
      startSmallVersion: 'Write one thing you learned today.',
      popularityScore: 81,
      scientificReference:
        'Di Stefano et al. (2016) - Learning by thinking: How reflection aids performance',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Practice public speaking for 10 minutes daily (record yourself, present to mirror). Fear of public speaking can be overcome through gradual exposure.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '🎤',
      iconColor: '#DC2626',
      growthType: 'complex',
      name: 'Public Speaking Practice',
      startSmallVersion: 'Read one sentence aloud to yourself.',
      popularityScore: 84,
      scientificReference:
        'Hofmann et al. (2008) - Exposure-based therapy for public speaking anxiety',
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Spend 15 minutes organizing digital files and emails into a clear folder structure. Reduces time searching for files by up to 50%.',
      estimatedMinutes: 15,
      frequency: 'weekly',
      icon: '🗂️',
      iconColor: '#F59E0B',
      growthType: 'average',
      name: 'Digital File Organization',
      startSmallVersion: 'Move one file into the right folder.',
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
      estimatedMinutes: 20,
      frequency: FREQUENCY_DAILY,
      icon: '🎲',
      iconColor: '#EC4899',
      growthType: 'average',
      name: 'Unstructured Play Time',
      startSmallVersion: 'Play with no goal for 60 seconds.',
      popularityScore: 83,
      scientificReference:
        'Brown (2009) - Play: How It Shapes the Brain, Opens the Imagination',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Build something with your hands (LEGO, crafts, woodworking, knitting). Tactile creation reduces anxiety and improves spatial reasoning.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '🧱',
      iconColor: '#F97316',
      growthType: 'complex',
      name: 'Hands-On Building',
      startSmallVersion: 'Pick up the materials and lay them out.',
      popularityScore: 81,
      scientificReference:
        'Csikszentmihalyi (1990) - Flow: The Psychology of Optimal Experience',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Cook a new recipe without looking at your phone. Cooking engages all senses and provides immediate creative satisfaction.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '👨‍🍳',
      iconColor: '#EA580C',
      growthType: 'average',
      name: 'Experimental Cooking',
      startSmallVersion: 'Add one new spice to your next dish.',
      popularityScore: 84,
      scientificReference:
        'Farmer et al. (2018) - Cooking frequency and dietary quality',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Spend 15 minutes gardening or tending plants. Horticultural therapy reduces cortisol and improves mood within minutes.',
      estimatedMinutes: 15,
      frequency: FREQUENCY_DAILY,
      icon: '🌱',
      iconColor: '#22C55E',
      growthType: 'average',
      name: 'Gardening Therapy',
      startSmallVersion: 'Touch the soil of one plant.',
      popularityScore: 86,
      scientificReference:
        'Van Den Berg & Custers (2011) - Gardening promotes neuroendocrine and affective restoration',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Sing for 10 minutes daily (shower, car, karaoke). Singing releases oxytocin, reduces stress hormones, and improves lung function.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '🎤',
      iconColor: '#A855F7',
      growthType: 'simple',
      name: 'Daily Singing',
      startSmallVersion: 'Hum one verse of a song.',
      popularityScore: 82,
      scientificReference:
        'Grape et al. (2003) - Does singing promote well-being?: Effects on wellbeing and physiological variables',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Dance freely for 10 minutes without choreography. Spontaneous movement reduces depression and improves body image.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '💃',
      iconColor: '#F43F5E',
      growthType: 'simple',
      name: 'Free Dance Session',
      startSmallVersion: 'Sway for 30 seconds.',
      popularityScore: 85,
      scientificReference:
        'Koch et al. (2019) - Effects of dance movement therapy on depression',
    });

    await insertWithTracking({
      category: 'creativity',
      createdAt: now,
      description:
        'Color in an adult coloring book for 20 minutes. Art therapy reduces anxiety comparable to meditation in many studies.',
      estimatedMinutes: 20,
      frequency: FREQUENCY_DAILY,
      icon: '🖍️',
      iconColor: '#0EA5E9',
      growthType: 'average',
      name: 'Coloring Practice',
      startSmallVersion: 'Fill in one shape with color.',
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
      estimatedMinutes: 15,
      frequency: 'weekly',
      icon: '🐦',
      iconColor: '#0D9488',
      growthType: 'simple',
      name: 'Bird Watching',
      startSmallVersion: 'Look out the window and find one bird.',
      popularityScore: 78,
      scientificReference:
        'Cox et al. (2017) - Doses of neighborhood nature: Benefits for mental health',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Spend 20 minutes near moving water (stream, fountain, ocean). Blue space exposure reduces psychological distress significantly.',
      estimatedMinutes: 20,
      frequency: 'weekly',
      icon: '💧',
      iconColor: '#0284C7',
      growthType: 'average',
      name: 'Blue Space Time',
      startSmallVersion: 'Play 30 seconds of water sounds.',
      popularityScore: 83,
      scientificReference:
        'White et al. (2010) - Blue space exposure and psychological well-being',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Look at the night sky for 10 minutes. Awe experiences from nature improve well-being and increase prosocial behavior.',
      estimatedMinutes: 10,
      frequency: 'weekly',
      icon: '🌌',
      iconColor: '#1E3A8A',
      growthType: 'simple',
      name: 'Stargazing',
      startSmallVersion: 'Step outside and find one star.',
      popularityScore: 79,
      scientificReference:
        'Piff et al. (2015) - Awe, the small self, and prosocial behavior',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Walk in the rain (with appropriate gear) for 15 minutes. Rain sounds and petrichor have calming effects on the nervous system.',
      estimatedMinutes: 15,
      frequency: 'weekly',
      icon: '🌧️',
      iconColor: '#64748B',
      growthType: 'simple',
      name: 'Rain Walking',
      startSmallVersion: 'Step outside and feel one raindrop.',
      popularityScore: 74,
      scientificReference:
        'Jiang et al. (2018) - Effects of natural sounds on stress recovery',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice cloud watching for 10 minutes. Sky gazing activates the default mode network and promotes creative thinking.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '☁️',
      iconColor: '#94A3B8',
      growthType: 'simple',
      name: 'Cloud Watching',
      startSmallVersion: 'Look up and find one cloud shape.',
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
      estimatedMinutes: 3,
      frequency: FREQUENCY_DAILY,
      icon: '🫨',
      iconColor: '#F97316',
      growthType: 'simple',
      name: 'Tension Release Shaking',
      startSmallVersion: 'Shake your hands out for 10 seconds.',
      popularityScore: 80,
      scientificReference:
        'Berceli (2008) - Tension and Trauma Release Exercises (TRE)',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice self-massage on hands, feet, or face for 5 minutes. Self-massage reduces cortisol and increases parasympathetic activity.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🙌',
      iconColor: '#EC4899',
      growthType: 'simple',
      name: 'Self-Massage Ritual',
      startSmallVersion: 'Rub your hands together for 30 seconds.',
      popularityScore: 82,
      scientificReference:
        'Field et al. (2005) - Cortisol decreases and serotonin and dopamine increase following massage therapy',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Stretch your jaw, massage temples, and relax facial muscles for 2 minutes. Facial tension correlates with overall stress levels.',
      estimatedMinutes: 2,
      frequency: FREQUENCY_DAILY,
      icon: '😌',
      iconColor: '#8B5CF6',
      growthType: 'simple',
      name: 'Facial Relaxation',
      startSmallVersion: 'Unclench your jaw for one breath.',
      popularityScore: 78,
      scientificReference:
        'Cram (1980) - EMG and the relaxation response: jaw muscle tension and stress',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Stand with bare feet on ground and notice all sensations for 2 minutes. Interoceptive awareness improves emotional regulation.',
      estimatedMinutes: 2,
      frequency: FREQUENCY_DAILY,
      icon: '🦶',
      iconColor: '#A16207',
      growthType: 'simple',
      name: 'Foot Grounding',
      startSmallVersion: 'Press both feet into the floor for 10 seconds.',
      popularityScore: 77,
      scientificReference:
        'Farb et al. (2015) - Interoception, contemplative practice, and health',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Roll a tennis ball under your feet for 5 minutes. Plantar fascia massage releases full-body tension through fascial connections.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🎾',
      iconColor: '#84CC16',
      growthType: 'simple',
      name: 'Foot Rolling',
      startSmallVersion: 'Roll your foot over a tennis ball for 10 seconds.',
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
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '🎯',
      iconColor: '#DC2626',
      growthType: 'simple',
      name: 'Purpose Statement Review',
      startSmallVersion: 'Read your mission statement out loud once.',
      popularityScore: 86,
      scientificReference:
        'Hill & Turiano (2014) - Purpose in life and mortality',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Visualize your ideal future self for 10 minutes. Future self-continuity increases long-term decision making and savings behavior.',
      estimatedMinutes: 10,
      frequency: 'weekly',
      icon: '🔮',
      iconColor: '#7C3AED',
      growthType: 'simple',
      name: 'Future Self Visualization',
      startSmallVersion: 'Picture your future self for one breath.',
      popularityScore: 83,
      scientificReference:
        'Hershfield (2011) - Future self-continuity: How conceptions of the future self transform decision-making',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Write a letter to yourself to open in 1 year. Prospective reflection increases life satisfaction and sense of progress.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '✉️',
      iconColor: '#059669',
      growthType: 'average',
      name: 'Letter to Future Self',
      startSmallVersion: 'Write one sentence to your future self.',
      popularityScore: 80,
      scientificReference:
        'Wilson et al. (2005) - Affective forecasting and the durability bias',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice memento mori: reflect briefly on mortality to clarify priorities. Death awareness increases gratitude and meaningful action.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '⏳',
      iconColor: '#64748B',
      growthType: 'simple',
      name: 'Mortality Reflection',
      startSmallVersion: 'Picture today as your last for one breath.',
      popularityScore: 76,
      scientificReference:
        'Cozzolino et al. (2004) - Greed, death, and values: Mortality salience and meaning',
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Identify one legacy action - something whose impact outlasts you. Legacy motivation increases well-being and generativity.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '🏛️',
      iconColor: '#B45309',
      growthType: 'average',
      name: 'Legacy Action',
      startSmallVersion: 'Name one thing you want to leave behind.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🧴',
      iconColor: '#FBBF24',
      growthType: 'simple',
      name: 'Mindful Moisturizing',
      startSmallVersion: 'Rub lotion into your hands slowly.',
      popularityScore: 77,
      scientificReference:
        'Neff (2003) - Self-compassion and physical self-care practices',
    });

    await insertWithTracking({
      category: 'recovery',
      createdAt: now,
      description:
        'Take a bath with epsom salts for 20 minutes. Magnesium absorption through skin promotes muscle relaxation and better sleep.',
      estimatedMinutes: 20,
      frequency: 'weekly',
      icon: '🛁',
      iconColor: '#38BDF8',
      growthType: 'average',
      name: 'Epsom Salt Bath',
      startSmallVersion: 'Soak your feet in warm water for 60 seconds.',
      popularityScore: 81,
      scientificReference:
        'Proksch et al. (2017) - Percutaneous absorption of magnesium',
    });

    await insertWithTracking({
      category: 'recovery',
      createdAt: now,
      description:
        'Apply a face mask and relax for 15 minutes. Self-care rituals activate the parasympathetic nervous system.',
      estimatedMinutes: 15,
      frequency: 'weekly',
      icon: '🧖‍♀️',
      iconColor: '#A855F7',
      growthType: 'simple',
      name: 'Face Mask Ritual',
      startSmallVersion: 'Splash your face with water and breathe slowly.',
      popularityScore: 78,
      scientificReference:
        'Gilbert (2009) - The Compassionate Mind: self-soothing systems',
    });

    await insertWithTracking({
      category: 'recovery',
      createdAt: now,
      description:
        'Change into comfortable clothes when arriving home. Clothing transitions help create psychological boundaries between work and rest.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '👕',
      iconColor: '#6366F1',
      growthType: 'simple',
      name: 'Comfort Clothes Transition',
      startSmallVersion: 'Change into one comfortable item.',
      popularityScore: 79,
      scientificReference:
        'Adam & Galinsky (2012) - Enclothed cognition: systematic influence of clothes',
    });

    await insertWithTracking({
      category: 'recovery',
      createdAt: now,
      description:
        'Light a candle and sit in candlelight for 10 minutes. Low, warm light reduces cortisol and promotes melatonin production.',
      estimatedMinutes: 10,
      frequency: FREQUENCY_DAILY,
      icon: '🕯️',
      iconColor: '#F59E0B',
      growthType: 'simple',
      name: 'Candlelight Relaxation',
      startSmallVersion: 'Light one candle and watch it for 30 seconds.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🍽️',
      iconColor: '#F97316',
      growthType: 'simple',
      name: 'Highs and Lows Ritual',
      startSmallVersion: 'Ask one person, "what was your high today?"',
      popularityScore: 88,
      scientificReference:
        'Fiese et al. (2002) - Family routines and rituals: A context for development',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Give a 6-second hug to someone you love. Extended hugs release oxytocin and deepen emotional connection.',
      estimatedMinutes: 1,
      frequency: FREQUENCY_DAILY,
      icon: '🤗',
      iconColor: '#EC4899',
      growthType: 'simple',
      name: '6-Second Hug',
      startSmallVersion: 'Give one 6-second hug today.',
      popularityScore: 87,
      scientificReference:
        'Gottman (1999) - The importance of extended physical affection in relationships',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Schedule a weekly date night (no phones, undivided attention). Regular couple rituals are the strongest predictor of relationship longevity.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '❤️',
      iconColor: '#DC2626',
      growthType: 'average',
      name: 'Weekly Date Night',
      startSmallVersion: 'Block 30 minutes on the calendar for your partner.',
      popularityScore: 91,
      scientificReference:
        'Wilcox & Dew (2012) - Date nights and marital satisfaction',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Check in with 3 close friends monthly with a genuine "how are you really doing?" Maintaining close friendships requires intentional effort.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '📱',
      iconColor: '#3B82F6',
      growthType: 'simple',
      name: 'Friend Check-Ins',
      startSmallVersion: 'Send one friend a "how are you really?" text.',
      popularityScore: 84,
      scientificReference:
        'Hall (2019) - How many hours does it take to make a friend?',
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Write and send a handwritten letter or card monthly. Handwritten correspondence has 7x more emotional impact than digital messages.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '💌',
      iconColor: '#F43F5E',
      growthType: 'average',
      name: 'Handwritten Letters',
      startSmallVersion: 'Write one sentence on a postcard.',
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
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🗣️',
      iconColor: '#059669',
      growthType: 'simple',
      name: 'Language Word Learning',
      startSmallVersion: 'Look up one new word.',
      popularityScore: 86,
      scientificReference:
        'Bialystok et al. (2007) - Bilingualism as protection against onset of dementia',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Take a different route to a familiar destination weekly. Novel navigation builds hippocampal gray matter and cognitive reserve.',
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '🗺️',
      iconColor: '#F59E0B',
      growthType: 'simple',
      name: 'Navigation Novelty',
      startSmallVersion: 'Take one new turn on your walk.',
      popularityScore: 77,
      scientificReference:
        'Maguire et al. (2000) - Navigation-related structural change in the hippocampi of taxi drivers',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Solve one logic puzzle daily (sudoku, chess puzzles, riddles). Regular mental challenges maintain fluid intelligence.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🧩',
      iconColor: '#7C3AED',
      growthType: 'simple',
      name: 'Daily Logic Puzzle',
      startSmallVersion: 'Solve one easy puzzle.',
      popularityScore: 84,
      scientificReference:
        'Verghese et al. (2003) - Leisure activities and the risk of dementia',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Memorize one poem, quote, or phone number monthly. Intentional memorization exercises keep memory systems active.',
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '📜',
      iconColor: '#B45309',
      growthType: 'average',
      name: 'Memory Challenges',
      startSmallVersion: 'Memorize one phone number digit by digit.',
      popularityScore: 78,
      scientificReference:
        'Nyberg et al. (2003) - Neural correlates of successful memory encoding',
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Watch an educational documentary or TED talk weekly on an unfamiliar topic. Novel information stimulates dopamine and curiosity circuits.',
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '🎬',
      iconColor: '#DC2626',
      growthType: 'simple',
      name: 'Documentary Learning',
      startSmallVersion: 'Watch a 60-second clip of something new.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🌸',
      iconColor: '#D946EF',
      growthType: 'simple',
      name: 'Aromatherapy Practice',
      startSmallVersion: 'Take one slow inhale of an essential oil.',
      popularityScore: 79,
      scientificReference:
        'Moss et al. (2003) - Aromas of rosemary and lavender essential oils affect cognition and mood',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Eat one meal in complete silence weekly, focusing only on taste and texture. Silent eating improves digestion and food satisfaction.',
      estimatedMinutes: 25,
      frequency: 'weekly',
      icon: '🤫',
      iconColor: '#64748B',
      growthType: 'average',
      name: 'Silent Eating',
      startSmallVersion: 'Take one bite in silence with no phone.',
      popularityScore: 76,
      scientificReference:
        'Robinson et al. (2014) - Eating attentively: A systematic review of eating with attention',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Do 10 squats every time you use the bathroom. "Habit stacking" makes exercise automatic and adds up to 50+ squats daily.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🚽',
      iconColor: '#10B981',
      growthType: 'simple',
      name: 'Bathroom Squats',
      startSmallVersion: 'Do one squat after washing your hands.',
      popularityScore: 83,
      scientificReference:
        'Clear (2018) - Atomic Habits: habit stacking methodology',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Drink a glass of water before every meal. Pre-meal water intake reduces calorie consumption by 75-90 calories per meal.',
      estimatedMinutes: 1,
      frequency: FREQUENCY_DAILY,
      icon: '🥛',
      iconColor: '#38BDF8',
      growthType: 'simple',
      name: 'Pre-Meal Water',
      startSmallVersion: 'Take one sip of water before your next bite.',
      popularityScore: 85,
      scientificReference:
        'Davy et al. (2008) - Water consumption reduces energy intake at a breakfast meal',
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Stand and do calf raises while brushing teeth. Two minutes twice daily adds up to 14 minutes of exercise weekly.',
      estimatedMinutes: 14,
      frequency: FREQUENCY_DAILY,
      icon: '🦵',
      iconColor: '#F97316',
      growthType: 'simple',
      name: 'Toothbrush Calf Raises',
      startSmallVersion: 'Do 3 calf raises while brushing teeth.',
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
      estimatedMinutes: 1,
      frequency: FREQUENCY_DAILY,
      icon: '🪟',
      iconColor: '#FBBF24',
      growthType: 'simple',
      name: 'Morning Window Gaze',
      startSmallVersion: 'Look out the window for 10 seconds.',
      popularityScore: 82,
      scientificReference:
        'Huberman (2021) - Morning light exposure before device use',
    });

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Smile at yourself in the mirror for 1 minute upon waking. Facial feedback hypothesis: smiling triggers positive emotions.',
      estimatedMinutes: 1,
      frequency: FREQUENCY_DAILY,
      icon: '😊',
      iconColor: '#FBBF24',
      growthType: 'simple',
      name: 'Morning Mirror Smile',
      startSmallVersion: 'Smile at yourself for 3 seconds.',
      popularityScore: 77,
      scientificReference:
        'Kraft & Pressman (2012) - Grin and bear it: Smiling facilitates stress recovery',
    });

    await insertWithTracking({
      category: 'morning_routine',
      createdAt: now,
      description:
        'Do 5 minutes of light movement (stretching, walking) immediately after waking. Gentle movement clears adenosine and increases alertness.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🌅',
      iconColor: '#F97316',
      growthType: 'simple',
      name: 'Wake-Up Movement',
      startSmallVersion: 'Do 10 seconds of arm circles.',
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
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🧠',
      iconColor: '#6366F1',
      growthType: 'simple',
      name: 'Evening Brain Dump',
      startSmallVersion: 'Write one worry on paper before bed.',
      popularityScore: 86,
      scientificReference:
        'Scullin et al. (2018) - The effects of bedtime writing on difficulty falling asleep',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Prepare clothes and bag for next day before bed. Reduces morning decision fatigue and creates closure ritual for the day.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '👔',
      iconColor: '#8B5CF6',
      growthType: 'simple',
      name: 'Next-Day Prep',
      startSmallVersion: 'Lay out tomorrow\'s shirt.',
      popularityScore: 83,
      scientificReference:
        'Baumeister & Tierney (2011) - Willpower: Rediscovering the Greatest Human Strength',
    });

    await insertWithTracking({
      category: 'sleep',
      createdAt: now,
      description:
        'Wear blue light blocking glasses 2-3 hours before bed. Blocks 90%+ of melatonin-suppressing light from screens.',
      estimatedMinutes: 180,
      frequency: FREQUENCY_DAILY,
      icon: '👓',
      iconColor: '#F59E0B',
      growthType: 'simple',
      name: 'Blue Light Blocking',
      startSmallVersion: 'Switch your phone to night mode.',
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
      estimatedMinutes: 3,
      frequency: FREQUENCY_DAILY,
      icon: '🙏',
      iconColor: '#059669',
      growthType: 'simple',
      name: 'Pre-Purchase Gratitude',
      startSmallVersion: 'Name one thing you already own and love.',
      popularityScore: 79,
      scientificReference:
        'Lambert et al. (2009) - Gratitude reduces materialism',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Transfer spare change from purchases to savings (round-up savings). Micro-savings add up to hundreds annually without noticing.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🪙',
      iconColor: '#84CC16',
      growthType: 'simple',
      name: 'Round-Up Savings',
      startSmallVersion: 'Move spare change to savings.',
      popularityScore: 81,
      scientificReference:
        'Thaler (2004) - Save More Tomorrow: Behavioral economics of saving',
    });

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Review and appreciate your net worth monthly (even if negative). Financial awareness correlates with better financial decisions.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '📊',
      iconColor: '#3B82F6',
      growthType: 'simple',
      name: 'Net Worth Check',
      startSmallVersion: 'Open your finance app and look once.',
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

// ═══════════════════════════════════════════════════════════════
// Research-Backed Templates (April 2026)
// Evidence-based habits from behavioral psychology, YouTube creators, and meta-analyses
// ═══════════════════════════════════════════════════════════════

export const seedResearchBackedTemplates = internalMutation({
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
      if (PRUNED_TEMPLATE_NAMES.has(templateNameKey)) {
        _skippedCount++;
        skippedNames.push(template.name);
        return false;
      }
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
    // RELATIONSHIPS — Gottman-backed relationship habits
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Have a 20-minute stress-reducing conversation with your partner at the end of the day. Gottman research on 3,000+ couples shows dedicating ~6 hours/week to small consistent moments dramatically improves relationship quality.',
      estimatedMinutes: 20,
      frequency: FREQUENCY_DAILY,
      icon: '💬',
      iconColor: '#F43F5E',
      growthType: 'average',
      name: 'Stress-Reducing Conversation',
      startSmallVersion: 'Ask your partner, "how was your day?" with phone down.',
      popularityScore: 88,
      scientificReference:
        'Gottman Institute - 40-year longitudinal couples research',
      tips: [
        'Focus on listening and understanding, not solving',
        'Take turns — each person gets 10 minutes',
        'Ask "How was your day?" and actually listen to the answer',
      ],
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Express genuine appreciation to your partner at least once daily. Gottman research shows stable couples maintain a 5:1 ratio of positive to negative interactions — this predicts relationship stability with 90%+ accuracy.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '❤️',
      iconColor: '#F43F5E',
      growthType: 'simple',
      name: 'Express Daily Appreciation',
      startSmallVersion: 'Tell your partner one thing you appreciate.',
      popularityScore: 90,
      scientificReference:
        'Gottman (1999) - The Marriage Clinic: 5:1 positive-to-negative interaction ratio',
      tips: [
        'Be specific — "I appreciated you making dinner" beats "thanks"',
        'Notice small things, not just grand gestures',
        'Say it out loud — thinking it doesn\'t count',
      ],
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Ask your partner one meaningful question about their inner world. Gottman calls this "Love Maps" — couples with detailed knowledge of each other\'s world are 60% more likely to report relationship satisfaction.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🗺️',
      iconColor: '#F43F5E',
      growthType: 'simple',
      name: 'Love Maps Question',
      startSmallVersion: 'Ask your partner one curious question.',
      popularityScore: 85,
      scientificReference:
        'Gottman Institute - Sound Relationship House theory',
      tips: [
        'Try: "What\'s something you\'re looking forward to this week?"',
        'Ask about dreams, worries, or things they\'re learning',
        'Update your map — people change over time',
      ],
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Share a kiss lasting at least 6 seconds with your partner daily. Long enough to activate bonding neurochemistry (oxytocin release). Recommended by Gottman as a daily ritual of connection.',
      estimatedMinutes: 1,
      frequency: FREQUENCY_DAILY,
      icon: '💋',
      iconColor: '#F43F5E',
      growthType: 'simple',
      name: 'Six-Second Kiss',
      startSmallVersion: 'Give your partner one 6-second kiss.',
      popularityScore: 82,
      scientificReference:
        'Gottman Institute - Rituals of connection research',
      tips: [
        'Make it a hello/goodbye ritual',
        '6 seconds is longer than you think — count it',
        'Be present — put the phone down first',
      ],
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Maintain at least one weekly recurring social commitment (dinner with friends, sports league, coffee date). Pre-scheduled events prevent the loneliness drift that happens when socializing depends on spontaneous plans.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '📅',
      iconColor: '#F43F5E',
      growthType: 'average',
      name: 'Standing Social Events',
      startSmallVersion: 'Reply yes to one invitation.',
      popularityScore: 83,
      scientificReference:
        'Holt-Lunstad et al. (2010) - Social relationships and mortality risk meta-analysis',
      tips: [
        'Pick the same day/time each week for consistency',
        'Even one recurring event dramatically reduces isolation',
        'Alternate hosting to share the effort',
      ],
    });

    // ═══════════════════════════════════════════════════════════════
    // SUBTRACTION — "Not doing" habits
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'subtraction',
      createdAt: now,
      description:
        'No phone or screens for the first 60 minutes after waking. Preserves your natural willpower and attention. Recommended by Dr. K (HealthyGamerGG), Huberman, and Matt D\'Avella as one of the highest-impact daily habits.',
      estimatedMinutes: 60,
      frequency: FREQUENCY_DAILY,
      icon: '📵',
      iconColor: '#7C3AED',
      growthType: 'complex',
      name: 'Phone-Free First Hour',
      startSmallVersion: 'Leave your phone in another room for 5 minutes after waking.',
      popularityScore: 91,
      scientificReference:
        'Attention restoration theory — Kaplan (1995); extended by smartphone research 2020-2025',
      tips: [
        'Charge your phone outside the bedroom',
        'Use a physical alarm clock instead',
        'Fill the time with a morning routine you enjoy',
      ],
    });

    await insertWithTracking({
      category: 'subtraction',
      createdAt: now,
      description:
        'Stop all caffeine at least 6 hours before bedtime. A double-blind RCT showed even moderate caffeine (400mg) consumed 6 hours before bed still reduced total sleep time by over 1 hour.',
      estimatedMinutes: 360,
      frequency: FREQUENCY_DAILY,
      icon: '☕',
      iconColor: '#7C3AED',
      growthType: 'average',
      name: 'Caffeine Cutoff',
      startSmallVersion: 'Switch to water at 2 PM today.',
      popularityScore: 89,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/24235903/',
      scientificReference:
        'Drake et al. (2013) - Caffeine effects on sleep, Journal of Clinical Sleep Medicine',
      tips: [
        'Calculate your cutoff: bedtime minus 6 hours',
        'Switch to decaf or herbal tea after your cutoff',
        'Watch for hidden caffeine in chocolate and sodas',
      ],
    });

    // ═══════════════════════════════════════════════════════════════
    // ENVIRONMENTAL DESIGN — Upstream habits that enable everything else
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'environmental_design',
      createdAt: now,
      description:
        'Spend 2 minutes each evening resetting your environment for tomorrow\'s habits (lay out workout clothes, prep coffee, clear desk). Research shows environmental cues are a stronger driver of behavior than motivation.',
      estimatedMinutes: 2,
      frequency: FREQUENCY_DAILY,
      icon: '🏠',
      iconColor: '#059669',
      growthType: 'simple',
      name: 'Evening Environment Reset',
      startSmallVersion: 'Put one thing back where it belongs.',
      popularityScore: 87,
      scientificReference:
        'Mazar & Wood (2022) - Environmental cues and habitual behavior, Annual Review of Psychology',
      tips: [
        'Set a 2-minute timer — it\'s faster than you think',
        'Prep for your most important morning habit first',
        'Make it part of your bedtime routine',
      ],
    });

    await insertWithTracking({
      category: 'environmental_design',
      createdAt: now,
      description:
        'Add one deliberate friction step to an unwanted behavior each week (e.g., log out of social media after each use, move phone charger to another room). Even small increases in effort reduce unwanted behavior by 50%+.',
      estimatedMinutes: 2,
      frequency: 'weekly',
      icon: '🚧',
      iconColor: '#059669',
      growthType: 'average',
      name: 'Friction Addition',
      startSmallVersion: 'Log out of one app you check too much.',
      popularityScore: 82,
      scientificReference:
        'Verplanken et al. (2021) - Habit discontinuity hypothesis, University of Bath',
      tips: [
        'Start with your most problematic habit',
        'Add just one friction point — don\'t overdo it',
        'Moving something 6 feet away can cut usage 50%',
      ],
    });

    await insertWithTracking({
      category: 'environmental_design',
      createdAt: now,
      description:
        'Place a visible physical cue in your environment for each desired habit (book on pillow for reading, water bottle on desk for hydration). Research shows event-based cues build automaticity better than app notifications.',
      estimatedMinutes: 2,
      frequency: 'weekly',
      icon: '👁️',
      iconColor: '#059669',
      growthType: 'simple',
      name: 'Visual Cue Placement',
      startSmallVersion: 'Place one object somewhere you\'ll see it.',
      popularityScore: 80,
      scientificReference:
        'Stawarz et al. (2015) - Event-based cues outperform reminders for habit formation',
      tips: [
        'One cue per habit — keep it simple',
        'Place the cue where you\'ll see it at the right moment',
        'Physical cues beat digital reminders for building automaticity',
      ],
    });

    // ═══════════════════════════════════════════════════════════════
    // HEALTH & FITNESS — Evidence-based additions
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Walk 7,000+ steps daily. A Lancet Public Health (2025) meta-analysis of 24 cohorts found the sharpest mortality reduction between 2,000-7,000 steps — more achievable than 10,000 and nearly as beneficial.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🚶',
      iconColor: '#10B981',
      growthType: 'average',
      name: '7,000 Steps',
      startSmallVersion: 'Take a 2-minute walk around your block.',
      popularityScore: 92,
      scientificLink:
        'https://www.thelancet.com/journals/lanpub/article/PIIS2468-2667(25)00164-1/fulltext',
      scientificReference:
        'Lancet Public Health (2025) - Step count dose-response meta-analysis, 24 cohorts',
      tips: [
        'Take walking meetings when possible',
        'A 30-minute walk is roughly 3,000-4,000 steps',
        'Park further away or take one extra loop around the block',
      ],
    });

    await insertWithTracking({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Track daily protein intake targeting 1.2-1.6g per kg of bodyweight. Meta-analysis shows this range significantly increases lean body mass and supports weight management. Beyond 1.62g/kg shows no further benefit.',
      estimatedMinutes: 25,
      frequency: FREQUENCY_DAILY,
      icon: '🥩',
      iconColor: '#10B981',
      growthType: 'average',
      name: 'Daily Protein Target',
      startSmallVersion: 'Add one boiled egg to your day.',
      popularityScore: 86,
      scientificLink: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8978023/',
      scientificReference:
        'Nunes et al. (2022) - Protein intake and body composition, Journal of Cachexia, Sarcopenia and Muscle',
      tips: [
        'Calculate your target: bodyweight in kg x 1.4',
        'Front-load protein at breakfast for better satiety',
        'Track for a week to learn your baseline, then adjust',
      ],
    });

    // ═══════════════════════════════════════════════════════════════
    // PRODUCTIVITY — Research-backed additions
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Conduct a 15-20 minute weekly review: reflect on the past week, celebrate wins, and set priorities for the next. Recommended by Ali Abdaal and Thomas Frank as a keystone productivity habit.',
      estimatedMinutes: 15,
      frequency: 'weekly',
      icon: '📋',
      iconColor: '#3B82F6',
      growthType: 'average',
      name: 'Weekly Review',
      startSmallVersion: 'Write one win from this week.',
      popularityScore: 87,
      scientificReference:
        'Implementation intentions research — Gollwitzer (1999); planning increases follow-through 2-3x',
      tips: [
        'Block 20 minutes on Sunday or Friday',
        'Review: What worked? What didn\'t? What\'s next?',
        'Pick your single most important task for next week',
      ],
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Pair an enjoyable activity exclusively with a "should" behavior (only listen to favorite podcast while exercising, only watch shows while stretching). Research shows this increases target behavior by 29-51%.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '🎧',
      iconColor: '#3B82F6',
      growthType: 'simple',
      name: 'Temptation Bundling',
      startSmallVersion: 'Queue your favorite podcast for your next walk.',
      popularityScore: 85,
      scientificLink:
        'https://pubsonline.informs.org/doi/10.1287/mnsc.2013.1784',
      scientificReference:
        'Milkman et al. (2014) - Holding the Hunger Games Hostage, Management Science',
      tips: [
        'Pick your guiltiest pleasure and pair it with your hardest habit',
        'Be strict — ONLY enjoy the reward during the target behavior',
        'Start with exercise + entertainment — highest success pairing',
      ],
    });

    await insertWithTracking({
      category: 'productivity',
      createdAt: now,
      description:
        'Set 90-day goals ("Quarterly Quests") instead of annual resolutions. Shorter timeframes are more manageable and have higher completion rates. Advocated by Ali Abdaal.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '🎯',
      iconColor: '#3B82F6',
      growthType: 'average',
      name: 'Quarterly Quest Setting',
      startSmallVersion: 'Write one 90-day goal.',
      popularityScore: 80,
      scientificReference:
        'Locke & Latham (2002) - Goal setting theory; shorter feedback loops increase persistence',
      tips: [
        'Set 1-3 goals per quarter maximum',
        'Review progress weekly',
        'Celebrate completion before setting new quests',
      ],
    });

    // ═══════════════════════════════════════════════════════════════
    // MINDFULNESS — Behavioral science additions
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Immediately after completing any habit, do a brief celebration (fist pump, smile, say "yes!") for 2-3 seconds. BJ Fogg\'s research on 40,000+ participants shows celebration is the critical differentiator for habits that stick.',
      estimatedMinutes: 1,
      frequency: FREQUENCY_DAILY,
      icon: '🎉',
      iconColor: '#8B5CF6',
      growthType: 'simple',
      name: 'Post-Behavior Celebration',
      startSmallVersion: 'Smile and say "yes!" after your next task.',
      popularityScore: 84,
      scientificReference:
        'Fogg (2020) - Tiny Habits, Stanford Behavior Design Lab (40,000+ participants)',
      tips: [
        'Pick a celebration that feels natural — don\'t force it',
        'Do it immediately — timing matters for neural wiring',
        'Even a quiet internal "nice!" works',
      ],
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Walk for 30-60 minutes with NO music, podcasts, or audiobooks. Just walk and think. Dr. K (HealthyGamerGG) recommends this as one of the most powerful habits for rebuilding attention span and processing emotions.',
      estimatedMinutes: 30,
      frequency: FREQUENCY_DAILY,
      icon: '🚶‍♂️',
      iconColor: '#8B5CF6',
      growthType: 'complex',
      name: 'Unstimulated Walk',
      startSmallVersion: 'Walk to the mailbox with no headphones.',
      popularityScore: 83,
      scientificReference:
        'Kaplan (1995) - Attention Restoration Theory; Dr. Alok Kanojia (HealthyGamerGG)',
      tips: [
        'Leave your phone at home or on airplane mode',
        'Start with 15 minutes if an hour feels too long',
        'Let your mind wander — that\'s the point',
      ],
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Write exactly one sentence about your day before bed. The ultra-low barrier makes this sustainable while still activating the cognitive processing that reduces rumination. Based on Pennebaker\'s expressive writing research.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '✏️',
      iconColor: '#8B5CF6',
      growthType: 'simple',
      name: 'Single-Sentence Journal',
      startSmallVersion: 'Write one sentence about today.',
      popularityScore: 86,
      scientificReference:
        'Pennebaker (2004) - Expressive writing and health; updated through 2023',
      tips: [
        'Keep a notebook by your bed with a pen on top',
        'One sentence only — resist the urge to write more at first',
        'There are no wrong answers — write whatever comes to mind',
      ],
    });

    await insertWithTracking({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Weekly 5-minute written reflection: "What did I do this week that aligns with who I want to become?" Identity-based habits are the strongest predictor of long-term persistence. The identity-behavior link is mutually reinforcing.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '🪞',
      iconColor: '#8B5CF6',
      growthType: 'average',
      name: 'Identity Journaling',
      startSmallVersion: 'Write the words "I am someone who..." once.',
      popularityScore: 84,
      scientificReference:
        'Berzonsky et al. (2023) - Identity and habit persistence, Identity: An International Journal',
      tips: [
        'Start with: "I am becoming someone who..."',
        'Notice actions that match your desired identity',
        'Focus on the person you\'re becoming, not the outcome',
      ],
    });

    // ═══════════════════════════════════════════════════════════════
    // LEARNING — Deliberate practice additions
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Spend 30-60 minutes in deliberate practice of a professional skill — focused effort at the edge of your ability with feedback. Research shows ~4 hours/day is the maximum before diminishing returns.',
      estimatedMinutes: 30,
      frequency: FREQUENCY_DAILY,
      icon: '🎯',
      iconColor: '#7C3AED',
      growthType: 'complex',
      name: 'Deliberate Skill Practice',
      startSmallVersion: 'Practice one rep at the edge of your skill.',
      popularityScore: 85,
      scientificLink: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6731745/',
      scientificReference:
        'Ericsson, Krampe & Tesch-Romer (1993) - Deliberate practice in expert performance',
      tips: [
        'Practice at the edge of your ability — comfortable enough to try, hard enough to fail sometimes',
        'Get feedback — practice without feedback doesn\'t improve performance',
        'Quality over quantity — 30 focused minutes beats 2 distracted hours',
      ],
    });

    await insertWithTracking({
      category: 'learning',
      createdAt: now,
      description:
        'Spend 15-30 minutes learning something completely new (new language, instrument, skill, topic). Novel learning provides a stronger neuroplasticity stimulus than repeating familiar tasks and maintains cognitive reserve.',
      estimatedMinutes: 15,
      frequency: FREQUENCY_DAILY,
      icon: '🧩',
      iconColor: '#7C3AED',
      growthType: 'average',
      name: 'Novel Learning Session',
      startSmallVersion: 'Look up one fact about something new.',
      popularityScore: 83,
      scientificReference:
        'Merzenich et al. (2014) - Neuroplasticity and cognitive training; Harvard Health neuroplasticity review',
      tips: [
        'Novelty is the key — pick something unfamiliar',
        'Rotate topics to maintain the novelty advantage',
        'Even 15 minutes of effortful learning triggers neuroplasticity',
      ],
    });

    // ═══════════════════════════════════════════════════════════════
    // SOCIAL — Connection habits
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Reach out to 2-5 professional contacts per week (emails, coffees, calls). Longitudinal research shows networking directly correlates with salary growth, promotions, and career satisfaction. 70-85% of positions are filled through networking.',
      estimatedMinutes: 5,
      frequency: 'weekly',
      icon: '🤝',
      iconColor: '#F43F5E',
      growthType: 'average',
      name: 'Weekly Networking Outreach',
      startSmallVersion: 'Send one professional message.',
      popularityScore: 81,
      scientificReference:
        'Wolff & Moser (2009) - Effects of Networking on Career Success, Journal of Applied Psychology',
      tips: [
        'Set a specific day for outreach (e.g., Tuesday mornings)',
        'Quality over quantity — one meaningful coffee beats 10 generic emails',
        'Follow up within 48 hours after meetings',
      ],
    });

    await insertWithTracking({
      category: 'social',
      createdAt: now,
      description:
        'Have at least one meaningful social interaction per day (in-person, phone call, or video — not text or social media). Social isolation increases all-cause mortality risk comparable to smoking 15 cigarettes per day.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '👋',
      iconColor: '#F43F5E',
      growthType: 'simple',
      name: 'Daily Meaningful Interaction',
      startSmallVersion: 'Call one person for 60 seconds.',
      popularityScore: 86,
      scientificReference:
        'Holt-Lunstad et al. (2010) - Social relationships and mortality risk meta-analysis',
      tips: [
        'Phone calls count — you don\'t need to meet in person every day',
        'Make it a real conversation, not just a "hey" text',
        'Prioritize face-to-face when possible — it has the strongest effect',
      ],
    });

    // ═══════════════════════════════════════════════════════════════
    // FINANCIAL — FinTok trend
    // ═══════════════════════════════════════════════════════════════

    await insertWithTracking({
      category: 'financial',
      createdAt: now,
      description:
        'Declare your spending intentions before making purchases — say them out loud or text them to an accountability partner. This "loud budgeting" trend from FinTok leverages the accountability effect to reduce impulse spending.',
      estimatedMinutes: 5,
      frequency: FREQUENCY_DAILY,
      icon: '📢',
      iconColor: '#10B981',
      growthType: 'simple',
      name: 'Loud Budgeting',
      startSmallVersion: 'Tell one person what you\'re skipping today.',
      popularityScore: 78,
      scientificReference:
        'Commitment device research — Milkman (2021); social accountability increases follow-through 65%',
      tips: [
        'Text a friend before any purchase over $50',
        'Say "I\'m choosing not to spend on X today" instead of "I can\'t afford it"',
        'Frame it as empowerment, not restriction',
      ],
    });

    return {
      insertedCount: _insertedCount,
      insertedNames,
      message: `${_insertedCount} research-backed templates inserted, ${_skippedCount} skipped (already exist)`,
      skippedCount: _skippedCount,
      skippedNames,
      success: true,
    };
  },
});

// ═══════════════════════════════════════════════════════════════
// Relabel existing templates based on evidence review (April 2026)
// ═══════════════════════════════════════════════════════════════

export const relabelExistingTemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    let updatedCount = 0;
    const updatedNames: string[] = [];

    const updates: Array<{
      name: string;
      patch: Partial<{
        description: string;
        icon: string;
        iconColor: string;
        name: string;
        tips: string[];
      }>;
    }> = [
      {
        name: 'Cold Shower',
        patch: {
          description:
            'Take a 2-3 minute cold shower. Triggers a 200-300% dopamine increase lasting 2+ hours, boosting alertness and mood. Note: immunity and fat-burning claims are not well-supported by current research.',
          tips: [
            'Start with 30 seconds of cold at the end of a warm shower',
            'Focus on the alertness benefit — that\'s what the evidence supports',
            'End on cold — don\'t warm back up for maximum dopamine effect',
          ],
        },
      },
      {
        name: 'Gratitude Journaling',
        patch: {
          description:
            'Write down 3 things you\'re grateful for. Research shows 2-3 times per week is optimal — daily practice can show diminishing returns over time. Focus on specificity and novelty for lasting benefits.',
          tips: [
            'Research suggests 2-3x/week produces stronger effects than daily',
            'Vary what you write about — novelty prevents hedonic adaptation',
            'Include one specific detail about why you appreciate each item',
          ],
        },
      },
      {
        name: 'Daily Reading',
        patch: {
          description:
            'Start with just 2 pages or 10 minutes of reading. This tiny habit version builds consistency — most people naturally scale up. Reading one page daily builds automaticity faster than reading a full chapter once a week.',
          tips: [
            'Put the book on your pillow as a visual cue',
            'Start with 2 pages — you\'ll often read more once you begin',
            'Read before bed to replace screen time',
          ],
        },
      },
      {
        name: 'No Added Sugar',
        patch: {
          description:
            'Add one extra serving of vegetables or whole foods to each meal. Approach-framed habits are more sustainable than avoidance — as whole food intake increases, processed food naturally decreases.',
          icon: '🥦',
          iconColor: '#22C55E',
          name: 'Choose Whole Foods',
          tips: [
            'Add a vegetable to one meal today — start small',
            'Approach framing works better than restriction',
            'As whole food intake rises, processed food naturally drops',
          ],
        },
      },
      {
        name: 'Deliberate Cold Exposure',
        patch: {
          description:
            '11 minutes of deliberate cold exposure per week. Strongly supported for dopamine increase (200-300% for 2+ hours) and improved alertness. Fat-burning and immune system claims are not well-supported by current evidence.',
          tips: [
            'Split into 2-4 sessions of 1-5 minutes each',
            'The alertness and mood benefits are the best-supported effects',
            'End cold — don\'t warm up artificially for maximum benefit',
          ],
        },
      },
      {
        name: 'Body Scan Meditation',
        patch: {
          tips: [
            'Start with just 2 minutes scanning head-to-toe as a micro-habit',
            'Gradually extend to 10-20 minutes as the habit solidifies',
            'Can be done lying in bed before sleep or seated during the day',
            'Focus on noticing sensations without trying to change them',
          ],
        },
      },
    ];

    for (const { name, patch } of updates) {
      const template = await ctx.db
        .query('templates')
        .filter((q) => q.eq(q.field('name'), name))
        .first();
      if (template) {
        await ctx.db.patch(template._id, patch);
        updatedCount++;
        updatedNames.push(name);
      }
    }

    return { success: true, updatedCount, updatedNames };
  },
});

/**
 * Backfill: patch `startSmallVersion` on existing template rows that pre-date
 * the field. Idempotent — only patches rows where the value is currently
 * undefined and a mapping exists by name. Run with:
 *   npx convex run templatesDataSeed:backfillStartSmallVersion
 */
export const backfillStartSmallVersion = internalMutation({
  args: {},
  handler: async (ctx) => {
    let patchedCount = 0;
    const skipped: string[] = [];

    const startSmallByName: Record<string, string> = {
      '5-Minute Meditation': 'Take one slow, mindful breath.',
      'Morning Pages': 'Write a single sentence on the page.',
      'Hydration First': 'Take one sip of water before anything else.',
      'Sunrise Viewing': 'Step outside and face the sun for 30 seconds.',
      'Sun Salutation Flow': 'Do one sun salutation.',
      'Cold Shower': 'End your shower with 10 seconds of cold water.',
      'Make Your Bed': 'Pull up the comforter and smooth it once.',
      '7-Minute Workout': 'Do two push-ups (or two squats).',
      '10,000 Steps': 'Walk to the end of the block and back.',
      'Strength Training': 'Do 5 push-ups against the wall.',
      'Stretching Routine': 'Reach for your toes once.',
      'No Added Sugar': 'Skip the sugar in your next drink.',
      'Meal Prepping': 'Wash one piece of produce.',
      'Daily Yoga Practice': 'Hold downward dog for one breath.',
      'High Fiber Diet': 'Add one piece of fruit to your next meal.',
      'Hydration Tracking': 'Log one glass of water.',
      'Deep Work Session': 'Open the doc and write one sentence.',
      'Pomodoro Technique': 'Set a 5-minute timer and start.',
      'MIT - Most Important Task': 'Write down today\'s one most important task.',
      'Inbox Zero': 'Archive or delete one email.',
      'Evening Planning': 'Write tomorrow\'s first task on a sticky note.',
      'Time Blocking': 'Block 15 minutes on your calendar for one task.',
      'Daily Learning': 'Read one paragraph of something new.',
      'Weekly Desk Cleanup': 'Throw away one piece of trash from your desk.',
      'Work Breaks': 'Stand up and stretch for 30 seconds.',
      'Gratitude Journaling': 'Name one thing you\'re grateful for.',
      'Breathwork Practice': 'Take one slow, deep breath.',
      'Evening Reflection': 'Name one thing that went well today.',
      'Digital Detox Hour': 'Put your phone in another room for 60 seconds.',
      'Walking in Nature': 'Step outside for one full minute.',
      'Progressive Muscle Relaxation': 'Clench and release your fists once.',
      'Loving-Kindness Meditation': 'Silently wish one person well.',
      'Positive Journaling': 'Write one good thing from today.',
      'Mindful Eating': 'Take one bite slowly and notice the taste.',
      'Morning Sunlight Viewing': 'Step outside and face the sun for 30 seconds.',
      'Delay Caffeine 90 Minutes': 'Drink one glass of water before your coffee.',
      'Zone 2 Cardio Training': 'Walk briskly for 5 minutes.',
      'Deliberate Cold Exposure': 'End your shower with 10 seconds of cold.',
      'NSDR Practice': 'Lie down and breathe slowly for 60 seconds.',
      'Physiological Sigh': 'Do one double-inhale, long-exhale sigh.',
      'Evening Light Dimming': 'Turn off one overhead light.',
      'Cool Sleep Temperature': 'Crack the window before bed.',
      'Morning Protein Protocol': 'Eat one boiled egg.',
      'Time-Restricted Eating': 'Note your first and last bite times today.',
      '16:8 Intermittent Fasting': 'Push breakfast back by 30 minutes.',
      'Sauna Therapy': 'Sit in a steamy bathroom for 2 minutes.',
      'Sleep Optimization': 'Set tonight\'s bedtime alarm.',
      'Darkness Before Sleep': 'Close the curtains 60 minutes before bed.',
      'Optimal Sleep Temperature': 'Lower the thermostat one degree.',
      'Daily Social Call': 'Send one "thinking of you" text.',
      'Reach Out Daily': 'Send one "thinking of you" text to a friend.',
      'Quality Partner Time': 'Ask your partner, "how was your day?" with phone down.',
      'Express Gratitude': 'Tell one person "thank you" out loud.',
      'Acts of Service': 'Hold the door for someone today.',
      'Group Activities': 'Reply yes to one invitation.',
      'Consistent Bedtime': 'Set tonight\'s bedtime alarm.',
      'No Screens Before Bed': 'Put your phone in another room 5 minutes before bed.',
      '4-7-8 Breathing': 'Do one round of 4-7-8 breathing.',
      'No Afternoon Caffeine': 'Skip your next afternoon coffee.',
      'Sleep in Complete Darkness': 'Pull the curtains fully closed tonight.',
      'Pre-Sleep Warm Bath': 'Run hot water over your hands and face.',
      '7-9 Hours Sleep': 'Set tonight\'s bedtime alarm.',
      'No Evening Alcohol': 'Pour yourself sparkling water tonight.',
      'Spaced Repetition': 'Review one flashcard.',
      'Daily Language Practice': 'Look up one new word.',
      'Feynman Technique': 'Explain one idea out loud to yourself.',
      'Active Recall': 'Close the book and recall one fact.',
      'Daily Reading': 'Read one page.',
      'Audio Learning': 'Listen to a podcast for 60 seconds.',
      'Music Practice': 'Play one scale.',
      'Handwritten Notes': 'Write one sentence by hand.',
      'Educational Videos': 'Watch a 60-second educational clip.',
      'Study Groups': 'Send one "want to study?" message.',
      'Expense Tracking': 'Log one expense from today.',
      'Automatic Savings': 'Move $1 to savings.',
      'Weekly Budget Review': 'Open your bank app and look once.',
      'Regular Investing': 'Invest $1 today.',
      '24-Hour Purchase Rule': 'Wait 60 seconds before clicking buy.',
      'Bring Lunch': 'Make one item for tomorrow\'s lunch.',
      'Subscription Audit': 'Open one subscription and check the price.',
      'Financial Education': 'Read one paragraph about money.',
      'Negotiate Bills': 'Open one bill and find the customer service number.',
      'Retirement Contributions': 'Move $1 to your retirement account.',
      'Morning Freewriting': 'Write one sentence as fast as you can.',
      'Daily Sketching': 'Doodle for 30 seconds.',
      'Idea Generation': 'Write down one idea.',
      'Daily Photography': 'Take one photo of something around you.',
      'Creative Writing': 'Write one sentence of fiction.',
      'Divergent Thinking': 'List two different uses for one object.',
      'Idea Mashup': 'Combine two random words into a phrase.',
      'Art Appreciation': 'Open one art image and look for 30 seconds.',
      'Skill Exploration': 'Watch a 60-second tutorial on a new skill.',
      'Break Routines': 'Take one different turn on your next walk.',
      'Standing Every Hour': 'Stand up and stretch for 10 seconds.',
      'Posture Check': 'Roll your shoulders back once.',
      'Barefoot Grounding': 'Stand barefoot on grass for 30 seconds.',
      '20-20-20 Eye Rule': 'Look out the window for 20 seconds.',
      'Nasal Breathing': 'Take three breaths through your nose.',
      'VO2 Max Training': 'Sprint up one flight of stairs.',
      'Balance Training': 'Stand on one foot for 10 seconds.',
      'Grip Strength Training': 'Hang from a bar for 5 seconds.',
      'Heat Therapy Bath': 'Run a hot bath and dip your feet in.',
      'Daily Hanging': 'Hang from a doorframe for 5 seconds.',
      'Post-Meal Walk (10 Minutes)': 'Walk to the end of your hallway after eating.',
      'Exercise Snacks (Stair Climbs)': 'Climb one flight of stairs.',
      'Brain Games': 'Solve one easy puzzle on your phone.',
      'Scheduled Worry Time': 'Write one worry on paper.',
      'Body Scan Meditation': 'Notice the feeling in your feet for 10 seconds.',
      '13-Minute Focus Meditation': 'Take three slow breaths with eyes closed.',
      'Dopamine Reset': 'Stay off your phone for 60 seconds.',
      'Dual N-Back Training': 'Do one round of N-back.',
      'Weighted Blanket Sleep': 'Drape a heavy blanket over your legs for 60 seconds.',
      'Sleep Sound Machine': 'Play 30 seconds of pink noise.',
      'Evening Magnesium': 'Take your magnesium pill.',
      'Stimulus Control (CBT-I)': 'Sit on the bed only when you\'re sleepy tonight.',
      '30 Plants Per Week': 'Add one new vegetable to today\'s plate.',
      'Daily Fermented Foods': 'Take one bite of yogurt or kimchi.',
      'Omega-3 Rich Foods': 'Eat a few walnuts.',
      'Eat Greens First': 'Take one bite of vegetables before anything else.',
      'No Late Night Eating': 'Set a kitchen-closed timer.',
      'Mindful Chewing': 'Chew your first bite 20 times.',
      'Protein Per Meal (25–30g)': 'Add one egg to your next meal.',
      'Interdental Cleaning': 'Floss between two teeth.',
      'Hand Hygiene (Key Times)': 'Wash your hands once before your next meal.',
      'Daily Sunscreen': 'Dot sunscreen on your nose.',
      'House Plant Care': 'Touch your plant\'s soil with one finger.',
      'Daily Declutter': 'Toss one item you don\'t use.',
      'Fresh Air Break': 'Open a window for 60 seconds.',
      'Daily Laughter': 'Watch one short comedy clip.',
      'Pet Time': 'Pet your animal for 30 seconds.',
      'Deep Listening': 'Listen to someone for 60 seconds without speaking.',
      'Random Act of Kindness': 'Smile at one stranger today.',
      'Face-to-Face Time': 'Say hi to one person in person today.',
      'Boundary Practice': 'Say "let me get back to you" to one ask.',
      'Daily Compliment': 'Tell one person what you appreciate about them.',
      'Phone-Free Meals': 'Put your phone face-down for one bite.',
      'Social Media Limit': 'Close the app after 60 seconds.',
      'Single-Tasking': 'Close every tab except the one you need.',
      'Airplane Mode Morning': 'Toggle airplane mode on for 5 minutes after waking.',
      'If-Then Planning': 'Write one if-then sentence on a sticky note.',
      'Daily Flossing': 'Floss between two teeth.',
      'Regular Dental Checkups': 'Open the calendar and pick a dentist date.',
      'Calcium Intake Tracking': 'Note one calcium-rich food you ate.',
      'Bone-Strengthening Exercise': 'Do 5 bodyweight squats.',
      'Hearing Protection': 'Tuck earplugs into your bag.',
      'Safe Listening Volume': 'Lower your headphone volume two notches.',
      'Vitamin D Supplementation': 'Take your vitamin D pill.',
      'Preventive Health Checkups': 'Open the calendar and pick a checkup date.',
      'Daily Sun Protection': 'Dot SPF on your nose and forehead.',
      'Joint Mobility Routine': 'Do five wrist and ankle circles.',
      'Mediterranean Plate': 'Drizzle olive oil over your next meal.',
      'Veggies First': 'Take one bite of vegetables before anything else.',
      'Legume Serving': 'Add a spoonful of beans to your next meal.',
      'Daily Nuts Serving': 'Eat 5 almonds.',
      'Whole Grain Swap': 'Swap one slice of bread for whole-wheat.',
      'Blood Pressure Check': 'Strap on the cuff and take one reading.',
      'Annual Eye Exam': 'Open the calendar and pick an eye-exam date.',
      'Annual Hearing Test': 'Open the calendar and pick a hearing-test date.',
      'Monthly Skin Self-Exam': 'Check one mole in the mirror.',
      'Vaccination Status Review': 'Open your vaccine record and read it.',
      'Isometric Wall Sit': 'Hold a wall sit for 10 seconds.',
      '5-Minute Mobility Snack': 'Roll your shoulders and ankles for 30 seconds.',
      'Weekly Goal Review': 'Read last week\'s goals out loud.',
      'Energy Level Tracking': 'Rate your energy 1-10 right now.',
      'Daily Top 3 Priorities': 'Write today\'s one most important task.',
      'Batch Check Messages': 'Close your inbox for the next 5 minutes.',
      'Two-Minute Tidy': 'Put one thing back where it belongs.',
      'Box Breathing': 'Do one round of 4-4-4-4 breathing.',
      'Tech-Free Break': 'Look out the window for 30 seconds, no phone.',
      'Pre-Sleep Review': 'Re-read one paragraph from today.',
      'Weekly Teaching': 'Explain one idea to someone in one sentence.',
      'Deep Questions': 'Ask one person, "what\'s been on your mind?"',
      'Receive Feedback Gracefully': 'Say "thank you" the next time someone gives you feedback.',
      'Career Documentation': 'Add one bullet to your resume.',
      'Professional Networking': 'Send one "thinking of you" message.',
      'Work Insights Journal': 'Write one thing you learned today.',
      'Public Speaking Practice': 'Read one sentence aloud to yourself.',
      'Digital File Organization': 'Move one file into the right folder.',
      'Unstructured Play Time': 'Play with no goal for 60 seconds.',
      'Hands-On Building': 'Pick up the materials and lay them out.',
      'Experimental Cooking': 'Add one new spice to your next dish.',
      'Gardening Therapy': 'Touch the soil of one plant.',
      'Daily Singing': 'Hum one verse of a song.',
      'Free Dance Session': 'Sway for 30 seconds.',
      'Coloring Practice': 'Fill in one shape with color.',
      'Bird Watching': 'Look out the window and find one bird.',
      'Blue Space Time': 'Play 30 seconds of water sounds.',
      'Stargazing': 'Step outside and find one star.',
      'Rain Walking': 'Step outside and feel one raindrop.',
      'Cloud Watching': 'Look up and find one cloud shape.',
      'Tension Release Shaking': 'Shake your hands out for 10 seconds.',
      'Self-Massage Ritual': 'Rub your hands together for 30 seconds.',
      'Facial Relaxation': 'Unclench your jaw for one breath.',
      'Foot Grounding': 'Press both feet into the floor for 10 seconds.',
      'Foot Rolling': 'Roll your foot over a tennis ball for 10 seconds.',
      'Purpose Statement Review': 'Read your mission statement out loud once.',
      'Future Self Visualization': 'Picture your future self for one breath.',
      'Letter to Future Self': 'Write one sentence to your future self.',
      'Mortality Reflection': 'Picture today as your last for one breath.',
      'Legacy Action': 'Name one thing you want to leave behind.',
      'Mindful Moisturizing': 'Rub lotion into your hands slowly.',
      'Epsom Salt Bath': 'Soak your feet in warm water for 60 seconds.',
      'Face Mask Ritual': 'Splash your face with water and breathe slowly.',
      'Comfort Clothes Transition': 'Change into one comfortable item.',
      'Candlelight Relaxation': 'Light one candle and watch it for 30 seconds.',
      'Highs and Lows Ritual': 'Ask one person, "what was your high today?"',
      '6-Second Hug': 'Give one 6-second hug today.',
      'Weekly Date Night': 'Block 30 minutes on the calendar for your partner.',
      'Friend Check-Ins': 'Send one friend a "how are you really?" text.',
      'Handwritten Letters': 'Write one sentence on a postcard.',
      'Language Word Learning': 'Look up one new word.',
      'Navigation Novelty': 'Take one new turn on your walk.',
      'Daily Logic Puzzle': 'Solve one easy puzzle.',
      'Memory Challenges': 'Memorize one phone number digit by digit.',
      'Documentary Learning': 'Watch a 60-second clip of something new.',
      'Aromatherapy Practice': 'Take one slow inhale of an essential oil.',
      'Silent Eating': 'Take one bite in silence with no phone.',
      'Bathroom Squats': 'Do one squat after washing your hands.',
      'Pre-Meal Water': 'Take one sip of water before your next bite.',
      'Toothbrush Calf Raises': 'Do 3 calf raises while brushing teeth.',
      'Morning Window Gaze': 'Look out the window for 10 seconds.',
      'Morning Mirror Smile': 'Smile at yourself for 3 seconds.',
      'Wake-Up Movement': 'Do 10 seconds of arm circles.',
      'Evening Brain Dump': 'Write one worry on paper before bed.',
      'Next-Day Prep': 'Lay out tomorrow\'s shirt.',
      'Blue Light Blocking': 'Switch your phone to night mode.',
      'Pre-Purchase Gratitude': 'Name one thing you already own and love.',
      'Round-Up Savings': 'Move spare change to savings.',
      'Net Worth Check': 'Open your finance app and look once.',
      'Stress-Reducing Conversation': 'Ask your partner, "how was your day?" with phone down.',
      'Express Daily Appreciation': 'Tell your partner one thing you appreciate.',
      'Love Maps Question': 'Ask your partner one curious question.',
      'Six-Second Kiss': 'Give your partner one 6-second kiss.',
      'Standing Social Events': 'Reply yes to one invitation.',
      'Phone-Free First Hour': 'Leave your phone in another room for 5 minutes after waking.',
      'Caffeine Cutoff': 'Switch to water at 2 PM today.',
      'Evening Environment Reset': 'Put one thing back where it belongs.',
      'Friction Addition': 'Log out of one app you check too much.',
      'Visual Cue Placement': 'Place one object somewhere you\'ll see it.',
      '7,000 Steps': 'Take a 2-minute walk around your block.',
      'Daily Protein Target': 'Add one boiled egg to your day.',
      'Weekly Review': 'Write one win from this week.',
      'Temptation Bundling': 'Queue your favorite podcast for your next walk.',
      'Quarterly Quest Setting': 'Write one 90-day goal.',
      'Post-Behavior Celebration': 'Smile and say "yes!" after your next task.',
      'Unstimulated Walk': 'Walk to the mailbox with no headphones.',
      'Single-Sentence Journal': 'Write one sentence about today.',
      'Identity Journaling': 'Write the words "I am someone who..." once.',
      'Deliberate Skill Practice': 'Practice one rep at the edge of your skill.',
      'Novel Learning Session': 'Look up one fact about something new.',
      'Weekly Networking Outreach': 'Send one professional message.',
      'Daily Meaningful Interaction': 'Call one person for 60 seconds.',
      'Loud Budgeting': 'Tell one person what you\'re skipping today.',
    };

    for (const [name, startSmallVersion] of Object.entries(startSmallByName)) {
      const template = await ctx.db
        .query('templates')
        .filter((q) => q.eq(q.field('name'), name))
        .first();
      if (!template) {
        skipped.push(name);
        continue;
      }
      if (template.startSmallVersion) continue;
      await ctx.db.patch(template._id, { startSmallVersion });
      patchedCount++;
    }

    return { success: true, patchedCount, skipped };
  },
});

/**
 * Internal Mutation: Insert ONLY the "Red Light Therapy" template.
 * SEC: Internal only — run once from the Convex dashboard after deploy.
 * Safe to re-run: skips if a template with this name already exists.
 */
export const insertRedLightTherapyTemplate = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query('templates')
      .filter((q) => q.eq(q.field('name'), 'Red Light Therapy'))
      .first();

    if (existing) {
      return { inserted: false, reason: 'already exists' as const };
    }

    await _insertTemplateIfMissing(ctx, {
      category: 'recovery',
      createdAt: Date.now(),
      description:
        'Spend 10-20 minutes in front of a red/near-infrared light panel (660nm + 850nm). Photobiomodulation supports skin health, muscle recovery, and mitochondrial energy production.',
      frequency: FREQUENCY_DAILY,
      icon: '🔴',
      iconColor: '#DC2626',
      growthType: 'simple',
      name: 'Red Light Therapy',
      startSmallVersion: 'Stand in front of the panel for 60 seconds.',
      popularityScore: 75,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/28748217/',
      scientificReference:
        'Hamblin (2017) - Mechanisms and applications of the anti-inflammatory effects of photobiomodulation',
    });

    return { inserted: true };
  },
});

/**
 * Backfill: patch `growthType` on existing template rows that pre-date the
 * field. Idempotent — syncs rows where growthType is missing or differs from
 * the mapping. Run with:
 *   npx convex run templatesDataSeed:backfillGrowthType
 *
 * Source of truth for name → growthType is duplicated here intentionally so
 * a single mutation can backfill the live DB without rerunning the seeders.
 */
export const backfillGrowthType = internalMutation({
  args: {},
  handler: async (ctx) => {
    const growthByName: Record<string, 'simple' | 'average' | 'complex'> = {
      '5-Minute Meditation': 'average',
      'Morning Pages': 'average',
      'Hydration First': 'simple',
      'Sunrise Viewing': 'simple',
      'Sun Salutation Flow': 'average',
      'Cold Shower': 'complex',
      'Make Your Bed': 'simple',
      'Morning Window Gaze': 'simple',
      'Morning Mirror Smile': 'simple',
      'Wake-Up Movement': 'simple',
      'Bilateral Eye Movements': 'simple',
      'Priority First': 'simple',
      'Cold Face Splash': 'simple',
      'Airplane Mode Morning': 'average',
      'Morning Sunlight Viewing': 'simple',
      'Delay Caffeine 90 Minutes': 'average',
      '7-Minute Workout': 'complex',
      '10,000 Steps': 'complex',
      '7,000 Steps': 'average',
      'Strength Training': 'complex',
      'Stretching Routine': 'average',
      'Daily Yoga Practice': 'average',
      'Standing Every Hour': 'simple',
      'Posture Check': 'simple',
      'Barefoot Grounding': 'average',
      '20-20-20 Eye Rule': 'simple',
      'Nasal Breathing': 'average',
      'VO2 Max Training': 'complex',
      'Balance Training': 'average',
      'Grip Strength Training': 'average',
      'Heat Therapy Bath': 'average',
      'Daily Hanging': 'simple',
      'Post-Meal Walk (10 Minutes)': 'average',
      'Exercise Snacks (Stair Climbs)': 'average',
      'Post-Meal Walk': 'average',
      'Backward Walking': 'simple',
      'Movement Snacks': 'average',
      'Bathroom Squats': 'simple',
      'Toothbrush Calf Raises': 'simple',
      'Isometric Wall Sit': 'average',
      '5-Minute Mobility Snack': 'average',
      'Joint Mobility Routine': 'average',
      'No Added Sugar': 'complex',
      'Meal Prepping': 'complex',
      'High Fiber Diet': 'average',
      'Hydration Tracking': 'average',
      '30 Plants Per Week': 'complex',
      'Daily Fermented Foods': 'average',
      'Omega-3 Rich Foods': 'average',
      'Eat Greens First': 'simple',
      'No Late Night Eating': 'average',
      'Mindful Chewing': 'average',
      'Protein Per Meal (25–30g)': 'average',
      'Mediterranean Plate': 'complex',
      'Veggies First': 'simple',
      'Legume Serving': 'average',
      'Daily Nuts Serving': 'simple',
      'Whole Grain Swap': 'simple',
      'Daily Protein Target': 'average',
      'Protein Pacing': 'average',
      'Pre-Meal Vinegar': 'simple',
      'Resistant Starch': 'simple',
      'Pre-Meal Water': 'simple',
      'Silent Eating': 'average',
      'Interdental Cleaning': 'simple',
      'Daily Flossing': 'simple',
      'Regular Dental Checkups': 'simple',
      'Hand Hygiene (Key Times)': 'simple',
      'Daily Sunscreen': 'simple',
      'Daily Sun Protection': 'simple',
      'Calcium Intake Tracking': 'average',
      'Bone-Strengthening Exercise': 'complex',
      'Hearing Protection': 'simple',
      'Safe Listening Volume': 'simple',
      'Vitamin D Supplementation': 'simple',
      'Preventive Health Checkups': 'simple',
      'Blood Pressure Check': 'simple',
      'Annual Eye Exam': 'simple',
      'Annual Hearing Test': 'simple',
      'Monthly Skin Self-Exam': 'simple',
      'Vaccination Status Review': 'simple',
      'Aromatherapy Practice': 'simple',
      'Deep Work Session': 'complex',
      'Pomodoro Technique': 'average',
      'MIT - Most Important Task': 'simple',
      'Inbox Zero': 'average',
      'Evening Planning': 'simple',
      'Time Blocking': 'average',
      'Daily Learning': 'average',
      'Weekly Desk Cleanup': 'average',
      'Work Breaks': 'simple',
      'House Plant Care': 'simple',
      'Daily Declutter': 'simple',
      'Fresh Air Break': 'simple',
      'Phone-Free Meals': 'average',
      'Social Media Limit': 'complex',
      'Single-Tasking': 'complex',
      'If-Then Planning': 'simple',
      'Weekly Goal Review': 'average',
      'Energy Level Tracking': 'simple',
      'Daily Top 3 Priorities': 'simple',
      'Batch Check Messages': 'average',
      'Two-Minute Tidy': 'simple',
      'Ultradian Work Cycles': 'average',
      'Grayscale Phone Mode': 'simple',
      'Fresh Air Ventilation': 'simple',
      'Career Documentation': 'average',
      'Professional Networking': 'average',
      'Work Insights Journal': 'simple',
      'Public Speaking Practice': 'complex',
      'Digital File Organization': 'average',
      'Weekly Review': 'average',
      'Temptation Bundling': 'simple',
      'Quarterly Quest Setting': 'average',
      'Gratitude Journaling': 'simple',
      'Breathwork Practice': 'average',
      'Evening Reflection': 'simple',
      'Digital Detox Hour': 'complex',
      'Walking in Nature': 'average',
      'Progressive Muscle Relaxation': 'average',
      'Loving-Kindness Meditation': 'average',
      'Positive Journaling': 'simple',
      'Mindful Eating': 'average',
      'Brain Games': 'average',
      'Scheduled Worry Time': 'average',
      'Body Scan Meditation': 'average',
      '13-Minute Focus Meditation': 'average',
      'Dopamine Reset': 'complex',
      'Daily Laughter': 'simple',
      'Box Breathing': 'simple',
      'Tech-Free Break': 'average',
      'Bird Watching': 'simple',
      'Blue Space Time': 'average',
      'Stargazing': 'simple',
      'Rain Walking': 'simple',
      'Cloud Watching': 'simple',
      'Tension Release Shaking': 'simple',
      'Self-Massage Ritual': 'simple',
      'Facial Relaxation': 'simple',
      'Foot Grounding': 'simple',
      'Foot Rolling': 'simple',
      'Purpose Statement Review': 'simple',
      'Future Self Visualization': 'simple',
      'Letter to Future Self': 'average',
      'Mortality Reflection': 'simple',
      'Legacy Action': 'average',
      'Post-Behavior Celebration': 'simple',
      'Unstimulated Walk': 'complex',
      'Single-Sentence Journal': 'simple',
      'Identity Journaling': 'average',
      'Zone 2 Cardio Training': 'complex',
      'Deliberate Cold Exposure': 'complex',
      'NSDR Practice': 'average',
      'Physiological Sigh': 'simple',
      'Evening Light Dimming': 'simple',
      'Cool Sleep Temperature': 'simple',
      'Morning Protein Protocol': 'average',
      'Time-Restricted Eating': 'complex',
      '16:8 Intermittent Fasting': 'complex',
      'Sauna Therapy': 'complex',
      'Sleep Optimization': 'average',
      'Darkness Before Sleep': 'simple',
      'Optimal Sleep Temperature': 'simple',
      'Daily Social Call': 'average',
      'Reach Out Daily': 'simple',
      'Quality Partner Time': 'average',
      'Express Gratitude': 'simple',
      'Acts of Service': 'average',
      'Group Activities': 'complex',
      'Deep Listening': 'average',
      'Random Act of Kindness': 'simple',
      'Face-to-Face Time': 'simple',
      'Boundary Practice': 'complex',
      'Daily Compliment': 'simple',
      'Deep Questions': 'simple',
      'Receive Feedback Gracefully': 'complex',
      'Pet Time': 'simple',
      'Active Constructive Responding': 'average',
      'Vulnerability Practice': 'complex',
      'Eye Contact Practice': 'simple',
      'Reflective Listening': 'average',
      'Highs and Lows Ritual': 'simple',
      '6-Second Hug': 'simple',
      'Weekly Date Night': 'average',
      'Friend Check-Ins': 'simple',
      'Handwritten Letters': 'average',
      'Weekly Networking Outreach': 'average',
      'Daily Meaningful Interaction': 'simple',
      'Consistent Bedtime': 'average',
      'No Screens Before Bed': 'average',
      '4-7-8 Breathing': 'simple',
      'No Afternoon Caffeine': 'average',
      'Sleep in Complete Darkness': 'simple',
      'Pre-Sleep Warm Bath': 'average',
      '7-9 Hours Sleep': 'average',
      'No Evening Alcohol': 'average',
      'Weighted Blanket Sleep': 'simple',
      'Sleep Sound Machine': 'simple',
      'Evening Magnesium': 'simple',
      'Stimulus Control (CBT-I)': 'complex',
      'Evening Brain Dump': 'simple',
      'Next-Day Prep': 'simple',
      'Blue Light Blocking': 'simple',
      'Spaced Repetition': 'average',
      'Daily Language Practice': 'average',
      'Feynman Technique': 'average',
      'Active Recall': 'average',
      'Daily Reading': 'average',
      'Audio Learning': 'simple',
      'Music Practice': 'complex',
      'Handwritten Notes': 'simple',
      'Educational Videos': 'simple',
      'Study Groups': 'complex',
      'Dual N-Back Training': 'complex',
      'Pre-Sleep Review': 'simple',
      'Weekly Teaching': 'average',
      'Non-Dominant Hand Training': 'simple',
      'Same-Day Review': 'simple',
      'Interleaved Practice': 'average',
      'Language Word Learning': 'simple',
      'Navigation Novelty': 'simple',
      'Daily Logic Puzzle': 'simple',
      'Memory Challenges': 'average',
      'Documentary Learning': 'simple',
      'Deliberate Skill Practice': 'complex',
      'Novel Learning Session': 'average',
      'Expense Tracking': 'average',
      'Automatic Savings': 'simple',
      'Weekly Budget Review': 'average',
      'Regular Investing': 'average',
      '24-Hour Purchase Rule': 'average',
      'Bring Lunch': 'average',
      'Subscription Audit': 'simple',
      'Financial Education': 'average',
      'Negotiate Bills': 'complex',
      'Retirement Contributions': 'simple',
      'Pre-Purchase Gratitude': 'simple',
      'Round-Up Savings': 'simple',
      'Net Worth Check': 'simple',
      'Loud Budgeting': 'simple',
      'Morning Freewriting': 'average',
      'Daily Sketching': 'average',
      'Idea Generation': 'average',
      'Daily Photography': 'simple',
      'Creative Writing': 'complex',
      'Divergent Thinking': 'average',
      'Idea Mashup': 'simple',
      'Art Appreciation': 'simple',
      'Skill Exploration': 'complex',
      'Break Routines': 'simple',
      'Unstructured Play Time': 'average',
      'Hands-On Building': 'complex',
      'Experimental Cooking': 'average',
      'Gardening Therapy': 'average',
      'Daily Singing': 'simple',
      'Free Dance Session': 'simple',
      'Coloring Practice': 'average',
      'Floor Sitting Practice': 'simple',
      'Always Take Stairs': 'simple',
      'Single-Leg Balance Test': 'simple',
      'Brisk Walking Pace': 'average',
      'Muscle Preservation': 'complex',
      'Ground Transitions': 'average',
      'Protein Per Meal Goal': 'average',
      'Resting Heart Rate Check': 'simple',
      'Self-Compassion Break': 'simple',
      'Cognitive Defusion': 'average',
      'Expressive Writing': 'average',
      'Behavioral Activation': 'average',
      'Values Clarification': 'simple',
      'Pleasant Activity Scheduling': 'simple',
      'Self-Distancing': 'average',
      'Emotion Granularity': 'average',
      'Opposite Action': 'complex',
      'Consistent Wake Time': 'average',
      'Contrast Shower': 'average',
      'Evening Sunset Viewing': 'simple',
      'Self-Massage/Foam Rolling': 'average',
      'Power Nap': 'simple',
      'Sauna Recovery': 'complex',
      'Red Light Therapy': 'simple',
      'Yoga Nidra/NSDR': 'average',
      'Mindful Moisturizing': 'simple',
      'Epsom Salt Bath': 'average',
      'Face Mask Ritual': 'simple',
      'Comfort Clothes Transition': 'simple',
      'Candlelight Relaxation': 'simple',
      'Box Breathing (4-4-4-4)': 'simple',
      'Daily Humming': 'simple',
      'CO2 Tolerance Training': 'average',
      '4-7-8 Relaxing Breath': 'simple',
      'Wim Hof Breathing': 'average',
      'Energizing Breath (Kapalabhati)': 'average',
      'Resonant Breathing': 'average',
      'Mouth Taping Sleep': 'simple',
      'Stress-Reducing Conversation': 'average',
      'Express Daily Appreciation': 'simple',
      'Love Maps Question': 'simple',
      'Six-Second Kiss': 'simple',
      'Standing Social Events': 'average',
      'Phone-Free First Hour': 'complex',
      'Caffeine Cutoff': 'average',
      'Evening Environment Reset': 'simple',
      'Friction Addition': 'average',
      'Visual Cue Placement': 'simple',
      // Backfill batch 2 — templates missed by the original map
      'Choose Whole Foods': 'complex',
      'Oral Microbiome Care': 'average',
      'Cognitive Reserve Building': 'complex',
      'Cognitive Blood Pressure Target': 'average',
      'Resistance Training for Brain': 'complex',
      'Seasonal Fermented Food Rotation': 'average',
      'Psychobiotic Foods': 'average',
      'Lacto-Fermented Vegetables': 'average',
      '2-Minute Emotional Pause': 'simple',
      'Power Posture Practice': 'simple',
      'Gratitude Snapshot': 'simple',
      'Self-Compassion After Setbacks': 'average',
      'Habit Tracking': 'simple',
      'Cold Face Diving Reflex': 'simple',
      'Optimal Vagal Breathing (6/min)': 'average',
      'Daily Vagus Reset Ritual': 'average',
      'Vagal Humming Practice': 'simple',
      'Consistent Meal Timing': 'average',
      'Sunset Viewing Ritual': 'simple',
      'Circadian Anchor Times': 'average',
      'Evening Screen Curfew': 'complex',
      'Longevity Big 4 Habits': 'complex',
      'Healthspan Tracking': 'average',
      'Mediterranean + Time-Restricted Eating': 'complex',
      '66-Day Habit Commitment': 'average',
      'Habit Anchoring Practice': 'average',
      'Morning Habit Initiation': 'simple',
      'Longevity Probiotics': 'simple',
      'Protein Quality Focus': 'average',
      'Lifelong Weight Maintenance': 'complex',
      '30-Minute Brain-Boosting Cardio': 'complex',
      '40 Hz Binaural Beats': 'simple',
    };

    let patchedCount = 0;
    const patchedNames: string[] = [];
    const allTemplates = await ctx.db.query('templates').collect();
    const seenNames = new Set<string>();

    for (const template of allTemplates) {
      seenNames.add(template.name);
      const growthType = growthByName[template.name];
      if (!growthType) continue;
      if (template.growthType === growthType) continue;
      await ctx.db.patch(template._id, { growthType });
      patchedCount++;
      patchedNames.push(template.name);
    }

    const missing = Object.keys(growthByName).filter(
      (name) => !seenNames.has(name)
    );

    return {
      success: true,
      patchedCount,
      patchedNames,
      missingCount: missing.length,
      missingNames: missing,
    };
  },
});
