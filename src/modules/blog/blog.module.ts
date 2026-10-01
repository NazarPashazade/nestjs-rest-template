import { Module } from '@nestjs/common';
import { AdminArticleController } from './controllers/admin-article.controller';
import { AdminArticleCategoryController } from './controllers/admin-article-category.controller';
import { ArticleController } from './controllers/article.controller';
import { ArticleCategoryController } from './controllers/article-category.controller';
import { ArticleService } from './services/article.service';
import { ArticleCategoryService } from './services/article-category.service';

const services = [ArticleService, ArticleCategoryService];

const _controllers = [
    ArticleController,
    AdminArticleController,
    ArticleCategoryController,
    AdminArticleCategoryController,
];

@Module({
    providers: [...services],
    controllers: _controllers,
})
export class BlogModule {}
