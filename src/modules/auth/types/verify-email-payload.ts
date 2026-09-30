import { Expose } from 'class-transformer';

export class VerifyEmailPayload {
    @Expose()
    success: boolean;
}
