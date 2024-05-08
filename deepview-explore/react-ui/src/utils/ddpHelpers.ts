import type { Breakdown, Ddp } from '@interfaces/ProfileData';

export interface DdpGraphData {
	pcie: { name: string; value: number }[];
	nvlink: { name: string; value: number }[];
}

const LINEAR_PARAM_LOOKUP = {
	pcie: {
		2: [0.18758736, 3.56189019],
		4: [0.2444404, 4.44230527]
	},
	nvlink: {
		2: [0.01931869, 0.03306339, 0.1377],
		4: [0.02802226, -0.00409064, 0.26453107]
	}
};

const pcieCommPredictor = (size: number, ngpu: 2 | 4) => {
	const [a, b] = LINEAR_PARAM_LOOKUP.pcie[ngpu];
	return b + Math.max(0, a * (size - 10));
};

const nvlinkCommPredictor = (size: number, ngpu: 2 | 4) => {
	const [a, b, c] = LINEAR_PARAM_LOOKUP.nvlink[ngpu];
	return Math.max(c, a * size + b);
};

const calculateBackwardTime = (bucketSizes: number[], expectedMax: number[], ngpus: number, linkType: 'pcie' | 'nvlink') => {
	let prev_comp_end = 0;
	let prev_comm_end = 0;
	let pred_comp = 0;
	let pred_comm = 0;
	let comp_end = 0;
	let comm_start = 0;
	let comm_end = 0;

	for (let i = 0; i < expectedMax.length; i++) {
		if (linkType === 'pcie') pred_comm = pcieCommPredictor(bucketSizes[i], ngpus);
		else if (linkType === 'nvlink') pred_comm = nvlinkCommPredictor(bucketSizes[i], ngpus);

		pred_comp = expectedMax[i];

		comp_end = prev_comp_end + pred_comp;
		comm_start = Math.max(comp_end, prev_comm_end);
		comm_end = comm_start + pred_comm;

		prev_comp_end = comp_end;
		prev_comm_end = comm_end;
	}

	return prev_comm_end;
};

export const getDdpGraphData = (ddp: Ddp, breakdown: Breakdown): DdpGraphData => {
	const { batch_size, iteration_run_time_ms } = breakdown;
	const { bucket_sizes, expected_max_compute_times_array, fw_time } = ddp;

	const initialValue = { name: 'n1', value: parseFloat(((batch_size * 1000) / iteration_run_time_ms).toFixed(2)) };

	return expected_max_compute_times_array.reduce(
		(acc, { ngpus, expected_compute_times }) => {
			const pcieTime = calculateBackwardTime(bucket_sizes, expected_compute_times, ngpus, 'pcie');
			const nvlinkTime = calculateBackwardTime(bucket_sizes, expected_compute_times, ngpus, 'nvlink');

			const pcieValue = parseFloat(((ngpus * batch_size * 1000) / (fw_time + pcieTime)).toFixed(2));
			const nvlinkValue = parseFloat(((ngpus * batch_size * 1000) / (fw_time + nvlinkTime)).toFixed(2));
			const name = `n${ngpus}`;

			return {
				...acc,
				pcie: [...acc.pcie, { name, value: pcieValue }],
				nvlink: [...acc.nvlink, { name, value: nvlinkValue }]
			};
		},
		{
			pcie: [initialValue],
			nvlink: [initialValue]
		}
	);
};
