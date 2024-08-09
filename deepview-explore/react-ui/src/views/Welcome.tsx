import { useState } from 'react';
import { Button, Card, Checkbox, LoadingSpinner } from '@centml/ui';
import { vscode } from '@utils/vscode';
import { useAnalysis } from '@context/useAnalysis';

const Welcome = () => {
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const { analysis, isUsingDdp, updateDdp } = useAnalysis();

	return (
		<div className="flex h-screen items-center justify-center bg-login bg-cover bg-center bg-no-repeat">
			<Card className="border-0" size="auto">
				<div className="flex bg-primary-800 p-2">
					<img src="assets/logo.png" className="max-w-[500px]" alt="DeepView logo" />
				</div>
				<div className="my-2">
					<p>
						<strong>Project Root:</strong> {analysis.project_root}
					</p>
					<p>
						<strong>Entry Point:</strong> {analysis.project_entry_point}
					</p>
				</div>

				{isAnalyzing ? (
					<LoadingSpinner message="Analyzing project..." />
				) : (
					<div className="flex flex-col gap-2">
						<Checkbox label="DDP Analysis (adds 3-5 minutes to the process)" isSelected={isUsingDdp} onChange={() => updateDdp()} />
						<Button
							variant="primary"
							onPress={() => {
								setIsAnalyzing(true);
								vscode.startAnalysis(isUsingDdp);
							}}
						>
							Begin Analysis
						</Button>
					</div>
				)}
			</Card>
		</div>
	);
};

export default Welcome;
