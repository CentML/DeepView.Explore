import type { ProfilingData } from '@centml/deepview-ui';
import { profiling_data } from '@mocks/mock_data';

export const verifyHabitatData = (data: ProfilingData) => {
	if (
		data.habitat.predictions &&
		(data.habitat.predictions.length === 0 || (data.habitat.predictions[0][0] === 'unavailable' && data.habitat.predictions[0][1] === -1.0))
	) {
		return {
			...data,
			habitat: {
				predictions: [...profiling_data.habitat.predictions],
				isDemo: true
			}
		};
	}

	return data;
};
