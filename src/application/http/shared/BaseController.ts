import { HttpStatus, HttpException } from "@nestjs/common";

export abstract class BaseController {
	public jsonResponse(code: number, data?: object | string) {
		let jsonBody = {
			statusCode: code,
			message: "success",
			payload: data,
		};

		return jsonBody;
	}

	public ok(data?: object | string) {
		return this.jsonResponse(HttpStatus.OK, data);
	}

	public created(data) {
		return this.jsonResponse(HttpStatus.CREATED, data);
	}

	public badRequest(message: string) {
		throw new HttpException(message || "Bad Request", HttpStatus.BAD_REQUEST);
	}

	public fail(error: Error) {
		if (error.hasOwnProperty('status')) throw error
		throw new HttpException(error.message || "Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
