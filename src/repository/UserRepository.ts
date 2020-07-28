import { User } from "../domain/User";

export interface UserRepository {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByUsername(username: string): Promise<User>;

    save(user: User): Promise<void>;

    login(username: string): Promise<User>;
}
