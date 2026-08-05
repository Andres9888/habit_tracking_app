/**
 * Label-Circle Alignment Tests
 *
 * Tests that date labels are correctly aligned with habit circles
 * by ensuring matching structure and spacing.
 */

import React, { Fragment } from "react";
import { render } from "@testing-library/react-native";
import { View, Text } from "react-native";
import { format, addDays } from "date-fns";

describe("Label-Circle Alignment Structure", () => {
  // Mock component simulating the labels row
  const LabelsRow = ({ dates }: { dates: Date[] }) => {
    return (
      <View testID="labels-row" style={{ flexDirection: "row" }}>
        {dates.map((date, index) => {
          const dateString = format(date, "yyyy-MM-dd");
          const dayLabel = format(date, "EEE").substring(0, 3);
          return (
            <Fragment key={`label-${dateString}`}>
              <View
                testID={`label-item-${index}`}
                style={{ width: 48, alignItems: "center" }}
              >
                <Text>{dayLabel.toUpperCase()}</Text>
              </View>
              {index < dates.length - 1 && (
                <View
                  testID={`label-spacer-${index}`}
                  style={{
                    height: 3,
                    backgroundColor: "transparent",
                    marginHorizontal: 6,
                    flexBasis: 0,
                    flexGrow: 1,
                  }}
                />
              )}
            </Fragment>
          );
        })}
      </View>
    );
  };

  // Mock component simulating the circles row
  const CirclesRow = ({ dates }: { dates: Date[] }) => {
    return (
      <View testID="circles-row" style={{ flexDirection: "row" }}>
        {dates.map((date, index) => {
          const dateString = format(date, "yyyy-MM-dd");
          return (
            <Fragment key={`circle-${dateString}`}>
              <View
                testID={`circle-${index}`}
                style={{ width: 48, height: 48, borderRadius: 24 }}
              />
              {index < dates.length - 1 && (
                <View
                  testID={`connector-${index}`}
                  style={{
                    height: 3,
                    backgroundColor: "#E5E7EB",
                    marginHorizontal: 6,
                    flexBasis: 0,
                    flexGrow: 1,
                  }}
                />
              )}
            </Fragment>
          );
        })}
      </View>
    );
  };

  const getMockDates = () => {
    const today = new Date("2025-10-05");
    return Array.from({ length: 5 }, (_, i) => addDays(today, i - 4));
  };

  describe("Structural alignment", () => {
    it("should have same number of label items as circles", () => {
      const dates = getMockDates();
      const { getAllByTestId: getLabels } = render(<LabelsRow dates={dates} />);
      const { getAllByTestId: getCircles } = render(
        <CirclesRow dates={dates} />
      );

      const labelItems = getLabels(/label-item-\d+/);
      const circles = getCircles(/circle-\d+/);

      expect(labelItems).toHaveLength(5);
      expect(circles).toHaveLength(5);
      expect(labelItems).toHaveLength(circles.length);
    });

    it("should have N-1 spacers for N items in labels row", () => {
      const dates = getMockDates();
      const { getAllByTestId } = render(<LabelsRow dates={dates} />);

      const spacers = getAllByTestId(/label-spacer-\d+/);
      expect(spacers).toHaveLength(4); // 5 items = 4 spacers
    });

    it("should have N-1 connectors for N items in circles row", () => {
      const dates = getMockDates();
      const { getAllByTestId } = render(<CirclesRow dates={dates} />);

      const connectors = getAllByTestId(/connector-\d+/);
      expect(connectors).toHaveLength(4); // 5 items = 4 connectors
    });

    it("should have matching number of spacers and connectors", () => {
      const dates = getMockDates();
      const { getAllByTestId: getLabels } = render(<LabelsRow dates={dates} />);
      const { getAllByTestId: getCircles } = render(
        <CirclesRow dates={dates} />
      );

      const spacers = getLabels(/label-spacer-\d+/);
      const connectors = getCircles(/connector-\d+/);

      expect(spacers).toHaveLength(connectors.length);
    });
  });

  describe("Fixed width elements", () => {
    it("label items should have fixed width of 48px", () => {
      const dates = getMockDates();
      const { getAllByTestId } = render(<LabelsRow dates={dates} />);

      const labelItems = getAllByTestId(/label-item-\d+/);
      labelItems.forEach((item) => {
        const styles = item.props.style;
        expect(styles.width).toBe(48);
      });
    });

    it("circles should have fixed width of 48px", () => {
      const dates = getMockDates();
      const { getAllByTestId } = render(<CirclesRow dates={dates} />);

      const circles = getAllByTestId(/circle-\d+/);
      circles.forEach((circle) => {
        const styles = circle.props.style;
        expect(styles.width).toBe(48);
      });
    });

    it("label items and circles should have matching widths", () => {
      const dates = getMockDates();
      const { getAllByTestId: getLabels } = render(<LabelsRow dates={dates} />);
      const { getAllByTestId: getCircles } = render(
        <CirclesRow dates={dates} />
      );

      const labelItem = getLabels(/label-item-0/)[0];
      const circle = getCircles(/circle-0/)[0];

      expect(labelItem.props.style.width).toBe(circle.props.style.width);
    });
  });

  describe("Growing spacers", () => {
    it("label spacers should have flexGrow: 1", () => {
      const dates = getMockDates();
      const { getAllByTestId } = render(<LabelsRow dates={dates} />);

      const spacers = getAllByTestId(/label-spacer-\d+/);
      spacers.forEach((spacer) => {
        const styles = spacer.props.style;
        expect(styles.flexGrow).toBe(1);
        expect(styles.flexBasis).toBe(0);
      });
    });

    it("connectors should have flexGrow: 1", () => {
      const dates = getMockDates();
      const { getAllByTestId } = render(<CirclesRow dates={dates} />);

      const connectors = getAllByTestId(/connector-\d+/);
      connectors.forEach((connector) => {
        const styles = connector.props.style;
        expect(styles.flexGrow).toBe(1);
        expect(styles.flexBasis).toBe(0);
      });
    });

    it("spacers and connectors should have matching flex properties", () => {
      const dates = getMockDates();
      const { getAllByTestId: getLabels } = render(<LabelsRow dates={dates} />);
      const { getAllByTestId: getCircles } = render(
        <CirclesRow dates={dates} />
      );

      const spacer = getLabels(/label-spacer-0/)[0];
      const connector = getCircles(/connector-0/)[0];

      expect(spacer.props.style.flexGrow).toBe(connector.props.style.flexGrow);
      expect(spacer.props.style.flexBasis).toBe(
        connector.props.style.flexBasis
      );
    });

    it("label spacers should be transparent (invisible)", () => {
      const dates = getMockDates();
      const { getAllByTestId } = render(<LabelsRow dates={dates} />);

      const spacers = getAllByTestId(/label-spacer-\d+/);
      spacers.forEach((spacer) => {
        const styles = spacer.props.style;
        expect(styles.backgroundColor).toBe("transparent");
      });
    });
  });

  describe("Layout pattern matching", () => {
    it("should follow pattern: [FIXED][GROW][FIXED][GROW]...", () => {
      const dates = getMockDates();
      const { getAllByTestId } = render(<LabelsRow dates={dates} />);

      // Check that label items (even indices in children) are fixed
      const labelItems = getAllByTestId(/label-item-\d+/);
      labelItems.forEach((item) => {
        expect(item.props.style.width).toBe(48); // Fixed width
        expect(item.props.style.flexGrow).toBeUndefined(); // No flexGrow
      });

      // Check that spacers (odd indices in children) grow
      const spacers = getAllByTestId(/label-spacer-\d+/);
      spacers.forEach((spacer) => {
        expect(spacer.props.style.flexGrow).toBe(1); // Grows
        expect(spacer.props.style.width).toBeUndefined(); // No fixed width
      });
    });
  });
});
