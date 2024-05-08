import Card from '@components/Card';
import { useAnalysis } from '@context/useAnalysis';

export const Stats = () => {
	const { utilizationData, throughput } = useAnalysis();
	const noUtilization = !utilizationData || Object.keys(utilizationData.allOperations).length === 0;

	return (
		<Card title="Overview stats">
			<div className="grid grid-cols-2 grid-rows-2 gap-4 text-center" style={{ gridTemplateRows: noUtilization ? '1fr' : '2fr' }}>
				<div className="flex flex-col">
					<h3 className="mb-2">Throughput</h3>
					<div className="border-1 w-25 m-auto my-2 border-surface-200" />

					{!throughput ? (
						<p className="text-sm opacity-60">No throughput data</p>
					) : (
						<>
							<p>
								<strong className="text-xl">{throughput}</strong>
							</p>
							<p className="text-sm opacity-60">samples/second</p>
						</>
					)}
				</div>

				{noUtilization ? (
					<div className="flex flex-col">
						<h3 className="mb-2">Utilization</h3>
						<div className="border-1 w-25 m-auto my-2 border-surface-200" />
						<p className="text-sm opacity-60">No utilization data</p>
					</div>
				) : (
					<>
						<div className="flex flex-col">
							<h3 className="mb-2">Utilization</h3>
							<div className="border-1 w-25 m-auto my-2 border-surface-200" />
							<p>
								<strong className="text-lg">{utilizationData.allOperations.name}</strong>
							</p>
							<p className="text-sm opacity-60">
								{utilizationData.allOperations.parentProportion}% of parent, {utilizationData.allOperations.totalProportion}% of total
							</p>
						</div>

						<div className="flex flex-col">
							<h3 className="mb-2">Forward Utilization</h3>
							<div className="border-1 w-25 m-auto my-2 border-surface-200" />
							<p>
								<strong className="text-xl">{utilizationData.allOperations.forward}%</strong>
							</p>
						</div>

						<div className="flex flex-col">
							<h3 className="mb-2">Backward Utilization</h3>
							<div className="border-1 w-25 m-auto my-2 border-surface-200" />
							<p>
								<strong className="text-xl">{utilizationData.allOperations.backward}%</strong>
							</p>
						</div>
					</>
				)}
			</div>
		</Card>
	);
};
