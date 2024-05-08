import { UtilizationNode } from '@interfaces/ProfileData';

export interface NodeData {
	name: string;
	parentProportion: number;
	totalProportion: number;
	forward: number;
	backward: number;
	children: NodeData[];
}

export interface UtilizationTableData {
	allOperations: NodeData;
	hideInsignificant: NodeData;
}

const formatUtilizationData = (node: UtilizationNode, parent: number, total: number, threshold: 1 | -1) => {
	const forwardSpan = Math.max(node.cpuForwardSpan, node.gpuForwardSpan);
	const backwardSpan = Math.max(node.cpuBackwardSpan, node.gpuBackwardSpan);
	const forward = forwardSpan ? Math.round((node.gpuForward / forwardSpan) * 100) : 0;
	const backward = backwardSpan ? Math.round((node.gpuBackward / backwardSpan) * 100) : 0;
	const nodeSumForwardBackwardSpans = node.cpuForwardSpan + node.gpuForwardSpan + node.cpuBackwardSpan + node.gpuBackwardSpan;
	const parentProportion = parent ? Math.round((nodeSumForwardBackwardSpans / parent) * 100) : 0;
	const totalProportion = total ? Math.round((nodeSumForwardBackwardSpans / total) * 100) : 0;

	const formattedNode: NodeData = {
		name: node.name,
		parentProportion,
		totalProportion,
		forward,
		backward,
		children: []
	};

	if (node.children.length > 0) {
		const children = node.children.map((c) => formatUtilizationData(c, nodeSumForwardBackwardSpans, total, threshold)).filter((c) => c);

		if (children.length > 0) formattedNode.children = children as NodeData[];
	}

	if (totalProportion > threshold) return formattedNode;
};

export const getUtilizationData = (rootNode: UtilizationNode | undefined): UtilizationTableData | null => {
	if (!rootNode) return null;

	const sumForwardBackwardSpans = rootNode.cpuForwardSpan + rootNode.gpuForwardSpan + rootNode.cpuBackwardSpan + rootNode.gpuBackwardSpan;

	return {
		allOperations: formatUtilizationData(rootNode, sumForwardBackwardSpans, sumForwardBackwardSpans, -1) as NodeData,
		hideInsignificant: formatUtilizationData(rootNode, sumForwardBackwardSpans, sumForwardBackwardSpans, 1) as NodeData
	};
};

export const getUtilizationColor = (utilization: number) => {
	if (utilization <= 30) return 'danger';
	else if (utilization > 30 && utilization < 80) return 'warning';
	return 'success';
};
