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
        v.literal('andrew_huberman'),
        v.literal('learning'),
        v.literal('social'),
        v.literal('financial'),
        v.literal('creativity'),
        v.literal('sleep')
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
 * Mutation: Seed initial templates (for setup/migration)
 */
export const seedTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Morning Routine Templates
    await ctx.db.insert('templates', {
      category: 'morning_routine',
      createdAt: now,
      description:
        'Start your day with mindful meditation. Research shows just 5 minutes daily can reduce stress and improve focus.',
      frequency: 'daily',
      icon: '🧘',
      iconColor: '#10B981',
      name: '5-Minute Meditation',
      popularityScore: 95,
      scientificLink:
        'https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/1809754',
      scientificReference:
        'Goyal et al. (2014) - Meditation programs for psychological stress',
    });

    await ctx.db.insert('templates', {
      category: 'morning_routine',
      createdAt: now,
      description:
        'Write 3 pages of stream-of-consciousness thoughts first thing. Clears mental clutter and boosts creativity.',
      frequency: 'daily',
      icon: '✍️',
      iconColor: '#3B82F6',
      name: 'Morning Pages',
      popularityScore: 88,
      scientificReference:
        "Cameron (1992) - The Artist's Way creative recovery program",
    });

    await ctx.db.insert('templates', {
      category: 'morning_routine',
      createdAt: now,
      description:
        'Drink a full glass of water immediately after waking. Rehydrates body and kickstarts metabolism.',
      frequency: 'daily',
      icon: '💧',
      iconColor: '#60A5FA',
      name: 'Hydration First',
      popularityScore: 92,
      scientificReference:
        'Popkin et al. (2010) - Water, hydration, and health',
    });

    await ctx.db.insert('templates', {
      category: 'morning_routine',
      createdAt: now,
      description:
        'View sunlight within 30 minutes of waking. Regulates circadian rhythm and improves sleep quality.',
      frequency: 'daily',
      icon: '🌅',
      iconColor: '#F59E0B',
      name: 'Sunrise Viewing',
      popularityScore: 85,
      scientificReference:
        'Huberman (2021) - Light exposure and circadian biology',
    });

    await ctx.db.insert('templates', {
      category: 'morning_routine',
      createdAt: now,
      description:
        'Wait 90 minutes after waking before having caffeine. Supports adenosine clearance and sustained alertness.',
      frequency: 'daily',
      icon: '☕',
      iconColor: '#B45309',
      name: 'Delay Caffeine 90 Minutes',
      popularityScore: 82,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Caffeine timing for optimal alertness',
    });

    await ctx.db.insert('templates', {
      category: 'morning_routine',
      createdAt: now,
      description:
        'Perform 5-10 sun salutations to wake up your body and mind. Improves circulation, flexibility, and energy.',
      frequency: 'daily',
      icon: '🌞',
      iconColor: '#F59E0B',
      name: 'Sun Salutation Flow',
      popularityScore: 78,
      scientificReference:
        'Cramer et al. (2016) - Yoga for chronic low back pain',
    });

    await ctx.db.insert('templates', {
      category: 'morning_routine',
      createdAt: now,
      description:
        'Take a 2-3 minute cold shower. Builds resilience, improves circulation, and boosts alertness.',
      frequency: 'daily',
      icon: '❄️',
      iconColor: '#3B82F6',
      name: 'Cold Shower',
      popularityScore: 76,
      scientificReference:
        'Höpfl et al. (2021) - Cold water immersion for recovery',
    });

    await ctx.db.insert('templates', {
      category: 'morning_routine',
      createdAt: now,
      description:
        'Make your bed immediately after waking. Creates a sense of accomplishment and order to start the day.',
      frequency: 'daily',
      icon: '🛏️',
      iconColor: '#8B5CF6',
      name: 'Make Your Bed',
      popularityScore: 80,
      scientificReference:
        'McRaven (2014) - Make Your Bed: Little Things That Can Change Your Life',
    });

    // Health & Fitness Templates
    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'High-intensity circuit training backed by science. 12 exercises, 30 seconds each, maximum results in minimum time.',
      frequency: 'daily',
      icon: '🏃',
      iconColor: '#EF4444',
      name: '7-Minute Workout',
      popularityScore: 98,
      scientificLink:
        'https://journals.lww.com/acsm-healthfitness/fulltext/2013/05000/high_intensity_circuit_training_using_body_weight_.5.aspx',
      scientificReference:
        'Jordan et al. (2013) - High-intensity circuit training',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Walk 10,000 steps daily. Proven to reduce cardiovascular disease risk and improve mental health.',
      frequency: 'daily',
      icon: '👟',
      iconColor: '#8B5CF6',
      name: '10,000 Steps',
      popularityScore: 94,
      scientificReference:
        'Lee et al. (2019) - Association of step volume and intensity',
    });

    await ctx.db.insert('templates', {
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

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Daily stretching for flexibility and injury prevention. Just 10 minutes improves range of motion.',
      frequency: 'daily',
      icon: '🤸',
      iconColor: '#EC4899',
      name: 'Stretching Routine',
      popularityScore: 86,
      scientificReference:
        'Behm et al. (2016) - Acute effects of muscle stretching',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Eliminate added sugars from diet. Reduces inflammation, improves energy, and supports weight management.',
      frequency: 'daily',
      icon: '🚫',
      iconColor: '#DC2626',
      name: 'No Added Sugar',
      popularityScore: 89,
      scientificReference:
        'Yang et al. (2014) - Added sugar intake and cardiovascular disease',
    });

    await ctx.db.insert('templates', {
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

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Practice yoga for 20-30 minutes. Improves flexibility, reduces stress, and enhances mental clarity.',
      frequency: 'daily',
      icon: '🧘‍♀️',
      iconColor: '#EC4899',
      name: 'Daily Yoga Practice',
      popularityScore: 87,
      scientificReference:
        'Cramer et al. (2014) - Yoga for anxiety and depression',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Consume 25-35g of fiber daily from whole foods. Supports gut health, digestion, and metabolic function.',
      frequency: 'daily',
      icon: '🌾',
      iconColor: '#16A34A',
      name: 'High Fiber Diet',
      popularityScore: 81,
      scientificReference:
        'McKeown et al. (2009) - Dietary fiber intake and mortality',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Track daily water intake to reach 8-10 glasses. Essential for hydration, cognitive function, and energy.',
      frequency: 'daily',
      icon: '🥤',
      iconColor: '#0284C7',
      name: 'Hydration Tracking',
      popularityScore: 88,
      scientificReference:
        'Riebl & Davy (2013) - The hydration equation: Update on water balance',
    });

    // Productivity Templates
    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        '90-minute focused work block with no distractions. Maximize cognitive output and creative problem-solving.',
      frequency: 'daily',
      icon: '🧠',
      iconColor: '#7C3AED',
      name: 'Deep Work Session',
      popularityScore: 96,
      scientificReference:
        'Newport (2016) - Deep Work: Rules for focused success',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Work in 25-minute focused intervals with 5-minute breaks. Maintains high focus and prevents burnout.',
      frequency: 'daily',
      icon: '⏱️',
      iconColor: '#F97316',
      name: 'Pomodoro Technique',
      popularityScore: 93,
      scientificReference: 'Cirillo (2006) - The Pomodoro Technique',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Identify and complete your single most important task before noon. Ensures progress on key priorities.',
      frequency: 'daily',
      icon: '🎯',
      iconColor: '#0EA5E9',
      name: 'MIT - Most Important Task',
      popularityScore: 90,
      scientificReference:
        'Tracy (2007) - Eat That Frog! productivity principle',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Process all emails to zero daily. Reduces mental load and prevents email overwhelm.',
      frequency: 'daily',
      icon: '📧',
      iconColor: '#06B6D4',
      name: 'Inbox Zero',
      popularityScore: 84,
      scientificReference: 'Mann (2007) - Inbox Zero email management system',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        "Plan tomorrow's top 3 tasks before bed. Reduces morning decision fatigue and anxiety.",
      frequency: 'daily',
      icon: '📝',
      iconColor: '#6366F1',
      name: 'Evening Planning',
      popularityScore: 87,
      scientificReference: 'Baumeister (2011) - Decision fatigue research',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Block specific time periods for focused work without interruptions. Improves productivity and work quality.',
      frequency: 'daily',
      icon: '📅',
      iconColor: '#059669',
      name: 'Time Blocking',
      popularityScore: 90,
      scientificReference: 'Cal Newport (2016) - Deep Work methodology',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Spend 30 minutes daily learning something new. Builds knowledge and keeps your brain sharp.',
      frequency: 'daily',
      icon: '📚',
      iconColor: '#7C3AED',
      name: 'Daily Learning',
      popularityScore: 84,
      scientificReference:
        'Dweck (2006) - Mindset: The New Psychology of Success',
    });

    await ctx.db.insert('templates', {
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

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Take regular 5-minute breaks every hour during work. Prevents burnout and maintains sustained focus.',
      frequency: 'daily',
      icon: '⏰',
      iconColor: '#F59E0B',
      name: 'Work Breaks',
      popularityScore: 85,
      scientificReference:
        'Trougakos et al. (2014) - Having to do it all: The effects of resource depletion',
    });

    // Mindfulness Templates
    await ctx.db.insert('templates', {
      category: 'mindfulness',
      createdAt: now,
      description:
        "Write down 3 things you're grateful for. Increases happiness, optimism, and life satisfaction.",
      frequency: 'daily',
      icon: '🙏',
      iconColor: '#F59E0B',
      name: 'Gratitude Journaling',
      popularityScore: 97,
      scientificLink:
        'https://greatergood.berkeley.edu/pdfs/GratitudePDFs/6Emmons-BlessingsBurdens.pdf',
      scientificReference:
        'Emmons & McCullough (2003) - Counting blessings versus burdens',
    });

    await ctx.db.insert('templates', {
      category: 'mindfulness',
      createdAt: now,
      description:
        '5 minutes of controlled breathing. Activates parasympathetic nervous system, reduces stress instantly.',
      frequency: 'daily',
      icon: '🌬️',
      iconColor: '#14B8A6',
      name: 'Breathwork Practice',
      popularityScore: 91,
      scientificReference:
        'Ma et al. (2017) - Breathing meditation for stress reduction',
    });

    await ctx.db.insert('templates', {
      category: 'mindfulness',
      createdAt: now,
      description:
        'Reflect on your day: what went well, what to improve. Builds self-awareness and continuous growth.',
      frequency: 'daily',
      icon: '🌙',
      iconColor: '#6366F1',
      name: 'Evening Reflection',
      popularityScore: 88,
      scientificReference: 'Kolb (1984) - Experiential learning and reflection',
    });

    await ctx.db.insert('templates', {
      category: 'mindfulness',
      createdAt: now,
      description:
        'One hour completely screen-free before bed. Improves sleep quality and mental restoration.',
      frequency: 'daily',
      icon: '📵',
      iconColor: '#10B981',
      name: 'Digital Detox Hour',
      popularityScore: 85,
      scientificReference:
        'Exelmans & Van den Bulck (2016) - Bedtime mobile phone use',
    });

    await ctx.db.insert('templates', {
      category: 'mindfulness',
      createdAt: now,
      description:
        '20-minute nature walk. Reduces cortisol, lowers blood pressure, and enhances mood significantly.',
      frequency: 'daily',
      icon: '🌲',
      iconColor: '#059669',
      name: 'Walking in Nature',
      popularityScore: 93,
      scientificReference:
        'Hansen et al. (2017) - Shinrin-yoku (forest bathing) benefits',
    });

    await ctx.db.insert('templates', {
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice progressive muscle relaxation for 10 minutes. Releases physical tension and reduces anxiety.',
      frequency: 'daily',
      icon: '💆',
      iconColor: '#EC4899',
      name: 'Progressive Muscle Relaxation',
      popularityScore: 82,
      scientificReference:
        'Jacobson (1929) - Progressive relaxation technique',
    });

    await ctx.db.insert('templates', {
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice loving-kindness meditation. Cultivates compassion for yourself and others, improving relationships.',
      frequency: 'daily',
      icon: '❤️',
      iconColor: '#EF4444',
      name: 'Loving-Kindness Meditation',
      popularityScore: 81,
      scientificReference:
        'Fredrickson et al. (2008) - Open hearts build lives: positive emotions',
    });

    await ctx.db.insert('templates', {
      category: 'mindfulness',
      createdAt: now,
      description:
        'Keep a daily journal of positive experiences and accomplishments. Builds optimism and resilience.',
      frequency: 'daily',
      icon: '✨',
      iconColor: '#F59E0B',
      name: 'Positive Journaling',
      popularityScore: 86,
      scientificReference:
        'Lyubomirsky (2008) - The How of Happiness: A Scientific Approach',
    });

    await ctx.db.insert('templates', {
      category: 'mindfulness',
      createdAt: now,
      description:
        'Practice mindful eating - eat slowly and pay attention to flavors, textures, and satisfaction cues.',
      frequency: 'daily',
      icon: '🍽️',
      iconColor: '#059669',
      name: 'Mindful Eating',
      popularityScore: 79,
      scientificReference:
        'Kristeller & Wolever (2011) - Mindfulness-based eating awareness training',
    });

    // Andrew Huberman Protocol Templates
    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'View 2-10 minutes of morning sunlight within 30-60 minutes of waking. Critical for circadian rhythm regulation and dopamine production.',
      frequency: 'daily',
      icon: '☀️',
      iconColor: '#F59E0B',
      name: 'Morning Sunlight Viewing',
      popularityScore: 95,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Morning sunlight for optimal circadian biology',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Delay caffeine intake by 90-120 minutes after waking. Allows natural adenosine clearance and prevents afternoon crash.',
      frequency: 'daily',
      icon: '⏰',
      iconColor: '#B45309',
      name: 'Delay Caffeine 90 Minutes',
      popularityScore: 92,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Optimal caffeine timing protocol',
    });

    await ctx.db.insert('templates', {
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
    });

    await ctx.db.insert('templates', {
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
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Practice 10-20 minutes of Non-Sleep Deep Rest (NSDR) daily. Restores focus, accelerates learning, and improves sleep.',
      frequency: 'daily',
      icon: '🛌',
      iconColor: '#7DD3FC',
      name: 'NSDR Practice',
      popularityScore: 89,
      scientificLink:
        'https://hubermanlab.com/using-nsdr-to-improve-learning-skill-memory/',
      scientificReference:
        'Huberman Lab (2021) - Using NSDR to improve learning and sleep',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Perform 1-3 physiological sighs when stressed. Rapidly lowers autonomic arousal and steadies mood.',
      frequency: 'daily',
      icon: '😮‍💨',
      iconColor: '#34D399',
      name: 'Physiological Sigh',
      popularityScore: 87,
      scientificLink:
        'https://hubermanlab.com/science-supported-tools-to-reduce-stress/',
      scientificReference:
        'Huberman Lab (2023) - Physiological sigh for stress regulation',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Dim lights 2-3 hours before sleep. Avoid overhead lights and use low-angle lights. Supports melatonin production.',
      frequency: 'daily',
      icon: '💡',
      iconColor: '#FDE047',
      name: 'Evening Light Dimming',
      popularityScore: 86,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Evening light protocols for better sleep',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Keep bedroom temperature 65-68°F (18-20°C) for optimal sleep. Cooler temperatures support deep sleep stages.',
      frequency: 'daily',
      icon: '🌡️',
      iconColor: '#0EA5E9',
      name: 'Cool Sleep Temperature',
      popularityScore: 85,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Temperature minimum protocol for sleep',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Consume 30-60g of protein within 30 minutes of waking. Supports neurotransmitter production and muscle maintenance.',
      frequency: 'daily',
      icon: '🍳',
      iconColor: '#F97316',
      name: 'Morning Protein Protocol',
      popularityScore: 84,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Morning nutrition for optimal alertness',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Follow consistent meal timing within a 10-12 hour eating window. Supports circadian alignment and metabolic health.',
      frequency: 'daily',
      icon: '🍽️',
      iconColor: '#10B981',
      name: 'Time-Restricted Eating',
      popularityScore: 88,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Meal timing and circadian biology',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Practice intermittent fasting with 16:8 schedule (16 hours fasting, 8 hours eating). Enhances autophagy and metabolic flexibility.',
      frequency: 'daily',
      icon: '⏰',
      iconColor: '#7C3AED',
      name: '16:8 Intermittent Fasting',
      popularityScore: 89,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Intermittent fasting protocols',
    });

    await ctx.db.insert('templates', {
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
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Track and optimize sleep quality. Maintain consistent sleep/wake times, keep bedroom cool, and avoid screens before bed.',
      frequency: 'daily',
      icon: '😴',
      iconColor: '#1E40AF',
      name: 'Sleep Optimization',
      popularityScore: 91,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Complete sleep toolkit',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Spend 1-2 hours in complete darkness before sleep. Enhances melatonin production and sleep quality.',
      frequency: 'daily',
      icon: '🌙',
      iconColor: '#0F172A',
      name: 'Darkness Before Sleep',
      popularityScore: 87,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Darkness and sleep optimization',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Maintain indoor temperature 65-68°F during sleep. Cooler temperatures promote deeper, more restorative sleep.',
      frequency: 'daily',
      icon: '🌡️',
      iconColor: '#06B6D4',
      name: 'Optimal Sleep Temperature',
      popularityScore: 85,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Temperature regulation for sleep',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Perform 90-minute focused work blocks aligned with ultradian rhythms. Maximize cognitive performance and creativity.',
      frequency: 'daily',
      icon: '🧠',
      iconColor: '#7C3AED',
      name: 'Ultradian Focus Cycles',
      popularityScore: 88,
      scientificLink: 'https://hubermanlab.com/maximizing-productivity-and-focus/',
      scientificReference:
        'Huberman Lab (2021) - Ultradian rhythms for peak performance',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'View afternoon/evening sunlight for 5-10 minutes to anchor circadian timing. Protects against light sensitivity at night.',
      frequency: 'daily',
      icon: '🌇',
      iconColor: '#F97316',
      name: 'Evening Sunlight Viewing',
      popularityScore: 82,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Afternoon light exposure protocols',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Perform 5-10 minutes of panoramic vision (distant gaze) after focused work. Reduces eye strain and activates parasympathetic nervous system.',
      frequency: 'daily',
      icon: '👁️',
      iconColor: '#0EA5E9',
      name: 'Panoramic Vision Practice',
      popularityScore: 81,
      scientificLink: 'https://hubermanlab.com/how-to-improve-your-vision/',
      scientificReference:
        'Huberman Lab (2022) - Vision and stress regulation',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Do resistance training in the afternoon/evening. Aligns with natural circadian peak in body temperature and strength.',
      frequency: 'weekly',
      icon: '🏋️',
      iconColor: '#DC2626',
      name: 'Afternoon Strength Training',
      popularityScore: 86,
      scientificLink: 'https://hubermanlab.com/optimize-your-training-program/',
      scientificReference:
        'Huberman Lab (2022) - Circadian timing for strength gains',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Perform high-intensity cardio in the morning. Increases adrenaline and dopamine for sustained alertness throughout day.',
      frequency: 'weekly',
      icon: '🏃‍♂️',
      iconColor: '#F59E0B',
      name: 'Morning HIIT Training',
      popularityScore: 84,
      scientificLink: 'https://hubermanlab.com/optimize-your-training-program/',
      scientificReference:
        'Huberman Lab (2022) - Morning cardio for energy optimization',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Take Omega-3 EPA (1-2g daily). Supports mood, focus, cardiovascular health, and reduces inflammation.',
      frequency: 'daily',
      icon: '💊',
      iconColor: '#0284C7',
      name: 'Omega-3 EPA Supplementation',
      popularityScore: 90,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Essential supplementation protocols',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Take Magnesium Threonate or Bisglycinate (200-400mg) 30-60 minutes before sleep. Enhances sleep quality and depth.',
      frequency: 'daily',
      icon: '🌙',
      iconColor: '#6366F1',
      name: 'Evening Magnesium Protocol',
      popularityScore: 87,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Magnesium for sleep optimization',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Expose eyes to bright light (ideally sunlight) to increase alertness. Activates melanopsin pathway for sustained focus.',
      frequency: 'daily',
      icon: '✨',
      iconColor: '#FDE047',
      name: 'Midday Light Exposure',
      popularityScore: 79,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Light exposure throughout the day',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Practice 10-30 minute cyclic hyperventilation breathing (Wim Hof style). Increases adrenaline, reduces stress, boosts immune function.',
      frequency: 'daily',
      icon: '🌬️',
      iconColor: '#38BDF8',
      name: 'Cyclic Hyperventilation',
      popularityScore: 83,
      scientificLink: 'https://hubermanlab.com/breathwork-for-stress-management/',
      scientificReference:
        'Huberman Lab (2022) - Cyclic hyperventilation protocols',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Practice box breathing (4-4-4-4) for 5 minutes. Reduces stress, improves HRV, and enhances autonomic control.',
      frequency: 'daily',
      icon: '📦',
      iconColor: '#10B981',
      name: 'Box Breathing Protocol',
      popularityScore: 85,
      scientificLink: 'https://hubermanlab.com/breathwork-for-stress-management/',
      scientificReference:
        'Huberman Lab (2022) - Box breathing for stress regulation',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Consume high-quality salt (1/4 - 1/2 tsp) in morning water. Supports neuron function, blood pressure, and mental clarity.',
      frequency: 'daily',
      icon: '🧂',
      iconColor: '#F8F9FA',
      name: 'Morning Salt Protocol',
      popularityScore: 78,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Sodium intake for optimal performance',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Delay first meal by 1-3 hours after waking. Extends fasting benefits, increases alertness, and supports fat oxidation.',
      frequency: 'daily',
      icon: '⏳',
      iconColor: '#EAB308',
      name: 'Delay First Meal Protocol',
      popularityScore: 86,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Fasting protocols for metabolic health',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Perform high-rep, brief exercise (jumping jacks, burpees) to increase body temperature. Enhances wakefulness and alertness.',
      frequency: 'daily',
      icon: '💥',
      iconColor: '#EF4444',
      name: 'Morning Movement Protocol',
      popularityScore: 82,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Movement for circadian alignment',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'View red/orange light (sunset, candles) in evening. Supports natural melatonin rise without disrupting circadian timing.',
      frequency: 'daily',
      icon: '🕯️',
      iconColor: '#FB923C',
      name: 'Red Light Evening Protocol',
      popularityScore: 80,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Red light for evening wind-down',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Avoid eating 2-3 hours before bedtime. Prevents blood sugar spikes and supports deeper sleep and growth hormone release.',
      frequency: 'daily',
      icon: '🚫',
      iconColor: '#DC2626',
      name: 'Evening Eating Cutoff',
      popularityScore: 84,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Meal timing for sleep quality',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Practice reveri hypnosis for 10-20 minutes. Reduces stress, improves sleep, and supports behavioral change.',
      frequency: 'daily',
      icon: '🌀',
      iconColor: '#8B5CF6',
      name: 'Self-Directed Hypnosis',
      popularityScore: 81,
      scientificLink: 'https://hubermanlab.com/using-hypnosis-to-enhance-health/',
      scientificReference:
        'Huberman Lab (2021) - Hypnosis for stress and behavior change',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Spend 10-20 minutes in nature without phone. Reduces cortisol, improves mood, and enhances cognitive function.',
      frequency: 'daily',
      icon: '🌳',
      iconColor: '#16A34A',
      name: 'Nature Immersion Protocol',
      popularityScore: 83,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Nature exposure for mental health',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Use nasal breathing during all exercise and rest. Increases oxygen efficiency, reduces stress, and improves performance.',
      frequency: 'daily',
      icon: '👃',
      iconColor: '#0EA5E9',
      name: 'Nasal Breathing Practice',
      popularityScore: 80,
      scientificLink: 'https://hubermanlab.com/breathwork-for-stress-management/',
      scientificReference:
        'Huberman Lab (2022) - Nasal breathing for optimization',
    });

    await ctx.db.insert('templates', {
      category: 'andrew_huberman',
      createdAt: now,
      description:
        'Limit caffeine to 100-400mg per day, consumed before 2pm. Optimizes alertness while protecting sleep quality.',
      frequency: 'daily',
      icon: '☕',
      iconColor: '#92400E',
      name: 'Caffeine Timing & Dosage',
      popularityScore: 89,
      scientificLink: 'https://hubermanlab.com/toolkit-for-sleep/',
      scientificReference:
        'Huberman Lab (2023) - Caffeine optimization protocols',
    });

    // Social Habits Templates
    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Call a friend or family member daily. Strong social connections are crucial for mental health and longevity.',
      frequency: 'daily',
      icon: '📞',
      iconColor: '#8B5CF6',
      name: 'Daily Social Call',
      popularityScore: 87,
      scientificReference:
        'Holt-Lunstad et al. (2010) - Social relationships and mortality',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Send a message to someone you care about. Small acts of connection strengthen relationships over time.',
      frequency: 'daily',
      icon: '💬',
      iconColor: '#06B6D4',
      name: 'Reach Out Daily',
      popularityScore: 84,
      scientificReference:
        'Gable et al. (2004) - The benefits of supportive relationships',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Spend quality time with your partner without distractions. Strengthens emotional bonds and intimacy.',
      frequency: 'daily',
      icon: '💑',
      iconColor: '#EC4899',
      name: 'Quality Partner Time',
      popularityScore: 86,
      scientificReference:
        'Gottman (1999) - The Seven Principles for Making Marriage Work',
    });

    await ctx.db.insert('templates', {
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

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Volunteer or help someone in need. Acts of service improve well-being and create social connections.',
      frequency: 'weekly',
      icon: '🤝',
      iconColor: '#10B981',
      name: 'Acts of Service',
      popularityScore: 81,
      scientificReference:
        'Post (2005) - Altruism, happiness, and health',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Join a club or group activity. Regular social interaction prevents loneliness and supports mental health.',
      frequency: 'weekly',
      icon: '👥',
      iconColor: '#6366F1',
      name: 'Group Activities',
      popularityScore: 79,
      scientificReference:
        'Hawkley & Cacioppo (2010) - Loneliness and health',
    });

    return { message: '74 templates seeded successfully', success: true };
  },
});

/**
 * Mutation: Import a template to create a new habit
 */
export const importTemplate = mutation({
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
      createdAt: Date.now(),
      accessibilityUpdatedAt: Date.now(),
      frequency: template.frequency,
      consecutiveDays: 0,
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
export const clearTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query('templates').collect();
    for (const template of templates) {
      await ctx.db.delete(template._id);
    }
    return { message: `Deleted ${templates.length} templates`, success: true };
  },
});
