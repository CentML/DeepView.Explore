import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ErrorView from './Error';

type ErrorType = 'connection' | 'error';

describe('Error view', () => {
	it.each([
		['error', 'Analysis Error', 'Restart Profiling'],
		['connection', 'Connection Error', 'Reconnect']
	])('renders for the error type %s', (type, title, label) => {
		render(<ErrorView error={{ type: type as ErrorType }} handleConnection={() => undefined} />);

		expect(screen.getByText(title)).toBeDefined();
		expect(screen.getByRole('button', { name: label })).toBeDefined();
	});

	it.each([
		['error', 'restart'],
		['connection', 'connect']
	])('calls the correct handler with error type %s', (type, arg) => {
		const handleChange = vi.fn();

		render(<ErrorView error={{ type: type as ErrorType }} handleConnection={handleChange} />);
		fireEvent.click(screen.getByRole('button'));
		expect(handleChange).toBeCalledTimes(1);
		expect(handleChange).toHaveBeenLastCalledWith(arg);
	});
});
