import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { IEditableEntity } from '../../../shared/domain/interfaces';
import { User } from '../../../user/domain/models/user.model';
import { ArticleStatus } from '../enums/article-status';
import { ArticleCategory } from './article-category.model';

@Entity({ name: 'articles' })
@Index(['status', 'publishedAt'])
export class Article implements IEditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Index({ unique: true })
    @Column()
    slug: string;

    @Column({ length: 500 })
    excerpt: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ name: 'cover_image_url', nullable: true })
    coverImageUrl?: string;

    @Column({ type: 'enum', enum: ArticleStatus, default: ArticleStatus.DRAFT })
    status: ArticleStatus;

    @Column({ name: 'published_at', type: 'timestamp with time zone', nullable: true })
    publishedAt?: Date;

    @Column({ name: 'view_count', default: 0 })
    viewCount: number;

    @Column({ name: 'category_id' })
    categoryId: string;

    @ManyToOne(() => ArticleCategory, (category) => category.articles, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'category_id' })
    category: ArticleCategory;

    @Column({ name: 'author_id' })
    authorId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'author_id' })
    author: User;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;

    publish(): void {
        this.status = ArticleStatus.PUBLISHED;
        this.publishedAt ??= new Date();
    }

    unpublish(): void {
        this.status = ArticleStatus.DRAFT;
    }
}
