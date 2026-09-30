import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { normalizeEmail } from '../utils/transformers';

export class ForgotPasswordInput {
    @Expose()
    @ApiProperty({ example: 'jane.doe@example.com' })
    @Transform(normalizeEmail)
    @IsEmail()
    readonly email: string;
}
