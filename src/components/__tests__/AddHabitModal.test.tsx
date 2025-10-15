import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AddHabitModal from "../../components/AddHabitModal";

describe("AddHabitModal", () => {
  it("disables submit when name is empty and enables when filled", () => {
    const { getByLabelText, getByText } = render(
      // @ts-expect-error partial props in test env
      <AddHabitModal visible onClose={jest.fn()} onSubmit={jest.fn()} />
    );

    const createButton = getByText("Create Habit");
    expect(createButton.props.disabled).toBeTruthy();

    const input = getByLabelText("Habit name");
    fireEvent.changeText(input, "Morning Run");

    expect(createButton.props.disabled).toBeFalsy();
  });

  it("calls onSubmit with composed name including emoji", () => {
    const onSubmit = jest.fn();
    const { getByLabelText, getAllByRole, getByText } = render(
      // @ts-expect-error partial props in test env
      <AddHabitModal visible onClose={jest.fn()} onSubmit={onSubmit} />
    );

    const input = getByLabelText("Habit name");
    fireEvent.changeText(input, "Morning Run");

    const emojiButtons = getAllByRole("button").filter((b) =>
      (b.props.accessibilityLabel || "").toString().startsWith("Icon ")
    );
    if (emojiButtons[0]) fireEvent.press(emojiButtons[0]);

    fireEvent.press(getByText("Create Habit"));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: expect.stringMatching(/^\p{Emoji}/u) })
    );
  });
});
