import { FloatingLabel, Form, FormControlProps } from 'react-bootstrap';

interface NumberInputProps extends FormControlProps {
	id: string;
	label: string;
}

const NumberInput = ({ id, label, onChange, ...props }: NumberInputProps) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isNaN(Number(e.target.value))) return;

		if (onChange) onChange(e);
	};

	return (
		<Form.Group className="relative">
			<FloatingLabel controlId={id} label={label}>
				<Form.Control className="rounded-md focus:border-primary-500 focus:shadow-none" onChange={handleChange} {...props} />
			</FloatingLabel>
		</Form.Group>
	);
};

export default NumberInput;
