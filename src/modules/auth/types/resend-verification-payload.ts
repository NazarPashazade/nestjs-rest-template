import { Expose } from 'class-transformer';

export class ResendVerificationPayload {
    @Expose()
    sent: boolean;
}
