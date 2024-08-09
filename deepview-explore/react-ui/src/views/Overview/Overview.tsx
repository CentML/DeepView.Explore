import { TabPanel } from '@centml/ui';
import { ProjectInfo, ProjectStats, ProjectTraining } from '@centml/deepview-ui';
import type { UtilizationTableData } from '@context/AnalysisContext';
import { useAnalysis } from '@context/useAnalysis';

const Overview = () => {
	const { analysis, encodedFiles, epochs, iterations, statsUsage, utilizationData, updateTraining } = useAnalysis();

	const handleExport = () => {
		try {
			const blob = new Blob([JSON.stringify({ analysis, epochs, iterations, encodedFiles: encodedFiles ?? [] })]);
			const url = URL.createObjectURL(blob);

			const downloadLink = document.createElement('a');
			downloadLink.href = URL.createObjectURL(blob);
			downloadLink.download = 'profiling_session.json';
			downloadLink.click();
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<TabPanel id="overview">
			<div className="flex flex-col gap-4">
				<ProjectInfo
					entry={analysis.project_entry_point}
					handleExport={handleExport}
					hardware={analysis.hardware_info}
					root={analysis.project_entry_point}
				/>
				<ProjectStats
					memory={statsUsage.memory}
					throughput={statsUsage.throughput}
					throughputSamplesPerSecond={analysis.throughput.samples_per_second}
					utilizationData={utilizationData as UtilizationTableData}
				/>
				<ProjectTraining epochs={epochs} iterations={iterations} updateTraining={updateTraining} />
			</div>
		</TabPanel>
	);
};

export default Overview;
