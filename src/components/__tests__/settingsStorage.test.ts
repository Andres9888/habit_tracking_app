import { getCompactMode, setCompactMode } from "../../lib/settingsStorage";

describe("settingsStorage", () => {
  it("returns false by default when not set", async () => {
    // Ensure clean slate
    try {
      (globalThis as any).localStorage?.removeItem(
        "habitTrackerSettings.compactMode"
      );
    } catch {}
    const value = await getCompactMode();
    expect(value).toBe(false);
  });

  it("persists and reads compact mode", async () => {
    await setCompactMode(true);
    const on = await getCompactMode();
    expect(on).toBe(true);

    await setCompactMode(false);
    const off = await getCompactMode();
    expect(off).toBe(false);
  });
});


