import React from "react";
import { render } from "@testing-library/react-native";
import { HabitChainVisualizer } from "../HabitChainVisualizer/HabitChainVisualizer";
import type { Id } from "../../../convex/_generated/dataModel";

const baseDates = ["2025-01-01", "2025-01-02", "2025-01-03", "2025-01-04", "2025-01-05"];

describe("HabitChainVisualizer", () => {
  it("highlights connected completed days with a darker fill", () => {
    const { getByTestId } = render(
      <HabitChainVisualizer
        habitId={"habit_1" as Id<"habits">}
        weekStatus={["done", "done", "planned", "planned", "planned"]}
        weekDateStrings={baseDates}
        streak={0}
        onToggle={jest.fn()}
      />
    );

    expect(getByTestId("habit-status-0").props.className).toContain("bg-[#276749]");
    expect(getByTestId("habit-status-1").props.className).toContain("bg-[#276749]");
  });

  it("uses the base completion color when a day is not connected", () => {
    const { getByTestId } = render(
      <HabitChainVisualizer
        habitId={"habit_2" as Id<"habits">}
        weekStatus={["done", "missed", "done", "planned", "planned"]}
        weekDateStrings={baseDates}
        streak={0}
        onToggle={jest.fn()}
      />
    );

    expect(getByTestId("habit-status-0").props.className).toContain("bg-[#48bb78]");
    expect(getByTestId("habit-status-0").props.className).not.toContain("bg-[#276749]");
    expect(getByTestId("habit-status-2").props.className).toContain("bg-[#48bb78]");
    expect(getByTestId("habit-status-2").props.className).not.toContain("bg-[#276749]");
  });
});
