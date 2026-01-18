import React from "react";
import { render } from "@testing-library/react-native";
import { DateSelector } from "../DateSelector";

describe("DateSelector", () => {
  it("renders 5 days with today highlighted", () => {
    const base = new Date(2024, 9, 12); // Oct 12, 2024
    const dates = Array.from({ length: 5 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i - 4);
      return d;
    });

    const { getAllByRole } = render(<DateSelector dates={dates} />);
    const dayTexts = getAllByRole("text");
    expect(dayTexts.length).toBeGreaterThan(0);
  });
});


