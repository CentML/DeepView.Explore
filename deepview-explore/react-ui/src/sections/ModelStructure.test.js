import { render, screen } from "@testing-library/react";
import ModelStructure from "./ModelStructure";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

const { ResizeObserver } = window;

const utilizationError = {
  error: "There was an error obtaining data",
};

const utilizationNormalData = {
  rootNode: {
    sliceId: 174,
    name: "nn.Module:GPT_0",
    start: 1690908710376538000,
    end: 1690908710384754000,
    cpuForward: 8216000,
    cpuForwardSpan: 8216000,
    gpuForward: 8892000,
    gpuForwardSpan: 9690000,
    cpuBackward: 12134000,
    cpuBackwardSpan: 14998000,
    gpuBackward: 15674000,
    gpuBackwardSpan: 16749000,
    children: [
      {
        slice_id: 175,
        name: "aten::arange",
        start: 1690908710376558000,
        end: 1690908710376581000,
        duration: 23000,
        cpuForward: 23000,
        cpuForwardSpan: 23000,
        gpuForward: 1000,
        gpuForwardSpan: 1000,
        cpuBackward: 0,
        cpuBackwardSpan: 0,
        gpuBackward: 0,
        gpuBackwardSpan: 0,
        children: [],
      },
      {
        slice_id: 208,
        name: "nn.Module: Block_0",
        start: 1690908710376731000,
        end: 1690908710377779000,
        duration: 1048000,
        cpuForward: 1048000,
        cpuForwardSpan: 1048000,
        gpuForward: 1042000,
        gpuForwardSpan: 1092000,
        cpuBackward: 1628000,
        cpuBackwardSpan: 1982000,
        gpuBackward: 1964000,
        gpuBackwardSpan: 2068000,
        children: [],
      },
    ],
  },
  tensor_core_usage: 19.01,
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

test("Show spinner when loading", () => {
  const mockStore = configureMockStore();

  let state = {
    analysisStateSliceReducer: {
      analysisState: { utilization: {} },
    },
  };

  const store = mockStore(() => state);
  render(
    <Provider store={store}>
      <ModelStructure />
    </Provider>
  );
  // ASSERT
  expect(screen.getByText(/loading model structure/i)).toBeTruthy();
});

test("Show error message", () => {
  const mockStore = configureMockStore();

  let state = {
    analysisStateSliceReducer: {
      analysisState: { utilization: utilizationError },
    },
  };

  const store = mockStore(() => state);
  render(
    <Provider store={store}>
      <ModelStructure />
    </Provider>
  );
  // ASSERT
  expect(
    screen.getByText(/there was an error obtaining the model structure/i)
  ).toBeTruthy();
});

test("Show correct information", () => {
  global.matchMedia =
    global.matchMedia ||
    function () {
      return {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      };
    };
  const mockStore = configureMockStore();

  let state = {
    analysisStateSliceReducer: {
      analysisState: { utilization: utilizationNormalData },
    },
  };

  const store = mockStore(() => state);
  render(
    <Provider store={store}>
      <ModelStructure />
    </Provider>
  );
  // ASSERT
  expect(screen.getByText(/tensor core utilization/i)).toBeTruthy();
  expect(screen.getByText(/hide insignificant operations/i)).toBeTruthy();
  expect(screen.getByText(/layer name/i)).toBeTruthy();
  expect(screen.getByText(/device utilization \(forward\)/i)).toBeTruthy();
  expect(screen.getByText(/device utilization \(backward\)/i)).toBeTruthy();
});
