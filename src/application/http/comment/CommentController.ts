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

import { Comment } from "../../../domain/Comment";
import { CommentService } from "../../../domain/service/CommentService";
import { CreateCommentDTO, ModifyCommentDTO } from "./CommentDTO";

@Controller("comments")
export class CommentController {
	constructor(
		@Inject("COMMENT_SERVICE")
		private readonly commentService: CommentService
	) {}

	@Get()
	public async findAllCommentsByURL(@Query("url") url: string) {
		if (!url) {
			throw new HttpException("url required.", HttpStatus.BAD_REQUEST);
		}

		return await this.commentService.findCommentsByURL(url);
	}

	//admin only
	@Get("all")
	public async findAllComments(@Query() query): Promise<Comment[]> {
		return await this.commentService.findAllComments();
	}

	@Get(":id")
	public async findCommentByID(@Param("id") id: string): Promise<Comment> {
		const comment = await this.commentService.findCommentByID(id);
		if (!comment) throw new HttpException("Invalid comment id.", HttpStatus.BAD_REQUEST);
		return comment;
	}

	@Post()
	public async createComment(@Body() createCommentDTO: CreateCommentDTO): Promise<string> {
		const { author, content, url } = createCommentDTO;

		if (!author) {
			throw new HttpException("Author required.", HttpStatus.BAD_REQUEST);
		} else if (!content) {
			throw new HttpException("Content required.", HttpStatus.BAD_REQUEST);
		} else if (!url) {
			throw new HttpException("Url required.", HttpStatus.BAD_REQUEST);
		}

		return await this.commentService.createComment(author, content, url);
	}

	@Put(":id")
	public async modifyComment(@Param("id") id: string, @Body() modifyCommentDTO: ModifyCommentDTO): Promise<void> {
		const { content } = modifyCommentDTO;

		if (!content) {
			throw new HttpException("Content required.", HttpStatus.BAD_REQUEST);
		}

		return await this.commentService.modifyComment(id, content);
	}

	@Put(":id/show")
	public async showComment(@Param("id") id: string): Promise<void> {
		return await this.commentService.showComment(id);
	}

	@Put(":id/hide")
	public async hideComment(@Param("id") id: string): Promise<void> {
		return await this.commentService.hideComment(id);
	}

	@Delete(":id")
	public async removeComment(@Param("id") id: string): Promise<void> {
		return await this.commentService.removeComment(id);
	}
}
