import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Card from '@components/Card';
import NumberInput from '@components/NumberInput';
import { formatNumber } from '@utils/formatNumber';
import { useAnalysis } from '@context/useAnalysis';

export const Training = () => {
	const { epochs, iterations, updateTraining } = useAnalysis();

	const [training, setTraining] = useState({
		epochs,
		iterations
	});
	const [error, setError] = useState<undefined | string>(undefined);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateTraining(training);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (error) setError(undefined);

		setTraining((prev) => ({
			...prev,
			[e.target.id]: Number(e.target.value)
		}));

		if (training.epochs * training.iterations >= 1e21) {
			setError('Total number of iterations must be less than 1e21');
			return;
		}
	};

	return (
		<Card title="Training schedule">
			<form className="flex flex-col gap-2" onSubmit={handleSubmit}>
				<div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
					<div className="flex gap-4 sm:gap-2">
						<NumberInput id="epochs" label="Epochs" value={training.epochs} onChange={handleChange} />
						<NumberInput id="iterations" label="Iterations per epoch" value={training.iterations} onChange={handleChange} />
					</div>
					<div className="mdplus:flex-row flex gap-1 sm:flex-col">
						{error ? (
							<p className="text-error-500">{error}</p>
						) : (
							<>
								<p className="opacity-60">Total number of iterations:</p>
								<p className="font-semibold">{formatNumber(training.epochs * training.iterations)}</p>
							</>
						)}
					</div>
				</div>
				<div>
					<Button variant="primary" type="submit" disabled={!!error}>
						Submit
					</Button>
				</div>
			</form>
		</Card>
	);
};
