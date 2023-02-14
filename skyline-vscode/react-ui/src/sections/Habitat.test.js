import {render, screen } from '@testing-library/react';

import Habitat from "./Habitat";

const { ResizeObserver } = window;

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

// describe('Habitat', () => {
//     it ('should render successfully', () => {
//       act(() => {
//         render(<Habitat habitatData={[]}/>,container);
//       });
//       console.log(container);
//       expect(container.textContent).toContain('Loading Habitat predictions.');
//     });
//   });

test("loads and displays greeting", async () => {
  // ARRANGE
  render(<Habitat habitatData={[]}/>);

  // ASSERT
  expect(await screen.findByText(/spinner/i)).toHaveTextContent("Loading Habitat predictions.");
});
