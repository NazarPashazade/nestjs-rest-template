import { Controller, Get, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConnectionArgs } from '../../shared/types/connection-args';
import { ArticleCategoryService } from '../services/article-category.service';
import { ArticleCategoryConnection } from '../types/article-category-connection-types';

@ApiTags('Article categories')
@Controller('/article-categories')
export class ArticleCategoryController {
    constructor(private readonly articleCategoryService: ArticleCategoryService) {}

    @Get()
    @ApiOperation({ summary: 'List article categories' })
    @ApiBadRequestResponse({ description: 'Invalid query parameters' })
    async getCategories(@Query() args: ConnectionArgs): Promise<ArticleCategoryConnection> {
        return this.articleCategoryService.getCategories(args);
    }
}
