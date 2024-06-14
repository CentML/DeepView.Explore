import { PropsWithChildren, useState } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

interface CardProps extends PropsWithChildren {
	title: string;
	tip?: string;
}

const Card = ({ children, tip, title }: CardProps) => {
	const [tipLocation, setTipLocation] = useState<undefined | { top: number; left: number }>(undefined);

	return (
		<div className="rounded-lg bg-white p-4 shadow-sm">
			<div className="flex flex-col gap-2">
				<div className="border-px	mb-2 flex items-center gap-1 border-b pb-1">
					<p className="text-lg font-semibold">{title}</p>
					{tip && (
						<Icon
							aria-label="tooltip"
							icon={faCircleQuestion}
							className="text-surface-400"
							onMouseMove={(e) =>
								setTipLocation({
									top: e.clientY + scrollY - 20,
									left: e.clientX
								})
							}
							onMouseLeave={() => setTipLocation(undefined)}
						/>
					)}
				</div>
				<div className="flex flex-col">{children}</div>
			</div>

			{tip && tipLocation && (
				<div
					className="border-1 z-100 absolute max-w-[200px] rounded-md border-surface-500 bg-white p-2 shadow-2xl"
					style={{ top: tipLocation.top, left: tipLocation.left + 20 }}
				>
					<p className="text-sm">{tip}</p>
				</div>
			)}
		</div>
	);
};

export default Card;
