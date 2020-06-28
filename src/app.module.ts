import { Module } from "@nestjs/common";

import { InMemoryCommentRepository } from "./infrastructure/repository/in-memory/InMemoryCommentRepository";
import { CommentServiceImpl } from "./domain/service/implementations/CommentServiceImpl";
import { CommentController } from "./application/http/comment/CommentController";

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
export class AppModule {}
