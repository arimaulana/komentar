export enum CommentStatus {
	SHOWED = "showed",
	HIDDEN = "hidden"
}

export class Comment {
	private id: string;
	private author: string;
	private content: string;
	private site: string;
	private slug: string;
	private date: Date;
	private status: CommentStatus;
	private parentId: string;

	public constructor(
		id: string,
		author: string,
		content: string,
		site: string,
		slug: string,
		date: Date,
		status: CommentStatus,
		parentId: string
	) {
		this.id = id;
		this.author = author;
		this.content = content;
		this.site = site;
		this.slug = slug;
		this.date = date;
		this.status = status;
		this.parentId = parentId;
	}

	public modifyComment(content: string): void {
		// validate content
		this.validateContent();

		// modify comment
		this.content = content;
	}

	public hideComment(): void {
		this.status = CommentStatus.HIDDEN;
	}

	public showComment(): void {
		this.status = CommentStatus.SHOWED;
	}

	private validateContent(): void { }

	// getters
	public getId(): string {
		return this.id;
	}

	public getAuthor(): string {
		return this.author;
	}

	public getContent(): string {
		return this.content;
	}

	public getSite(): string {
		return this.site;
	}

	public getSlug(): string {
		return this.slug;
	}

	public getDate(): Date {
		return this.date;
	}

	public getStatus(): CommentStatus {
		return this.status;
	}

	public getParentId(): string {
		return this.parentId;
	}
}

export class CommentBuilder {
	private commentId: string;
	private commentAuthor: string;
	private commentContent: string;
	private commentSite: string;
	private commentSlug: string;
	private commentDate: Date = new Date();
	private commentStatus: CommentStatus = CommentStatus.SHOWED;
	private commentParentId: string;

	public setId(id: string): CommentBuilder {
		this.commentId = id;
		return this;
	}

	public setAuthor(author: string): CommentBuilder {
		this.commentAuthor = author;
		return this;
	}

	public setContent(content: string): CommentBuilder {
		this.commentContent = content;
		return this;
	}

	public setSite(site: string): CommentBuilder {
		this.commentSite = site;
		return this;
	}

	public setSlug(slug: string): CommentBuilder {
		this.commentSlug = slug;
		return this;
	}

	public setDate(date: Date): CommentBuilder {
		this.commentDate = date;
		return this;
	}

	public setStatus(status: CommentStatus): CommentBuilder {
		this.commentStatus = status;
		return this;
	}

	public setParentId(parentId: string): CommentBuilder {
		if (!parentId) return this;

		this.commentParentId = parentId;
		return this;
	}

	public build(): Comment {
		return new Comment(
			this.commentId,
			this.commentAuthor,
			this.commentContent,
			this.commentSite,
			this.commentSlug,
			this.commentDate,
			this.commentStatus,
			this.commentParentId
		);
	}
}