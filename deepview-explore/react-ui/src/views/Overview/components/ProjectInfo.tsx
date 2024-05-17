import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useAnalysis } from '@context/useAnalysis';
import Card from '@components/Card';
import { vscode } from '@utils/vscode';

export const ProjectInfo = () => {
	const { analysis, encodedFiles, epochs, iterations, timeBreakDown } = useAnalysis();

	useEffect(() => {
		if (Object.keys(analysis).length) {
			const fileNames = (timeBreakDown?.fine ?? [])
				.filter((t) => t.file_refs && t.file_refs.length)
				.map((t) => (t.file_refs ? t.file_refs[0].path : ''))
				.filter((t, i, self) => self.indexOf(t) === i);

			vscode.startEncoding(fileNames);
		}
	}, [analysis]);

	const handleExport = () => {
		try {
			const blob = new Blob([JSON.stringify({ analysis, epochs, iterations, encodedFiles })]);
			const url = URL.createObjectURL(blob);

			const downloadLink = document.createElement('a');
			downloadLink.href = URL.createObjectURL(blob);
			downloadLink.download = 'profiling_session.json';

			document.body.appendChild(downloadLink);
			downloadLink.click();

			// clean up
			downloadLink.parentNode?.removeChild(downloadLink);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error(error);
		}
	};

	const { project_root, project_entry_point, hardware_info } = analysis;

	return (
		<Card title="Project information">
			<div className="flex-col gap-2">
				<p>
					<span className="font-semibold">Project Root:</span> {project_root}
				</p>
				<p>
					<span className="font-semibold">Entry Point:</span> {project_entry_point}
				</p>

				{hardware_info.gpus.length > 0 && (
					<p>
						<span className="font-semibold">GPU:</span> {hardware_info.gpus[0]}
					</p>
				)}
			</div>
			<div className="mt-2">
				<Button variant="primary" className="px-2" onClick={() => handleExport()}>
					<Icon icon={faDownload} size="1x" className="mr-2" />
					Export session
				</Button>
			</div>
		</Card>
	);
};
