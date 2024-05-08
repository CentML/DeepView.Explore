import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Header from './Header';

describe('Header component', () => {
	it('renders', () => {
		render(<Header />);

		expect(screen.getByRole('button', { name: /restart/i })).toBeDefined();
		expect(screen.getByAltText(/logo/i)).toBeDefined();
	});

	it('tells the user it has detected a change', () => {
		vi.mock('@context/useAnalysis', () => ({
			useAnalysis: () => ({
				hasTextChanged: true
			})
		}));

		render(<Header />);

		expect(screen.getByText(/change detected/i)).toBeDefined();
	});
});
