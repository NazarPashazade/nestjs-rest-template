import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class VerifyEmailInput {
    @Expose()
    @ApiProperty({ description: 'The `token` query parameter from the link in the verification email' })
    @IsJWT()
    readonly token: string;
}
