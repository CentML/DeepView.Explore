export interface FileRef {
	line_no: number;
	path: string;
	run_time_ms: number;
	size_bytes: number;
}

export interface OperationTreeNode {
	backward_ms: number;
	file_refs?: FileRef[];
	forward_ms: number;
	name: string;
	num_children: number;
	size_bytes: number;
}

export interface TraceTree extends OperationTreeNode {
	depth?: number;
	expand?: boolean;
	parent?: OperationTreeNode;
	total?: number;
}

export interface TimeBreakDown extends TraceTree {
	percentage?: number;
	total_time?: number;
}

export interface Breakdown {
	peak_usage_bytes: number;
	memory_capacity_bytes: number;
	iteration_run_time_ms: number;
	batch_size: number;
	num_nodes_operation_tree: number;
	num_nodes_weight_tree: number;
	operation_tree: OperationTreeNode[];
}

export interface Ddp {
	fw_time: number;
	bucket_sizes: number[];
	expected_max_compute_times_array: ExpectedComputeTimes[];
}

interface Energy {
	total_consumption: number;
	components: { type: string; consumption: number }[];
	batch_size: number;
}

export interface UtilizationNode {
	sideId?: number;
	slice_id?: number;
	name: string;
	start: number;
	end: number;
	cpuForward: number;
	cpuForwardSpan: number;
	gpuForward: number;
	gpuForwardSpan: number;
	cpuBackward: number;
	cpuBackwardSpan: number;
	gpuBackward: number;
	gpuBackwardSpan: number;
	children: UtilizationNode[];
}

interface ExpectedComputeTimes {
	ngpus: number;
	expected_compute_times: number[];
}

export interface ProfilingData {
	message_type: string;
	hardware_info: {
		gpus: string[];
	};
	project_root: string;
	project_entry_point: string;
	additionalProviders: string;
	throughput:
		| {
				samples_per_second: number;
				predicted_max_samples_per_second: number;
				run_time_ms: number[];
				peak_usage_bytes: number[];
				batch_size_context: string;
				can_manipulate_batch_size: boolean;
		  }
		| EmptyObject;
	breakdown: Breakdown | EmptyObject;
	habitat:
		| {
				error?: unknown;
				predictions: [string, number][];
				isDemo?: boolean;
		  }
		| EmptyObject;
	energy:
		| {
				error?: unknown;
				current: Energy;
				past_measurements: Energy[];
		  }
		| EmptyObject;
	utilization: { rootNode: UtilizationNode; tensor_core_usage: number } | EmptyObject;
	ddp:
		| {
				error?: unknown;
				fw_time?: number;
				bucket_sizes?: number[];
				expected_max_compute_times_array?: ExpectedComputeTimes[];
		  }
		| EmptyObject;
}

type EmptyObject = Record<string, never>;
