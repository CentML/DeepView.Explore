import { render, screen } from "@testing-library/react";
import Habitat from "./Habitat";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

const { ResizeObserver } = window;

const habitatData = {
  predictions: [
    ["source", 22.029312],
    ["P100", 14.069682],
    ["P4000", 127.268085], // 27.268085
    ["RTX2070", 16.088268],
    ["RTX2080Ti", 11.826558],
    ["T4", 22.029312],
    ["V100", 10.182922],
    ["A100", 10.068596],
    ["RTX3090", 9.841998],
    ["A40", 11.558072],
    ["A4000", 14.67059],
    ["RTX4000", 20.2342],
  ],
};

const noHabitatData = {
  predictions: [
    ["source", 22.029312],
    ["P100", 14.069682],
    ["P4000", 127.268085], // 27.268085
    ["RTX2070", 16.088268],
    ["RTX2080Ti", 11.826558],
    ["T4", 22.029312],
    ["V100", 10.182922],
    ["A100", 10.068596],
    ["RTX3090", 9.841998],
    ["A40", 11.558072],
    ["A4000", 14.67059],
    ["RTX4000", 20.2342],
    ["demo", 1],
  ],
};

beforeEach(() => {
  delete window.ResizeObserver;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

afterEach(() => {
  window.ResizeObserver = ResizeObserver;
  jest.restoreAllMocks();
});

jest.mock("recharts", () => {
  const OriginalRechartsModule = jest.requireActual("recharts");

  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ height, children }) => (
      <div
        className="recharts-responsive-container"
        style={{ width: 800, height }}
      >
        {children}
      </div>
    ),
  };
});

test("Shows loading spinner when there is no habitat data", () => {
  // ARRANGE
  const mockStore = configureMockStore();

  let state = {
    analysisStateSliceReducer: {
      analysisState: { habitat: {} },
    },
  };

  const store = mockStore(() => state);
  render(
    <Provider store={store}>
      <Habitat habitatData={{}} />
    </Provider>
  );

  // ASSERT
  expect(screen.getByText(/loading deepview.predict data/i)).toBeTruthy();
});

test("Shows graph when habitat data is present", () => {
  // ARRANGE
  const mockStore = configureMockStore();

  let state = {
    analysisStateSliceReducer: {
      analysisState: { habitat: habitatData },
    },
  };

  const store = mockStore(() => state);
  const { container } = render(
    <Provider store={store}>
      <Habitat />
    </Provider>
  );

  // ASSERT
  expect(
    container.querySelector(".recharts-responsive-container") // eslint-disable-line
  ).toBeTruthy(); // eslint-disable-line
});

test("no habitat data received from backend", () => {
  // ARRANGE
  const mockStore = configureMockStore();

  let state = {
    analysisStateSliceReducer: {
      analysisState: { habitat: noHabitatData },
    },
  };

  const store = mockStore(() => state);
  
  render(
  <Provider store={store}>
    <Habitat />
  </Provider>
  );
  // ASSERT
  expect(
    screen.getByText(/the local gpu is not supported by deepview.predict/i)
  ).toBeTruthy();
});
