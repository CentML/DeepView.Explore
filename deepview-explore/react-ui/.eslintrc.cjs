module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:import/warnings',
		'plugin:prettier/recommended'
	],
	plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
	ignorePatterns: ['*.cjs', '*.config.*'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 'latest',
		ecmaFeatures: {
			impliedStrict: true,
			jsx: true,
			node: true
		}
	},
	env: {
		browser: true,
		es2020: true
	},
	rules: {
		'react/react-in-jsx-scope': 'off',
		'react-hooks/exhaustive-deps': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/no-explicit-any': 'warn',
		'import/export': 1,
		'import/order': 1
	},
	settings: {
		react: {
			version: 'detect'
		}
	}
};
