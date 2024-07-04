interface ConnectionData {
	message_type: 'connection';
	status: unknown;
}

interface AnalysisData {
	message_type: 'analysis';
}

interface TextChangeData {
	message_type: 'text_change';
}

interface ErrorData {
	message_type: 'error';
	error_text: string;
}

interface EncodedFilesData {
	message_type: 'encoded_files';
	fileContents: unknown;
}

export type Message = ConnectionData | AnalysisData | TextChangeData | ErrorData | EncodedFilesData;
