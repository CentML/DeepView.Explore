import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { vscode } from '@utils/vscode';
import { TimeBreakdown } from './TimeBreakdown';

const DATA_LABEL = 'label';
const path = './path';
const line = 100;

const breakdown = {
	coarse: [
		{
			name: DATA_LABEL,
			num_children: 0,
			forward_ms: 0.02184533327817917,
			backward_ms: 0.03515733405947685,
			size_bytes: 131072,
			file_refs: [],
			depth: 1,
			parent: {
				name: 'root',
				num_children: 11,
				forward_ms: 12.462421417236328,
				backward_ms: 20.851369857788086,
				size_bytes: 1386957824,
				file_refs: []
			},
			total: 1,
			expand: true,
			percentage: 20
		},
		{
			name: 'untracked',
			percentage: 80,
			num_children: 0,
			forward_ms: 0,
			backward_ms: 0,
			size_bytes: 0,
			total_time: 100
		}
	],
	fine: [
		{
			name: DATA_LABEL,
			num_children: 0,
			forward_ms: 0.02184533327817917,
			backward_ms: 0.03515733405947685,
			size_bytes: 131072,
			file_refs: [{ path, line_no: line, run_time_ms: 1.0100053548812866, size_bytes: 0 }],
			depth: 1,
			parent: {
				name: 'root',
				num_children: 11,
				forward_ms: 12.462421417236328,
				backward_ms: 20.851369857788086,
				size_bytes: 1386957824,
				file_refs: []
			},
			total: 1,
			expand: true,
			percentage: 20
		},
		{
			name: 'untracked',
			percentage: 80,
			num_children: 0,
			forward_ms: 0,
			backward_ms: 0,
			size_bytes: 0,
			total_time: 100
		}
	]
};

describe('Time breakdown', () => {
	beforeEach(() => {
		vi.mock('@utils/vscode');
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('renders', () => {
		render(<TimeBreakdown timeBreakDown={breakdown} />);

		expect(screen.getByRole('checkbox')).toBeDefined();
		expect(screen.getAllByText('untracked')).toBeDefined();
		expect(screen.getAllByText('untracked')).toHaveLength(1);
		expect(screen.getAllByText(DATA_LABEL)).toBeDefined();
		expect(screen.getAllByText(DATA_LABEL)).toHaveLength(1);
		expect(screen.queryByText('%')).toBe(null); // does not show screen reader only text
	});

	it('calls highligh code handler', () => {
		render(<TimeBreakdown timeBreakDown={breakdown} />);

		fireEvent.click(screen.getByRole('button', { name: /label/ }));
		expect(vscode.highlightCode).toHaveBeenCalledTimes(1);
		expect(vscode.highlightCode).toHaveBeenCalledWith(path, line);
	});

	it('does not call highlight code handler for items without files', () => {
		render(<TimeBreakdown timeBreakDown={breakdown} />);

		fireEvent.click(screen.getByRole('button', { name: /untracked/i }));
		expect(vscode.highlightCode).not.toHaveBeenCalled();
	});

	it('can hide untracked breakdown', () => {
		render(<TimeBreakdown timeBreakDown={breakdown} />);

		fireEvent.click(screen.getByRole('checkbox'));
		expect(screen.queryByText('untracked')).toBe(null);
	});

	it('renders empty card', () => {
		render(<TimeBreakdown timeBreakDown={null} />);

		expect(screen.getByText(/no time breakdown/i)).toBeDefined();
	});
});
