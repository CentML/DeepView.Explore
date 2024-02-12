import { render, screen } from "@testing-library/react";
import DDP from "../components/Ddp";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

const { ResizeObserver } = window;

const validDdpData = {
  fw_time: 45.29404067993164,
  bucket_sizes: [
    20.732999801635742, 27.642000198364258, 27.642000198364258,
    27.642000198364258, 27.642000198364258, 27.642000198364258,
    27.642000198364258, 27.642000198364258, 27.642000198364258,
    27.642000198364258, 27.642000198364258, 27.642000198364258,
    27.642000198364258, 27.642000198364258, 27.642000198364258,
    27.642000198364258, 27.642000198364258, 27.642000198364258,
    27.642000198364258, 27.642000198364258, 27.642000198364258,
    7.199999809265137,
  ],
  expected_max_2gpus: [
    0.29096877574920654, 1.0798629522323608, 1.1018232107162476,
    1.164063572883606, 1.150593638420105, 1.172276258468628, 1.1914831399917603,
    1.1504861116409302, 1.12201988697052, 1.1141682863235474,
    1.0865813493728638, 1.1893115043640137, 1.1601482629776, 1.1518992185592651,
    1.155229091644287, 1.1423497200012207, 1.1456283330917358,
    1.1174979209899902, 1.1352002620697021, 1.1297550201416016,
    1.1955938339233398, 0.8672459721565247,
  ],
  expected_max_4gpus: [
    0.2914436459541321, 1.0851646661758423, 1.11895751953125,
    1.2206796407699585, 1.2070813179016113, 1.252228856086731,
    1.2658971548080444, 1.2019717693328857, 1.1579734086990356,
    1.1472386121749878, 1.091835618019104, 1.2712198495864868,
    1.2036592960357666, 1.2014503479003906, 1.2115859985351562,
    1.1902040243148804, 1.191380262374878, 1.1450241804122925,
    1.1823368072509766, 1.177552580833435, 1.266211748123169,
    0.8722561597824097,
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

test("Shows NO DDP message if flag is not enable", () => {
  // ARRANGE
  const mockStore = configureMockStore();

  let state = {
    analysisStateSliceReducer: {
      analysisState: { ddp: {} },
    },
    passesStateReducer: {
      ddpPass: false,
    },
  };

  const store = mockStore(() => state);
  render(
    <Provider store={store}>
      <DDP />
    </Provider>
  );

  // ASSERT
  expect(screen.getByText(/ddp analysis was not included/i)).toBeTruthy();
});

test("Shows loading when ddp flag is enable", () => {
  // ARRANGE
  const mockStore = configureMockStore();

  let state = {
    analysisStateSliceReducer: {
      analysisState: { ddp: {} },
    },
    passesStateReducer: {
      ddpPass: true,
    },
  };

  const store = mockStore(() => state);
  render(
    <Provider store={store}>
      <DDP />
    </Provider>
  );

  // ASSERT
  expect(screen.getByText(/loading ddp analysis data/i)).toBeTruthy();
});

test("Shows error message", () => {
  // ARRANGE
  const mockStore = configureMockStore();

  let state = {
    analysisStateSliceReducer: {
      analysisState: { ddp: { error: "error message" } },
    },
    passesStateReducer: {
      ddpPass: true,
    },
  };

  const store = mockStore(() => state);
  render(
    <Provider store={store}>
      <DDP />
    </Provider>
  );

  // ASSERT
  expect(
    screen.getByText(/there was an error generating ddp analysis/i)
  ).toBeTruthy();
});

test("Shows valid information", () => {
  // ARRANGE
  const mockStore = configureMockStore();

  let state = {
    analysisStateSliceReducer: {
      analysisState: {
        breakdown: { batch_size: 24, iteration_run_time_ms: 45 },
        ddp: validDdpData,
      },
    },
    passesStateReducer: {
      ddpPass: true,
    },
  };

  const store = mockStore(() => state);
  const { container } = render(
    <Provider store={store}>
      <DDP />
    </Provider>
  );

  // ASSERT
  expect(
    container.querySelector(".recharts-responsive-container") // eslint-disable-line
  ).toBeTruthy(); // eslint-disable-line
});
