import { Entity, Column, PrimaryColumn, EntitySchema } from 'typeorm';

import { CommentStatus } from '../../../../domain/Comment';

@Entity({
    name: 'comments'
})
export class CommentModel {

    @PrimaryColumn({
        type: 'varchar',
        length: 50,
        comment: 'Comment ID'
    })
    id: string;

    @Column({
        type: 'varchar',
        length: 50,
        comment: 'used for storing Parent Comment ID.',
        default: '0'
    })
    parent_id: string;

    @Column({
        type: 'varchar',
        length: 50,
        comment: 'used for storing authors.'
    })
    author: string;

    @Column({
        type: 'longtext',
        comment: 'used for storing comment content/text.'
    })
    content: string;

    @Column({
        type: 'varchar',
        length: 255,
        comment: 'used for storing post url.'
    })
    url: string;

    @Column({
        type: "timestamp"
    })
    date: Date;

    @Column({
        type: "enum",
        enum: CommentStatus,
        comment: 'used for storing comment status, i.e. (showed / hidden).',
        default: CommentStatus.SHOWED
    })
    status: CommentStatus;
}
