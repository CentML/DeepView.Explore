import { render, screen } from "@testing-library/react";
import DeploymentTab from "./DeploymentTab";
import { Provider } from "react-redux";
import { enableFetchMocks } from "jest-fetch-mock";
import configureMockStore from "redux-mock-store";

enableFetchMocks();
const { ResizeObserver } = window;

const habitatData = {
  predictions: [
    ["source", 22.029312],
    ["P100", 14.069682],
    ["P4000", 127.268085],
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

const correctData = [
  {
    name: "google",
    logo: "resources/google.png",
    color: "#ea4335",
    instances: [
      {
        name: "a2-highgpu-1g",
        gpu: "a100",
        vcpus: 12,
        ram: 85,
        ngpus: 1,
        cost: 36.67,
      },
    ],
  },
];

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
    trainingScheduleReducer: {
      epochs: 50,
      iterPerEpoch: 2000,
    },
  };

  const store = mockStore(() => state);

  render(
    <Provider store={store}>
      <DeploymentTab/>
    </Provider>
  );

  // ASSERT
  expect(screen.getByText(/loading information/i)).toBeTruthy();
  const deploymentSection = screen.queryByText(/deployment target/i);
  expect(deploymentSection).toBeNull();
});

test("Shows deployment target when there is habitat data", async () => {
  // ARRANGE
  // Mock fetch response
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(correctData),
  });

  const mockStore = configureMockStore();

  let state = {
    analysisStateSliceReducer: {
      analysisState: { habitat: habitatData },
    },
    trainingScheduleReducer: {
      epochs: 50,
      iterPerEpoch: 2000,
    },
  };

  const store = mockStore(() => state);

  const { container } = render(
    <Provider store={store}>
      <DeploymentTab/>
    </Provider>
  );

  // ASSERT
  expect(await screen.findByText(/deployment target/i)).toBeTruthy();

  const deploymentSection = screen.queryByText(/loading information/i);
  expect(deploymentSection).toBeNull();
  expect(
    container.querySelector(".recharts-responsive-container") // eslint-disable-line
  ).toBeTruthy();
});

test("temp",()=>{});