import { v4 as uuidv4 } from "uuid";
import bcrypt from 'bcrypt';

import { AuthService } from "../AuthService";
import { UserRepository } from "../../repository/UserRepository";
import { User, UserBuilder } from "../../domain/User";
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AuthServiceImpl implements AuthService {
    private readonly userRepository: UserRepository;

    public constructor(@Inject("USER_REPOSITORY") userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async registerUser(username: string, password: string, passwordConfirm: string): Promise<string> {
        if (!username) {
            throw new Error('Please input username.');
        } else if (!password) {
            throw new Error('Please input password.');
        } else if (!passwordConfirm) {
            throw new Error('Please input password confirmation.');
        } else if (password !== passwordConfirm) {
            throw new Error('Your confirmation password is not valid.');
        }

        const isUserExist = await this.userRepository.findByUsername(username);
        if (isUserExist) throw new Error('User already exist.');

        const id = `${uuidv4()}-${new Date().getTime()}`;
        const hashedPassword = await this.generateHashPassword(password);

        const user = new UserBuilder()
            .setId(id)
            .setUsername(username)
            .setHashedPassword(hashedPassword)
            .build();

        await this.userRepository.save(user);

        return id;
    }

    public async loginUser(username: string, password: string): Promise<User> {
        if (!username) {
            throw new Error('Please input username.');
        } else if (!password) {
            throw new Error('Please input password.');
        }

        const user = await this.userRepository.login(username);
        if (!user) return null;

        let isPasswordValid = await this.comparePassword(password, user.getHashedPassword());
        let validatedUser = new UserBuilder()
            .setId(user.getId())
            .setUsername(user.getUsername())
            .setRole(user.getRole())
            .build();
        return isPasswordValid ? validatedUser : null;
    }

    private async generateHashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}
