/**
 * Premium Templates Seed - Advanced habits for premium subscribers
 * Features like Deep Work Blocks, Pomodoro Tracking, and other advanced habits
 */
import { mutation } from '../_generated/server';

type PremiumTemplateInsert = {
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
  isPremium: true;
  name: string;
  popularityScore?: number;
  scientificReference: string;
  tips?: string[];
};

/**
 * Mutation: Seed premium-only templates (advanced habits)
 */
export const seedPremiumTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let insertedCount = 0;
    let skippedCount = 0;

    const insertIfMissing = async (template: PremiumTemplateInsert) => {
      const existing = await ctx.db
        .query('templates')
        .filter((q) => q.eq(q.field('name'), template.name))
        .first();
      if (existing) {
        // Ensure isPremium flag is set on existing template
        if (!existing.isPremium) {
          await ctx.db.patch(existing._id, { isPremium: true });
        }
        skippedCount++;
        return;
      }
      await ctx.db.insert('templates', template);
      insertedCount++;
    };

    // ═══════════════════════════════════════════════════════════════
    // 🧠 PRODUCTIVITY - Advanced Focus & Deep Work
    // ═══════════════════════════════════════════════════════════════

    await insertIfMissing({
      category: 'productivity',
      createdAt: now,
      description:
        'Schedule 2-4 deep work blocks per day (90 min each). Track block completion, interruptions avoided, and cognitive output. Builds elite-level focus capacity over weeks.',
      frequency: 'daily',
      icon: '🧠',
      iconColor: '#7C3AED',
      isPremium: true,
      name: 'Deep Work Blocks',
      popularityScore: 97,
      scientificReference:
        'Newport (2016) - Deep Work: Rules for Focused Success in a Distracted World',
      tips: [
        'Start with one 90-min block and add more as focus improves',
        'Use a physical "deep work in progress" sign',
        'Track your deep work hours weekly to see improvement',
        'Pair with caffeine timing for optimal cognitive performance',
      ],
    });

    await insertIfMissing({
      category: 'productivity',
      createdAt: now,
      description:
        'Advanced Pomodoro with analytics: track focus quality per session (1-5), log distractions, and review weekly focus trends. Includes progressive interval training (25→35→45 min).',
      frequency: 'daily',
      icon: '🍅',
      iconColor: '#DC2626',
      isPremium: true,
      name: 'Pomodoro Tracking Pro',
      popularityScore: 94,
      scientificReference:
        'Cirillo (2006) - The Pomodoro Technique; DeskTime (2014) - Optimal work/break ratio study',
      tips: [
        'Rate each pomodoro session quality to identify peak hours',
        'Gradually increase intervals as focus improves',
        'Use break time for movement, not screen switching',
        'Review weekly analytics to optimize your schedule',
      ],
    });

    await insertIfMissing({
      category: 'productivity',
      createdAt: now,
      description:
        'Apply the Eisenhower Matrix daily: categorize all tasks into Urgent/Important quadrants. Track time spent in each quadrant and aim for 60%+ in "Important, Not Urgent."',
      frequency: 'daily',
      icon: '📊',
      iconColor: '#059669',
      isPremium: true,
      name: 'Eisenhower Matrix Review',
      popularityScore: 91,
      scientificReference:
        'Covey (1989) - The 7 Habits of Highly Effective People; Eisenhower Decision Principle',
      tips: [
        'Spend first 10 min each morning categorizing tasks',
        'Delegate or delete tasks in the "Not Important" quadrants',
        'Weekly review: calculate your Quadrant 2 percentage',
      ],
    });

    await insertIfMissing({
      category: 'productivity',
      createdAt: now,
      description:
        'Conduct a structured weekly review: process inboxes to zero, review all projects, update next actions, and set intentions for the coming week. The cornerstone of GTD methodology.',
      frequency: 'weekly',
      icon: '📋',
      iconColor: '#2563EB',
      isPremium: true,
      name: 'GTD Weekly Review',
      popularityScore: 92,
      scientificReference:
        'Allen (2001) - Getting Things Done: The Art of Stress-Free Productivity',
      tips: [
        'Block 60-90 minutes every Friday or Sunday',
        'Use a checklist to ensure no step is missed',
        'Start with a mind sweep to capture all open loops',
      ],
    });

    await insertIfMissing({
      category: 'productivity',
      createdAt: now,
      description:
        'Conduct a monthly personal retrospective: What went well? What didn\'t? What will I change? Rate life satisfaction across 8 dimensions and set improvement goals.',
      frequency: 'weekly',
      icon: '🔄',
      iconColor: '#8B5CF6',
      isPremium: true,
      name: 'Monthly Life Retrospective',
      popularityScore: 88,
      scientificReference:
        'Schön (1983) - The Reflective Practitioner; Agile retrospective methodology adapted for personal growth',
      tips: [
        'Rate 8 life areas: Health, Career, Finance, Relationships, Growth, Fun, Environment, Purpose',
        'Compare scores month over month for trends',
        'Pick max 3 improvement areas per month',
      ],
    });

    // ═══════════════════════════════════════════════════════════════
    // 💪 HEALTH & FITNESS - Advanced Protocols
    // ═══════════════════════════════════════════════════════════════

    await insertIfMissing({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Structured periodization: track progressive overload across all lifts. Log sets, reps, weight, RPE, and volume. Auto-calculates estimated 1RM and weekly volume trends.',
      frequency: 'daily',
      icon: '🏋️',
      iconColor: '#EF4444',
      isPremium: true,
      name: 'Strength Training Log',
      popularityScore: 93,
      scientificReference:
        'Schoenfeld (2010) - The mechanisms of muscle hypertrophy; Progressive overload principle',
      tips: [
        'Track total weekly volume (sets × reps × weight) per muscle group',
        'Aim for 2-5% progressive overload every 1-2 weeks',
        'Include RPE ratings to manage fatigue',
      ],
    });

    await insertIfMissing({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Track HRV (heart rate variability) each morning with a chest strap or smart ring. Use 7-day rolling average to guide training intensity. Higher HRV = ready for hard training.',
      frequency: 'daily',
      icon: '📈',
      iconColor: '#10B981',
      isPremium: true,
      name: 'HRV Recovery Tracking',
      popularityScore: 90,
      scientificReference:
        'Plews et al. (2013) - Training adaptation and heart rate variability in athletes',
      tips: [
        'Measure within 5 min of waking, same position daily',
        'Track 7-day rolling average, not single readings',
        'Red days: active recovery only. Green days: push hard.',
      ],
    });

    await insertIfMissing({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Follow the Huberman-Attia hybrid protocol: 3× Zone 2 cardio (45 min), 1× VO2 max intervals, 3× resistance training per week. Track all sessions and recovery metrics.',
      frequency: 'weekly',
      icon: '🫀',
      iconColor: '#DC2626',
      isPremium: true,
      name: 'Elite Fitness Protocol',
      popularityScore: 95,
      scientificReference:
        'Attia (2023) - Outlive; Huberman Lab (2023) - Optimal fitness protocol combining endurance and strength',
      tips: [
        'Zone 2 = can hold a conversation but barely',
        'VO2 max session: 4×4 min at max sustainable pace',
        'Never skip the 3 Zone 2 sessions — they build your base',
      ],
    });

    await insertIfMissing({
      category: 'health_fitness',
      createdAt: now,
      description:
        'Use a CGM (continuous glucose monitor) or post-meal finger pricks to log glycemic responses. Identify which foods spike you and build a personalized optimal food list.',
      frequency: 'daily',
      icon: '📉',
      iconColor: '#F59E0B',
      isPremium: true,
      name: 'Blood Glucose Optimization',
      popularityScore: 89,
      scientificReference:
        'Zeevi et al. (2015) - Personalized nutrition by prediction of glycemic responses (Weizmann Institute)',
      tips: [
        'Log meals + glucose readings 1hr and 2hr post-meal',
        'Target: stay under 140 mg/dL post-meal',
        'Test food order effects: protein/fat before carbs',
      ],
    });

    // ═══════════════════════════════════════════════════════════════
    // 😴 SLEEP - Advanced Sleep Optimization
    // ═══════════════════════════════════════════════════════════════

    await insertIfMissing({
      category: 'sleep',
      createdAt: now,
      description:
        'Advanced sleep tracking protocol: log sleep/wake times, sleep latency, WASO, subjective quality (1-10), and morning alertness. Calculate weekly sleep efficiency and trends.',
      frequency: 'daily',
      icon: '📊',
      iconColor: '#4338CA',
      isPremium: true,
      name: 'Sleep Quality Analytics',
      popularityScore: 91,
      scientificReference:
        'Walker (2017) - Why We Sleep; CBT-I sleep diary methodology',
      tips: [
        'Sleep efficiency = (time asleep / time in bed) × 100',
        'Target: 85%+ sleep efficiency',
        'Track caffeine timing and its effect on sleep latency',
      ],
    });

    await insertIfMissing({
      category: 'sleep',
      createdAt: now,
      description:
        'Follow the complete CBT-I (Cognitive Behavioral Therapy for Insomnia) protocol: sleep restriction, stimulus control, cognitive restructuring, and sleep hygiene. The gold standard for insomnia.',
      frequency: 'daily',
      icon: '🛏️',
      iconColor: '#1E40AF',
      isPremium: true,
      name: 'CBT-I Full Protocol',
      popularityScore: 88,
      scientificReference:
        'Morin et al. (2006) - CBT-I: More effective than medication for chronic insomnia (meta-analysis)',
      tips: [
        'Restrict bed time to actual sleep time (minimum 5.5 hrs)',
        'If awake >20 min in bed, get up and return when sleepy',
        'No clock-watching — turn clocks away from bed',
      ],
    });

    // ═══════════════════════════════════════════════════════════════
    // 🧘 MINDFULNESS - Advanced Practices
    // ═══════════════════════════════════════════════════════════════

    await insertIfMissing({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Progressive meditation practice: track session duration, depth (1-10), and type (focused attention, open monitoring, loving-kindness). Build toward 20+ min daily with quality tracking.',
      frequency: 'daily',
      icon: '🧘',
      iconColor: '#7C3AED',
      isPremium: true,
      name: 'Meditation Mastery Program',
      popularityScore: 92,
      scientificReference:
        'Lutz et al. (2008) - Attention regulation and monitoring in meditation; 10,000 hours of practice research',
      tips: [
        'Start logging meditation quality, not just duration',
        'Alternate between techniques for balanced development',
        'Monthly: review average depth score trends',
      ],
    });

    await insertIfMissing({
      category: 'mindfulness',
      createdAt: now,
      description:
        'Apply stoic philosophy daily: morning premeditation of adversity, evening journaling (what went well, what was challenging, what wisdom was gained). Based on Marcus Aurelius\' Meditations practice.',
      frequency: 'daily',
      icon: '📜',
      iconColor: '#64748B',
      isPremium: true,
      name: 'Stoic Daily Practice',
      popularityScore: 87,
      scientificReference:
        'Robertson (2019) - How to Think Like a Roman Emperor; Aurelius - Meditations; Modern stoicism research',
      tips: [
        'Morning: "What could go wrong today? How would I handle it?"',
        'Evening: 3 questions from Seneca\'s daily review',
        'Weekly: identify one situation where you practiced virtue',
      ],
    });

    // ═══════════════════════════════════════════════════════════════
    // 📚 LEARNING - Advanced Skill Acquisition
    // ═══════════════════════════════════════════════════════════════

    await insertIfMissing({
      category: 'learning',
      createdAt: now,
      description:
        'Apply deliberate practice principles: identify specific sub-skills, practice at the edge of ability, get feedback, and track skill level over time. The science of becoming expert at anything.',
      frequency: 'daily',
      icon: '🎯',
      iconColor: '#DC2626',
      isPremium: true,
      name: 'Deliberate Practice Protocol',
      popularityScore: 93,
      scientificReference:
        'Ericsson et al. (1993) - The Role of Deliberate Practice in the Acquisition of Expert Performance',
      tips: [
        'Identify the specific sub-skill to improve this week',
        'Practice should feel difficult but not impossible',
        'Get expert feedback at least once per week',
        'Log practice quality (1-10) alongside duration',
      ],
    });

    await insertIfMissing({
      category: 'learning',
      createdAt: now,
      description:
        'Build and review a personal Zettelkasten or linked notes system. Connect new ideas to existing knowledge daily. Track notes created, links made, and insights generated.',
      frequency: 'daily',
      icon: '🗃️',
      iconColor: '#059669',
      isPremium: true,
      name: 'Zettelkasten Knowledge System',
      popularityScore: 86,
      scientificReference:
        'Luhmann (1981) - Kommunikation mit Zettelkästen; Ahrens (2017) - How to Take Smart Notes',
      tips: [
        'Write one permanent note per day from what you read/learned',
        'Always link new notes to at least 2 existing notes',
        'Review random old notes weekly to find new connections',
      ],
    });

    // ═══════════════════════════════════════════════════════════════
    // 💰 FINANCIAL - Advanced Wealth Building
    // ═══════════════════════════════════════════════════════════════

    await insertIfMissing({
      category: 'financial',
      createdAt: now,
      description:
        'Track net worth monthly across all accounts. Calculate savings rate, investment returns, and progress toward financial independence. Includes FIRE number tracking.',
      frequency: 'weekly',
      icon: '💎',
      iconColor: '#059669',
      isPremium: true,
      name: 'Wealth Dashboard Review',
      popularityScore: 90,
      scientificReference:
        'Collins (2016) - The Simple Path to Wealth; FIRE movement research on savings rate impact',
      tips: [
        'Automate account aggregation for frictionless tracking',
        'Calculate your FIRE number: annual expenses × 25',
        'Track savings rate: aim for 20%+ of gross income',
      ],
    });

    await insertIfMissing({
      category: 'financial',
      createdAt: now,
      description:
        'Review investment portfolio weekly: check allocation drift, rebalance triggers, tax-loss harvesting opportunities, and dividend reinvestment. Maintain target asset allocation.',
      frequency: 'weekly',
      icon: '📈',
      iconColor: '#2563EB',
      isPremium: true,
      name: 'Investment Portfolio Review',
      popularityScore: 87,
      scientificReference:
        'Bogle (2007) - The Little Book of Common Sense Investing; Swensen (2005) - Unconventional Success',
      tips: [
        'Set rebalance threshold: act when >5% off target allocation',
        'Review once weekly but only trade quarterly',
        'Track total return vs benchmark (e.g., S&P 500)',
      ],
    });

    // ═══════════════════════════════════════════════════════════════
    // 🔬 LONGEVITY - Advanced Biomarker Tracking
    // ═══════════════════════════════════════════════════════════════

    await insertIfMissing({
      category: 'longevity',
      createdAt: now,
      description:
        'Track key biomarkers quarterly: ApoB, HbA1c, fasting insulin, hsCRP, vitamin D, omega-3 index. Log results and correlate with lifestyle interventions.',
      frequency: 'weekly',
      icon: '🔬',
      iconColor: '#0EA5E9',
      isPremium: true,
      name: 'Biomarker Dashboard',
      popularityScore: 92,
      scientificReference:
        'Attia (2023) - Outlive; Key biomarkers for longevity optimization',
      tips: [
        'Get comprehensive bloodwork every 3-6 months',
        'Target ApoB < 60 mg/dL for optimal cardiovascular protection',
        'Track HbA1c trend — aim for < 5.4%',
      ],
    });

    await insertIfMissing({
      category: 'longevity',
      createdAt: now,
      description:
        'Follow a structured longevity exercise protocol: 3× Zone 2 (180 min/wk), 1× VO2 max, 3× strength, 1× stability/balance. Track weekly compliance and performance metrics.',
      frequency: 'weekly',
      icon: '🏃',
      iconColor: '#10B981',
      isPremium: true,
      name: 'Centenarian Decathlon Training',
      popularityScore: 94,
      scientificReference:
        'Attia (2023) - Outlive: Training for the last decade of your life (Centenarian Decathlon concept)',
      tips: [
        'Define your 10 physical tasks you want to do at age 90',
        'Train backward from those goals with margin',
        'Test yourself quarterly on all 10 tasks',
      ],
    });

    return {
      insertedCount,
      message: `${insertedCount} premium templates inserted, ${skippedCount} skipped`,
      skippedCount,
      success: true,
    };
  },
});
