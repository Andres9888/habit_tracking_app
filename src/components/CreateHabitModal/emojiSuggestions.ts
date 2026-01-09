/**
 * Smart emoji suggestions based on habit name keywords
 */
export function getSuggestedEmojis(habitName: string): string[] {
  const q = habitName.toLowerCase();

  const emojiMap: Record<string, string[]> = {
    bike: ['🚴', '🚲', '🚴‍♀️', '🏔️'],
    book: ['📖', '📚', '📰', '📝'],
    calm: ['🧘', '🙏', '😌', '💭'],
    clean: ['🧹', '🧼', '✨', '🏠'],
    coffee: ['☕', '🫖', '☕', '🌅'],
    creative: ['🎨', '✏️', '🖌️', '🖼️'],
    cycle: ['🚴', '🚲', '🚴‍♀️', '🏔️'],
    diary: ['📝', '✍️', '📓', '🖊️'],
    digital: ['📱', '📵', '🔇', '⏰'],
    draw: ['🎨', '✏️', '🖌️', '🖼️'],
    drink: ['💧', '🥤', '🚰', '💦'],
    eat: ['🍎', '🥗', '🥑', '🍊'],
    evening: ['🌙', '🌃', '✨', '🌟'],
    exercise: ['💪', '🏋️', '🏋️‍♀️', '⚡'],
    food: ['🍎', '🥗', '🥑', '🍊'],
    grateful: ['🙏', '💝', '✨', '🌟'],
    gratitude: ['🙏', '💝', '✨', '🌟'],
    guitar: ['🎸', '🎹', '🎵', '🎶'],
    gym: ['💪', '🏋️', '🏋️‍♀️', '⚡'],
    healthy: ['🍎', '🥗', '🥑', '🍊'],
    hydrat: ['💧', '🥤', '🚰', '💦'],
    instrument: ['🎸', '🎹', '🎵', '🎶'],
    jog: ['🏃', '👟', '🏃‍♀️', '💨'],
    journal: ['📝', '✍️', '📓', '🖊️'],
    learn: ['📚', '🎓', '🧠', '💡'],
    lift: ['💪', '🏋️', '🏋️‍♀️', '⚡'],
    meditat: ['🧘', '🙏', '😌', '💭'],
    mindful: ['🧘', '🙏', '😌', '💭'],
    morning: ['🌅', '☀️', '⏰', '🌄'],
    music: ['🎸', '🎹', '🎵', '🎶'],
    night: ['🌙', '🌃', '✨', '🌟'],
    organiz: ['🧹', '🧼', '✨', '🏠'],
    paint: ['🎨', '✏️', '🖌️', '🖼️'],
    phone: ['📱', '📵', '🔇', '⏰'],
    piano: ['🎸', '🎹', '🎵', '🎶'],
    read: ['📖', '📚', '📰', '📝'],
    run: ['🏃', '👟', '🏃‍♀️', '💨'],
    screen: ['📱', '📵', '🔇', '⏰'],
    sleep: ['😴', '🛏️', '🌙', '💤'],
    step: ['🚶', '👣', '🚶‍♀️', '🌳'],
    stretch: ['🧘', '🤸', '🙆', '🧘‍♀️'],
    study: ['📚', '🎓', '🧠', '💡'],
    supplement: ['💊', '🍊', '💉', '🩺'],
    thank: ['🙏', '💝', '✨', '🌟'],
    tidy: ['🧹', '🧼', '✨', '🏠'],
    vitamin: ['💊', '🍊', '💉', '🩺'],
    wake: ['🌅', '☀️', '⏰', '🌄'],
    walk: ['🚶', '👣', '🚶‍♀️', '🌳'],
    water: ['💧', '🥤', '🚰', '💦'],
    workout: ['💪', '🏋️', '🏋️‍♀️', '⚡'],
    write: ['📝', '✍️', '📓', '🖊️'],
    yoga: ['🧘', '🤸', '🙆', '🧘‍♀️'],
  };

  for (const [keyword, emojis] of Object.entries(emojiMap)) {
    if (q.includes(keyword)) {
      return emojis;
    }
  }

  return [];
}
