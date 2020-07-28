import { Inject, Post, Controller, UseGuards, Request, Body } from "@nestjs/common";

import { BaseController } from "../shared/BaseController";
import { AuthService } from "../../../service/AuthService";
import { RegisterDTO } from "./AuthDTO";
import { LocalAuthGuard } from "./AuthGuard";

// create our own abstraction rather than depends on detail
// a bit weird cause not follow guide on nest js but its okay cause we would inject it
interface JwtService {
    sign(payload: any): string;
}

@Controller("auth")
export class AuthController extends BaseController {
    private readonly authService: AuthService;
    private readonly jwtService: JwtService;

    constructor(@Inject("AUTH_SERVICE") authService: AuthService, @Inject("JWT_SERVICE") jwtService: JwtService) {
        super();

        this.authService = authService;
        this.jwtService = jwtService;
    }

    @Post("signup")
    public async registerUser(@Body() registerDTO: RegisterDTO) {
        try {
            let { username, password, passwordConfirm } = registerDTO;

            const savedUserId = await this.authService.registerUser(username, password, passwordConfirm);
            return this.ok(savedUserId);
        } catch (e) {
            return this.fail(e);
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post("login")
    public async loginUser(@Request() req) {
        try {
            const tokenPayload = {
                sub: req.user.id,
                role: req.user.role
            }
            const accessToken = this.jwtService.sign(tokenPayload);

            return this.ok({ token: accessToken });
        } catch (e) {
            return this.fail(e);
        }
    }
}
