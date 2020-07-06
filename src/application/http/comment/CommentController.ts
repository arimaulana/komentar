import {
	Controller,
	Get,
	Inject,
	HttpException,
	HttpStatus,
	Param,
	Query,
	Post,
	Body,
	Put,
	Delete,
} from "@nestjs/common";

import { CommentService } from "../../../domain/service/CommentService";
import { CreateCommentDTO, ModifyCommentDTO } from "./CommentDTO";
import { BaseController } from "../shared/BaseController";

@Controller("comments")
export class CommentController extends BaseController {
	private readonly commentService: CommentService;

	constructor(@Inject("COMMENT_SERVICE") commentService: CommentService) {
		super();

		this.commentService = commentService;
	}

	@Get()
	public async findAllCommentsByURL(@Query("url") url: string) {
		if (!url) {
			return this.badRequest("Url required.");
		}

		const comments = await this.commentService.findCommentsByURL(url);
		return this.ok(comments);
	}

	//admin only
	@Get("all")
	public async findAllComments() {
		const comments = await this.commentService.findAllComments();
		return this.ok(comments);
	}

	@Get(":id")
	public async findCommentByID(@Param("id") id: string) {
		const comment = await this.commentService.findCommentByID(id);

		if (!comment) return this.badRequest("Invalid comment id.");

		return this.ok(comment);
	}

	@Post()
	public async createComment(@Body() createCommentDTO: CreateCommentDTO) {
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
	}

	@Post(":id/replies")
	public async createReplyComment(@Param("id") commentId: string, @Body() createCommentDTO: CreateCommentDTO) {
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
	}

	@Put(":id")
	public async modifyComment(@Param("id") id: string, @Body() modifyCommentDTO: ModifyCommentDTO) {
		const { content } = modifyCommentDTO;

		if (!content) {
			return this.badRequest("Content required.");
		}

		await this.commentService.modifyComment(id, content);
		return this.ok();
	}

	@Put(":id/show")
	public async showComment(@Param("id") id: string) {
		await this.commentService.showComment(id);
		return this.ok();
	}

	@Put(":id/hide")
	public async hideComment(@Param("id") id: string) {
		await this.commentService.hideComment(id);
		return this.ok();
	}

	@Delete(":id")
	public async removeComment(@Param("id") id: string) {
		await this.commentService.removeComment(id);
		return this.ok();
	}
}
