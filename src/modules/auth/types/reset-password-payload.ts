import { Expose } from 'class-transformer';

export class ResetPasswordPayload {
    @Expose()
    success: boolean;
}
