import { render, screen } from "@testing-library/react";
import ProviderPanel from "./ProviderPanel";
import { Provider } from "react-redux";
import { enableFetchMocks } from "jest-fetch-mock";
import configureMockStore from "redux-mock-store";

enableFetchMocks();

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

const correctData = [
  {
    name: "gcp",
    logo: "resources/google.png",
    color: "#ea4335",
    instances: [
      {
        name: "a2-highgpu-1g",
        gpu: "a100",
        vcpus: 12,
        ram: 85,
        ngpus: 1,
        cost: 3.67,
      },
    ],
  },
  {
    name: "aws",
    logo: "resources/aws.png",
    color: "#ff9900",
    instances: [
      {
        name: "p3.2xlarge",
        gpu: "v100",
        vcpus: 8,
        ram: 61,
        ngpus: 1,
        cost: 3.06,
      },
    ],
  },
];

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
  ],
  isDemo: true,
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

test("Shows a scatter chart", async () => {
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
      <ProviderPanel />
    </Provider>
  );

  // ASSERT
  expect(await screen.findByText(/Providers/i)).toBeTruthy();
  expect(
    container.querySelector(".recharts-responsive-container") // eslint-disable-line
  ).toBeTruthy();
  expect(await screen.findByText(/select a configuration/i)).toBeTruthy();
});

test("no habitat data received from backend", async () => {
  // ARRANGE
  // Mock fetch response
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(correctData),
  });

  const mockStore = configureMockStore();

  let state = {
    analysisStateSliceReducer: {
      analysisState: { habitat: noHabitatData },
    },
    trainingScheduleReducer: {
      epochs: 50,
      iterPerEpoch: 2000,
    },
  };

  const store = mockStore(() => state);

  render(
    <Provider store={store}>
      <ProviderPanel />
    </Provider>
  );
  // ASSERT
  expect(
    await screen.findByText(
      /Currently showing a demo data because local GPU is not supported by DeepView.Predict/i
    )
  ).toBeTruthy();
});
