import { Module } from "@nestjs/common";

import { InMemoryCommentRepository } from "../repository/implementations/in-memory-db/InMemoryCommentRepository";
import { CommentServiceImpl } from "../service/implementations/CommentServiceImpl";
import { CommentController } from "./http/comment/CommentController";

@Module({
	imports: [],
	controllers: [CommentController],
	providers: [
		{
			provide: "COMMENT_SERVICE",
			useClass: CommentServiceImpl,
		},
		{
			provide: "COMMENT_REPOSITORY",
			useClass: InMemoryCommentRepository,
		},
	],
})
export class AppModule { }
