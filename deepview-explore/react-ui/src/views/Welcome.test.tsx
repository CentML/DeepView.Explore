import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { vscode } from '@utils/vscode';
import Welcome from './Welcome';

const handleChange = vi.fn();

let isUsingDdp = true;

describe('Welcome view', () => {
	beforeEach(() => {
		vi.mock('@context/useAnalysis', () => ({
			useAnalysis: () => ({
				analysis: {
					project_root: 'root',
					project_entry_point: 'entry'
				},
				isUsingDdp,
				updateDdp: handleChange
			})
		}));

		vi.mock('@utils/vscode');
	});

	it('renders', () => {
		render(<Welcome />);

		expect(screen.getByAltText(/logo/i)).toBeDefined();
		expect(screen.getByText('root')).toBeDefined();
		expect(screen.getByText('entry')).toBeDefined();
		expect(screen.getByRole('button')).toBeDefined();
	});

	it('renders a checked ddp input', () => {
		render(<Welcome />);
		expect(screen.getByRole('checkbox').checked).toEqual(true);

		fireEvent.click(screen.getByRole('checkbox'));
		expect(handleChange).toBeCalledTimes(1);
	});

	it('renders a non checked input', () => {
		isUsingDdp = false;

		render(<Welcome />);
		expect(screen.getByRole('checkbox').checked).toEqual(false);
	});

	it('calls the vscode analysis function with ddp state', () => {
		render(<Welcome />);

		fireEvent.click(screen.getByRole('button'));
		expect(vscode.startAnalysis).toHaveBeenCalledTimes(1);
		expect(vscode.startAnalysis).toHaveBeenCalledWith(isUsingDdp);
	});
});
