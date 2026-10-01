import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
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
import { ArticleCategoryDTO } from '../dto/article-category.dto';
import { ArticleCategoryService } from '../services/article-category.service';
import { CreateArticleCategoryInput } from '../types/create-article-category-input';
import { UpdateArticleCategoryInput } from '../types/update-article-category-input';

@ApiTags('Admin / Article categories')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@ApiForbiddenResponse({ description: 'Admin role required' })
@AuthorizeAdmin()
@Controller('/admin/article-categories')
export class AdminArticleCategoryController {
    constructor(private readonly articleCategoryService: ArticleCategoryService) {}

    @Post()
    @ApiOperation({ summary: 'Create a category' })
    @ApiBadRequestResponse({ description: 'Invalid input' })
    @ApiConflictResponse({ description: 'A category with this name or slug already exists' })
    async createCategory(@Body() input: CreateArticleCategoryInput): Promise<ArticleCategoryDTO> {
        const category = await this.articleCategoryService.createCategory(input);
        return plainToInstance(ArticleCategoryDTO, category);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a category' })
    @ApiBadRequestResponse({ description: 'Invalid input' })
    @ApiNotFoundResponse({ description: 'ArticleCategory not found' })
    @ApiConflictResponse({ description: 'A category with this name or slug already exists' })
    async updateCategory(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() input: UpdateArticleCategoryInput,
    ): Promise<ArticleCategoryDTO> {
        const category = await this.articleCategoryService.updateCategory(id, input);
        return plainToInstance(ArticleCategoryDTO, category);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a category' })
    @ApiNotFoundResponse({ description: 'ArticleCategory not found' })
    @ApiConflictResponse({ description: 'ArticleCategory still has articles' })
    async deleteCategory(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        await this.articleCategoryService.deleteCategory(id);
    }
}
