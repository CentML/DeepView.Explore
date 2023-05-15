import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import store from "./redux/store/store";
import { Provider } from "react-redux";
import App from "./App";

// For testing there is no default socket connection. It will show the error screen
test("Render App correctly, must show a connection error and button to reset it", async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(screen.getByText(/connection error/i)).toBeTruthy();
  await userEvent.click(screen.getByText("Reconnect"));
});
