import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { vscode } from '@utils/vscode';
import { ProjectInfo } from './ProjectInfo';

let analysis = {
	project_root: 'root',
	project_entry_point: 'entry',
	hardware_info: {
		gpus: []
	}
};

const path = 'renet.py';

describe('Project information card', () => {
	beforeEach(() => {
		vi.mock('@context/useAnalysis', () => ({
			useAnalysis: () => ({
				analysis,
				timeBreakDown: {
					fine: [
						{
							file_refs: [{ path, line_no: 85, run_time_ms: 1.0100053548812866, size_bytes: 0 }]
						}
					]
				}
			})
		}));

		vi.mock('@utils/vscode');
	});

	it('renders', () => {
		render(<ProjectInfo />);

		expect(screen.getByText(analysis.project_root)).toBeDefined();
		expect(screen.getByText(analysis.project_entry_point)).toBeDefined();
		expect(screen.queryByText('GPU')).toBe(null);
		expect(screen.getByRole('button', { name: /export/i })).toBeDefined();
	});

	it('rencodes the file names for vscode', () => {
		render(<ProjectInfo />);

		expect(vscode.startEncoding).toHaveBeenCalled();
		expect(vscode.startEncoding).toHaveBeenCalledWith([path]);
	});

	it('renders an empty analysis state', () => {
		analysis = undefined;

		render(<ProjectInfo />);

		expect(screen.getByText(/no analysis/i)).toBeDefined();
	});
});
