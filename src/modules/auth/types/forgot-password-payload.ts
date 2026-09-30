import { Expose } from 'class-transformer';

export class ForgotPasswordPayload {
    @Expose()
    sent: boolean;
}
