import { Alert, Button, Container } from 'react-bootstrap';
import type { ErrorState } from '@interfaces/ErrorState';

interface ErrorProps {
	handleConnection: (type: 'connect' | 'restart') => void;
	error: ErrorState;
}

const ErrorView = ({ error, handleConnection }: ErrorProps) => {
	const { type, message } = error;
	const isConnectionError = type === 'connection';

	const title = isConnectionError ? 'Connection Error' : 'Analysis Error';
	const body = isConnectionError
		? 'Connection has been lost to the profiler. Please reconnect the profiler and double check your ports then click connect'
		: 'An error has occurred during analysis. This could be a problem with Deepview profiler or possibly your code. For more information, refer to the detailed message below:';

	return (
		<Container fluid className="flex h-screen grow flex-col items-center justify-center">
			<Alert variant="danger" className="max-w-[500px]">
				<Alert.Heading>{title}</Alert.Heading>
				{body && <p>{body}</p>}
				<div className="flex flex-col items-center gap-4">
					{message && <p className="text-error-500">{message}</p>}
					<Button variant="primary" className="px-8" onClick={() => handleConnection(isConnectionError ? 'connect' : 'restart')}>
						{isConnectionError ? 'Reconnect' : 'Restart Profiling'}
					</Button>
				</div>
			</Alert>
		</Container>
	);
};

export default ErrorView;
