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

    // Sleep Templates
    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Go to bed at the same time every night. Consistent sleep schedule improves sleep quality and circadian rhythm.',
      frequency: 'daily',
      icon: '🛏️',
      iconColor: '#1E3A8A',
      name: 'Consistent Bedtime',
      popularityScore: 92,
      scientificReference:
        'Walker (2017) - Why We Sleep: Unlocking the Power of Sleep',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Stop screen use 60 minutes before bed. Blue light disrupts melatonin production and delays sleep onset.',
      frequency: 'daily',
      icon: '📱',
      iconColor: '#DC2626',
      name: 'No Screens Before Bed',
      popularityScore: 89,
      scientificLink:
        'https://www.sleep.org/blue-light-and-sleep/',
      scientificReference:
        'Chang et al. (2015) - Evening use of light-emitting eReaders',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Practice 4-7-8 breathing before sleep. Activates relaxation response and promotes faster sleep onset.',
      frequency: 'daily',
      icon: '😴',
      iconColor: '#6366F1',
      name: '4-7-8 Breathing',
      popularityScore: 86,
      scientificReference:
        'Weil (2015) - Breathing: The Master Key to Self-Healing',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Limit caffeine after 2 PM. Caffeine has a 5-6 hour half-life that can disrupt sleep architecture.',
      frequency: 'daily',
      icon: '☕',
      iconColor: '#92400E',
      name: 'No Afternoon Caffeine',
      popularityScore: 88,
      scientificReference:
        'Drake et al. (2013) - Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Use blackout curtains for complete darkness. Light exposure during sleep reduces sleep quality and REM.',
      frequency: 'daily',
      icon: '🌑',
      iconColor: '#0F172A',
      name: 'Sleep in Complete Darkness',
      popularityScore: 84,
      scientificReference:
        'Gooley et al. (2011) - Exposure to room light before bedtime',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Take a warm bath 90 minutes before bed. Increases core body temperature drop that signals sleep time.',
      frequency: 'daily',
      icon: '🛁',
      iconColor: '#3B82F6',
      name: 'Pre-Sleep Warm Bath',
      popularityScore: 81,
      scientificReference:
        'Harding et al. (2019) - Systematic review of warm baths and sleep quality',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Sleep 7-9 hours per night. Adequate sleep is essential for cognitive function, health, and longevity.',
      frequency: 'daily',
      icon: '💤',
      iconColor: '#4338CA',
      name: '7-9 Hours Sleep',
      popularityScore: 95,
      scientificLink:
        'https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need',
      scientificReference:
        'Hirshkowitz et al. (2015) - National Sleep Foundation sleep duration recommendations',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Avoid alcohol 3-4 hours before bed. Alcohol disrupts REM sleep and causes sleep fragmentation.',
      frequency: 'daily',
      icon: '🚫',
      iconColor: '#991B1B',
      name: 'No Evening Alcohol',
      popularityScore: 78,
      scientificReference:
        'Ebrahim et al. (2013) - Alcohol and sleep review',
    });

    // Learning Templates
    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Practice spaced repetition for 20 minutes. Review material at increasing intervals for long-term retention.',
      frequency: 'daily',
      icon: '🔄',
      iconColor: '#7C3AED',
      name: 'Spaced Repetition',
      popularityScore: 91,
      scientificLink:
        'https://www.gwern.net/Spaced-repetition',
      scientificReference:
        'Cepeda et al. (2006) - Distributed practice in verbal recall tasks',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Learn one new word daily in a foreign language. Consistent vocabulary building accelerates language acquisition.',
      frequency: 'daily',
      icon: '🌍',
      iconColor: '#059669',
      name: 'Daily Language Practice',
      popularityScore: 87,
      scientificReference:
        'Nation (2001) - Learning Vocabulary in Another Language',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Teach someone what you learned today. Teaching reinforces understanding and reveals knowledge gaps.',
      frequency: 'daily',
      icon: '👨‍🏫',
      iconColor: '#DC2626',
      name: 'Feynman Technique',
      popularityScore: 89,
      scientificReference:
        'Chi et al. (1989) - Self-explanations and learning',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Practice active recall for 15 minutes. Test yourself without looking at notes to strengthen memory.',
      frequency: 'daily',
      icon: '🧩',
      iconColor: '#2563EB',
      name: 'Active Recall',
      popularityScore: 93,
      scientificReference:
        'Roediger & Karpicke (2006) - Test-enhanced learning',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Read for 30 minutes daily. Regular reading improves vocabulary, comprehension, and cognitive function.',
      frequency: 'daily',
      icon: '📖',
      iconColor: '#B45309',
      name: 'Daily Reading',
      popularityScore: 94,
      scientificReference:
        'Krashen (2004) - The Power of Reading',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Listen to educational podcasts or audiobooks during commute. Transforms dead time into learning opportunities.',
      frequency: 'daily',
      icon: '🎧',
      iconColor: '#DC2626',
      name: 'Audio Learning',
      popularityScore: 85,
      scientificReference:
        'Rogowsky et al. (2016) - Matching learning style to instructional method',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Practice a musical instrument for 20 minutes. Music training enhances cognitive abilities and neuroplasticity.',
      frequency: 'daily',
      icon: '🎵',
      iconColor: '#EC4899',
      name: 'Music Practice',
      popularityScore: 82,
      scientificReference:
        'Herholz & Zatorre (2012) - Musical training as framework for brain plasticity',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Take handwritten notes while learning. Writing by hand improves retention and comprehension.',
      frequency: 'daily',
      icon: '✍️',
      iconColor: '#0EA5E9',
      name: 'Handwritten Notes',
      popularityScore: 88,
      scientificReference:
        'Mueller & Oppenheimer (2014) - The Pen Is Mightier Than the Keyboard',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Watch one educational video daily. Visual learning enhances understanding of complex concepts.',
      frequency: 'daily',
      icon: '📺',
      iconColor: '#F59E0B',
      name: 'Educational Videos',
      popularityScore: 84,
      scientificReference:
        'Mayer (2009) - Multimedia Learning principles',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Join a study group or accountability circle. Social learning enhances motivation and understanding.',
      frequency: 'weekly',
      icon: '👥',
      iconColor: '#8B5CF6',
      name: 'Study Groups',
      popularityScore: 80,
      scientificReference:
        'Slavin (1996) - Research on cooperative learning',
    });

    // Financial Templates
    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Track every expense daily. Awareness of spending patterns is the first step to financial control.',
      frequency: 'daily',
      icon: '💰',
      iconColor: '#059669',
      name: 'Expense Tracking',
      popularityScore: 90,
      scientificReference:
        'Thaler & Sunstein (2008) - Nudge: Improving Decisions About Health, Wealth, and Happiness',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Save 10% of income automatically. Pay yourself first before spending on anything else.',
      frequency: 'daily',
      icon: '🏦',
      iconColor: '#2563EB',
      name: 'Automatic Savings',
      popularityScore: 93,
      scientificReference:
        'Bach (2004) - The Automatic Millionaire',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Review budget weekly. Regular financial check-ins prevent overspending and build awareness.',
      frequency: 'weekly',
      icon: '📊',
      iconColor: '#DC2626',
      name: 'Weekly Budget Review',
      popularityScore: 86,
      scientificReference:
        'Ramsey (2013) - The Total Money Makeover',
    });

    await ctx.db.insert('templates', {
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

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Use the 24-hour rule for purchases over $50. Delayed gratification reduces impulse buying.',
      frequency: 'daily',
      icon: '⏰',
      iconColor: '#F59E0B',
      name: '24-Hour Purchase Rule',
      popularityScore: 84,
      scientificReference:
        'Mischel (2014) - The Marshmallow Test: Mastering Self-Control',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Pack lunch instead of eating out. Home-prepared meals save thousands annually and improve health.',
      frequency: 'daily',
      icon: '🍱',
      iconColor: '#16A34A',
      name: 'Bring Lunch',
      popularityScore: 82,
      scientificReference:
        'Ramsey (2013) - Small expenses compound over time',
    });

    await ctx.db.insert('templates', {
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

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Read financial news or books for 15 minutes. Financial literacy is key to building and protecting wealth.',
      frequency: 'daily',
      icon: '📰',
      iconColor: '#0EA5E9',
      name: 'Financial Education',
      popularityScore: 85,
      scientificReference:
        'Lusardi & Mitchell (2014) - The Economic Importance of Financial Literacy',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Negotiate one bill or expense. Small negotiations compound into significant annual savings.',
      frequency: 'weekly',
      icon: '💬',
      iconColor: '#7C3AED',
      name: 'Negotiate Bills',
      popularityScore: 78,
      scientificReference:
        'Ramsey (2013) - The power of negotiation',
    });

    await ctx.db.insert('templates', {
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
    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Engage in freewriting for 10 minutes. Stream-of-consciousness writing unlocks creative thinking.',
      frequency: 'daily',
      icon: '✍️',
      iconColor: '#8B5CF6',
      name: 'Morning Freewriting',
      popularityScore: 87,
      scientificReference:
        'Elbow (1998) - Writing Without Teachers',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Sketch or doodle for 15 minutes. Visual expression enhances creative problem-solving.',
      frequency: 'daily',
      icon: '🎨',
      iconColor: '#EC4899',
      name: 'Daily Sketching',
      popularityScore: 83,
      scientificReference:
        'Brown (2014) - The Doodle Revolution',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Brainstorm 10 ideas on any topic. Idea generation is a muscle that strengthens with practice.',
      frequency: 'daily',
      icon: '💡',
      iconColor: '#F59E0B',
      name: 'Idea Generation',
      popularityScore: 89,
      scientificReference:
        'Altucher (2014) - Becoming an Idea Machine',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Take photos during daily walk. Photography trains observation and perspective-taking.',
      frequency: 'daily',
      icon: '📸',
      iconColor: '#0EA5E9',
      name: 'Daily Photography',
      popularityScore: 81,
      scientificReference:
        'Csikszentmihalyi (1996) - Creativity: Flow and the Psychology of Discovery',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Write one poem or short story. Creative writing develops imagination and emotional intelligence.',
      frequency: 'weekly',
      icon: '📝',
      iconColor: '#7C3AED',
      name: 'Creative Writing',
      popularityScore: 80,
      scientificReference:
        'Kaufman & Gregoire (2015) - Wired to Create',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Practice divergent thinking exercises. Generate multiple solutions to problems to enhance creativity.',
      frequency: 'daily',
      icon: '🧠',
      iconColor: '#06B6D4',
      name: 'Divergent Thinking',
      popularityScore: 84,
      scientificReference:
        'Guilford (1967) - The Nature of Human Intelligence',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Combine two unrelated ideas daily. Cross-pollination of concepts sparks innovation.',
      frequency: 'daily',
      icon: '🔀',
      iconColor: '#10B981',
      name: 'Idea Mashup',
      popularityScore: 82,
      scientificReference:
        'Johansson (2004) - The Medici Effect',
    });

    await ctx.db.insert('templates', {
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

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Learn a new creative skill monthly. Novel experiences build cognitive flexibility.',
      frequency: 'weekly',
      icon: '🎭',
      iconColor: '#F97316',
      name: 'Skill Exploration',
      popularityScore: 85,
      scientificReference:
        'Carson (2010) - Your Creative Brain',
    });

    await ctx.db.insert('templates', {
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

    return { message: '114 templates seeded successfully', success: true };
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

/**
 * Mutation: Seed additional science-backed templates (Phase 3.1)
 * 37 new habits covering: Physical Resilience, Cognitive, Nutrition, Digital Wellness, Social
 */
export const seedAdditionalTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // ═══════════════════════════════════════════════════════════════
    // HEALTH & FITNESS - Physical Resilience & Movement
    // ═══════════════════════════════════════════════════════════════

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Stand up and move for 2-3 minutes every hour. Prolonged sitting increases cardiovascular disease risk even with regular exercise.',
      frequency: 'daily',
      icon: '🧍',
      iconColor: '#10B981',
      name: 'Standing Every Hour',
      popularityScore: 91,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/22890825/',
      scientificReference:
        'Dunstan et al. (2012) - Too much sitting: The population health science of sedentary behavior',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Check and correct your posture 3x daily. Good posture reduces back pain, improves breathing, and boosts confidence.',
      frequency: 'daily',
      icon: '🪑',
      iconColor: '#6366F1',
      name: 'Posture Check',
      popularityScore: 84,
      scientificReference:
        'Carney et al. (2010) - Power posing: Brief nonverbal displays affect neuroendocrine levels',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Walk barefoot on grass, sand, or earth for 10-20 minutes. Grounding reduces inflammation and improves sleep quality.',
      frequency: 'daily',
      icon: '🦶',
      iconColor: '#84CC16',
      name: 'Barefoot Grounding',
      popularityScore: 79,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/22291721/',
      scientificReference:
        'Chevalier et al. (2012) - Earthing: Health implications of reconnecting the human body to the Earth',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Every 20 minutes, look at something 20 feet away for 20 seconds. Reduces digital eye strain and prevents myopia progression.',
      frequency: 'daily',
      icon: '👁️',
      iconColor: '#0EA5E9',
      name: '20-20-20 Eye Rule',
      popularityScore: 93,
      scientificReference:
        'American Optometric Association - Digital eye strain prevention guidelines',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Practice breathing through your nose throughout the day. Nasal breathing filters air, produces nitric oxide, and activates the parasympathetic nervous system.',
      frequency: 'daily',
      icon: '👃',
      iconColor: '#14B8A6',
      name: 'Nasal Breathing',
      popularityScore: 88,
      scientificReference:
        'Nestor (2020) - Breath: The New Science of a Lost Art',
    });

    await ctx.db.insert('templates', {
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

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Practice single-leg stands, heel-to-toe walking, or balance board exercises. Balance training reduces fall risk and improves coordination at any age.',
      frequency: 'daily',
      icon: '⚖️',
      iconColor: '#8B5CF6',
      name: 'Balance Training',
      popularityScore: 85,
      scientificReference:
        'Sherrington et al. (2019) - Exercise for preventing falls in older people living in the community',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Train grip strength with dead hangs, farmer carries, or grip exercises. Grip strength is a powerful predictor of all-cause mortality.',
      frequency: 'daily',
      icon: '✊',
      iconColor: '#F97316',
      name: 'Grip Strength Training',
      popularityScore: 87,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/25953784/',
      scientificReference:
        'Leong et al. (2015) - Prognostic value of grip strength: findings from the PURE study',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Take a hot bath (104°F/40°C) for 15-20 minutes. Passive heat therapy provides cardiovascular benefits similar to moderate exercise.',
      frequency: 'daily',
      icon: '🛀',
      iconColor: '#F43F5E',
      name: 'Heat Therapy Bath',
      popularityScore: 82,
      scientificReference:
        'Laukkanen et al. (2018) - Cardiovascular and other health benefits of passive heat therapy',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Hang from a bar for 30-60 seconds daily. Decompresses spine, improves shoulder mobility, and builds grip strength.',
      frequency: 'daily',
      icon: '🙆',
      iconColor: '#0891B2',
      name: 'Daily Hanging',
      popularityScore: 81,
      scientificReference:
        'McGill (2016) - Back Mechanic: spinal decompression techniques',
    });

    // ═══════════════════════════════════════════════════════════════
    // MINDFULNESS - Cognitive & Mental Health
    // ═══════════════════════════════════════════════════════════════

    await ctx.db.insert('templates', {
      category: 'mindfulness',
      createdAt: now,
      description:
        'Spend 15 minutes on puzzles, crosswords, or brain training games. Novel cognitive challenges build neuroplasticity and cognitive reserve.',
      frequency: 'daily',
      icon: '🧩',
      iconColor: '#A855F7',
      name: 'Brain Games',
      popularityScore: 83,
      scientificReference:
        'Park et al. (2014) - The impact of sustained engagement on cognitive function in older adults',
    });

    await ctx.db.insert('templates', {
      category: 'mindfulness',
      createdAt: now,
      description:
        'Schedule 15-30 minutes to write down worries, then close the notebook. Containing worry to a specific time reduces generalized anxiety.',
      frequency: 'daily',
      icon: '📓',
      iconColor: '#64748B',
      name: 'Scheduled Worry Time',
      popularityScore: 86,
      scientificReference:
        'Borkovec et al. (1990) - Stimulus control treatment for worry and insomnia',
    });

    await ctx.db.insert('templates', {
      category: 'mindfulness',
      createdAt: now,
      description:
        'Systematically scan your body from head to toe, noticing sensations. Reduces chronic pain, increases body awareness, and calms the nervous system.',
      frequency: 'daily',
      icon: '🫥',
      iconColor: '#06B6D4',
      name: 'Body Scan Meditation',
      popularityScore: 88,
      scientificReference:
        'Kabat-Zinn (1990) - Full Catastrophe Living: Using the Wisdom of Your Body and Mind',
    });

    await ctx.db.insert('templates', {
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

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Practice Dual N-Back training for 20 minutes. One of the few brain training methods shown to improve fluid intelligence and working memory.',
      frequency: 'daily',
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

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Sleep under a weighted blanket (10% of body weight). Deep pressure stimulation reduces anxiety and improves sleep quality.',
      frequency: 'daily',
      icon: '🛋️',
      iconColor: '#4338CA',
      name: 'Weighted Blanket Sleep',
      popularityScore: 82,
      scientificReference:
        'Ackerley et al. (2015) - Positive effects of a weighted blanket on insomnia',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Use white or pink noise while sleeping. Background noise masks disruptions and improves sleep onset and quality.',
      frequency: 'daily',
      icon: '🔊',
      iconColor: '#94A3B8',
      name: 'Sleep Sound Machine',
      popularityScore: 79,
      scientificReference:
        'Messineo et al. (2017) - Broadband sound administration improves sleep onset latency',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Take 200-400mg magnesium glycinate or threonate 30-60 minutes before bed. Magnesium supports GABA activity and improves sleep quality.',
      frequency: 'daily',
      icon: '💊',
      iconColor: '#10B981',
      name: 'Evening Magnesium',
      popularityScore: 85,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/23853635/',
      scientificReference:
        'Abbasi et al. (2012) - The effect of magnesium supplementation on sleep quality',
    });

    // ═══════════════════════════════════════════════════════════════
    // HEALTH & FITNESS - Nutrition
    // ═══════════════════════════════════════════════════════════════

    await ctx.db.insert('templates', {
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

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Consume fermented foods daily (yogurt, kefir, kimchi, sauerkraut, kombucha). Increases gut microbiome diversity and reduces inflammation.',
      frequency: 'daily',
      icon: '🥬',
      iconColor: '#84CC16',
      name: 'Daily Fermented Foods',
      popularityScore: 90,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/34256014/',
      scientificReference:
        'Wastyk et al. (2021) - Gut-microbiota-targeted diets modulate human immune status (Stanford study)',
    });

    await ctx.db.insert('templates', {
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

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Eat vegetables or salad before carbohydrates at meals. Eating greens first blunts blood sugar spikes by up to 73%.',
      frequency: 'daily',
      icon: '🥗',
      iconColor: '#22C55E',
      name: 'Eat Greens First',
      popularityScore: 86,
      scientificReference:
        'Imai et al. (2014) - Eating vegetables before carbohydrates improves postprandial glucose',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Stop eating at least 3 hours before bedtime. Late eating disrupts sleep architecture and increases acid reflux risk.',
      frequency: 'daily',
      icon: '🍽️',
      iconColor: '#EF4444',
      name: 'No Late Night Eating',
      popularityScore: 84,
      scientificReference:
        'Fujiwara et al. (2005) - Association between dinner-to-bed time and gastro-esophageal reflux disease',
    });

    await ctx.db.insert('templates', {
      category: 'health_fitness',
      createdAt: now,
      description:
        'Chew each bite 20-30 times before swallowing. Thorough chewing improves digestion, nutrient absorption, and naturally reduces calorie intake.',
      frequency: 'daily',
      icon: '😋',
      iconColor: '#F97316',
      name: 'Mindful Chewing',
      popularityScore: 78,
      scientificReference:
        'Zhu & Hollis (2014) - Increasing the number of chews before swallowing reduces meal size',
    });

    // ═══════════════════════════════════════════════════════════════
    // PRODUCTIVITY - Environment & Lifestyle
    // ═══════════════════════════════════════════════════════════════

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Care for indoor plants daily. Tending plants reduces stress, improves air quality, and provides a sense of accomplishment.',
      frequency: 'daily',
      icon: '🪴',
      iconColor: '#22C55E',
      name: 'House Plant Care',
      popularityScore: 80,
      scientificReference:
        'Lohr et al. (2010) - Interior plants may improve worker productivity',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Remove, donate, or discard one item from your space daily. Physical clutter increases cortisol and reduces focus.',
      frequency: 'daily',
      icon: '🗑️',
      iconColor: '#64748B',
      name: 'Daily Declutter',
      popularityScore: 83,
      scientificReference:
        'Saxbe & Repetti (2010) - No place like home: Home tours correlate with cortisol levels',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Open windows for 10-15 minutes to ventilate your space. Fresh air reduces indoor CO2 levels, improving cognitive function by up to 50%.',
      frequency: 'daily',
      icon: '🪟',
      iconColor: '#38BDF8',
      name: 'Fresh Air Break',
      popularityScore: 81,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/26502459/',
      scientificReference:
        'Allen et al. (2016) - Associations of cognitive function scores with CO2 and ventilation',
    });

    await ctx.db.insert('templates', {
      category: 'mindfulness',
      createdAt: now,
      description:
        'Watch comedy, read jokes, or spend time with funny friends. Laughter reduces cortisol, boosts immunity, and improves cardiovascular health.',
      frequency: 'daily',
      icon: '😂',
      iconColor: '#FBBF24',
      name: 'Daily Laughter',
      popularityScore: 85,
      scientificReference:
        'Bennett & Lengacher (2009) - Humor and laughter may influence health: Complementary therapies review',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Spend quality time with a pet—petting, playing, or walking. Human-animal interaction increases oxytocin and reduces stress hormones.',
      frequency: 'daily',
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

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Practice listening without interrupting or planning your response. Deep listening improves relationships and builds empathy.',
      frequency: 'daily',
      icon: '👂',
      iconColor: '#8B5CF6',
      name: 'Deep Listening',
      popularityScore: 84,
      scientificReference:
        'Rogers (1951) - Client-centered therapy: Its current practice, implications, and theory',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Perform one random act of kindness daily. Helping others increases your own happiness and reduces depression symptoms.',
      frequency: 'daily',
      icon: '💝',
      iconColor: '#EC4899',
      name: 'Random Act of Kindness',
      popularityScore: 91,
      scientificReference:
        'Lyubomirsky et al. (2005) - Pursuing happiness: The architecture of sustainable change',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Have at least one face-to-face conversation daily. In-person interaction provides stronger wellbeing benefits than digital communication.',
      frequency: 'daily',
      icon: '👥',
      iconColor: '#3B82F6',
      name: 'Face-to-Face Time',
      popularityScore: 87,
      scientificReference:
        'Helliwell & Huang (2013) - Comparing the happiness effects of real and online friends',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Practice saying no to requests that don\'t align with your priorities. Healthy boundaries reduce stress and prevent burnout.',
      frequency: 'daily',
      icon: '🚫',
      iconColor: '#DC2626',
      name: 'Boundary Practice',
      popularityScore: 82,
      scientificReference:
        'Cloud & Townsend (1992) - Boundaries: When to Say Yes, How to Say No',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Give at least one sincere compliment daily. Giving compliments activates reward centers in your own brain and strengthens relationships.',
      frequency: 'daily',
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

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Keep phones away from the table during meals. Phone-free meals improve digestion, strengthen relationships, and increase enjoyment.',
      frequency: 'daily',
      icon: '📵',
      iconColor: '#EF4444',
      name: 'Phone-Free Meals',
      popularityScore: 90,
      scientificReference:
        'Dwyer et al. (2018) - Smartphone use undermines enjoyment of face-to-face social interactions',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Limit social media to 30 minutes daily. Reducing social media use decreases anxiety and depression while improving life satisfaction.',
      frequency: 'daily',
      icon: '📱',
      iconColor: '#6366F1',
      name: 'Social Media Limit',
      popularityScore: 88,
      scientificLink: 'https://pubmed.ncbi.nlm.nih.gov/30570350/',
      scientificReference:
        'Hunt et al. (2018) - No more FOMO: Limiting social media decreases loneliness and depression',
    });

    await ctx.db.insert('templates', {
      category: 'productivity',
      createdAt: now,
      description:
        'Focus on one task at a time without switching. Multitasking reduces productivity by up to 40% and impairs attention.',
      frequency: 'daily',
      icon: '🎯',
      iconColor: '#059669',
      name: 'Single-Tasking',
      popularityScore: 89,
      scientificReference:
        'Ophir et al. (2009) - Cognitive control in media multitaskers',
    });

    await ctx.db.insert('templates', {
      category: 'morning_routine',
      createdAt: now,
      description:
        'Keep your phone on airplane mode for the first hour after waking. Protects your attention and prevents reactive morning mode.',
      frequency: 'daily',
      icon: '✈️',
      iconColor: '#0EA5E9',
      name: 'Airplane Mode Morning',
      popularityScore: 86,
      scientificReference:
        'Newport (2019) - Digital Minimalism: Choosing a Focused Life in a Noisy World',
    });

    return { message: '37 additional templates seeded successfully', success: true };
  },
});

