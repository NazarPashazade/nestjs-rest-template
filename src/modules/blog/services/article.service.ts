import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { BaseHandler } from '../../shared/queries/base-handler';
import { isUniqueViolation } from '../../shared/utils/db-errors';
import { slugify } from '../../shared/utils/slugify';
import { ArticleSort } from '../domain/enums/article-sort';
import { ArticleStatus } from '../domain/enums/article-status';
import { Article } from '../domain/models/article.model';
import { ArticleConnection, ArticleNode } from '../types/article-connection-types';
import { CreateArticleInput } from '../types/create-article-input';
import { AdminListArticlesInput, ListArticlesInput } from '../types/list-articles-input';
import { UpdateArticleInput } from '../types/update-article-input';

const ARTICLE_RELATIONS = ['category', 'author'];

@Injectable()
export class ArticleService extends BaseHandler {
    async getPublishedArticles(input: ListArticlesInput): Promise<ArticleConnection> {
        return this.getArticles({ ...input, status: ArticleStatus.PUBLISHED });
    }

    async getArticles(input: AdminListArticlesInput): Promise<ArticleConnection> {
        const qb = this.dbContext.articles
            .createQueryBuilder('article')
            .leftJoinAndSelect('article.category', 'category')
            .leftJoinAndSelect('article.author', 'author');

        this.applyFilters(qb, input);
        this.applySort(qb, input.sort);

        return this.dbContext.articles.getMany(qb, ArticleNode, input);
    }

    async getPublishedArticleBySlug(slug: string): Promise<Article> {
        const article = await this.dbContext.articles.findOne({
            where: { slug, status: ArticleStatus.PUBLISHED },
            relations: ARTICLE_RELATIONS,
        });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        await this.dbContext.articles.incrementViewCount(article.id);
        article.viewCount += 1;

        return article;
    }

    async getArticleById(id: string): Promise<Article> {
        const article = await this.dbContext.articles.findOne({ where: { id }, relations: ARTICLE_RELATIONS });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        return article;
    }

    async createArticle(input: CreateArticleInput, authorId: string): Promise<Article> {
        await this.assertCategoryExists(input.categoryId);

        const slug = input.slug ?? (await this.generateUniqueSlug(input.title));

        const article = this.dbContext.articles.create({ ...input, slug, authorId });

        await this.save(article);

        this.logger.log(`Article created: ${article.id}`, ArticleService.name);

        return this.getArticleById(article.id);
    }

    async updateArticle(id: string, input: UpdateArticleInput): Promise<Article> {
        const article = await this.dbContext.articles.findOne({ where: { id } });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        if (input.categoryId) {
            await this.assertCategoryExists(input.categoryId);
        }

        Object.assign(article, input);

        await this.save(article);

        return this.getArticleById(id);
    }

    async publishArticle(id: string): Promise<Article> {
        const article = await this.getArticleById(id);

        article.publish();

        return this.save(article);
    }

    async unpublishArticle(id: string): Promise<Article> {
        const article = await this.getArticleById(id);

        article.unpublish();

        return this.save(article);
    }

    async deleteArticle(id: string): Promise<void> {
        const { affected } = await this.dbContext.articles.delete({ id });

        if (!affected) {
            throw new NotFoundException('Article not found');
        }

        this.logger.log(`Article deleted: ${id}`, ArticleService.name);
    }

    private applyFilters(qb: SelectQueryBuilder<Article>, { status, category, search }: AdminListArticlesInput): void {
        if (status) {
            qb.andWhere('article.status = :status', { status });
        }

        if (category) {
            qb.andWhere('category.slug = :category', { category });
        }

        if (search) {
            const pattern = `%${search.replace(/[\\%_]/g, '\\$&')}%`;

            qb.andWhere(
                new Brackets((where) =>
                    where.where('article.title ILIKE :pattern', { pattern }).orWhere('article.excerpt ILIKE :pattern'),
                ),
            );
        }
    }

    private applySort(qb: SelectQueryBuilder<Article>, sort: ArticleSort = ArticleSort.NEWEST): void {
        if (sort === ArticleSort.POPULAR) {
            qb.orderBy('article.viewCount', 'DESC');
        }

        qb.addOrderBy('article.publishedAt', 'DESC', 'NULLS LAST').addOrderBy('article.createdAt', 'DESC');
    }

    private async assertCategoryExists(categoryId: string): Promise<void> {
        const exists = await this.dbContext.articleCategories.exists({ where: { id: categoryId } });

        if (!exists) {
            throw new BadRequestException('ArticleCategory does not exist');
        }
    }

    private async generateUniqueSlug(title: string): Promise<string> {
        const base = slugify(title) || 'article';

        const taken = await this.dbContext.articles.exists({ where: { slug: base } });

        return taken ? `${base}-${randomBytes(3).toString('hex')}` : base;
    }

    private async save(article: Article): Promise<Article> {
        try {
            return await this.dbContext.articles.save(article);
        } catch (error) {
            if (isUniqueViolation(error)) {
                throw new ConflictException('An article with this slug already exists');
            }
            throw error;
        }
    }
}
