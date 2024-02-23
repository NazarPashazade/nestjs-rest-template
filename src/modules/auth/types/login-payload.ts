import { Expose } from "class-transformer";

export class LoginPayload {
    @Expose()
    accessToken: string;
}
