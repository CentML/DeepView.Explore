import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Iterations from "./Iterations";
import store from "../redux/store/store";
import { Provider } from "react-redux";

test("Allows user interact with input to set epoch and iteration per epochs", async () => {
  // ARRANGE
  render(
    <Provider store={store}>
      <Iterations />
    </Provider>
  );
  const epochs = screen.getByDisplayValue("50");
  const iterPerEpoch = screen.getByDisplayValue("2000");
  // ACT
  await userEvent.clear(epochs);
  await userEvent.type(epochs, "874");
  await userEvent.clear(iterPerEpoch);
  await userEvent.type(iterPerEpoch, "4567");

  // ASSERT
  expect(screen.getByText(/4 million/i)).toBeTruthy();
});

test("Set upper bound to 1e21", async () => {
  // ARRANGE
  render(
    <Provider store={store}>
      <Iterations />
    </Provider>
  );
  const epochs = screen.getByDisplayValue("50");
  const iterPerEpoch = screen.getByDisplayValue("2000");
  // ACT
  await userEvent.clear(epochs);
  await userEvent.type(epochs, "1000000000");
  await userEvent.clear(iterPerEpoch);
  await userEvent.type(iterPerEpoch, "1000000000000");
  await userEvent.click(screen.getByText("submit"));

  // ASSERT
  expect(
    screen.getByText(/the total number of iterations should be less than 1e21/i)
  ).toBeTruthy();
});
