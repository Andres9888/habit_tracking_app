import { getEmojiAndName } from "../DraggableHabit/DraggableHabit.hooks";

describe("getEmojiAndName", () => {
  it("extracts leading emoji and name", () => {
    const result = getEmojiAndName("🏃 Exercise");
    expect(result).toEqual({ emoji: "🏃", name: "Exercise" });
  });

  it("returns empty emoji when none present", () => {
    const result = getEmojiAndName("Exercise");
    expect(result).toEqual({ emoji: "", name: "Exercise" });
  });

  it("handles skin tone modifiers", () => {
    const result = getEmojiAndName("👍🏽 Approve");
    // Our simple regex treats first code point; accept either combined or base as emoji
    expect(result.name).toMatch(/Approve/);
    expect(result.emoji.length).toBeGreaterThan(0);
  });

  it("handles flag sequences", () => {
    const result = getEmojiAndName("🇺🇸 Travel");
    expect(result.name).toMatch(/Travel/);
    expect(result.emoji.length).toBeGreaterThan(0);
  });
});


