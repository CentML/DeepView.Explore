import type { OperationTreeNode, TraceTree } from '@interfaces/ProfileData';

export function getTraceByLevel(tree: OperationTreeNode[]) {
	const traceTree: TraceTree[] = [{ ...tree[0], depth: 0 }, ...tree.slice(1)];

	function treeSize(index: number) {
		let total = 1;
		const numberOfChildren = tree[index].num_children;
		for (let i = 0; i < numberOfChildren; i++) {
			const node = index + total;

			traceTree[node] = { ...traceTree[node], depth: 1 + (traceTree[index].depth ?? 0) };
			traceTree[node].parent = tree[index];
			total += treeSize(node);
		}

		return (traceTree[index].total = total);
	}

	function pickExpand(index: number, expanded: boolean) {
		const totalTime = tree[0].forward_ms + tree[0].backward_ms;
		const min_frac = 0.5;
		const num_children = tree[index].num_children;
		let total = 1;

		const node_time = tree[index].forward_ms + tree[index].backward_ms;
		let expand = true;
		if (expanded || node_time > totalTime * min_frac) {
			expand = false;
		}

		traceTree[index].expand = expand;

		for (let i = 0; i < num_children; i++) {
			const node = index + total;
			pickExpand(node, expand || expanded);
			total += traceTree[node].total ?? 0;
		}

		return total;
	}

	treeSize(0);
	pickExpand(0, false);

	const coarse = traceTree.filter((node) => node.depth === 1);
	const fine = traceTree.filter((node) => node.expand);

	return { coarse, fine };
}
