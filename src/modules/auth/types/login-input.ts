import { Expose } from 'class-transformer';

export class LoginInput {
    @Expose()
    readonly email: string;

    @Expose()
    readonly password: string;
}
