import { useState } from 'react';
import { ProgressBar, Table } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import Card from '@components/Card';
import { ProfilingData } from '@interfaces/ProfileData';
import { NodeData, UtilizationTableData, getUtilizationColor } from '@utils/getUtilizationData';
import Switch from '@components/Switch';

interface ComputeUtilizationProps {
	analysis: ProfilingData;
	utilizationData: UtilizationTableData;
}

export const ComputeUtilization = ({ analysis, utilizationData }: ComputeUtilizationProps) => {
	const [hideInsignificantOperations, setHideInsignificantOperations] = useState(false);

	const { utilization } = analysis;
	const { tensor_core_usage } = utilization;

	const filter = hideInsignificantOperations ? 'hideInsignificant' : 'allOperations';

	return (
		<Card title="Compute utilization (Model structure)">
			<div className="flex flex-col">
				<div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
					{tensor_core_usage < 5 ? (
						<h2 className="font-semibold text-error-500">We recommend using tensor cores.</h2>
					) : (
						<h2 className="text-xl">
							Tensor core utilization: <strong>{tensor_core_usage}%</strong>
						</h2>
					)}

					<Switch
						id="operations"
						checked={hideInsignificantOperations}
						label="Hide insignificant operations"
						onChange={() => setHideInsignificantOperations(!hideInsignificantOperations)}
					/>
				</div>

				<Table className="mt-4">
					<thead>
						<tr className="[&>th]:bg-surface-50 [&>th]:font-normal">
							<th>Layer name</th>
							<th>Forward utilization</th>
							<th>Backward utilization</th>
						</tr>
					</thead>
					<tbody>
						<UtilizationDataRow node={utilizationData[filter]} nodeDepth={0} />
					</tbody>
				</Table>
			</div>
		</Card>
	);
};

interface UtilizationDataRowProps {
	node: NodeData;
	nodeDepth: number;
}

const UtilizationDataRow = ({ node, nodeDepth }: UtilizationDataRowProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const { backward, forward, name, parentProportion, totalProportion, children } = node;

	return (
		<>
			<tr>
				<td>
					<div className="flex items-center gap-2" style={{ paddingLeft: `${nodeDepth}rem` }}>
						{children?.length > 0 && (
							<button
								aria-label={!isExpanded ? 'expand' : 'collapse'}
								className="border-1 flex items-center rounded-full border-surface-200 p-1 transition-all hover:bg-primary-500 hover:text-white"
								onClick={() => setIsExpanded(!isExpanded)}
							>
								<Icon className="h-[10px] w-[10px]" icon={isExpanded ? faMinus : faPlus} />
							</button>
						)}
						<p className="font-semibold">
							{name}{' '}
							<span className="text-sm font-normal opacity-60">
								{parentProportion}% of parent, {totalProportion}% of total
							</span>
						</p>
					</div>
				</td>

				<td>
					<div className="flex items-center gap-2">
						<ProgressBar className="h-2 grow" now={forward} variant={getUtilizationColor(forward)} />
						<p className="w-[20px] text-xs">{forward}%</p>
					</div>
				</td>
				<td>
					<div className="flex items-center gap-2">
						<ProgressBar className="h-2 grow" now={backward} variant={getUtilizationColor(backward)} />
						<p className="w-[20px] text-xs">{backward}%</p>
					</div>
				</td>
			</tr>

			{isExpanded && children.map((node, i) => <UtilizationDataRow key={`${node.name}-${i}`} node={node} nodeDepth={nodeDepth + 1} />)}
		</>
	);
};
