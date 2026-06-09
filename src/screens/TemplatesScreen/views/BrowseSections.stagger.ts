/** Stagger indices for BrowseSections entrance animations. */

export function browseStaggerIndex(options: {
  isFirstTimeUser: boolean;
  recommendationCount: number;
  section: 'browseLink' | 'forYou' | 'goals' | 'popular' | 'starters';
  showStarterList: boolean;
}): number {
  const { isFirstTimeUser, recommendationCount, section, showStarterList } =
    options;
  const hasForYou = recommendationCount > 0;

  if (showStarterList) {
    if (section === 'starters') return 2;
    if (section === 'browseLink') return 3;
    return 2;
  }

  if (section === 'forYou') return isFirstTimeUser ? 3 : 2;
  if (section === 'goals') {
    if (isFirstTimeUser) return hasForYou ? 4 : 3;
    return 2;
  }
  if (section === 'popular') {
    if (isFirstTimeUser) return hasForYou ? 5 : 4;
    return hasForYou ? 3 : 2;
  }
  if (section === 'browseLink') {
    if (isFirstTimeUser) return hasForYou ? 6 : 5;
    return hasForYou ? 4 : 3;
  }
  return 2;
}
