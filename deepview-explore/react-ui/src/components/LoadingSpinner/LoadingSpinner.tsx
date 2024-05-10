import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
	message?: string;
}

const LoadingSpinner = ({ message }: LoadingSpinnerProps) => {
	return (
		<div className="flex flex-col items-center justify-center gap-2">
			<Spinner className="text-primary-500" animation="border" role="status">
				<p className="sr-only">Loading...</p>
			</Spinner>
			{message && <p className="text-xs italic">{message}</p>}
		</div>
	);
};

export default LoadingSpinner;
