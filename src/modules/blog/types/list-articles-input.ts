import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { trim } from '../../auth/utils/transformers';
import { ConnectionArgs } from '../../shared/types/connection-args';
import { ArticleSort } from '../domain/enums/article-sort';
import { ArticleStatus } from '../domain/enums/article-status';

export class ListArticlesInput extends ConnectionArgs {
    @Expose()
    @ApiPropertyOptional({ example: 'tehsil', description: 'ArticleCategory slug' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    readonly category?: string;

    @Expose()
    @ApiPropertyOptional({ example: 'imtahan', description: 'Matches title or excerpt' })
    @IsOptional()
    @Transform(trim)
    @IsString()
    @MaxLength(100)
    readonly search?: string;

    @Expose()
    @ApiPropertyOptional({ enum: ArticleSort, default: ArticleSort.NEWEST })
    @IsOptional()
    @IsEnum(ArticleSort)
    readonly sort?: ArticleSort;
}

export class AdminListArticlesInput extends ListArticlesInput {
    @Expose()
    @ApiPropertyOptional({ enum: ArticleStatus })
    @IsOptional()
    @IsEnum(ArticleStatus)
    readonly status?: ArticleStatus;
}
