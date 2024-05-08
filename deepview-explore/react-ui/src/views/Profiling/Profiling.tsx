import { useAnalysis } from '@context/useAnalysis';
import { TabPanel } from '@layout/Layout';
import { TimeBreakdown } from './components/TimeBreakdown';
import { ComputeUtilization } from './components/ComputeUtilization';
import { MemoryBatchSize } from './components/MemoryBatchSize';

const Profiling = () => {
	const { analysis, timeBreakDown, utilizationData } = useAnalysis();

	return (
		<TabPanel name="profiling">
			{!analysis ? (
				<h2 className="text-center">No Analysis</h2>
			) : (
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-4 mdplus:flex-row">
						<div className="w-full lg:w-[30%]">
							<TimeBreakdown timeBreakDown={timeBreakDown} />
						</div>

						<div className="w-full lg:w-[70%]">
							<MemoryBatchSize analysis={analysis} />
						</div>
					</div>
					{!utilizationData ? <p>No utilization data</p> : <ComputeUtilization analysis={analysis} utilizationData={utilizationData} />}
				</div>
			)}
		</TabPanel>
	);
};

export default Profiling;
