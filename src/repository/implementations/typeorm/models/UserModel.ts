import { Entity, Column, PrimaryColumn } from 'typeorm';
import { UserRole } from '../../../../domain/User';

@Entity({
    name: 'user'
})
export class UserModel {
    @PrimaryColumn({
        type: 'varchar',
        length: 50,
        comment: 'User ID'
    })
    id: string;

    @Column({
        type: 'varchar',
        length: 20,
        comment: 'Username'
    })
    username: string;

    @Column({
        type: 'varchar',
        length: 100,
        comment: 'User hashed password'
    })
    hash_password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        comment: 'User role (admin, member)',
        default: UserRole.MEMBER
    })
    role: UserRole;
}
