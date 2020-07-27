import { Module } from "@nestjs/common";
import { resolve } from 'path';

import { InMemoryCommentRepository } from "../repository/implementations/in-memory-db/InMemoryCommentRepository";
import { CommentServiceImpl } from "../service/implementations/CommentServiceImpl";
import { CommentController } from "./http/comment/CommentController";
import { MySQLConnection } from "../repository/implementations/typeorm/MySQLConnection";
import { CommentModel } from "../repository/implementations/typeorm/models/CommentModel";
import { DBConnection } from "../repository/DBConnection";
import { MySQLCommentRepository } from "../repository/implementations/typeorm/MySQLCommentRepository";


@Module({
	imports: [],
	controllers: [CommentController],
	providers: [
		{
			provide: "CONNECTION",
			useFactory: async () => {
				return await MySQLConnection.createConnection({
					type: 'mysql',
					host: process.env.DOCKER_DB_HOST || process.env.DB_HOST, // if using docker, should use docker hostname to get resolved ip
					port: 3306,
					username: process.env.DB_USER,
					password: process.env.DB_PASS,
					database: process.env.DB_NAME,
					logging: true,
					entities: [resolve(__dirname, "../repository/implementations/typeorm/models/*.ts")]
				});
			}
		},
		{
			provide: "COMMENT_SERVICE",
			useClass: CommentServiceImpl,
		},
		{
			provide: "COMMENT_REPOSITORY",
			// useClass: InMemoryCommentRepository,
			useFactory: (dbConnection: DBConnection) => {
				return new MySQLCommentRepository(dbConnection.getRepository(CommentModel));
			},
			inject: ["CONNECTION"]
		}
	],
})
export class AppModule { }
