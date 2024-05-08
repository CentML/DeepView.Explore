import { Form, FormSelectProps } from 'react-bootstrap';

interface SelectProps extends FormSelectProps {
	id: string;
	label: string;
	options: string[];
	placeholder?: string;
}

export const Select = ({ id, label, options, placeholder, ...props }: SelectProps) => {
	return (
		<Form.Group>
			<Form.Label className="mb-1 text-sm font-semibold" htmlFor={id}>
				{label}
			</Form.Label>
			<Form.Select id={id} className="rounded-md focus:border-primary-500 focus:shadow-none" {...props}>
				<option disabled>{placeholder ?? 'Select an option'}</option>
				{options.map((o, i) => (
					<option key={`${o}-${i}`} value={o}>
						{o}
					</option>
				))}
			</Form.Select>
		</Form.Group>
	);
};
