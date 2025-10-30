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

    // Learning & Education Templates
    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Read for 30 minutes daily. Improves vocabulary, cognitive function, and reduces stress significantly.',
      frequency: 'daily',
      icon: '📚',
      iconColor: '#8B5CF6',
      name: 'Daily Reading',
      popularityScore: 94,
      scientificReference:
        'Bavishi et al. (2016) - A chapter a day: Association of book reading with longevity',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Practice a new language for 15 minutes daily. Consistent short sessions are more effective than long irregular study.',
      frequency: 'daily',
      icon: '🌍',
      iconColor: '#3B82F6',
      name: 'Language Learning',
      popularityScore: 89,
      scientificReference:
        'Krashen (1982) - Second language acquisition and input hypothesis',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Watch one educational video or take one online course lesson. Microlearning improves knowledge retention.',
      frequency: 'daily',
      icon: '🎓',
      iconColor: '#F59E0B',
      name: 'Learn Something New',
      popularityScore: 87,
      scientificReference:
        'Giurgiu et al. (2020) - Microlearning effectiveness in education',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Practice active recall and spaced repetition for 10 minutes. The most effective learning technique backed by science.',
      frequency: 'daily',
      icon: '🧩',
      iconColor: '#EC4899',
      name: 'Spaced Repetition Study',
      popularityScore: 91,
      scientificReference:
        'Dunlosky et al. (2013) - Improving students learning with effective techniques',
    });

    await ctx.db.insert('templates', {
      category: 'learning',
      createdAt: now,
      description:
        'Write a summary of what you learned today. Consolidates knowledge and reveals gaps in understanding.',
      frequency: 'daily',
      icon: '✏️',
      iconColor: '#06B6D4',
      name: 'Learning Journal',
      popularityScore: 85,
      scientificReference:
        'Bui et al. (2013) - Note-taking with computers: Exploring alternative strategies',
    });

    // Social & Relationships Templates
    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Reach out to one friend or family member. Regular social connection significantly improves mental health and longevity.',
      frequency: 'daily',
      icon: '💬',
      iconColor: '#10B981',
      name: 'Daily Connection',
      popularityScore: 92,
      scientificReference:
        'Holt-Lunstad et al. (2010) - Social relationships and mortality risk',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Practice active listening without interrupting. Strengthens relationships and improves empathy.',
      frequency: 'daily',
      icon: '👂',
      iconColor: '#7C3AED',
      name: 'Active Listening',
      popularityScore: 88,
      scientificReference:
        'Rogers & Farson (1957) - Active listening communication technique',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Express appreciation to someone. Gratitude practices strengthen social bonds and increase life satisfaction.',
      frequency: 'daily',
      icon: '💝',
      iconColor: '#F472B6',
      name: 'Express Gratitude',
      popularityScore: 90,
      scientificReference:
        'Algoe et al. (2010) - Its the little things: Everyday gratitude',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Put away phone during meals with others. Undivided attention improves relationship quality.',
      frequency: 'daily',
      icon: '📵',
      iconColor: '#EF4444',
      name: 'Device-Free Meals',
      popularityScore: 86,
      scientificReference:
        'Przybylski & Weinstein (2013) - Can you connect with me now?',
    });

    await ctx.db.insert('templates', {
      category: 'social',
      createdAt: now,
      description:
        'Schedule quality time with loved ones. Intentional connection prevents relationship drift.',
      frequency: 'weekly',
      icon: '📅',
      iconColor: '#0EA5E9',
      name: 'Plan Quality Time',
      popularityScore: 84,
      scientificReference:
        'Aron et al. (2000) - Couples shared participation in novel activities',
    });

    // Financial Health Templates
    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Track every expense. Financial awareness is the first step to building wealth and reducing money stress.',
      frequency: 'daily',
      icon: '💰',
      iconColor: '#10B981',
      name: 'Track Expenses',
      popularityScore: 91,
      scientificReference:
        'Thaler & Sunstein (2008) - Nudge: Improving decisions about health, wealth',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Review and update your budget. Regular budget review prevents overspending and builds financial security.',
      frequency: 'weekly',
      icon: '📊',
      iconColor: '#3B82F6',
      name: 'Budget Review',
      popularityScore: 88,
      scientificReference:
        'Fernbach et al. (2015) - Financial literacy and household decision making',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Save before spending - automate transfers to savings. Pay yourself first principle builds wealth automatically.',
      frequency: 'daily',
      icon: '🏦',
      iconColor: '#059669',
      name: 'Automated Savings',
      popularityScore: 93,
      scientificReference:
        'Thaler & Benartzi (2004) - Save More Tomorrow: Using behavioral economics',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Read financial news or learning content for 10 minutes. Financial literacy directly correlates with wealth building.',
      frequency: 'daily',
      icon: '📰',
      iconColor: '#F59E0B',
      name: 'Financial Education',
      popularityScore: 85,
      scientificReference:
        'Lusardi & Mitchell (2014) - The economic importance of financial literacy',
    });

    await ctx.db.insert('templates', {
      category: 'financial',
      createdAt: now,
      description:
        'Implement a no-spend day. Regular restraint builds discipline and increases savings rate.',
      frequency: 'weekly',
      icon: '🚫',
      iconColor: '#DC2626',
      name: 'No-Spend Day',
      popularityScore: 82,
      scientificReference:
        'Baumeister et al. (2007) - Psychology of spending and consumer self-control',
    });

    // Creativity Templates
    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Sketch, doodle, or draw for 10 minutes. Visual creativity reduces stress and enhances problem-solving.',
      frequency: 'daily',
      icon: '🎨',
      iconColor: '#EC4899',
      name: 'Daily Drawing',
      popularityScore: 87,
      scientificReference:
        'Kaimal et al. (2016) - Reduction of cortisol levels through art making',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Free write for 10 minutes without editing. Stream-of-consciousness writing unlocks creative insights.',
      frequency: 'daily',
      icon: '✍️',
      iconColor: '#7C3AED',
      name: 'Creative Writing',
      popularityScore: 89,
      scientificReference:
        'Pennebaker & Smyth (2016) - Opening up by writing it down',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Capture 3 ideas or observations. Building an idea bank fuels creativity and innovation.',
      frequency: 'daily',
      icon: '💡',
      iconColor: '#F59E0B',
      name: 'Idea Collection',
      popularityScore: 86,
      scientificReference:
        'Sawyer (2011) - Explaining creativity: The science of human innovation',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Practice your creative skill for 20 minutes. Deliberate practice is essential for creative mastery.',
      frequency: 'daily',
      icon: '🎭',
      iconColor: '#8B5CF6',
      name: 'Creative Practice',
      popularityScore: 91,
      scientificReference:
        'Ericsson et al. (1993) - The role of deliberate practice in expertise',
    });

    await ctx.db.insert('templates', {
      category: 'creativity',
      createdAt: now,
      description:
        'Consume creative inspiration (art, music, poetry). Diverse input enhances creative output.',
      frequency: 'daily',
      icon: '🎵',
      iconColor: '#06B6D4',
      name: 'Creative Inspiration',
      popularityScore: 84,
      scientificReference:
        'Getzels & Csikszentmihalyi (1976) - Creative vision: Longitudinal study',
    });

    // Sleep & Recovery Templates
    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Maintain a consistent sleep schedule 7 days a week. Regular sleep timing is crucial for circadian health.',
      frequency: 'daily',
      icon: '⏰',
      iconColor: '#6366F1',
      name: 'Consistent Sleep Schedule',
      popularityScore: 95,
      scientificReference:
        'Walker (2017) - Why We Sleep: Unlocking the power of sleep',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Keep bedroom cool (65-68°F/18-20°C). Cooler temperatures significantly improve sleep quality.',
      frequency: 'daily',
      icon: '❄️',
      iconColor: '#38BDF8',
      name: 'Cool Sleep Environment',
      popularityScore: 89,
      scientificReference:
        'Okamoto-Mizuno & Mizuno (2012) - Effects of thermal environment on sleep',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Create a 30-minute wind-down routine before bed. Consistent pre-sleep rituals improve sleep onset.',
      frequency: 'daily',
      icon: '🌙',
      iconColor: '#818CF8',
      name: 'Bedtime Routine',
      popularityScore: 92,
      scientificReference:
        'Irish et al. (2015) - The role of sleep hygiene in sleep quality',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Avoid caffeine after 2 PM. Caffeine has a 6-hour half-life and disrupts deep sleep stages.',
      frequency: 'daily',
      icon: '☕',
      iconColor: '#92400E',
      name: 'Afternoon Caffeine Cutoff',
      popularityScore: 88,
      scientificReference:
        'Drake et al. (2013) - Caffeine effects on sleep taken 0, 3, or 6 hours',
    });

    await ctx.db.insert('templates', {
      category: 'sleep',
      createdAt: now,
      description:
        'Use blackout curtains or sleep mask. Complete darkness enhances melatonin production and sleep quality.',
      frequency: 'daily',
      icon: '🌑',
      iconColor: '#1E293B',
      name: 'Dark Sleep Environment',
      popularityScore: 86,
      scientificReference:
        'Gooley et al. (2011) - Exposure to room light before bedtime',
    });

    return { message: '55 templates seeded successfully', success: true };
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
