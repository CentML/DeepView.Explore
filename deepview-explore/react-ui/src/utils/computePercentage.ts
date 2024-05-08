import type { TimeBreakDown, TraceTree } from '@interfaces/ProfileData';

export function computePercentage(operations: TraceTree[], total_time: number) {
	const breakdown: TimeBreakDown[] = [...operations];

	let tracked_total_time = 0;
	for (const elem in operations) {
		tracked_total_time += operations[elem]['forward_ms'] + operations[elem]['backward_ms'];
	}
	total_time = Math.max(total_time, tracked_total_time);

	for (const elem in operations) {
		breakdown[elem]['percentage'] = (100 * (operations[elem]['forward_ms'] + operations[elem]['backward_ms'])) / total_time;
	}

	if (tracked_total_time < total_time) {
		breakdown.push({
			name: 'untracked',
			percentage: (100 * (total_time - tracked_total_time)) / total_time,
			num_children: 0,
			forward_ms: 0,
			backward_ms: 0,
			size_bytes: 0,
			total_time: total_time - tracked_total_time
		});
	}

	return breakdown;
}
