/**
 * AI-like suggestions based on input patterns
 */
export const getAISuggestions = (input: string): string[] => {
  const q = input.toLowerCase().trim();

  if (q.length < 3) return [];

  if (q.includes('meditat')) return ['5 minutes', 'morning', 'before bed'];
  if (q.includes('read')) return ['10 minutes', '20 pages', 'before sleep'];
  if (q.includes('exercise') || q.includes('workout'))
    return ['30 minutes', 'morning', '3x week'];
  if (q.includes('run') || q.includes('jog'))
    return ['20 minutes', '2 miles', 'every day'];
  if (q.includes('water') || q.includes('drink'))
    return ['8 glasses', 'hourly', 'before meals'];
  if (q.includes('walk') || q.includes('step'))
    return ['10,000 steps', '30 minutes', 'after lunch'];
  if (q.includes('sleep')) return ['8 hours', 'by 10pm', 'no screens'];
  if (q.includes('journal') || q.includes('write'))
    return ['10 minutes', 'morning', 'gratitude'];
  if (q.includes('stretch') || q.includes('yoga'))
    return ['15 minutes', 'morning', 'evening'];
  if (q.includes('learn') || q.includes('study'))
    return ['30 minutes', 'new skill', 'daily'];
  if (q.includes('clean') || q.includes('tidy'))
    return ['15 minutes', 'morning', 'before bed'];
  if (q.includes('call') || q.includes('phone'))
    return ['weekly', 'parents', 'friends'];
  if (q.includes('grateful') || q.includes('gratitude'))
    return ['3 things', 'morning', 'evening'];
  if (q.includes('vitamin') || q.includes('supplement'))
    return ['morning', 'with food', 'daily'];
  if (q.includes('breakfast') || q.includes('meal'))
    return ['healthy', '7am', 'no skip'];
  if (q.includes('practice') || q.includes('music'))
    return ['30 minutes', 'scales', 'daily'];
  if (q.includes('floss') || q.includes('teeth'))
    return ['after meals', 'before bed', 'morning'];

  // Generic time-based suggestions if nothing specific matches
  if (q.length >= 5) return ['daily', 'morning', 'evening'];

  return [];
};
