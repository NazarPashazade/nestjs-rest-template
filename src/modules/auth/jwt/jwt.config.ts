import { JWT_SECRET } from "../../config/environment";

export const JwtConfig = {
    secret: JWT_SECRET,
    signOptions: {
        expiresIn: '365d',
    },
}