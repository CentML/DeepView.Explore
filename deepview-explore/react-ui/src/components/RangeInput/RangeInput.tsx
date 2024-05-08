import { InputHTMLAttributes } from 'react';

interface RangeInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	id: string;
	hideLabel?: boolean;
	label: string;
}

export const RANGE_HEIGHT = '450px';

const RangeInput = ({ hideLabel = true, id, label, value, ...props }: RangeInputProps) => {
	return (
		<div className="relative">
			<input
				className="absolute bottom-0 origin-bottom-left -rotate-90 bg-transparent"
				style={{ width: RANGE_HEIGHT }}
				type="range"
				id={id}
				value={value}
				{...props}
			/>
			<label className={hideLabel ? 'sr-only' : ''} htmlFor={id}>
				{label}
			</label>
		</div>
	);
};

export default RangeInput;
