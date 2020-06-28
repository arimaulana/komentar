export interface CreateCommentDTO {
	author: string;
	content: string;
	url: string;
}

export interface ModifyCommentDTO {
	content: string;
}
