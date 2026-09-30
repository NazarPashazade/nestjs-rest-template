import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString, MaxLength, MinLength } from 'class-validator';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../utils/password';

export class ResetPasswordInput {
    @Expose()
    @ApiProperty({ description: 'The `token` query parameter from the link in the password reset email' })
    @IsJWT()
    readonly token: string;

    @Expose()
    @ApiProperty({ example: 'N3wStr0ngPass!' })
    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH)
    @MaxLength(PASSWORD_MAX_LENGTH)
    readonly password: string;
}
