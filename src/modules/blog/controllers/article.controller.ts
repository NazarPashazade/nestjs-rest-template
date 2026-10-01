import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ArticleDTO } from '../dto/article.dto';
import { ArticleService } from '../services/article.service';
import { ArticleConnection } from '../types/article-connection-types';
import { ListArticlesInput } from '../types/list-articles-input';

@ApiTags('Articles')
@Controller('/articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Get()
    @ApiOperation({ summary: 'List published articles' })
    @ApiBadRequestResponse({ description: 'Invalid query parameters' })
    async getArticles(@Query() input: ListArticlesInput): Promise<ArticleConnection> {
        return this.articleService.getPublishedArticles(input);
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get a published article by slug and count the view' })
    @ApiNotFoundResponse({ description: 'Article not found or not published' })
    async getArticleBySlug(@Param('slug') slug: string): Promise<ArticleDTO> {
        const article = await this.articleService.getPublishedArticleBySlug(slug);
        return plainToInstance(ArticleDTO, article);
    }
}
