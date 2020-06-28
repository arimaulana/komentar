export class Comment {
	private id: string;
	private author: string;
	private content: string;
	private url: string; // url where the comment live
	private status: string;
	private parentId: string;

	private constructor(
		id: string,
		author: string,
		content: string,
		url: string,
		status: string,
		parentId: string
	) {
		this.id = id;
		this.author = author;
		this.content = content;
		this.url = url;
		this.status = status;
		this.parentId = parentId;
	}

	public static createComment = new (class CommentBuilder {
		private commentId: string;
		private commentAuthor: string;
		private commentContent: string;
		private commentUrl: string;
		private commentStatus: string;
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

		public setUrl(url: string): CommentBuilder {
			this.commentUrl = url;
			return this;
		}

		public setStatus(status: string): CommentBuilder {
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
				this.commentUrl,
				this.commentStatus,
				this.commentParentId
			);
		}
	})();

	public createComment(author: string, content: string, url: string): void {
		// validate url

		// validate content
		this.validateContent();

		// create comment
		this.author = author;
		this.content = content;
		this.url = url;
		this.status = "SHOWED";
	}

	public modifyComment(content: string): void {
		// validate content
		this.validateContent();

		// modify comment
		this.content = content;
	}

	public hideComment(): void {
		this.status = "HIDDEN";
	}

	public showComment(): void {
		this.status = "SHOWED";
	}

	private validateContent(): void {}

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

	public getUrl(): string {
		return this.url;
	}

	public getStatus(): string {
		return this.status;
	}

	public getParentId(): string {
		return this.parentId;
	}
}
