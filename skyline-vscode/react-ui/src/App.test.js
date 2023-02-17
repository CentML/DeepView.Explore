import { render, screen } from "@testing-library/react";
import App from './App';

test("Render App correctly, it must show begin analysis button", () => {
  render(<App />);
  // For testing there is no default socket connection. It will show the warning screen

  expect(screen.getByText(/connection has been lost to the profiler. please reconnect the profiler and double check your ports then click connect/i)).toBeTruthy();
})
