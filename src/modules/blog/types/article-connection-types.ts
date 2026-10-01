import { Exclude, Expose, Type } from 'class-transformer';
import { ConnectionType, EdgeType, RelayNode } from '../../shared/types';
import { ArticleStatus } from '../domain/enums/article-status';
import { AuthorDTO } from '../dto/author.dto';
import { ArticleCategoryDTO } from '../dto/article-category.dto';

@Exclude()
export class ArticleNode implements RelayNode {
    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    slug: string;

    @Expose()
    excerpt: string;

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
}

export class ArticleEdge extends EdgeType(ArticleNode) {}

export class ArticleConnection extends ConnectionType(ArticleNode, ArticleEdge) {}
