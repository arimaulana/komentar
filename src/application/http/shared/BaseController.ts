import { HttpStatus } from "@nestjs/common";

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
}
