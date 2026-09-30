import { Expose, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Gender } from '../../user/domain/enums/gender';
import { normalizeEmail, trim } from '../utils/transformers';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../utils/password';

export class RegisterInput {
    @Expose()
    @ApiProperty({ example: 'Jane' })
    @Transform(trim)
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    readonly firstName: string;

    @Expose()
    @ApiProperty({ example: 'Doe' })
    @Transform(trim)
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    readonly lastName: string;

    @Expose()
    @ApiProperty({ example: 'jane.doe@example.com' })
    @Transform(normalizeEmail)
    @IsEmail()
    @MaxLength(254)
    readonly email: string;

    @Expose()
    @ApiProperty({ example: 'Str0ngPass!' })
    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH)
    @MaxLength(PASSWORD_MAX_LENGTH)
    readonly password: string;

    @Expose()
    @ApiProperty({ example: '+994501234567' })
    @Transform(trim)
    @IsPhoneNumber(undefined, { message: 'phoneNumber must be in international format, e.g. +994501234567' })
    readonly phoneNumber: string;

    @Expose()
    @ApiPropertyOptional({ example: '1995-04-12' })
    @IsOptional()
    @IsDateString({ strict: true })
    readonly dateOfBirth?: string;

    @Expose()
    @ApiPropertyOptional({ enum: Gender, example: Gender.FEMALE })
    @IsOptional()
    @IsEnum(Gender)
    readonly gender?: Gender;
}
