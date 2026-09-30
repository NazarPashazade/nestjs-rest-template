import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { normalizeEmail } from '../utils/transformers';

export class LoginInput {
    @Expose()
    @ApiProperty({ example: 'admin@gmail.com' })
    @Transform(normalizeEmail)
    @IsEmail()
    readonly email: string;

    @Expose()
    @ApiProperty({ example: '@dm1nP@ssL0CAL' })
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}
