import { render, screen } from "@testing-library/react";
import PerfBarContainer from "./PerfBarContainer";
import { labels, renderPerfBars } from "../data/test_data";

test("No display when there is no information", () => {
  // ARRANGE
  render(<PerfBarContainer labels={[]} renderPerfBars={[]} />);

  // ASSERT
  const layer1 = screen.queryByText(/layer1.0/i);
  expect(layer1).toBeNull();
  const layer2 = screen.queryByText(/layer2.0/i);
  expect(layer2).toBeNull();
  const layer3 = screen.queryByText(/layer3.0/i);
  expect(layer3).toBeNull();
  const layer4 = screen.queryByText(/layer4.0/i);
  expect(layer4).toBeNull();
});

test("Display set of layers", () => {
    // ARRANGE
    render(<PerfBarContainer labels={labels} renderPerfBars={renderPerfBars} />);
  
    // ASSERT
    expect(screen.getByText(/layer1.0/i)).toBeTruthy();
    expect(screen.getByText(/layer2.0/i)).toBeTruthy();
    expect(screen.getByText(/layer3.0/i)).toBeTruthy();
    expect(screen.getByText(/layer4.0/i)).toBeTruthy();
  });