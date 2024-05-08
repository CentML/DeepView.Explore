export function formatNumber(n: number) {
	return new Intl.NumberFormat('en-US', {
		notation: 'compact',
		compactDisplay: 'long'
	}).format(n);
}
