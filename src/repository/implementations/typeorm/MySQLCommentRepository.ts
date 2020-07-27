import { Repository } from "typeorm";
import { CommentRepository } from "../../CommentRepository";
import { CommentModel } from "./models/CommentModel";
import { Comment } from "../../../domain/Comment";

export class MySQLCommentRepository implements CommentRepository {

    private commentRepository: Repository<CommentModel>;

    constructor(commentRepository: Repository<CommentModel>) {
        this.commentRepository = commentRepository;
    }

    private persistenceToDomain(comment: CommentModel) {
        return Comment.createComment
            .setId(comment.id)
            .setParentId(comment.parent_id)
            .setAuthor(comment.author)
            .setContent(comment.content)
            .setUrl(comment.url)
            .setDate(comment.date)
            .setStatus(comment.status)
            .build();
    }

    public async findAll(): Promise<Comment[]> {
        const comments = await this.commentRepository.find();

        return comments.map(comment => this.persistenceToDomain(comment));
    }

    public async findByURL(url: string): Promise<Comment[]> {
        const comments = await this.commentRepository
            .createQueryBuilder("comment")
            .where("comment.url = :url", { url: url })
            .getMany();

        return comments.map(comment => this.persistenceToDomain(comment))
    }

    public async findById(id: string): Promise<Comment> {
        const comment = await this.commentRepository.findOne(id);

        return this.persistenceToDomain(comment);
    }

    public async findByParentId(parentId: string): Promise<Comment[]> {
        const comments = await this.commentRepository
            .createQueryBuilder("comment")
            .where("comment.parent_id = :parentId", { parentId: parentId })
            .getMany();

        return comments.map(comment => this.persistenceToDomain(comment));
    }

    public async save(comment: Comment): Promise<void> {
        await this.commentRepository
            .createQueryBuilder()
            .insert()
            .into(CommentModel)
            .values([
                {
                    id: comment.getId(),
                    parent_id: comment.getParentId(),
                    author: comment.getAuthor(),
                    content: comment.getContent(),
                    url: comment.getUrl(),
                    date: comment.getDate(),
                    status: comment.getStatus()
                }
            ])
            .execute();
    }

    public async update(id: string, comment: Comment): Promise<void> {
        if (id !== comment.getId()) {
            throw new Error("Invalid id.");
        }

        await this.commentRepository
            .createQueryBuilder()
            .update(CommentModel)
            .set({
                parent_id: comment.getParentId(),
                author: comment.getAuthor(),
                content: comment.getContent(),
                url: comment.getUrl(),
                date: comment.getDate(),
                status: comment.getStatus()
            })
            .where("id = :id", { id: id })
            .execute();
    }

    public async remove(id: string): Promise<void> {
        await this.commentRepository
            .createQueryBuilder()
            .delete()
            .from(CommentModel)
            .where("id = :id", { id: id })
            .execute();
    }

}
