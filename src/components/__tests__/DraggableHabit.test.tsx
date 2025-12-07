import React from "react";
import { render } from "@testing-library/react-native";
import DraggableHabit from "../DraggableHabit/DraggableHabit";
import type { Id } from "../../../convex/_generated/dataModel";

const buildHabit = (overrides: Partial<Record<string, unknown>> = {}) =>
  ({
    _id: "habit_1" as Id<"habits">,
    name: "✅ Daily Reflection",
    createdAt: Date.now(),
    _creationTime: Date.now(),
    ...overrides,
  }) as const;

const weekDateStrings = ["2025-01-01", "2025-01-02", "2025-01-03", "2025-01-04", "2025-01-05"];
const weekStatus: Array<"done" | "missed" | "planned"> = [
  "done",
  "planned",
  "missed",
  "done",
  "planned",
];

describe("DraggableHabit compact mode", () => {
  it("keeps full habit card padding in default mode", () => {
    const { toJSON } = render(
      <DraggableHabit
        habit={buildHabit()}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
        streak={0}
        isCompactMode={false}
        toggleHabit={jest.fn()}
      />
    );

    const tree = toJSON();
    expect(tree).toBeTruthy();

    const className = Array.isArray(tree) ? tree[0]?.props?.className : tree?.props?.className;
    expect(className).toContain("py-5");
    expect(className).not.toContain("py-3");
  });

  it("reduces only vertical padding when compact mode is enabled", () => {
    const { toJSON } = render(
      <DraggableHabit
        habit={buildHabit()}
        weekDateStrings={weekDateStrings}
        weekStatus={weekStatus}
        streak={0}
        isCompactMode
        toggleHabit={jest.fn()}
      />
    );

    const tree = toJSON();
    expect(tree).toBeTruthy();

    const className = Array.isArray(tree) ? tree[0]?.props?.className : tree?.props?.className;
    expect(className).toContain("py-3");
    expect(className).not.toContain("py-5");
    expect(className).toContain("px-5");
  });
});
