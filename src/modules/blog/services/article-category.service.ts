import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseHandler } from '../../shared/queries/base-handler';
import { ConnectionArgs } from '../../shared/types/connection-args';
import { isUniqueViolation } from '../../shared/utils/db-errors';
import { slugify } from '../../shared/utils/slugify';
import { ArticleCategory } from '../domain/models/article-category.model';
import { ArticleCategoryConnection, ArticleCategoryNode } from '../types/article-category-connection-types';
import { CreateArticleCategoryInput } from '../types/create-article-category-input';
import { UpdateArticleCategoryInput } from '../types/update-article-category-input';

@Injectable()
export class ArticleCategoryService extends BaseHandler {
    async getCategories(args: ConnectionArgs): Promise<ArticleCategoryConnection> {
        const qb = this.dbContext.articleCategories.createQueryBuilder('category').orderBy('category.name', 'ASC');

        return this.dbContext.articleCategories.getMany(qb, ArticleCategoryNode, args);
    }

    async createCategory({ name, slug }: CreateArticleCategoryInput): Promise<ArticleCategory> {
        const category = this.dbContext.articleCategories.create({ name, slug: slug ?? slugify(name) });

        return this.save(category);
    }

    async updateCategory(id: string, input: UpdateArticleCategoryInput): Promise<ArticleCategory> {
        const category = await this.getCategoryById(id);

        Object.assign(category, input);

        return this.save(category);
    }

    async deleteCategory(id: string): Promise<void> {
        const category = await this.getCategoryById(id);

        const hasArticles = await this.dbContext.articles.exists({ where: { categoryId: id } });

        if (hasArticles) {
            throw new ConflictException('ArticleCategory still has articles');
        }

        await this.dbContext.articleCategories.remove(category);

        this.logger.log(`ArticleCategory deleted: ${id}`, ArticleCategoryService.name);
    }

    private async getCategoryById(id: string): Promise<ArticleCategory> {
        const category = await this.dbContext.articleCategories.findOne({ where: { id } });

        if (!category) {
            throw new NotFoundException('ArticleCategory not found');
        }

        return category;
    }

    private async save(category: ArticleCategory): Promise<ArticleCategory> {
        try {
            return await this.dbContext.articleCategories.save(category);
        } catch (error) {
            if (isUniqueViolation(error)) {
                throw new ConflictException('A category with this name or slug already exists');
            }
            throw error;
        }
    }
}
