import { useEffect, useState } from 'react';
import { useAnalysis } from '@context/useAnalysis';
import Card from '@components/Card';
import Switch from '@components/Switch';
import LoadingSpinner from '@components/LoadingSpinner';
import type { FileRef } from '@interfaces/ProfileData';
import { vscode } from '@utils/vscode';
import { MIN_HEIGHT } from './constants';

function getBarColor(index: number) {
	switch (index) {
		case 1:
			return '#bfe9de';
		case 2:
			return '#99dcca';
		case 3:
			return '#4dc2a3';
		case 4:
			return '#00A87B';
		case 5:
			return '#00976f';
		default:
			return '#00A87B';
	}
}

interface Tip {
	label: string;
	backward: number;
	forward: number;
	total: number;
	top: number;
	left: number;
}

interface GraphData {
	label: string;
	percentage: number;
	backward: number;
	files: FileRef[];
	forward: number;
	total: number;
	backgroundColor: string;
}

export const TimeBreakdown = () => {
	const { timeBreakDown } = useAnalysis();

	const [graphData, setGraphData] = useState<GraphData[]>([]);
	const [labels, setLabels] = useState<{ name: string; percentage: number }[]>([]);
	const [hideUntracked, setHideUntracked] = useState(false);
	const [tip, setTip] = useState<Tip | undefined>(undefined);

	useEffect(() => {
		if (!timeBreakDown) return;

		const trackedTotal = 100 - (timeBreakDown.fine.find(({ name }) => name === 'untracked')?.percentage ?? 0);

		const data = timeBreakDown.fine
			.map(({ name, percentage, total_time, file_refs, forward_ms, backward_ms }, i) => ({
				label: name,
				percentage: hideUntracked ? ((percentage ?? 0) / trackedTotal) * 100 : percentage ?? 0,
				backward: backward_ms,
				files: file_refs ?? [],
				forward: forward_ms,
				total: total_time ? total_time : 0,
				backgroundColor: name === 'untracked' ? '#d3d8db' : getBarColor((i % 5) + 1)
			}))
			.filter(({ label }) => (hideUntracked ? label !== 'untracked' : true));

		const labelData = timeBreakDown.coarse
			.map(({ name, percentage }) => ({
				name,
				percentage: hideUntracked ? ((percentage ?? 0) / trackedTotal) * 100 : percentage ?? 0
			}))
			.filter(({ name }) => (hideUntracked ? name !== 'untracked' : true));

		setGraphData(data);
		setLabels(labelData);
	}, [timeBreakDown, hideUntracked]);

	const handleClick = ({ path, line_no }: FileRef) => vscode.highlightCode(path, line_no);

	if (!timeBreakDown) {
		return (
			<Card title="Time breakdown">
				<LoadingSpinner />
			</Card>
		);
	}

	return (
		<Card title="Time breakdown">
			<div className={`${MIN_HEIGHT} relative`}>
				<div>
					{timeBreakDown.fine.find(({ name }) => name === 'untracked') && (
						<div className="absolute bottom-0 right-0">
							<Switch id="untracked" checked={hideUntracked} onChange={() => setHideUntracked(!hideUntracked)} label="Hide untracked" />
						</div>
					)}
					<div className="flex h-[450px] justify-center gap-4 ">
						<div>
							{graphData.map(({ backward, files, forward, label, percentage, backgroundColor, total }, i) => (
								<button
									key={i}
									style={{ cursor: files.length === 0 ? 'auto' : 'pointer', backgroundColor, height: `${percentage}%` }}
									className="block w-20"
									onClick={() => {
										if (files.length > 0) handleClick(files[0]);
									}}
									onMouseMove={(e) =>
										setTip({
											label,
											backward,
											forward,
											total,
											top: e.clientY + scrollY,
											left: e.clientX
										})
									}
									onMouseLeave={() => setTip(undefined)}
								>
									<span className="sr-only">
										{label} {percentage}%
									</span>
								</button>
							))}
						</div>

						<div>
							{labels.map(({ name, percentage }, i) => (
								<div key={i} style={{ height: `${percentage}%` }} className="flex">
									<div className="w-5 border-b-[1px] border-black" style={{ borderTop: i === 0 ? '1px solid' : 0 }} />
									{percentage && percentage > 10 && (
										<p className="m-auto grow text-sm font-semibold opacity-60">
											{name} <span className="sr-only">{percentage}%</span>
										</p>
									)}
								</div>
							))}
						</div>
					</div>
				</div>

				{tip && (
					<div
						className="border-1 z-100 absolute rounded-md border-surface-500 bg-white p-2 shadow-2xl"
						style={{ top: tip.top, left: tip.left + 20 }}
					>
						<p className="font-semibold">{tip.label}</p>
						{tip.label === 'untracked' ? (
							<p className="text-sm">Time {tip.total?.toFixed(2)} ms</p>
						) : (
							<>
								<p className="text-sm">Forward: {tip.forward?.toFixed(2)} ms</p>
								<p className="text-sm">Backward: {tip.backward?.toFixed(2)} ms</p>
							</>
						)}
					</div>
				)}
			</div>
		</Card>
	);
};
