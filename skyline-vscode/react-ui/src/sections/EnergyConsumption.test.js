import { render, screen } from "@testing-library/react";
import EnergyConsumption from "./EnergyConsumption";

const { ResizeObserver } = window;

const numIterations = 10000;

const energy_complete = {
  current: {
    total_consumption: 2.3,
    components: [
      { type: "ENERGY_UNSPECIFIED", consumption: 0 },
      { type: "ENERGY_CPU_DRAM", consumption: 1.15 },
      { type: "ENERGY_GPU", consumption: 1.15 },
    ],
  },
  past_measurements: [
    {
      total_consumption: 8.1,
      components: [
        { type: "ENERGY_UNSPECIFIED", consumption: 0 },
        { type: "ENERGY_CPU_DRAM", consumption: 7.05 },
        { type: "ENERGY_GPU", consumption: 1.05 },
      ],
    },
    {
      total_consumption: 9.3,
      components: [
        { type: "ENERGY_UNSPECIFIED", consumption: 0 },
        { type: "ENERGY_CPU_DRAM", consumption: 1.15 },
        { type: "ENERGY_GPU", consumption: 8.15 },
      ],
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
    },
    {
      total_consumption: 9.3,
      components: [
        { type: "ENERGY_UNSPECIFIED", consumption: 0 },
        { type: "ENERGY_CPU_DRAM", consumption: 1.15 },
        { type: "ENERGY_GPU", consumption: 8.15 },
      ],
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
  render(<EnergyConsumption energyData={{}} numIterations={numIterations} />);

  // ASSERT
  expect(
    screen.getByText(/loading energy and environmental data/i)
  ).toBeTruthy();
});

test("Only current data: shows both pie and graph data", () => {
  // ARRANGE
  const { container } = render(
    <EnergyConsumption
      energyData={energy_only_current}
      numIterations={numIterations}
    />
  );

  // ASSERT
  expect(screen.getByText(/total consumption/i)).toBeTruthy();
  expect(screen.getByText(/relative to your other experiments/i)).toBeTruthy();

  expect(
    container.querySelector(".recharts-responsive-container")  // eslint-disable-line
  ).toBeTruthy();
});

test("Only past experiments: shows only graph data", () => {
  // ARRANGE
  const { container } = render(
    <EnergyConsumption
      energyData={energy_only_past}
      numIterations={numIterations}
    />
  );

  // ASSERT
  expect(screen.getByText(/could not load the data/i)).toBeTruthy();
  expect(screen.getByText(/relative to your other experiments/i)).toBeTruthy();

  expect(
    container.querySelector(".recharts-responsive-container")  // eslint-disable-line
  ).toBeTruthy();
});

test("Empty data: shows could not load data", () => {
  // ARRANGE
  const { container } = render(
    <EnergyConsumption
      energyData={energy_empty_data}
      numIterations={numIterations}
    />
  );

  // ASSERT
  expect(screen.getAllByText(/could not load the data/i)).toBeTruthy();

  expect(container.querySelector(".recharts-responsive-container")).toBeFalsy();  // eslint-disable-line
});

test("All information Complete: show both charts", () => {
  const { container } = render(
    <EnergyConsumption
      energyData={energy_complete}
      numIterations={numIterations}
    />
  );

  // ASSERT
  expect(screen.getAllByText(/breakdown/i)).toBeTruthy();
  expect(screen.getByText(/relative to your other experiments/i)).toBeTruthy();

  expect(
    container.querySelector(".recharts-responsive-container")  // eslint-disable-line
  ).toBeTruthy();

  expect(
    container.querySelector(".bargraph-container")  // eslint-disable-line
  ).toBeTruthy();
});
