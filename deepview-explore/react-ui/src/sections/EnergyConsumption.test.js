import { render, screen } from "@testing-library/react";
import EnergyConsumption from "./EnergyConsumption";
import store from "../redux/store/store";
import { Provider } from "react-redux";

const { ResizeObserver } = window;

const energy_complete = {
  current: {
    total_consumption: 2.3,
    components: [
      { type: "ENERGY_UNSPECIFIED", consumption: 0 },
      { type: "ENERGY_CPU_DRAM", consumption: 1.15 },
      { type: "ENERGY_GPU", consumption: 1.15 },
    ],
    batch_size: 4,
  },
  past_measurements: [
    {
      total_consumption: 8.1,
      components: [
        { type: "ENERGY_UNSPECIFIED", consumption: 0 },
        { type: "ENERGY_CPU_DRAM", consumption: 7.05 },
        { type: "ENERGY_GPU", consumption: 1.05 },
      ],
      batch_size: 4,
    },
    {
      total_consumption: 9.3,
      components: [
        { type: "ENERGY_UNSPECIFIED", consumption: 0 },
        { type: "ENERGY_CPU_DRAM", consumption: 1.15 },
        { type: "ENERGY_GPU", consumption: 8.15 },
      ],
      batch_size: 4,
    },
  ],
};

const energy_only_current = {
  current: {
    total_consumption: 2.3,
    components: [
      { type: "ENERGY_UNSPECIFIED", consumption: 0 },
      { type: "ENERGY_CPU_DRAM", consumption: 1.15 },
      { type: "ENERGY_GPU", consumption: 1.15 },
    ],
    batch_size: 4,
  },
};

const energy_only_past = {
  past_measurements: [
    {
      total_consumption: 8.1,
      components: [
        { type: "ENERGY_UNSPECIFIED", consumption: 0 },
        { type: "ENERGY_CPU_DRAM", consumption: 7.05 },
        { type: "ENERGY_GPU", consumption: 1.05 },
      ],
      batch_size: 4,
    },
    {
      total_consumption: 9.3,
      components: [
        { type: "ENERGY_UNSPECIFIED", consumption: 0 },
        { type: "ENERGY_CPU_DRAM", consumption: 1.15 },
        { type: "ENERGY_GPU", consumption: 8.15 },
      ],
      batch_size: 4,
    },
  ],
};

const energy_empty_data = {
  current: {},
  past_measurements: {},
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

test("No energy data: shows only loading spinner", () => {
  // ARRANGE
  render(
    <Provider store={store}>
      <EnergyConsumption energyData={{}} />
    </Provider>
  );

  // ASSERT
  expect(
    screen.getByText(/loading energy and environmental data/i)
  ).toBeTruthy();
});

test("Only current data: shows both pie and graph data", () => {
  // ARRANGE
  const { container } = render(
    <Provider store={store}>
      <EnergyConsumption energyData={energy_only_current} />
    </Provider>
  );

  // ASSERT
  expect(screen.getByText(/total consumption/i)).toBeTruthy();
  expect(screen.getByText(/relative to your other experiments/i)).toBeTruthy();

  expect(
    container.querySelector(".recharts-responsive-container") // eslint-disable-line
  ).toBeTruthy();
});

test("Only past experiments: shows only graph data", () => {
  // ARRANGE
  const { container } = render(
    <Provider store={store}>
      <EnergyConsumption energyData={energy_only_past} />
    </Provider>
  );

  // ASSERT
  expect(screen.getByText(/could not load the data/i)).toBeTruthy();
  expect(screen.getByText(/relative to your other experiments/i)).toBeTruthy();

  expect(
    container.querySelector(".recharts-responsive-container") // eslint-disable-line
  ).toBeTruthy();
});

test("Empty data: shows could not load data", () => {
  // ARRANGE
  const { container } = render(
    <Provider store={store}>
      <EnergyConsumption energyData={energy_empty_data} />
    </Provider>
  );

  // ASSERT
  expect(screen.getAllByText(/could not load the data/i)).toBeTruthy();

  expect(container.querySelector(".recharts-responsive-container")).toBeFalsy(); // eslint-disable-line
});

test("All information Complete: show both charts", () => {
  const { container } = render(
    <Provider store={store}>
      <EnergyConsumption energyData={energy_complete} />
    </Provider>
  );

  // ASSERT
  expect(screen.getAllByText(/breakdown/i)).toBeTruthy();
  expect(screen.getByText(/relative to your other experiments/i)).toBeTruthy();

  expect(
    container.querySelector(".recharts-responsive-container") // eslint-disable-line
  ).toBeTruthy();

  expect(
    container.querySelector(".bargraph-container") // eslint-disable-line
  ).toBeTruthy();
});
