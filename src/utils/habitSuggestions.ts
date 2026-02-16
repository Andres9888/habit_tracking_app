/**
 * Smart Habit Suggestions
 * 
 * Analyzes user's existing habits and suggests complementary templates
 * based on habit categories, names, and behavior patterns.
 * 
 * Scientific Basis:
 * - Habit stacking (Clear, 2018): Building new habits on existing ones
 * - Behavioral clustering (Lally et al., 2010): Related habits form together
 * - Context-dependent patterns (Wood & Neal, 2007): Similar contexts reinforce
 */

import type { Doc } from '../../convex/_generated/dataModel';

/**
 * Template category-based suggestions
 * Map: template category → complementary categories to suggest
 */
const TEMPLATE_CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  health_fitness: ['mindfulness', 'sleep', 'recovery', 'breathing'],
  mindfulness: ['health_fitness', 'sleep', 'mental_health', 'breathing'],
  productivity: ['morning_routine', 'learning', 'mental_health'],
  learning: ['productivity', 'mindfulness', 'creativity'],
  creativity: ['learning', 'mental_health', 'mindfulness'],
  social: ['mental_health', 'mindfulness'],
  sleep: ['recovery', 'mindfulness', 'breathing', 'health_fitness'],
  mental_health: ['mindfulness', 'breathing', 'social'],
};

/**
 * Keyword-based complementary suggestions
 * Fuzzy matching for habit names → suggested templates
 */
const KEYWORD_SUGGESTIONS: Record<string, string[]> = {
  exercise: ['Stretching', 'Drink Water', 'Sleep 8 Hours', 'Track Workout'],
  workout: ['Stretching', 'Drink Water', 'Sleep 8 Hours', 'Protein Shake'],
  gym: ['Stretching', 'Drink Water', 'Sleep 8 Hours', 'Track Progress'],
  run: ['Stretching', 'Drink Water', 'Sleep 8 Hours', 'Morning Walk'],
  yoga: ['Meditation', 'Drink Water', 'Stretching', 'Mindful Breathing'],
  
  read: ['Journal', 'Learn Language', 'Meditate', 'Take Notes'],
  book: ['Journal', 'Learn Language', 'Reflect', 'Summary Notes'],
  study: ['Break Time', 'Drink Water', 'Review Notes', 'Spaced Repetition'],
  
  meditate: ['Journal', 'Gratitude', 'Deep Breathing', 'Mindful Walking'],
  mindful: ['Journal', 'Gratitude', 'Meditation', 'Body Scan'],
  
  write: ['Read', 'Morning Pages', 'Brainstorm', 'Edit Work'],
  journal: ['Meditate', 'Gratitude', 'Read', 'Reflect on Day'],
  
  work: ['Break Time', 'Stretch', 'Walk', 'Drink Water', 'Plan Tomorrow'],
  code: ['Break Time', 'Stretch', 'Learn New Tech', 'Review Code'],
  
  sleep: ['No Screens', 'Evening Routine', 'Read', 'Gratitude'],
  morning: ['Drink Water', 'Stretch', 'Make Bed', 'Plan Day'],
  evening: ['Review Day', 'Gratitude', 'Plan Tomorrow', 'Wind Down'],
};

/**
 * Behavioral pattern suggestions
 * Based on habit frequency and time preferences
 */
function getPatternBasedSuggestions(habits: Doc<'habits'>[]): string[] {
  const suggestions: string[] = [];
  
  // Count morning habits
  const morningHabits = habits.filter(h => 
    h.preferredTime === 'morning' || 
    h.cueTime?.toLowerCase().includes('morning') ||
    (h.reminderTime && parseInt(h.reminderTime.split(':')[0]) < 12)
  );
  
  if (morningHabits.length >= 2) {
    suggestions.push('Morning Routine', 'Make Bed', 'Cold Shower');
  }
  
  // Count evening habits
  const eveningHabits = habits.filter(h =>
    h.preferredTime === 'evening' ||
    h.cueTime?.toLowerCase().includes('evening') ||
    (h.reminderTime && parseInt(h.reminderTime.split(':')[0]) >= 18)
  );
  
  if (eveningHabits.length >= 2) {
    suggestions.push('Evening Routine', 'Reflect on Day', 'Plan Tomorrow');
  }
  
  // Check for daily habits (suggest consistency)
  const dailyHabits = habits.filter(h => h.frequency === 'daily');
  if (dailyHabits.length >= 3) {
    suggestions.push('Track Mood', 'Review Goals', 'Daily Wins');
  }
  
  return suggestions;
}

