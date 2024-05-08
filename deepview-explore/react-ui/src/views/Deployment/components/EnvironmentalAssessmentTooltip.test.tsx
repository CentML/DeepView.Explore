import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EnvironmentalAssessmentTooltip } from './EnvironmentalAssessmentTooltip';

describe('Enviornment tooltip', () => {
	it('renders', () => {
		render(
			<EnvironmentalAssessmentTooltip
				regionData={{
					regionName: 'Canada',
					carbonEmissions: 100,
					miles: '2',
					household: [0.1],
					phone: '1'
				}}
			/>
		);

		expect(screen.getByText('Canada')).toBeDefined();
		expect(screen.getByText(/100.0/)).toBeDefined();
		expect(screen.getByText('2')).toBeDefined();
		expect(screen.getByText('0.1')).toBeDefined();
		expect(screen.getByText('1')).toBeDefined();
	});
});
