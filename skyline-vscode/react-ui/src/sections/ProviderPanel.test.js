import { render, screen } from "@testing-library/react";
import ProviderPanel from "./ProviderPanel";

const { ResizeObserver } = window;
const numIterations = 10000;

const data = [
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
];

const noHabitatData = [
  ["source", 22.029312],
  ["P100",14.069682],
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
  ["demo",1]
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

test("Shows a scatter chart", () => {
  // ARRANGE
  const { container } = render(
    <ProviderPanel numIterations={numIterations} habitatData={data} />
  );

  // ASSERT
  expect(screen.getByText(/Providers/i)).toBeTruthy();
  expect(
    container.querySelector(".recharts-responsive-container")  // eslint-disable-line
  ).toBeTruthy();
  expect(screen.getByText(/select a configuration/i)).toBeTruthy();
});

test("no habitat data received from backend", ()=>{
  // ARRANGE
  const { container } = render(<ProviderPanel numIterations={numIterations} habitatData={noHabitatData} />);
  // ASSERT
  expect(screen.getByText(/currently showing a demo data because local gpu is not supported by habitat/i)).toBeTruthy();
})