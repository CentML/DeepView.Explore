import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		outDir: './build',
		sourcemap: false,
		manifest: 'manifest.json',
		rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
	},
	server: {
		port: 3000
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
