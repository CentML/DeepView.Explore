export interface ErrorState {
	type: 'connection' | 'error';
	message?: string;
}
