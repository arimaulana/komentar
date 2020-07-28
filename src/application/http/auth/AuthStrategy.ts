import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../../../service/AuthService';
import { User } from '../../../domain/User';
import { UnauthorizedException, Injectable, Inject } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    private authService: AuthService

    constructor(@Inject("AUTH_SERVICE") authService: AuthService) {
        super({ usernameField: 'username', passwordField: 'password' });

        this.authService = authService;
    }

    async validate(username: string, password: string): Promise<User> {
        const user = await this.authService.loginUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
