import '@testing-library/react';
import 'vitest';
import 'vitest-canvas-mock';

class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

window.ResizeObserver = ResizeObserver;
