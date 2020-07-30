import { Comment } from "../domain/Comment";

/**
 * CommentService
 *
 * This will be the port (contract) in term of hexagonal architecture
 */
export interface CommentService {
	findCommentsByURL(site: string, slug: string): Promise<Comment[]>;

	findAllComments(): Promise<Comment[]>;

	findCommentByID(id: string): Promise<Comment>;

	createComment(author: string, content: string, site: string, slug: string, parentId?: string): Promise<string>;

	modifyComment(id: string, content: string): Promise<void>;

	hideComment(id: string): Promise<void>;

	showComment(id: string): Promise<void>;

	removeComment(id: string): Promise<void>;
}
