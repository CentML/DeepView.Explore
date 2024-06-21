import { ComputeUtilization, MemoryBatchSize, TimeBreakdown } from '@centml/deepview-ui';
import { useAnalysis } from '@context/useAnalysis';
import { TabPanel } from '@layout/Layout';
import { vscode } from '@utils/vscode';

const Profiling = () => {
	const { analysis, timeBreakDown, utilizationData } = useAnalysis();

	return (
		<TabPanel name="profiling">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-4 mdplus:flex-row">
					<div className="w-full lg:w-[35%]">
						<TimeBreakdown handleHighlightCode={({ path, line_no }) => vscode.highlightCode(path, line_no)} timeBreakdown={timeBreakDown} />
					</div>

					<div className="w-full lg:w-[65%]">
						<MemoryBatchSize analysis={analysis} />
					</div>
				</div>
				<ComputeUtilization utilization={analysis.utilization} utilizationData={utilizationData} />
			</div>
		</TabPanel>
	);
};

export default Profiling;
