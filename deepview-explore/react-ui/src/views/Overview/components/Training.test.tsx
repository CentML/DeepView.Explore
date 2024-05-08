import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Training } from './Training';

const epochs = 50;
const iterations = 2000;
const mockUpdate = vi.fn();

describe('Training schedule card', () => {
	beforeEach(() => {
		vi.mock('@context/useAnalysis', () => ({
			useAnalysis: () => ({
				epochs,
				iterations,
				updateTraining: mockUpdate
			})
		}));
	});

	it('renders', () => {
		render(<Training />);

		expect(screen.getByRole('textbox', { name: /epochs/i })).toBeDefined();
		expect(screen.getByRole('textbox', { name: /epochs/i })).toHaveProperty('value', epochs.toString());
		expect(screen.getByRole('textbox', { name: /iterations/i })).toBeDefined();
		expect(screen.getByRole('textbox', { name: /iterations/i })).toHaveProperty('value', iterations.toString());
		// expect(screen.getByText(epochs * iterations).toString()).toBeDefined();
	});

	it('renders too error for too many iterations', () => {
		render(<Training />);

		fireEvent.change(screen.getByRole('textbox', { name: /epochs/i }), { target: { value: 99999999999999 * 99999999999999 } });
		fireEvent.change(screen.getByRole('textbox', { name: /iterations/i }), { target: { value: 99999999999999 * 99999999999999 } });

		expect(screen.getByText(/less than 1e21/i)).toBeDefined();
		expect(screen.getByRole('button')).toHaveProperty('disabled');
	});

	it('updates the training values', () => {
		render(<Training />);

		fireEvent.change(screen.getByRole('textbox', { name: /epochs/i }), { target: { value: 1 } });
		fireEvent.change(screen.getByRole('textbox', { name: /iterations/i }), { target: { value: 1 } });
		fireEvent.click(screen.getByRole('button'));

		expect(mockUpdate).toHaveBeenCalledTimes(1);
		expect(mockUpdate).toHaveBeenCalledWith({ epochs: 1, iterations: 1 });
	});
});
