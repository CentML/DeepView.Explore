import { fileURLToPath, URL } from 'url';
import { defaultExclude, defineConfig, coverageConfigDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		setupFiles: './src/setupTests.ts',
		exclude: [...defaultExclude],
		globals: true,
		deps: {
			inline: ['vitest-canvas-mock']
		},
		coverage: {
			exclude: [...coverageConfigDefaults.exclude, '**/*/{index,global,constants,config,App,setupTests}.{ts,tsx}', '**/mocks', '*.config.{js,ts}'],
			provider: 'v8',
			lines: 80,
			functions: 80,
			branches: 70,
			statements: 80
		}
	},
	resolve: {
		alias: [
			{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
			{ find: '@components', replacement: fileURLToPath(new URL('./src/components', import.meta.url)) },
			{ find: '@context', replacement: fileURLToPath(new URL('./src/context', import.meta.url)) },
			{ find: '@data', replacement: fileURLToPath(new URL('./src/data', import.meta.url)) },
			{ find: '@interfaces', replacement: fileURLToPath(new URL('./src/interfaces', import.meta.url)) },
			{ find: '@layout', replacement: fileURLToPath(new URL('./src/layout', import.meta.url)) },
			{ find: '@mocks', replacement: fileURLToPath(new URL('./src/mocks', import.meta.url)) },
			{ find: '@schema', replacement: fileURLToPath(new URL('./src/schema', import.meta.url)) },
			{ find: '@utils', replacement: fileURLToPath(new URL('./src/utils', import.meta.url)) },
			{ find: '@views', replacement: fileURLToPath(new URL('./src/views', import.meta.url)) }
		]
	}
});
