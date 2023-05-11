import { render, screen } from "@testing-library/react";
import PerfBarContainer from "./PerfBarContainer";
import { labels, renderPerfBars } from "../data/test_data";
import store from "../redux/store/store";
import { Provider } from "react-redux";

test("No display when there is no information", () => {
  // ARRANGE
  render(
    <Provider store={store}>
      <PerfBarContainer labels={[]} renderPerfBars={[]} />
    </Provider>
  );

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
  render(
    <Provider store={store}>
      <PerfBarContainer labels={labels} renderPerfBars={renderPerfBars} />
    </Provider>
  );

  // ASSERT
  expect(screen.getByText(/layer1.0/i)).toBeTruthy();
  expect(screen.getByText(/layer2.0/i)).toBeTruthy();
  expect(screen.getByText(/layer3.0/i)).toBeTruthy();
  expect(screen.getByText(/layer4.0/i)).toBeTruthy();
});
