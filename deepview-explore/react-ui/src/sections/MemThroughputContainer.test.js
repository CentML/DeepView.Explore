import { render, screen } from "@testing-library/react";
import MemThroughputContainer from "./MemThroughputContainer";
import { Provider } from "react-redux";
import { profiling_data } from "../data/mock_data";
import configureMockStore from "redux-mock-store";

test("Display sliders", () => {
  // ARRANGE
  const mockStore = configureMockStore();

  let state = {
    analysisStateSliceReducer: {
      analysisState: profiling_data,
    }
  };

  const store = mockStore(() => state);
  render(
    <Provider store={store}>
      <MemThroughputContainer SENDMOCK={true} />
    </Provider>
  );

  // ASSERT
  const batchSize = screen.queryByText(/using predicted batch size/i);
  expect(batchSize).toBeNull();
  expect(screen.getByText(/peak memory usage/i)).toBeTruthy();
  expect(screen.getAllByText(/throughput/i)).toBeTruthy();
});