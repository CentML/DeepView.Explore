import { Form } from 'react-bootstrap';

interface SwitchProps {
	checked: boolean;
	id: string;
	label: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const Switch = ({ checked, id, label, onChange }: SwitchProps) => {
	return (
		<Form.Switch>
			<Form.Switch.Input
				className="focus:border-primary-500 focus:shadow-none"
				checked={checked}
				id={id}
				onChange={onChange}
				style={{ backgroundColor: checked ? '#00a87b' : '', borderColor: checked ? '#00654a' : '' }}
			/>
			<Form.Switch.Label htmlFor={id}>{label}</Form.Switch.Label>
		</Form.Switch>
	);
};
