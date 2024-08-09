import {} from 'tailwindcss';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,tsx}', './node_modules/@centml/deepview-ui/dist/**/*.js', './node_modules/@centml/ui/dist/**/*.js'],
	darkMode: 'selector',
	theme: {
		extend: {
			backgroundImage: {
				login: "url('https://centml-resources-dev.s3.amazonaws.com/login_bg.jpg')"
			},
			colors: {
				primary: {
					50: 'rgb(217, 242, 235)',
					100: 'rgb(204, 238, 229)',
					200: 'rgb(191, 233, 222)',
					300: 'rgb(153, 220, 202)',
					400: 'rgb(77, 194, 163)',
					500: 'rgb(0, 168, 123)',
					600: 'rgb(0, 151, 111)',
					700: 'rgb(0, 126, 92)',
					800: 'rgb(0, 101, 74)',
					900: 'rgb(0, 82, 60)'
				},
				error: {
					50: 'rgb(251, 224, 224)',
					100: 'rgb(249, 214, 214)',
					200: 'rgb(248, 204, 204)',
					300: 'rgb(243, 173, 173)',
					400: 'rgb(234, 112, 112)',
					500: 'rgb(225, 51, 51)',
					600: 'rgb(203, 46, 46)',
					700: 'rgb(169, 38, 38)',
					800: 'rgb(135, 31, 31)',
					900: 'rgb(110, 25, 25)'
				}
			},
			screens: {
				mdplus: '930px',
				timelg: '1500px'
			}
		}
	},
	plugins: []
} satisfies Config;
