import { Comment } from "../domain/Comment";

/**
 * CommentRepository
 *
 * This will be the port (contract) in term of hexagonal architecture
 */
export interface CommentRepository {
	findAll(): Promise<Comment[]>;

	findByURL(site: string, slug: string): Promise<Comment[]>;

	findById(id: string): Promise<Comment>;

	findByParentId(parentId: string): Promise<Comment[]>;

	save(comment: Comment): Promise<void>;

	update(id: string, comment: Comment): Promise<void>;

	remove(id: string): Promise<void>;
}