/**
 * Get smart habit suggestions based on user's existing habits
 */
export function getSmartSuggestions(
  userHabits: Doc<'habits'>[],
  allTemplates: Doc<'templates'>[]
): Doc<'templates'>[] {
  if (!userHabits.length || !allTemplates.length) {
    // No habits yet - show popular/beginner templates
    return allTemplates
      .filter(t => t.category === 'health_fitness' || t.category === 'productivity')
      .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
      .slice(0, 6);
  }
  
  const suggestedNames = new Set<string>();
  const alreadyHaveNames = new Set(
    userHabits.map(h => h.name.toLowerCase().trim())
  );
  
  // 1. Keyword-based suggestions (primary strategy since habits don't have categories)
  userHabits.forEach(habit => {
    const habitName = habit.name.toLowerCase();
    Object.entries(KEYWORD_SUGGESTIONS).forEach(([keyword, suggestions]) => {
      if (habitName.includes(keyword)) {
        suggestions.forEach(name => suggestedNames.add(name.toLowerCase()));
      }
    });
  });
  
  // 2. Pattern-based suggestions
  const patternSuggestions = getPatternBasedSuggestions(userHabits);
  patternSuggestions.forEach(name => suggestedNames.add(name.toLowerCase()));
  
  // 3. Filter out habits user already has
  const filteredSuggestions = Array.from(suggestedNames).filter(
    name => !alreadyHaveNames.has(name)
  );
  
  // 4. Match suggested names to actual templates (fuzzy matching)
  const matchedTemplates = filteredSuggestions
    .map(suggestedName => {
      // Try exact match first
      let template = allTemplates.find(
        t => t.name.toLowerCase() === suggestedName
      );
      
      // Try partial match if exact fails
      if (!template) {
        template = allTemplates.find(t =>
          t.name.toLowerCase().includes(suggestedName) ||
          suggestedName.includes(t.name.toLowerCase())
        );
      }
      
      return template;
    })
    .filter((t): t is Doc<'templates'> => t !== undefined);
  
  // 5. If we have matched templates, use them; otherwise suggest from complementary categories
  let resultTemplates: Doc<'templates'>[];
  if (matchedTemplates.length >= 3) {
    resultTemplates = matchedTemplates;
  } else {
    // Not enough keyword matches - suggest from complementary template categories
    const usedCategories = new Set<string>();
    
    // Analyze what templates would match user's habits
    userHabits.forEach(habit => {
      const habitName = habit.name.toLowerCase();
      allTemplates.forEach(template => {
        if (template.name.toLowerCase().includes(habitName) || 
            habitName.includes(template.name.toLowerCase())) {
          usedCategories.add(template.category);
        }
      });
    });
    
    // Get complementary categories
    const suggestedCategories = new Set<string>();
    usedCategories.forEach(cat => {
      const complements = TEMPLATE_CATEGORY_SUGGESTIONS[cat] || [];
      complements.forEach(c => suggestedCategories.add(c));
    });
    
    // Get templates from suggested categories
    const categoryTemplates = allTemplates.filter(t => 
      suggestedCategories.has(t.category) &&
      !alreadyHaveNames.has(t.name.toLowerCase())
    );
    
    // Combine matched + category suggestions
    resultTemplates = [...matchedTemplates, ...categoryTemplates];
  }
  
  // 6. Remove duplicates, sort by popularity, take top 6
  const uniqueTemplates = Array.from(
    new Map(resultTemplates.map(t => [t._id, t])).values()
  );
  
  return uniqueTemplates
    .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
    .slice(0, 6);
}

/**
 * Check if we should show suggestions to user
 * Show when: user has < 5 habits (getting started)
 */
export function shouldShowSuggestions(habitCount: number): boolean {
  return habitCount > 0 && habitCount < 5;
}
