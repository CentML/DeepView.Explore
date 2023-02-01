import {act, create} from 'react-test-renderer';
import App from './App';

describe('App', () => {
  it ('should render successfully', () => {
    let root;
    act(() => {
      root = create(<App />);
    });
    expect(root).toBeTruthy();
  });
});
