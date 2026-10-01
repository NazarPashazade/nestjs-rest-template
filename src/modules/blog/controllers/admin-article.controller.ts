import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthorizeAdmin } from '../../auth/decorators/authorize-admin.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ArticleDTO } from '../dto/article.dto';
import { ArticleService } from '../services/article.service';
import { ArticleConnection } from '../types/article-connection-types';
import { CreateArticleInput } from '../types/create-article-input';
import { AdminListArticlesInput } from '../types/list-articles-input';
import { UpdateArticleInput } from '../types/update-article-input';

@ApiTags('Admin / Articles')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@ApiForbiddenResponse({ description: 'Admin role required' })
@AuthorizeAdmin()
@Controller('/admin/articles')
export class AdminArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Get()
    @ApiOperation({ summary: 'List articles in any status' })
    @ApiBadRequestResponse({ description: 'Invalid query parameters' })
    async getArticles(@Query() input: AdminListArticlesInput): Promise<ArticleConnection> {
        return this.articleService.getArticles(input);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an article by id' })
    @ApiNotFoundResponse({ description: 'Article not found' })
    async getArticleById(@Param('id', ParseUUIDPipe) id: string): Promise<ArticleDTO> {
        const article = await this.articleService.getArticleById(id);
        return plainToInstance(ArticleDTO, article);
    }

    @Post()
    @ApiOperation({ summary: 'Create a draft article' })
    @ApiBadRequestResponse({ description: 'Invalid input, or the category does not exist' })
    @ApiConflictResponse({ description: 'An article with this slug already exists' })
    async createArticle(@Body() input: CreateArticleInput, @CurrentUser('id') authorId: string): Promise<ArticleDTO> {
        const article = await this.articleService.createArticle(input, authorId);
        return plainToInstance(ArticleDTO, article);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an article' })
    @ApiBadRequestResponse({ description: 'Invalid input, or the category does not exist' })
    @ApiNotFoundResponse({ description: 'Article not found' })
    @ApiConflictResponse({ description: 'An article with this slug already exists' })
    async updateArticle(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() input: UpdateArticleInput,
    ): Promise<ArticleDTO> {
        const article = await this.articleService.updateArticle(id, input);
        return plainToInstance(ArticleDTO, article);
    }

    @Post(':id/publish')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Publish an article' })
    @ApiNotFoundResponse({ description: 'Article not found' })
    async publishArticle(@Param('id', ParseUUIDPipe) id: string): Promise<ArticleDTO> {
        const article = await this.articleService.publishArticle(id);
        return plainToInstance(ArticleDTO, article);
    }

    @Post(':id/unpublish')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Move an article back to drafts' })
    @ApiNotFoundResponse({ description: 'Article not found' })
    async unpublishArticle(@Param('id', ParseUUIDPipe) id: string): Promise<ArticleDTO> {
        const article = await this.articleService.unpublishArticle(id);
        return plainToInstance(ArticleDTO, article);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete an article' })
    @ApiNotFoundResponse({ description: 'Article not found' })
    async deleteArticle(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        await this.articleService.deleteArticle(id);
    }
}
