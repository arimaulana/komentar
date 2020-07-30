export interface CreateCommentDTO {
	author: string;
	content: string;
	site: string;
	slug: string;
}

export interface ModifyCommentDTO {
	content: string;
}
