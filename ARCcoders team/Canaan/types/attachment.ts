// A base type for common properties
export type ClientAttachment = {
	id: string; // A temporary client-side ID (e.g., UUID)
	file: File;
	previewUrl: string; // Generated using URL.createObjectURL for instant preview
};

// A base for all remote attachments that are files
export type RemoteFileAttachment = {
	id: string; // The permanent ID from the database
	url: string; // The public URL to access the file
	filename: string;
	contentType: string; // e.g., 'image/png', 'text/plain'
	size: number; // Size in bytes
};
