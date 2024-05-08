export function formatCurrency(cost: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		notation: 'compact',
		compactDisplay: 'short'
	}).format(cost);
}
