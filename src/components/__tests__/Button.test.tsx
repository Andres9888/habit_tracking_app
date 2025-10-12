import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import Button from "../Button";

describe("Button Component", () => {
  it("renders text children inside a Text node", () => {
    const { getByText } = render(<Button>Click Me</Button>);
    expect(getByText("Click Me")).toBeTruthy();
  });

  it("renders element children directly without wrapping", () => {
    const { getByTestId } = render(
      <Button>
        <Text testID="inner-text">Inner</Text>
      </Button>
    );
    expect(getByTestId("inner-text")).toBeTruthy();
  });

  it("handles onPress when provided", () => {
    const onPress = jest.fn();
    const { getByRole } = render(<Button onPress={onPress}>Press</Button>);
    const btn = getByRole("button");
    fireEvent.press(btn);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("falls back to onClick when onPress is not provided", () => {
    const onClick = jest.fn();
    const { getByRole } = render(
      // @ts-expect-error onClick supported by our wrapper for web parity
      <Button onClick={onClick}>Press</Button>
    );
    const btn = getByRole("button");
    fireEvent.press(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("respects disabled state and blocks presses", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button disabled onPress={onPress}>
        Disabled
      </Button>
    );
    const btn = getByRole("button");
    fireEvent.press(btn);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("applies variant and size classes", () => {
    const { getByRole, rerender } = render(
      <Button size="sm" variant="secondary">
        Label
      </Button>
    );
    const btn = getByRole("button");
    expect(btn.props.className).toContain("px-3");
    expect(btn.props.className).toContain("py-1.5");

    rerender(<Button size="lg">Label</Button>);
    const btnLg = getByRole("button");
    expect(btnLg.props.className).toContain("px-5");
    expect(btnLg.props.className).toContain("py-3");
  });
});
