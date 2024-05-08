import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DeploymentLogo } from './DeploymentLogo';

describe('Cloud logos', () => {
	it.each([['aws'], ['azure'], ['gcp'], ['other']])('it renders the correct logo', (logo) => {
		render(<DeploymentLogo logo={logo} />);

		if (logo !== 'other') expect(screen.getByLabelText(/logo/)).toBeDefined();
		else expect(screen.queryByLabelText(/logo/)).toBe(null);
	});
});
