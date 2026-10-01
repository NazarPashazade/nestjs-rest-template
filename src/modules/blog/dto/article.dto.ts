import { Exclude, Expose, Type } from 'class-transformer';
import { ArticleStatus } from '../domain/enums/article-status';
import { AuthorDTO } from './author.dto';
import { ArticleCategoryDTO } from './article-category.dto';

@Exclude()
export class ArticleDTO {
    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    slug: string;

    @Expose()
    excerpt: string;

    @Expose()
    content: string;

    @Expose()
    coverImageUrl?: string;

    @Expose()
    status: ArticleStatus;

    @Expose()
    publishedAt?: Date;

    @Expose()
    viewCount: number;

    @Expose()
    @Type(() => ArticleCategoryDTO)
    category: ArticleCategoryDTO;

    @Expose()
    @Type(() => AuthorDTO)
    author: AuthorDTO;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
