import { Injectable } from "@nestjs/common";

import { CommentRepository } from "../../../domain/repository/CommentRepository";
import { Comment } from "../../../domain/Comment";

@Injectable()
export class InMemoryCommentRepository implements CommentRepository {
	private comments: Comment[];

	public constructor() {
		this.comments = [];
	}

	public async findAll(): Promise<Comment[]> {
		return this.comments;
	}

	public async findByURL(url: string): Promise<Comment[]> {
		return this.comments.filter((comment) => comment.getUrl() === url);
	}

	public async findById(id: string): Promise<Comment> {
		return this.comments.find((comment) => comment.getId() == id);
	}

	public async findByParentId(parentId: string): Promise<Comment[]> {
		return this.comments.filter((comment) => comment.getParentId() == parentId);
	}

	public async save(comment: Comment): Promise<void> {
		this.comments.push(comment);
	}

	public async update(id: string, comment: Comment): Promise<void> {
		if (id !== comment.getId()) {
			throw new Error("Invalid id.");
		}

		const commentIdx = this.comments.findIndex((data) => data.getId() === comment.getId());

		if (commentIdx < 0) {
			throw new Error("No comment found.");
		}

		this.comments[commentIdx] = comment;
	}

	public async remove(id: string): Promise<void> {
		this.comments = this.comments.filter((comment) => comment.getId() !== id);
	}
}
