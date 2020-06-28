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
			throw new HttpException("url required.", HttpStatus.BAD_REQUEST);
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
		if (!comment) throw new HttpException("Invalid comment id.", HttpStatus.BAD_REQUEST);
		return this.ok(comment);
	}

	@Post()
	public async createComment(@Body() createCommentDTO: CreateCommentDTO) {
		const { author, content, url } = createCommentDTO;

		if (!author) {
			throw new HttpException("Author required.", HttpStatus.BAD_REQUEST);
		} else if (!content) {
			throw new HttpException("Content required.", HttpStatus.BAD_REQUEST);
		} else if (!url) {
			throw new HttpException("Url required.", HttpStatus.BAD_REQUEST);
		}

		const createdCommentId = await this.commentService.createComment(author, content, url);
		return this.created(createdCommentId);
	}

	@Put(":id")
	public async modifyComment(@Param("id") id: string, @Body() modifyCommentDTO: ModifyCommentDTO) {
		const { content } = modifyCommentDTO;

		if (!content) {
			throw new HttpException("Content required.", HttpStatus.BAD_REQUEST);
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
