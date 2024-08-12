import { useAnalysis } from '@context/useAnalysis';
import { Alert, Button, Icon } from '@centml/ui';
import { vscode } from '@utils/vscode';

function Header() {
	const { hasTextChanged } = useAnalysis();

	return (
		<div className="flex flex-col text-white">
			<div className="app-bar flex flex-col space-y-2 bg-primary-800 p-4">
				<div className="flex flex-row items-center justify-between">
					<img className="h-12" src="assets/logo.png" alt="DeepView logo" />

					<div className="flex items-center gap-2">
						{hasTextChanged && (
							<Alert variant="info" showIcon>
								Change detected
							</Alert>
						)}

						<Button onPress={() => vscode.restart()} variant="primary">
							Restart
						</Button>
						<a href="https://docs.centml.ai/" rel="noreferrer" target="_blank" title="help">
							<Icon icon="question-mark-circle" />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Header;
