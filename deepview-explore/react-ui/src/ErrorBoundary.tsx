import { Component, ErrorInfo, PropsWithChildren } from 'react';
import { Button, Card } from 'react-bootstrap';
import { vscode } from '@utils/vscode';

interface State {
	error: Error | null;
	hasError: boolean;
}

class ErrorBoundary extends Component<PropsWithChildren, State> {
	constructor(props: PropsWithChildren) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		if (error instanceof Error) console.error(error, errorInfo);
		this.setState({ hasError: true });
	}

	handleReconnect() {
		this.setState({ hasError: false }, () => vscode.restart());
	}

	render() {
		const { error, hasError } = this.state;
		const { children } = this.props;

		if (hasError) {
			return (
				<div className="flex h-screen flex-col items-center justify-center gap-2">
					<Card>
						<Card.Header className="flex bg-primary-800 p-4">
							<img src="assets/logo.png" className="max-w-[500px]" alt="DeepView logo" />
						</Card.Header>
						<Card.Body className="flex flex-col items-center gap-4">
							<div>
								<h2 className="text-3xl font-semibold text-error-500">Error</h2>
								<p className="text-error-500">{error instanceof Error && (error.message ? error.message : 'An unknown error has occurred')}</p>
							</div>

							<div>
								<Button onClick={this.handleReconnect} variant="primary" className="px-8">
									Restart
								</Button>
							</div>
						</Card.Body>
					</Card>
				</div>
			);
		}

		return children;
	}
}

export default ErrorBoundary;
