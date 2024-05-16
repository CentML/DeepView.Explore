import {} from 'tailwindcss';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				login: "url('https://centml-resources-dev.s3.amazonaws.com/login_bg.jpg')"
			},
			colors: {
				primary: {
					50: 'rgba(var(--color-primary-50))',
					100: 'rgba(var(--color-primary-100))',
					200: 'rgba(var(--color-primary-200))',
					300: 'rgba(var(--color-primary-300))',
					400: 'rgba(var(--color-primary-400))',
					500: 'rgba(var(--color-primary-500))',
					600: 'rgba(var(--color-primary-600))',
					700: 'rgba(var(--color-primary-700))',
					800: 'rgba(var(--color-primary-800))',
					900: 'rgba(var(--color-primary-900))'
				},
				error: {
					50: 'rgba(var(--color-error-50))',
					100: 'rgba(var(--color-error-100))',
					200: 'rgba(var(--color-error-200))',
					300: 'rgba(var(--color-error-300))',
					400: 'rgba(var(--color-error-400))',
					500: 'rgba(var(--color-error-500))',
					600: 'rgba(var(--color-error-600))',
					700: 'rgba(var(--color-error-700))',
					800: 'rgba(var(--color-error-800))',
					900: 'rgba(var(--color-error-900))'
				},
				surface: {
					50: 'rgba(var(--color-surface-50))',
					100: 'rgba(var(--color-surface-100))',
					200: 'rgba(var(--color-surface-200))',
					300: 'rgba(var(--color-surface-300))',
					400: 'rgba(var(--color-surface-400))',
					500: 'rgba(var(--color-surface-500))',
					600: 'rgba(var(--color-surface-600))',
					700: 'rgba(var(--color-surface-700))',
					800: 'rgba(var(--color-surface-800))',
					900: 'rgba(var(--color-surface-900))'
				}
			},
			screens: {
				mdplus: '930px'
			}
		}
	},
	plugins: []
} satisfies Config;
