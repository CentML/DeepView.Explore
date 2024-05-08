import { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
	title: string;
}

const Card = ({ children, title }: CardProps) => {
	return (
		<div className="rounded-lg bg-white p-4 shadow-sm">
			<div className="flex flex-col gap-2">
				<p className="border-px	mb-2 border-b pb-1 text-lg font-semibold">{title}</p>
				<div className="flex flex-col">{children}</div>
			</div>
		</div>
	);
};

export default Card;
