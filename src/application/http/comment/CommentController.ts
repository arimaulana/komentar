import {
	Controller,
	Get,
	Inject,
	Param,
	Query,
	Post,
	Body,
	Put,
	Delete,
	UseGuards,
} from "@nestjs/common";

import { CommentService } from "../../../service/CommentService";
import { CreateCommentDTO, ModifyCommentDTO } from "./CommentDTO";
import { BaseController } from "../shared/BaseController";
import { JwtAuthGuard } from "../auth/JwtAuthGuard";

@Controller("comments")
export class CommentController extends BaseController {
	private readonly commentService: CommentService;

	constructor(@Inject("COMMENT_SERVICE") commentService: CommentService) {
		super();

		this.commentService = commentService;
	}

	@Get()
	public async findAllCommentsByURL(@Query("url") url: string) {
		try {
			if (!url) {
				return this.badRequest("Url required.");
			}

			const comments = await this.commentService.findCommentsByURL(url);
			return this.ok(comments);
		} catch (e) {
			return this.fail(e);
		}
	}

	//admin only
	@UseGuards(JwtAuthGuard)
	@Get("all")
	public async findAllComments() {
		try {
			const comments = await this.commentService.findAllComments();
			return this.ok(comments);
		} catch (e) {
			return this.fail(e);
		}
	}

	@Get(":id")
	public async findCommentByID(@Param("id") id: string) {
		try {
			const comment = await this.commentService.findCommentByID(id);

			if (!comment) return this.badRequest("Invalid comment id.");

			return this.ok(comment);
		} catch (e) {
			return this.fail(e);
		}
	}

	@Post()
	public async createComment(@Body() createCommentDTO: CreateCommentDTO) {
		try {
			const { author, content, url } = createCommentDTO;

			if (!author) {
				return this.badRequest("Author required.");
			} else if (!content) {
				return this.badRequest("Content required.");
			} else if (!url) {
				return this.badRequest("Url required.");
			}

			const createdCommentId = await this.commentService.createComment(author, content, url);
			return this.created(createdCommentId);
		} catch (e) {
			return this.fail(e);
		}
	}

	@Post(":id/replies")
	public async createReplyComment(@Param("id") commentId: string, @Body() createCommentDTO: CreateCommentDTO) {
		try {
			const { author, content, url } = createCommentDTO;
			if (!author) {
				return this.badRequest("Author required.");
			} else if (!content) {
				return this.badRequest("Content required.");
			} else if (!url) {
				return this.badRequest("Url required.");
			}

			const createdReplyCommentId = await this.commentService.createComment(author, content, url, commentId);
			return this.created(createdReplyCommentId);
		} catch (e) {
			return this.fail(e);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Put(":id")
	public async modifyComment(@Param("id") id: string, @Body() modifyCommentDTO: ModifyCommentDTO) {
		try {
			const { content } = modifyCommentDTO;

			if (!content) {
				return this.badRequest("Content required.");
			}

			await this.commentService.modifyComment(id, content);
			return this.ok();
		} catch (e) {
			return this.fail(e);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Put(":id/show")
	public async showComment(@Param("id") id: string) {
		try {
			await this.commentService.showComment(id);
			return this.ok();
		} catch (e) {
			return this.fail(e);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Put(":id/hide")
	public async hideComment(@Param("id") id: string) {
		try {
			await this.commentService.hideComment(id);
			return this.ok();
		} catch (e) {
			return this.fail(e);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Delete(":id")
	public async removeComment(@Param("id") id: string) {
		try {
			await this.commentService.removeComment(id);
			return this.ok();
		} catch (e) {
			return this.fail(e);
		}
	}
}
