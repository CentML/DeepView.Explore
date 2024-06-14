import { TabPanel } from '@layout/Layout';
import { TimeBreakdown } from './components/TimeBreakdown';
import { ComputeUtilization } from './components/ComputeUtilization';
import { MemoryBatchSize } from './components/MemoryBatchSize';

const Profiling = () => {
	return (
		<TabPanel name="profiling">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-4 mdplus:flex-row">
					<div className="w-full lg:w-[35%]">
						<TimeBreakdown />
					</div>

					<div className="w-full lg:w-[65%]">
						<MemoryBatchSize />
					</div>
				</div>
				<ComputeUtilization />
			</div>
		</TabPanel>
	);
};

export default Profiling;
