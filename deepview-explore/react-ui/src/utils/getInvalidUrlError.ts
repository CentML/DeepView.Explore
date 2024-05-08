export function getInvalidUrlError(type: 'noJsonResponseFromUrl' | string, response: Response) {
	const code = `status: ${response?.statusText} | code: ${response?.status}`;
	switch (type) {
		case 'noJsonResponseFromUrl':
			return {
				msg: `no json data from url: ${response?.url}`,
				code
			};
		default: // url is not accessible
			return {
				msg: `url is not accessible: ${response?.url}`,
				code
			};
	}
}
