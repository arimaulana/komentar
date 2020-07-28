import { Module } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from '@nestjs/jwt';
import { resolve } from 'path';

import { LocalStrategy } from "./http/auth/AuthStrategy";

import { InMemoryCommentRepository } from "../repository/implementations/in-memory-db/InMemoryCommentRepository";
import { DBConnection } from "../repository/DBConnection";
import { MySQLConnection } from "../repository/implementations/typeorm/MySQLConnection";
import { MySQLCommentRepository } from "../repository/implementations/typeorm/MySQLCommentRepository";
import { MySQLUserRepository } from "../repository/implementations/typeorm/MySQLUserRepository";

import { UserModel } from "../repository/implementations/typeorm/models/UserModel";
import { CommentModel } from "../repository/implementations/typeorm/models/CommentModel";

import { AuthController } from "./http/auth/AuthController";
import { CommentController } from "./http/comment/CommentController";

import { AuthServiceImpl } from "../service/implementations/AuthServiceImpl";
import { CommentServiceImpl } from "../service/implementations/CommentServiceImpl";
import { JwtStrategy } from "./http/auth/JwtStrategy";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PassportModule
	],
	controllers: [AuthController, CommentController],
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
					synchronize: process.env.NODE_ENV === 'production' ? false : true,
					entities: [resolve(__dirname, "../repository/implementations/typeorm/models/*.ts")]
				});
			}
		},
		{
			provide: "COMMENT_REPOSITORY",
			// useClass: InMemoryCommentRepository,
			useFactory: (dbConnection: DBConnection) => {
				return new MySQLCommentRepository(dbConnection.getRepository(CommentModel));
			},
			inject: ["CONNECTION"]
		},
		{
			provide: "USER_REPOSITORY",
			useFactory: (dbConnection: DBConnection) => {
				return new MySQLUserRepository(dbConnection.getRepository(UserModel));
			},
			inject: ["CONNECTION"]
		},
		{
			provide: "COMMENT_SERVICE",
			useClass: CommentServiceImpl,
		},
		{
			provide: "AUTH_SERVICE",
			useClass: AuthServiceImpl
		},
		{
			provide: "JWT_SERVICE",
			useValue: new JwtService({
				secret: process.env.SECRET_KEY,
				signOptions: { expiresIn: '1h' }
			})
		},
		{
			provide: LocalStrategy,
			useClass: LocalStrategy
		},
		{
			provide: JwtStrategy,
			useClass: JwtStrategy
		}
	],
})
export class AppModule { }
