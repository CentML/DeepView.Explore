import type { ParseError as ParseErrorType } from '@utils/parsers';

interface ParseErrorProps {
	errors: ParseErrorType[];
}

export const ParseError = ({ errors }: ParseErrorProps) => {
	return (
		<div className="flex flex-col items-center justify-center">
			<h2 className="mb-2 font-semibold text-error-500">Error fetching data from the urls.</h2>

			{errors.map(({ msg, code, invalidFields }, i) => (
				<div key={i}>
					{code && <p className="text-sm text-error-500">Error code: {code}</p>}
					<p className="text-sm text-error-500">Message: {msg}</p>

					{(invalidFields ?? []).map(({ field, err }) => (
						<div className="text-sm text-error-500" key={err}>
							<p>{field}</p>
							<p>{err}</p>
						</div>
					))}
				</div>
			))}
		</div>
	);
};
