import { Comment } from "../Comment";

/**
 * CommentService
 *
 * This will be the port (contract) in term of hexagonal architecture
 */
export interface CommentService {
	findCommentsByURL(url: string): Promise<Comment[]>;

	findAllComments(): Promise<Comment[]>;

	findCommentByID(id: string): Promise<Comment>;

	createComment(author: string, content: string, url: string): Promise<string>;

	modifyComment(id: string, content: string): Promise<void>;

	hideComment(id: string): Promise<void>;

	showComment(id: string): Promise<void>;

	removeComment(id: string): Promise<void>;
}
