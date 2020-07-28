export enum UserRole {
    ADMIN = "admin",
    MEMBER = "member"
}

export class User {
    private id: string;
    private username: string;
    private hashedPassword: string;
    private role: UserRole;

    public constructor(id: string, username: string, hashedPassword: string, role: UserRole = UserRole.MEMBER) {
        this.id = id;
        this.username = username;
        this.hashedPassword = hashedPassword;
        this.role = role;
    }

    public getId(): string {
        return this.id;
    }

    public getUsername(): string {
        return this.username;
    }

    public getHashedPassword(): string {
        return this.hashedPassword;
    }

    public getRole(): UserRole {
        return this.role;
    }

}

export class UserBuilder {
    private userId: string;
    private userName: string;
    private userHashedPassword: string;
    private userRole: UserRole = UserRole.MEMBER;

    public setId(id: string): UserBuilder {
        this.userId = id;
        return this;
    }

    public setUsername(username: string): UserBuilder {
        this.userName = username;
        return this;
    }

    public setHashedPassword(hashedPassword: string): UserBuilder {
        this.userHashedPassword = hashedPassword;
        return this;
    }

    public setRole(role: UserRole): UserBuilder {
        this.userRole = role;
        return this;
    }

    public build(): User {
        console.log(this.userHashedPassword);
        return new User(this.userId, this.userName, this.userHashedPassword, this.userRole);
    }
}