import { User } from "../domain/User";

export interface AuthService {
    registerUser(username: string, password: string, passwordConfirm: string): Promise<string>;
    loginUser(username: string, password: string): Promise<User>;
}
