import { UserRepository } from "../../UserRepository";
import { User, UserBuilder } from "../../../domain/User";
import { Repository } from "typeorm";
import { UserModel } from "./models/UserModel";

export class MySQLUserRepository implements UserRepository {

    private userRepository: Repository<UserModel>;

    constructor(userRepository: Repository<UserModel>) {
        this.userRepository = userRepository;
    }

    private persistenceToDomain(user: UserModel) {
        return !user ? null : new UserBuilder()
            .setId(user.id)
            .setUsername(user.username)
            .setRole(user.role)
            .build();
    }

    public async findAll(): Promise<User[]> {
        const users = await this.userRepository.find();

        return users.map(user => this.persistenceToDomain(user));
    }

    public async findById(id: string): Promise<User> {
        const user = await this.userRepository.findOne(id);

        return this.persistenceToDomain(user);
    }

    public async findByUsername(username: string): Promise<User> {
        const user = await this.userRepository
            .createQueryBuilder("user")
            .where("user.username = :username", { username: username })
            .getOne();

        return this.persistenceToDomain(user);
    }

    public async save(user: User): Promise<void> {
        await this.userRepository
            .createQueryBuilder()
            .insert()
            .into(UserModel)
            .values([
                {
                    id: user.getId(),
                    username: user.getUsername(),
                    hash_password: user.getHashedPassword(),
                    role: user.getRole()
                }
            ])
            .execute();
    }

    public async login(username: string): Promise<User> {
        const user = await this.userRepository
            .createQueryBuilder("user")
            .where("user.username = :username", { username: username })
            .getOne();

        return !user ? null : new UserBuilder()
            .setId(user.id)
            .setUsername(user.username)
            .setHashedPassword(user.hash_password)
            .setRole(user.role)
            .build();
    }
}
