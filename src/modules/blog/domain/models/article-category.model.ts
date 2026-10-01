import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { IEditableEntity } from '../../../shared/domain/interfaces';
import { Article } from './article.model';

@Entity({ name: 'article_categories' })
export class ArticleCategory implements IEditableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column()
    name: string;

    @Index({ unique: true })
    @Column()
    slug: string;

    @OneToMany(() => Article, (article) => article.category)
    articles: Article[];

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    @VersionColumn({ default: 0 })
    version: number;
}
