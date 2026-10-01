import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID, Matches, MaxLength } from 'class-validator';
import { trim } from '../../auth/utils/transformers';
import { SLUG_PATTERN } from '../../shared/utils/slugify';

export class CreateArticleInput {
    @Expose()
    @ApiProperty({ example: 'Qəbul İmtahanı – 1-ci Qrup Üzrə 2023' })
    @Transform(trim)
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    readonly title: string;

    @Expose()
    @ApiPropertyOptional({
        example: 'qebul-imtahani-1-ci-qrup-2023',
        description: 'Generated from the title when omitted',
    })
    @IsOptional()
    @Transform(trim)
    @Matches(SLUG_PATTERN, { message: 'slug may only contain lowercase letters, digits and single dashes' })
    @MaxLength(200)
    readonly slug?: string;

    @Expose()
    @ApiProperty({ example: '1-ci ixtisas qrupu üzrə qəbul imtahanının təhlili.' })
    @Transform(trim)
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    readonly excerpt: string;

    @Expose()
    @ApiProperty({ example: '## Giriş\n\nMəqalənin mətni...' })
    @IsString()
    @IsNotEmpty()
    readonly content: string;

    @Expose()
    @ApiPropertyOptional({ example: 'https://cdn.example.com/covers/qebul-2023.jpg' })
    @IsOptional()
    @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
    @MaxLength(2048)
    readonly coverImageUrl?: string;

    @Expose()
    @ApiProperty({ example: '3f1c2a9e-6b1d-4c8e-9a51-2f7d8e4b6c10' })
    @IsUUID()
    readonly categoryId: string;
}
