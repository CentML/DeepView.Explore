import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ComputeUtilization } from './ComputeUtilization';

const analysis = {
	utilization: {
		tensor_core_usage: 99
	}
};

const data = {
	allOperations: {
		name: 'nn.Module:GPT_0',
		parentProportion: 100,
		totalProportion: 100,
		forward: 92,
		backward: 94,
		children: [
			{
				name: 'aten::arange',
				parentProportion: 0,
				totalProportion: 0,
				forward: 4,
				backward: 0,
				children: [
					{
						name: 'aten::arange',
						parentProportion: 0,
						totalProportion: 0,
						forward: 4,
						backward: 0,
						children: []
					}
				]
			},
			{
				name: 'nn.Module: Block_0',
				parentProportion: 12,
				totalProportion: 12,
				forward: 95,
				backward: 95,
				children: []
			}
		]
	},
	hideInsignificant: {
		name: 'nn.Module:GPT_0',
		parentProportion: 100,
		totalProportion: 100,
		forward: 92,
		backward: 94,
		children: [
			{
				name: 'nn.Module: Block_0',
				parentProportion: 12,
				totalProportion: 12,
				forward: 95,
				backward: 95,
				children: []
			}
		]
	}
};

describe('Compute utilization card', () => {
	it('renders', () => {
		render(<ComputeUtilization analysis={analysis} utilizationData={data} />);

		expect(screen.getByText(/tensor core utilization/i)).toBeDefined();
		expect(screen.getByRole('checkbox')).toHaveProperty('checked', false);
		expect(screen.getAllByRole('row')).toHaveLength(2); // includes table head
	});

	it('can expand rows', () => {
		render(<ComputeUtilization analysis={analysis} utilizationData={data} />);

		fireEvent.click(screen.getByRole('button'));
		expect(screen.getAllByRole('row')).toHaveLength(2 + data.allOperations.children.length);
	});

	it('can hide insignificant operations', () => {
		render(<ComputeUtilization analysis={analysis} utilizationData={data} />);

		fireEvent.click(screen.getByRole('checkbox'));
		expect(screen.getByRole('checkbox')).toHaveProperty('checked', true);
		expect(screen.getAllByRole('row')).toHaveLength(2); // includes table head

		fireEvent.click(screen.getByRole('button'));
		expect(screen.getAllByRole('row')).toHaveLength(2 + data.hideInsignificant.children.length);
	});

	it('only renders row buttons for nodes with children', () => {
		render(<ComputeUtilization analysis={analysis} utilizationData={data} />);
		fireEvent.click(screen.getByRole('button'));

		const childButtons = data.allOperations.children.reduce((acc, curr) => (acc += curr.children.length > 0 ? 1 : 0), 0);

		expect(screen.getAllByRole('button')).toHaveLength(1 + childButtons);
	});

	it('recommends to use tensor cores for low usage', () => {
		analysis.utilization.tensor_core_usage = 1;
		render(<ComputeUtilization analysis={analysis} utilizationData={data} />);

		expect(screen.getByText(/recommend using tensor cores/i)).toBeDefined();
	});
});
