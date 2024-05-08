import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DeploymentPlan } from './DeploymentPlan';

const cloudProviders = [
	{
		name: 'gcp',
		logo: 'gcp',
		color: 'red',
		pue: 1,
		regions: {
			Canada: {
				emissionFactor: 100
			}
		}
	}
];

const instance = {
	id: 5,
	x: 21.767504,
	y: 0.000007074438799999999,
	info: {
		instance: 'instance',
		gpu: 't4',
		vcpus: 8,
		ram: 52,
		ngpus: 2,
		cost: 1.17,
		provider: 'gcp'
	},
	regions: ['Canada'],
	vmem: 16,
	fill: '#ea4335',
	z: 200
};

describe('Deployment plan', () => {
	it('renders', () => {
		render(<DeploymentPlan cloudProviders={cloudProviders} closeDeploymentPlan={vi.fn()} instance={instance} totalIterations={1} />);

		expect(screen.getByText(instance.info.instance)).toBeDefined();
		expect(screen.getByText(instance.info.gpu)).toBeDefined();
		expect(screen.getByText(instance.info.vcpus)).toBeDefined();
		expect(screen.getByText(instance.info.ngpus)).toBeDefined();
	});

	it('calls close fn', () => {
		const mockClose = vi.fn();

		render(<DeploymentPlan cloudProviders={cloudProviders} closeDeploymentPlan={mockClose} instance={instance} totalIterations={1} />);

		fireEvent.click(screen.getByRole('button'));
		expect(mockClose).toHaveBeenCalledTimes(1);
	});
});
