import { v4 as uuidv4 } from "uuid";
import { Injectable, Inject } from "@nestjs/common";

import { CommentService } from "../CommentService";
import { CommentRepository } from "../../repository/CommentRepository";
import { Comment, CommentBuilder } from "../../domain/Comment";

@Injectable()
export class CommentServiceImpl implements CommentService {
	private readonly commentRepository: CommentRepository;

	public constructor(@Inject("COMMENT_REPOSITORY") commentRepository: CommentRepository) {
		this.commentRepository = commentRepository;
	}

	public async findCommentsByURL(site: string, slug: string): Promise<Comment[]> {
		return await this.commentRepository.findByURL(site, slug);
	}

	public async findAllComments(): Promise<Comment[]> {
		return await this.commentRepository.findAll();
	}

	public async findCommentByID(id: string): Promise<Comment> {
		return await this.commentRepository.findById(id);
	}

	public async createComment(author: string, content: string, site: string, slug: string, parentId?: string): Promise<string> {
		const id = `${uuidv4()}-${new Date().getTime()}`;

		// validate parent id
		if (parentId) {
			const parentComment = await this.commentRepository.findById(parentId);
			if (!parentComment) throw new Error("No parent comment found.");
		}

		const comment = new CommentBuilder()
			.setId(id)
			.setAuthor(author)
			.setContent(content)
			.setSite(site)
			.setSlug(slug)
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
