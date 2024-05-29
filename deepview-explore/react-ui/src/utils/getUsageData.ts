import { GPU_MAX_CAPACITY_LIMIT } from '@data/properties';
import { ProfilingData } from '@interfaces/ProfileData';

export const INITIAL_SLIDER_STATE = [50, 69, 420] as [number, number, number];

export function getUsageData(
	analysis: ProfilingData,
	memoryPercentage: number | null,
	throughputPercentage: number | null,
	batchSize: number | undefined
) {
	const { throughput, breakdown } = analysis;

	if (!Object.keys(throughput).length || !Object.keys(breakdown).length) {
		return {
			batchSize: 0,
			memory: 0,
			throughput: 0
		};
	}

	const memoryModel = throughput.peak_usage_bytes;
	const throughputModel = throughput.run_time_ms;
	const maxBatch = Math.floor((GPU_MAX_CAPACITY_LIMIT * breakdown.memory_capacity_bytes - memoryModel[1]) / memoryModel[0]);
	const maxMemory = breakdown.memory_capacity_bytes;
	const maxThroughput = (maxBatch * 1000.0) / (maxBatch * throughputModel[0] + throughputModel[1]);

	if (!batchSize) {
		if (!memoryPercentage && !throughputPercentage) return;

		if (memoryPercentage) {
			batchSize = Math.floor((memoryPercentage * maxBatch) / 100.0);
		}

		if (throughputPercentage) {
			const tp = (throughputPercentage * maxThroughput) / 100.0;
			batchSize = Math.floor(tp * throughputModel[1]) / (1000.0 - tp * throughputModel[0]);
		}

		batchSize = Math.max(1, Math.min(batchSize ?? 0, maxBatch));
	}

	const m = batchSize * memoryModel[0] + memoryModel[1];
	const tp = (batchSize * 1000.0) / (batchSize * throughputModel[0] + throughputModel[1]);

	return {
		batchSize,
		memory: [(100.0 * m) / maxMemory, m / 1e6, maxMemory / 1e6] as [number, number, number],
		throughput: [(100.0 * tp) / maxThroughput, tp, Math.max(maxThroughput, tp)] as [number, number, number]
	};
}
