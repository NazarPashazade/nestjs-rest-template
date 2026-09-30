import { Expose } from 'class-transformer';

export class RegisterPayload {
    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    emailVerified: boolean;
}
