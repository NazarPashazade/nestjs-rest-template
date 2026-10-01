import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { trim } from '../../auth/utils/transformers';
import { SLUG_PATTERN } from '../../shared/utils/slugify';

export class CreateArticleCategoryInput {
    @Expose()
    @ApiProperty({ example: 'Təhsil' })
    @Transform(trim)
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    readonly name: string;

    @Expose()
    @ApiPropertyOptional({ example: 'tehsil', description: 'Generated from the name when omitted' })
    @IsOptional()
    @Transform(trim)
    @Matches(SLUG_PATTERN, { message: 'slug may only contain lowercase letters, digits and single dashes' })
    @MaxLength(100)
    readonly slug?: string;
}
