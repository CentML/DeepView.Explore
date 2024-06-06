import { useAnalysis } from '@context/useAnalysis';
import { Alert, Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
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
							<Alert className="mb-0 px-2 py-1 text-sm" variant="info">
								<Icon icon={faCircleExclamation} size="1x" className="mr-1" />
								Change detected
							</Alert>
						)}

						<Button onClick={() => vscode.restart()} variant="primary" className="px-8">
							Restart
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Header;
