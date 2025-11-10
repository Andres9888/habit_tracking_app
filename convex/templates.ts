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

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Practice active listening in conversations. Focus fully on others without interrupting, strengthening connections.',
      frequency: 'daily',
      icon: '👂',
      iconColor: '#F59E0B',
      name: 'Active Listening',
      popularityScore: 82,
      scientificReference:
        'Weger et al. (2014) - The relative effectiveness of active listening',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Have a device-free meal with family or friends. Strengthens bonds through undivided attention.',
      frequency: 'daily',
      icon: '🍴',
      iconColor: '#EF4444',
      name: 'Device-Free Meals',
      popularityScore: 80,
      scientificReference:
        'Misra et al. (2016) - The iPhone Effect: The quality of in-person interactions',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Schedule regular date nights or quality time with significant other. Maintains relationship vitality and connection.',
      frequency: 'weekly',
      icon: '❤️',
      iconColor: '#EC4899',
      name: 'Date Night',
      popularityScore: 85,
      scientificReference:
        'Gottman (2011) - The relationship cure',
    });

    // Learning Templates
    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Read for 30 minutes daily. Improves vocabulary, knowledge, cognitive function, and reduces stress.',
      frequency: 'daily',
      icon: '📖',
      iconColor: '#7C3AED',
      name: 'Daily Reading',
      popularityScore: 92,
      scientificReference:
        'Mangen & Kuiken (2014) - Lost in an iPad: Narrative engagement on paper',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Listen to educational podcasts or audiobooks during commute. Transforms idle time into learning opportunities.',
      frequency: 'daily',
      icon: '🎧',
      iconColor: '#F97316',
      name: 'Podcast Learning',
      popularityScore: 88,
      scientificReference:
        'Knowles (1975) - Self-Directed Learning: A Guide',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Practice a new language for 15 minutes. Enhances cognitive flexibility and delays cognitive decline.',
      frequency: 'daily',
      icon: '🗣️',
      iconColor: '#10B981',
      name: 'Language Practice',
      popularityScore: 86,
      scientificReference:
        'Bialystok et al. (2007) - Bilingualism as a protection against cognitive decline',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Take an online course or watch educational videos. Continuous learning keeps mind sharp and competitive.',
      frequency: 'weekly',
      icon: '🎓',
      iconColor: '#3B82F6',
      name: 'Online Course',
      popularityScore: 84,
      scientificReference:
        'Hone & El Said (2016) - Exploring the factors affecting MOOC retention',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Practice spaced repetition with flashcards. Scientifically proven most effective method for long-term memory.',
      frequency: 'daily',
      icon: '🗂️',
      iconColor: '#EC4899',
      name: 'Spaced Repetition',
      popularityScore: 87,
      scientificReference:
        'Cepeda et al. (2006) - Distributed practice in verbal recall tasks',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Teach something you learned to someone else. Teaching solidifies understanding and reveals knowledge gaps.',
      frequency: 'weekly',
      icon: '👨‍🏫',
      iconColor: '#F59E0B',
      name: 'Teach to Learn',
      popularityScore: 83,
      scientificReference:
        'Fiorella & Mayer (2013) - The relative benefits of learning by teaching',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Practice a musical instrument for 20-30 minutes. Enhances brain plasticity, memory, and coordination.',
      frequency: 'daily',
      icon: '🎹',
      iconColor: '#8B5CF6',
      name: 'Music Practice',
      popularityScore: 81,
      scientificReference:
        'Schellenberg (2004) - Music lessons enhance IQ',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Write summary notes after learning. Active recall strengthens memory retention and understanding.',
      frequency: 'daily',
      icon: '📝',
      iconColor: '#06B6D4',
      name: 'Learning Journal',
      popularityScore: 85,
      scientificReference:
        'Karpicke & Blunt (2011) - Retrieval practice produces more learning',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Solve puzzles or brain teasers daily. Maintains cognitive function and problem-solving skills.',
      frequency: 'daily',
      icon: '🧩',
      iconColor: '#EF4444',
      name: 'Daily Puzzles',
      popularityScore: 79,
      scientificReference:
        'Park et al. (2014) - The impact of sustained engagement on cognitive function',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Attend workshops, seminars, or conferences. Networking and learning from experts accelerates growth.',
      frequency: 'monthly',
      icon: '🏛️',
      iconColor: '#6366F1',
      name: 'Attend Events',
      popularityScore: 76,
      scientificReference:
        'Wenger (1998) - Communities of Practice: Learning, Meaning, and Identity',
    });

    // Financial Templates
    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Track every expense daily. Awareness is the first step to financial control and better spending decisions.',
      frequency: 'daily',
      icon: '💰',
      iconColor: '#059669',
      name: 'Expense Tracking',
      popularityScore: 90,
      scientificReference:
        'Thaler & Sunstein (2008) - Nudge: Improving Decisions About Health and Wealth',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Review and update your budget weekly. Regular monitoring prevents overspending and ensures financial goals.',
      frequency: 'weekly',
      icon: '📊',
      iconColor: '#3B82F6',
      name: 'Budget Review',
      popularityScore: 87,
      scientificReference:
        'Fernbach et al. (2015) - Political extremism is supported by an illusion of understanding',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Save or invest a fixed amount automatically. Pay yourself first builds wealth consistently over time.',
      frequency: 'monthly',
      icon: '🏦',
      iconColor: '#10B981',
      name: 'Automated Savings',
      popularityScore: 92,
      scientificReference:
        'Thaler & Benartzi (2004) - Save More Tomorrow: Using Behavioral Economics',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Read financial news or investment books for 15 minutes. Financial literacy leads to better money decisions.',
      frequency: 'daily',
      icon: '📰',
      iconColor: '#F59E0B',
      name: 'Financial Education',
      popularityScore: 84,
      scientificReference:
        'Lusardi & Mitchell (2014) - The Economic Importance of Financial Literacy',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Review investment portfolio monthly. Regular rebalancing maintains risk levels and optimizes returns.',
      frequency: 'monthly',
      icon: '📈',
      iconColor: '#0EA5E9',
      name: 'Portfolio Review',
      popularityScore: 83,
      scientificReference:
        'Bogle (2007) - The Little Book of Common Sense Investing',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Pack lunch instead of eating out. Saves thousands annually while often being healthier.',
      frequency: 'daily',
      icon: '🥡',
      iconColor: '#16A34A',
      name: 'Bring Lunch',
      popularityScore: 86,
      scientificReference:
        'Thaler (1999) - Mental accounting matters',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Practice the 24-hour rule before non-essential purchases. Reduces impulse buying and buyer\'s remorse.',
      frequency: 'daily',
      icon: '⏰',
      iconColor: '#DC2626',
      name: '24-Hour Purchase Rule',
      popularityScore: 88,
      scientificReference:
        'Baumeister (2002) - Yielding to Temptation: Self-Control Failure',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Negotiate bills and recurring expenses quarterly. Simple calls can save hundreds on insurance, phone, internet.',
      frequency: 'quarterly',
      icon: '📞',
      iconColor: '#8B5CF6',
      name: 'Bill Negotiation',
      popularityScore: 81,
      scientificReference:
        'Cialdini (2006) - Influence: The Psychology of Persuasion',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Review and pay off high-interest debt first. Debt avalanche method saves most on interest over time.',
      frequency: 'monthly',
      icon: '💳',
      iconColor: '#EF4444',
      name: 'Debt Reduction Plan',
      popularityScore: 89,
      scientificReference:
        'Ramsey (2013) - The Total Money Makeover',
    });

    // Creativity Templates
    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Free write for 10 minutes without editing. Unlocks creativity and processes subconscious thoughts.',
      frequency: 'daily',
      icon: '✍️',
      iconColor: '#F59E0B',
      name: 'Creative Writing',
      popularityScore: 85,
      scientificReference:
        'Pennebaker (1997) - Writing About Emotional Experiences',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Sketch, doodle, or draw for 15 minutes. Visual creativity enhances problem-solving and reduces stress.',
      frequency: 'daily',
      icon: '🎨',
      iconColor: '#EC4899',
      name: 'Daily Sketching',
      popularityScore: 82,
      scientificReference:
        'Brown (2014) - The Doodle Revolution',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Brainstorm ideas without judgment. Quantity over quality initially - divergent thinking sparks innovation.',
      frequency: 'weekly',
      icon: '💡',
      iconColor: '#FDE047',
      name: 'Brainstorming Sessions',
      popularityScore: 83,
      scientificReference:
        'Osborn (1953) - Applied Imagination: Principles of Creative Problem-Solving',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Try a new creative hobby or craft. Novelty stimulates neuroplasticity and creative thinking.',
      frequency: 'weekly',
      icon: '🎭',
      iconColor: '#8B5CF6',
      name: 'New Creative Project',
      popularityScore: 79,
      scientificReference:
        'Kaufman & Gregoire (2015) - Wired to Create',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Take photos or capture moments creatively. Photography trains observation and artistic perspective.',
      frequency: 'daily',
      icon: '📷',
      iconColor: '#0EA5E9',
      name: 'Daily Photography',
      popularityScore: 80,
      scientificReference:
        'Csikszentmihalyi (1996) - Creativity: Flow and the Psychology of Discovery',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Cook a new recipe without following instructions exactly. Culinary improvisation builds creative confidence.',
      frequency: 'weekly',
      icon: '👨‍🍳',
      iconColor: '#F97316',
      name: 'Creative Cooking',
      popularityScore: 77,
      scientificReference:
        'Sternberg (1999) - Handbook of Creativity',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Mind map ideas and connections visually. Non-linear thinking reveals creative insights and patterns.',
      frequency: 'weekly',
      icon: '🗺️',
      iconColor: '#10B981',
      name: 'Mind Mapping',
      popularityScore: 81,
      scientificReference:
        'Buzan & Buzan (1994) - The Mind Map Book',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Visit museums, galleries, or cultural events. Exposure to diverse art forms inspires creative thinking.',
      frequency: 'monthly',
      icon: '🖼️',
      iconColor: '#7C3AED',
      name: 'Cultural Exploration',
      popularityScore: 76,
      scientificReference:
        'Amabile (1996) - Creativity in Context',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Practice improvisation or spontaneous creation. Letting go of control unleashes creative potential.',
      frequency: 'weekly',
      icon: '🎪',
      iconColor: '#EF4444',
      name: 'Creative Improvisation',
      popularityScore: 78,
      scientificReference:
        'Limb & Braun (2008) - Neural substrates of spontaneous musical performance',
    });

    // Sleep Templates
    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Go to bed and wake up at the same time daily, even weekends. Regulates circadian rhythm for better sleep.',
      frequency: 'daily',
      icon: '⏰',
      iconColor: '#3B82F6',
      name: 'Consistent Sleep Schedule',
      popularityScore: 94,
      scientificReference:
        'Walker (2017) - Why We Sleep: Unlocking the Power of Sleep',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Avoid screens 1 hour before bed. Blue light suppresses melatonin production and disrupts sleep cycles.',
      frequency: 'daily',
      icon: '📵',
      iconColor: '#EF4444',
      name: 'Screen-Free Before Bed',
      popularityScore: 91,
      scientificReference:
        'Chang et al. (2015) - Evening use of light-emitting eReaders',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Create a relaxing bedtime routine. Signals body it\'s time to wind down, improving sleep onset.',
      frequency: 'daily',
      icon: '🛀',
      iconColor: '#8B5CF6',
      name: 'Bedtime Routine',
      popularityScore: 89,
      scientificReference:
        'Irish et al. (2015) - The role of sleep hygiene in promoting public health',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Keep bedroom cool, dark, and quiet. Optimal sleep environment enhances deep sleep stages.',
      frequency: 'daily',
      icon: '🌙',
      iconColor: '#1E293B',
      name: 'Optimize Sleep Environment',
      popularityScore: 90,
      scientificReference:
        'Okamoto-Mizuno & Mizuno (2012) - Effects of thermal environment on sleep',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Limit caffeine after 2 PM. Caffeine half-life is 6 hours, affecting sleep quality even if you fall asleep.',
      frequency: 'daily',
      icon: '☕',
      iconColor: '#B45309',
      name: 'Afternoon Caffeine Cutoff',
      popularityScore: 88,
      scientificReference:
        'Drake et al. (2013) - Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Avoid large meals 2-3 hours before bed. Late eating disrupts sleep quality and circadian rhythms.',
      frequency: 'daily',
      icon: '🍽️',
      iconColor: '#059669',
      name: 'No Late Heavy Meals',
      popularityScore: 85,
      scientificReference:
        'St-Onge et al. (2016) - Effects of diet on sleep quality',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Use white noise or nature sounds if environment is noisy. Masks disturbances for uninterrupted sleep.',
      frequency: 'daily',
      icon: '🎵',
      iconColor: '#06B6D4',
      name: 'Sleep Sounds',
      popularityScore: 83,
      scientificReference:
        'Messineo et al. (2017) - Broadband sound administration improves sleep onset latency',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Track sleep quality and duration. Awareness helps identify patterns and optimize sleep habits.',
      frequency: 'daily',
      icon: '📊',
      iconColor: '#7C3AED',
      name: 'Sleep Tracking',
      popularityScore: 86,
      scientificReference:
        'Kolla et al. (2016) - Consumer sleep tracking devices',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Practice 4-7-8 breathing technique before sleep. Calms nervous system and promotes faster sleep onset.',
      frequency: 'daily',
      icon: '😴',
      iconColor: '#10B981',
      name: '4-7-8 Sleep Breathing',
      popularityScore: 84,
      scientificReference:
        'Weil (2015) - Breathing: The Master Key to Self Healing',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'If unable to sleep after 20 minutes, get up and do calm activity. Prevents bed-sleep anxiety association.',
      frequency: 'daily',
      icon: '🚶',
      iconColor: '#F59E0B',
      name: '20-Minute Sleep Rule',
      popularityScore: 81,
      scientificReference:
        'Morin & Espie (2003) - Insomnia: A Clinical Guide to Assessment and Treatment',
    });

    // Additional Health & Fitness Templates
    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Practice intermittent fasting with 16:8 window. Supports metabolic health, autophagy, and weight management.',
      frequency: 'daily',
      icon: '⏲️',
      iconColor: '#7C3AED',
      name: 'Intermittent Fasting',
      popularityScore: 90,
      scientificReference:
        'Mattson et al. (2017) - Impact of intermittent fasting on health and disease',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Take stairs instead of elevator. Simple daily cardio improves heart health and burns calories.',
      frequency: 'daily',
      icon: '🪜',
      iconColor: '#F97316',
      name: 'Take the Stairs',
      popularityScore: 82,
      scientificReference:
        'Boreham et al. (2005) - Training effects of accumulated daily stair-climbing',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Practice proper posture throughout the day. Prevents back pain, improves breathing and confidence.',
      frequency: 'daily',
      icon: '🧍',
      iconColor: '#0EA5E9',
      name: 'Posture Check',
      popularityScore: 84,
      scientificReference:
        'Nair et al. (2015) - Do slumped and upright postures affect stress responses?',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Spend 15 minutes in sunlight daily for Vitamin D. Essential for bone health, immunity, and mood.',
      frequency: 'daily',
      icon: '☀️',
      iconColor: '#FDE047',
      name: 'Vitamin D Sunlight',
      popularityScore: 87,
      scientificReference:
        'Holick (2007) - Vitamin D deficiency',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Do mobility exercises for 10 minutes. Prevents injuries, reduces stiffness, improves movement quality.',
      frequency: 'daily',
      icon: '🤸‍♂️',
      iconColor: '#EC4899',
      name: 'Mobility Work',
      popularityScore: 83,
      scientificReference:
        'Behm & Chaouachi (2011) - A review of the acute effects of static and dynamic stretching',
    });

    // Additional Productivity Templates
    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Use the Eisenhower Matrix to prioritize tasks. Distinguish urgent vs important for better decision-making.',
      frequency: 'daily',
      icon: '📋',
      iconColor: '#EF4444',
      name: 'Eisenhower Matrix',
      popularityScore: 88,
      scientificReference:
        'Covey (1989) - The 7 Habits of Highly Effective People',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Batch similar tasks together. Context switching drains energy; grouping saves mental bandwidth.',
      frequency: 'daily',
      icon: '📦',
      iconColor: '#10B981',
      name: 'Task Batching',
      popularityScore: 86,
      scientificReference:
        'Leroy (2009) - Why is it so hard to do my work?',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Review weekly goals every Monday. Sets clear direction and maintains alignment with bigger objectives.',
      frequency: 'weekly',
      icon: '🎯',
      iconColor: '#3B82F6',
      name: 'Weekly Goal Review',
      popularityScore: 89,
      scientificReference:
        'Locke & Latham (2002) - Building a practically useful theory of goal setting',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Eliminate or automate one repetitive task weekly. Frees up time and mental space for important work.',
      frequency: 'weekly',
      icon: '🤖',
      iconColor: '#8B5CF6',
      name: 'Automate Tasks',
      popularityScore: 85,
      scientificReference:
        'Ferriss (2009) - The 4-Hour Workweek',
    });

    return { message: '119 templates seeded successfully', success: true };
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
