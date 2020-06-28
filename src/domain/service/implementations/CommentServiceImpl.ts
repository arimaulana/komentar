import { v4 as uuidv4 } from "uuid";
import { Injectable, Inject } from "@nestjs/common";

import { CommentService } from "../CommentService";
import { CommentRepository } from "../../repository/CommentRepository";
import { Comment } from "../../Comment";

@Injectable()
export class CommentServiceImpl implements CommentService {
	private readonly commentRepository: CommentRepository;

	public constructor(@Inject("COMMENT_REPOSITORY") commentRepository: CommentRepository) {
		this.commentRepository = commentRepository;
	}

	public async findCommentsByURL(url: string): Promise<Comment[]> {
		return await this.commentRepository.findByURL(url);
	}

	public async findAllComments(): Promise<Comment[]> {
		return await this.commentRepository.findAll();
	}

	public async findCommentByID(id: string): Promise<Comment> {
		return await this.commentRepository.findById(id);
	}

	public async createComment(author: string, content: string, url: string, parentId?: string): Promise<string> {
		const id = `${uuidv4()}-${new Date().getTime()}`;

		const comment = Comment.createComment
			.setId(id)
			.setAuthor(author)
			.setContent(content)
			.setUrl(url)
			.setParentId(parentId)
			.build();

		await this.commentRepository.save(comment);

		return comment.getId();
	}

	public async modifyComment(id: string, content: string): Promise<void> {
		const comment = await this.findCommentByID(id);

		comment.modifyComment(content);

		await this.commentRepository.update(id, comment);
	}

	public async hideComment(id: string): Promise<void> {
		const comment = await this.findCommentByID(id);

		comment.hideComment();

		await this.commentRepository.update(id, comment);
	}

	public async showComment(id: string): Promise<void> {
		const comment = await this.findCommentByID(id);

		comment.showComment();

		await this.commentRepository.update(id, comment);
	}

	public async removeComment(id: string): Promise<void> {
		// check is it a parent comment or not?
		const nestedComments = await this.commentRepository.findByParentId(id);

		if (nestedComments.length > 0) {
			throw new Error("Cannot delete parent comment.");
		}

		// delete comment
		await this.commentRepository.remove(id);
	}
}
