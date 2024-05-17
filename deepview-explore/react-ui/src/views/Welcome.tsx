import { useState } from 'react';
import { Button, Container, Card, Form } from 'react-bootstrap';
import { vscode } from '@utils/vscode';
import { useAnalysis } from '@context/useAnalysis';
import LoadingSpinner from '@components/LoadingSpinner';

const Welcome = () => {
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const { analysis, isUsingDdp, updateDdp } = useAnalysis();

	return (
		<div className="h-screen bg-login bg-cover bg-center bg-no-repeat">
			<Container fluid className="flex h-screen grow flex-col items-center justify-center">
				<Card className="border-0">
					<Card.Header className="flex bg-primary-800 p-4">
						<img src="/assets/logo.png" className="max-w-[500px]" alt="DeepView logo" />
					</Card.Header>
					<Card.Body>
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
								<Form.Check
									checked={isUsingDdp}
									onChange={() => updateDdp()}
									type="checkbox"
									id="ddpAnalysis"
									label="DDP Analysis (adds 3-5 minutes to the process)"
								/>
								<Button
									variant="primary"
									className="px-8"
									onClick={() => {
										setIsAnalyzing(true);
										vscode.startAnalysis(isUsingDdp);
									}}
								>
									Begin Analysis
								</Button>
							</div>
						)}
					</Card.Body>
				</Card>
			</Container>
		</div>
	);
};

export default Welcome;
