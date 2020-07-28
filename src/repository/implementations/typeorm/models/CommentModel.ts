import { Entity, Column, PrimaryColumn } from 'typeorm';

import { CommentStatus } from '../../../../domain/Comment';

@Entity({
    name: 'comment'
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
        type: "enum",
        enum: CommentStatus,
        comment: 'used for storing comment status, i.e. (showed / hidden).',
        default: CommentStatus.SHOWED
    })
    status: CommentStatus;

    @Column({
        type: "timestamp",
        comment: 'Creation time',
        default: () => "CURRENT_TIMESTAMP"
    })
    created_date: Date;

}
