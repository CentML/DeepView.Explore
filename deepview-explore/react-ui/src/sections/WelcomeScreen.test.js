import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WelcomeScreen from "./WelcomeScreen";
import store from "../redux/store/store";
import { Provider } from "react-redux";

test("User should only be allow to click on begin analysis only once", async () => {
  // ARRANGE
  render(
    <Provider store={store}>
      <WelcomeScreen />
    </Provider>
  );

  // ACT
  await userEvent.click(screen.getByText(/begin analysis/i));

  // ASSERT
  expect(screen.getByText(/analyzing project/i)).toBeTruthy();
  expect(screen.getByText(/analyzing project/i).getAttribute("disabled")).toBe(
    ""
  );
});
